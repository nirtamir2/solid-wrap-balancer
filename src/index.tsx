import type { Component, JSX, JSXElement } from "solid-js";
import {
  DEV,
  children,
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js";
import { Dynamic, isServer } from "solid-js/web";

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
  /**
   * The nonce attribute to allowlist inline script injection by the component
   */
  nonce?: string;
  children?: JSXElement;
}

const SYMBOL_KEY = "__wrap_b";
const SYMBOL_NATIVE_KEY = "__wrap_n";
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
    // A flag to indicate whether the browser supports text-balancing natively.
    // undefined: not injected
    // 1: injected and supported
    // 2: injected but not supported
    [SYMBOL_NATIVE_KEY]?: number;
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
  let lower: number = width / 2 - 0.25;
  let upper: number = width + 0.5;
  let middle: number;

  if (width) {
    while (lower + 1 < upper) {
      middle = Math.round((lower + upper) / 2);
      update(middle);
      if (container.clientHeight === height) {
        upper = middle;
      } else {
        lower = middle;
      }
    }

    // Update the wrapper width
    update(upper * ratio + width * (1 - ratio));
  }

  // Create a new observer if we don't have one.
  // Note that we must inline the key here as we use `toString()` to serialize
  // the function.
  if (wrapper.__wrap_o == null) {
    (wrapper.__wrap_o = new ResizeObserver(() => {
      self.__wrap_b(0, +wrapper.dataset.brr!, wrapper);
    })).observe(container);
  }
};

const RELAYOUT_STR = relayout.toString();

const isTextWrapBalanceSupported = `(self.CSS&&CSS.supports("text-wrap","balance")?1:2)`;

const createScriptElement = (
  injected: boolean,
  nonce?: string,
  suffix = ""
) => {
  if (suffix) {
    suffix = `self.${SYMBOL_NATIVE_KEY}!=1&&${suffix}`;
  }
  return (
    <script
      innerHTML={
        // Calculate the balance initially for SSR
        (injected
          ? ""
          : `self.${SYMBOL_NATIVE_KEY}=self.${SYMBOL_NATIVE_KEY}||${isTextWrapBalanceSupported};self.${SYMBOL_KEY}=${RELAYOUT_STR};`) +
        suffix
      }
      {...(nonce == null ? null : { nonce })}
    />
  );
};

/**
 * An optional provider to inject the global relayout function, so all children
 * Balancer components can share it.
 */
const BalancerContext = createContext<boolean>(false);
export const BalancerProvider: Component<{
  /**
   * The nonce attribute to allowlist inline script injection by the component
   */
  nonce?: string;
  children?: JSX.Element;
}> = (props) => {
  return (
    <BalancerContext.Provider value>
      {createScriptElement(false, props.nonce)}
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
    "nonce",
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

    // Skip if the browser supports text-balancing natively.
    if (self[SYMBOL_NATIVE_KEY] === 1) return;

    // Re-assign the function here as the component can be dynamically rendered, and script tag won't work in that case.
    (self[SYMBOL_KEY] = relayout)(0, props.ratio, wrapper);
  });

  // Remove the observer when unmounting.
  onCleanup(() => {
    const wrapper = wrapperRef();
    if (wrapper == null) {
      return;
    }

    // Skip if the browser supports text-balancing natively.
    if (self[SYMBOL_NATIVE_KEY] === 1) return;


    const resizeObserver = wrapper[SYMBOL_OBSERVER_KEY];
    if (resizeObserver == null) {
      return;
    }

    resizeObserver.disconnect();
    delete wrapper[SYMBOL_OBSERVER_KEY];
  });

  createEffect(() => {
    // In development, we check `children`'s type to ensure we are not wrapping
    // elements like <p> or <h1> inside. Instead <Balancer> should directly
    // wrap text nodes.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (DEV != null && !isServer) {
      const childrenArray = children(() => props.children).toArray();
      const firstChild = childrenArray[0];
      if (
        childrenArray.length === 1 &&
        firstChild != null &&
        typeof firstChild === "object" &&
        "tagName" in firstChild &&
        typeof firstChild.tagName === "string" &&
        firstChild.tagName.toLowerCase() !== "span"
      ) {
        const tagName = firstChild.tagName.toLowerCase();
        console.warn(
          `<Balancer> should not wrap <${tagName}> inside. Instead, it should directly wrap text or inline nodes.

Try changing this:
  <Balancer><${tagName}>content</${tagName}></Balancer>
To:
  <${tagName}><Balancer>content</Balancer></${tagName}>`
        );
      }
    }
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
          "text-wrap": "balance",
        }}
      >
        {props.children}
      </Dynamic>
      {createScriptElement(
        hasProvider,
        props.nonce,
        `self.${SYMBOL_KEY}("${id}",${props.ratio})`
      )}
    </>
  );
}
