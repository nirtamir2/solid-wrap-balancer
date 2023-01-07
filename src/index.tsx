import type { Component, JSX, JSXElement } from "solid-js";
import {
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";

interface BalancerProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * The HTML tag to use for the wrapper element.
   * @defaultValue 'span'
   */
  as?: keyof JSX.IntrinsicElements;
  /**
   * The balance ratio of the wrapper width (0 ≤ ratio ≤ 1).
   * 0 means the wrapper width is the same as the container width (no balance, browser default).
   * 1 means the wrapper width is the minimum (full balance, most compact).
   * @defaultValue 1
   */
  ratio?: number;
  children?: JSXElement;
}

const SYMBOL_KEY = "__wrap_b";
const SYMBOL_OBSERVER_KEY = "__wrap_o";

type WrapperHTMLElement = HTMLElement & {
  __wrap_o?: ResizeObserver;
  dataset: { brr?: number };
};

type RelayoutFn = (
  id: number | string,
  ratio: number,
  Wrapper?: WrapperHTMLElement
) => void;

declare global {
  interface Window {
    [SYMBOL_KEY]: RelayoutFn;
  }
}

const relayout: RelayoutFn = (
  id,
  ratio,
  wrapper = document.querySelector<WrapperHTMLElement>(`[data-br="${id}"]`)!
) => {
  const container = wrapper.parentElement;

  if (container == null) {
    return;
  }

  const update = (width: number) => (wrapper.style.maxWidth = `${width}px`);

  // Reset wrapper width
  wrapper.style.maxWidth = "";

  // Get the initial container size
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Synchronously do binary search and calculate the layout
  let left: number = width / 2;
  let right: number = width;
  let middle: number;

  if (width) {
    while (left + 1 < right) {
      middle = ~~((left + right) / 2);
      update(middle);
      if (container.clientHeight === height) {
        right = middle;
      } else {
        left = middle;
      }
    }

    // Update the wrapper width
    update(right * ratio + width * (1 - ratio));
  }

  // Create a new observer if we don't have one.
  // Note that we must inline the key here as we use `toString()` to serialize
  // the function.
  if (wrapper.__wrap_o == null) {
    (wrapper.__wrap_o = new ResizeObserver(() => {
      window.__wrap_b(0, +wrapper.dataset.brr!, wrapper);
    })).observe(container);
  }
};

const RELAYOUT_STR = relayout.toString();

const createScriptElement = (injected: boolean, suffix = "") => (
  <script
    // Calculate the balance initially for SSR
    innerHTML={(injected ? "" : `window.${SYMBOL_KEY}=${RELAYOUT_STR};`) + suffix}
  />
);

/**
 * An optional provider to inject the global relayout function, so all children
 * Balancer components can share it.
 */
const BalancerContext = createContext<boolean>(false);
export const BalancerProvider: Component<{
  children?: JSX.Element;
}> = (props) => {
  return (
    <BalancerContext.Provider value>
      {createScriptElement(false)}
      {props.children}
    </BalancerContext.Provider>
  );
};

export function Balancer(_props: BalancerProps) {
  const mergedProps = mergeProps({ as: "span", ratio: 1 }, _props);
  const [props, restProps] = splitProps(mergedProps, [
    "as",
    "ratio",
    "children",
  ]);

  const id = createUniqueId();

  const [wrapperRef, setWrapperRef] = createSignal<
    WrapperHTMLElement | undefined
  >();

  const hasProvider = useContext(BalancerContext);

  // Re-balance on content change and on mount/hydration.
  createEffect(() => {
    const wrapper = wrapperRef();
    if (wrapper == null) {
      return;
    }
    // Re-assign the function here as the component can be dynamically rendered, and script tag won't work in that case.
    (window[SYMBOL_KEY] = relayout)(0, props.ratio, wrapper);
  });

  // Remove the observer when unmounting.
  onCleanup(() => {
    const wrapper = wrapperRef();
    if (wrapper == null) {
      return;
    }

    const resizeObserver = wrapper[SYMBOL_OBSERVER_KEY];
    if (resizeObserver == null) {
      return;
    }

    resizeObserver.disconnect();
    delete wrapper[SYMBOL_OBSERVER_KEY];
  });

  return (
    <>
      <Dynamic
        component={props.as}
        {...restProps}
        ref={setWrapperRef}
        data-br={id}
        data-brr={props.ratio}
        style={{
          display: "inline-block",
          "vertical-align": "top",
          "text-decoration": "inherit",
        }}
      >
        {props.children}
      </Dynamic>
      {createScriptElement(
        hasProvider,
        `window.${SYMBOL_KEY}("${id}",${props.ratio})`
      )}
    </>
  );
}
