"use client";

import copy from "copy-to-clipboard";
import { Balancer, Provider } from "../../../src";
import { animated, createSpring } from "solid-spring";
import { createSignal, JSX, mergeProps, Show } from "solid-js";
import TooltipTriggerIcon from "~/assets/tooltip-tigger.svg";
import GithubIcon from "~/assets/github.svg";
import CopyIcon from "~/assets/copy.svg";
import Copiedcon from "~/assets/copied.svg";
import TooltipArrowIcon from "~/assets/tooltip-arrow.svg";

const content = (
  <>
    <div class="skeleton" style={{ "--w": "60%" }} />
    <div class="skeleton" style={{ "--w": "80%" }} />
    <div class="skeleton" style={{ "--w": "75%" }} />
  </>
);

// Quick and dirty monochrome code highlighter via string templates, don't use this.
function highlightedCode(fades: Array<string>, ...highlighted: Array<string>) {
  const elements = [];

  for (const fade of fades) {
    elements.push(<span class="hl-fade">{fade}</span>);
    if (highlighted.length > 0) {
      elements.push(<span class="hl-highlighted">{highlighted.shift()}</span>);
    }
  }

  return elements;
}

function Comparison(_props: { a: JSX.Element; b: JSX.Element; align?: "left" | "start" }) {
  const [myWidth, setMyWidth] = createSignal(0.55);
  const styles = createSpring(() => ({
    width: myWidth(),
  }));
  const props = mergeProps({ align: "left" }, _props);
  return (
    <div class="demo-container">
      <div class="controller">
        <input
          type="range"
          defaultValue="55"
          onInput={(e) => {
            setMyWidth(+e.currentTarget.value / 100);
          }}
        />
      </div>
      <Show
        keyed
        when={typeof props.a === "function"}
        fallback={
          <animated.div
            style={{
              width: styles().width.to((v) => `calc(${v * 100}% + ${1 - v} * var(--w0))`),
              "text-align": props.align,
            }}
            class="demo"
          >
            <div>
              <legend>Default</legend>
              {props.a}
            </div>
            <div>
              <legend>With Balancer</legend>
              {props.b}
            </div>
          </animated.div>
        }
      >
        <div style={{ width: `calc(55% + 144px)`, "text-align": props.align }} class="demo">
          <div>
            <legend>Default</legend>
            {props.a(
              styles().width.to((v) => `calc(${v} * var(--w1) + ${150 * (1 - v) - 31 * v}px)`),
            )}
          </div>
          <div>
            <legend>With Balancer</legend>
            {props.b(
              styles().width.to((v) => `calc(${v} * var(--w1) + ${150 * (1 - v) - 31 * v}px)`),
            )}
          </div>
        </div>
      </Show>
    </div>
  );
}

function Ratio() {
  const [ratio, setRatio] = createSignal(0.65);
  const [currentRatio, setCurrentRatio] = createSignal(0.65);

  createSpring({
    from: { r: 0.65 },
    onChange(prop) {
      setCurrentRatio(prop.value.r);
    },
  });

  return (
    <div class="demo-container">
      <div class="controller">
        <input
          type="range"
          defaultValue="65"
          onInput={(e) => {
            setRatio(Number(e.currentTarget.value) / 100);
          }}
        />
      </div>
      <div class="demo" style={{ width: "480", "max-width": "100%" }}>
        <div
          style={{
            "text-align": "center",
            position: "relative",
          }}
        >
          <div>
            <h2 class="ratio-ruler">
              <Balancer>
                <span>The quick brown fox jumps over the lazy dog</span>
              </Balancer>
            </h2>
            <h2 class="ratio-title">
              <Balancer ratio={currentRatio()}>
                The quick brown fox jumps over the lazy dog
              </Balancer>
            </h2>
            <code>{`<Balancer ratio={${ratio().toFixed(2)}}>`}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReactWrapBalancer () {
  const [copying, setCopying] = createSignal(0);
  let pointerPos = { x: -1, y: -1 };

  return (
    <Provider>
      <main>
        <div class="logo-container">
          <a
            href="https://github.com/shuding/react-wrap-balancer"
            target="_blank"
            class="logo"
            rel="noreferrer"
          >
            React
            <br />
            Wrap
            <br />
            Balancer
          </a>
        </div>
        <p class="headline">
          <Balancer>Simple React Component That Makes Titles More Readable</Balancer>
        </p>
        <Comparison
          align="center"
          a={
            <div class="item">
              <h2>React: A JavaScript library for building user interfaces</h2>
              {content}
            </div>
          }
          b={
            <div class="item">
              <h2>
                <Balancer>React: A JavaScript library for building user interfaces</Balancer>
              </h2>
              {content}
            </div>
          }
        />
        <h3>
          <Balancer>React Wrap Balancer avoids single hanging word on the last line</Balancer>
        </h3>
        <p class="headline">
          <Balancer>Getting Started</Balancer>
        </p>
        <p>
          <label>Installation</label>
          <code
            class="installation"
            onPointerDown={(e) => {
              pointerPos = { x: e.clientX, y: e.clientY };
            }}
            onClick={(e) => {
              let text: string | undefined = "npm install react-wrap-balancer";

              // Only copy the selected text if the pointer is moved
              if (
                Math.abs(e.clientX - pointerPos.x) > 5 ||
                Math.abs(e.clientY - pointerPos.y) > 5
              ) {
                text = window.getSelection()?.toString();
                if (!text) return;
              }

              copy(text);
              setCopying((c) => c + 1);
              setTimeout(() => {
                setCopying((c) => c - 1);
              }, 2000);
            }}
          >
            npm install react-wrap-balancer
            <span class="copy">
              <Show keyed when={copying() > 0} fallback={<Copiedcon />}>
                <CopyIcon />
              </Show>
            </span>
          </code>
        </p>
        <p>
          <label>Usage</label>
          <span>
            The simplest way is to wrap the text content with{" "}
            <span class="code">{`<Balancer>`}</span>:
          </span>
          <code>
            {highlightedCode`import ${"Balancer"} from ${"'react-wrap-balancer'"}\n\n// ...\n\n<h1>\n  ${"<Balancer>My Title</Balancer>"}\n</h1>`}
          </code>
          <span>
            If you have multiple <span class="code">{`<Balancer>`}</span> components used, it’s
            recommended (but optional) to use <span class="code">{`<Provider>`}</span> to wrap the
            entire app. This will make them share the re-balance logic and reduce the HTML size:
          </span>
          <code>
            {highlightedCode`import { ${"Provider"} } from ${"'react-wrap-balancer'"}\n\n// ...\n\n${"<Provider>"}\n  <App/>\n${"</Provider>"}`}
          </code>
        </p>
        <div class="p">
          <label>Features</label>
          <ul>
            <li>0.95 kB Gzipped</li>
            <li>Fast O(log n) algorithm</li>
            <li>
              Doesn’t cause{" "}
              <a href="https://web.dev/cls/" target="_blank" rel="noreferrer">
                layout shifts
              </a>
            </li>
            <li>Works perfectly with web fonts</li>
            <li>
              SSR and{" "}
              <a
                href="https://beta.nextjs.org/docs/data-fetching/streaming-and-suspense"
                target="_blank"
                rel="noreferrer"
              >
                streaming SSR
              </a>{" "}
              supported
            </li>
            <li>
              <a
                href="https://beta.nextjs.org/docs/rendering/server-and-client-components"
                target="_blank"
                rel="noreferrer"
              >
                Next.js 13 app directory and React Server Components
              </a>{" "}
              compatible
            </li>
          </ul>
        </div>
        <p>
          <label>Requirements</label>
          This library requires React ≥ 18.0.0, and IE 11 is not supported.
        </p>
        <p>
          <a
            href="https://github.com/shuding/react-wrap-balancer"
            target="_blank"
            class="github-link"
            rel="noreferrer"
          >
            3<span>View project on</span>
            <span>
              <GithubIcon width="1.1em" />
              GitHub
            </span>
          </a>
        </p>
        <p class="headline">
          <Balancer>Custom Balance Ratio</Balancer>
        </p>
        <Ratio />
        <h3>
          <Balancer>
            Adjust the balance ratio to a custom value between <span class="code">0</span> (loose)
            and <span class="code">1</span> (compact, the default)
          </Balancer>
        </h3>
        <p class="headline">
          <Balancer>How Does It Work?</Balancer>
        </p>
        <p>
          React Wrap Balancer reduces the width of the content wrapper as much as it could, before
          causing an extra line break. When reaching the minimum width, each line will approximately
          have the same width, and look more compact and balanced.
        </p>
        <p>
          Check out the{" "}
          <a href="https://github.com/shuding/react-wrap-balancer" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>{" "}
          to lear3 more.
        </p>
        <p class="headline">
          <Balancer>Use Cases</Balancer>
        </p>
        <Comparison
          a={(width) => (
            <div class="tooltip-container">
              <div class="TooltipContent">
                <animated.div style={{ width }}>
                  <div class="tooltip item">
                    This deployment is currently in progress. <a>Read more</a>.
                  </div>
                </animated.div>
                <TooltipArrowIcon />
              </div>
              <div class="tooltip-trigger">
                <TooltipTriggerIcon width={16} fill="currentColor" />
              </div>
            </div>
          )}
          b={(width) => (
            <div class="tooltip-container">
              <div class="TooltipContent">
                <animated.div style={{ width }}>
                  <div class="tooltip item">
                    <Balancer>
                      This deployment is currently in progress. <a>Read more</a>.
                    </Balancer>
                  </div>
                </animated.div>
                <TooltipArrowIcon />
              </div>
              <div class="tooltip-trigger">
                <TooltipTriggerIcon />
              </div>
            </div>
          )}
        />
        <h3>
          <Balancer>Useful in tooltips and other UI components</Balancer>
        </h3>
        <Comparison
          a={
            <>
              <h2 class="item">第六個沉思：論物質性東西的存在；論人的靈魂和肉體之間的實在區別</h2>
              {content}
            </>
          }
          b={
            <>
              <h2 class="item">
                <Balancer>第六個沉思：論物質性東西的存在；論人的靈魂和肉體之間的實在區別</Balancer>
              </h2>
              {content}
            </>
          }
        />
        <h3>
          <Balancer>Left aligned, non-latin content</Balancer>
        </h3>
        <Comparison
          a={
            <blockquote class="item">
              <span>
                You have wakened not out of sleep, but into a prior dream, and that dream lies
                within another, and so on, to infinity, which is the number of grains of sand. The
                path that you are to take is endless, and you will die before you have truly
                awakened.
              </span>
              <br />- Jorge Luis Borges
            </blockquote>
          }
          b={
            <blockquote class="item">
              <Balancer>
                You have wakened not out of sleep, but into a prior dream, and that dream lies
                within another, and so on, to infinity, which is the number of grains of sand. The
                path that you are to take is endless, and you will die before you have truly
                awakened.
              </Balancer>
              <br />- Jorge Luis Borges
            </blockquote>
          }
        />
        <h3>
          <Balancer>
            Makes multi-line content more compact with fewer visual changes when resizing
          </Balancer>
        </h3>
        <p class="headline">
          <Balancer>Performance Impact</Balancer>
        </p>
        <p
          style={{
            "text-align": "left",
            "font-size": "14",
          }}
        >
          It is worth to mention that this project is a workaround for the lack of native support
          for balanced text wrapping in CSS. It is not perfect as it adds some performance overhead.
          However, the performance impact is usually very trivial and can be ignored in most cases.
        </p>
        <p
          style={{
            "text-align": "left",
            "font-size": "14",
          }}
        >
          The following benchmark (
          <a
            href="https://github.com/shuding/react-wrap-balancer/tree/main/test/benchmark"
            target="_blank"
            rel="noreferrer"
          >
            source3
          </a>
          ) is done by measuring the script execution time of X balanced titles when loading the
          webpage (
          <a
            href="https://gist.github.com/shuding/1554c7bf31efb389c9960758e9f27274"
            target="_blank"
            rel="noreferrer"
          >
            raw dat3
          </a>
          ):
        </p>
        <a href="/bench.svg" target="_blank" class="benchmark">
          <img src="/bench.svg" alt="Benchmark result" />
        </a>
        <p
          style={{
            "text-align": "left",
            "font-size": "14",
          }}
        >
          It shows that when there are less than 100 elements with React Wrap Balancer in the
          initial HTML, the per-element impact to the page load time is less than 0.25 ms. When
          there are 1,000 elements, that number increases to ~1 ms. When there are 5,000 elements,
          the per-element script execution time becomes ~7 ms.
        </p>
        <p
          style={{
            "text-align": "left",
            "font-size": "14",
          }}
        >
          These numbers don’t scale linearly because re-layouts usually have an impact to other
          elements on the page. Hence the best practice is to only use this library for title
          elements when necessary, or use it for content that is behind user interactions (e.g.
          tooltips), to avoid negative impacts to the page performance.
        </p>
        <p class="headline">
          <Balancer>About React Wrap Balancer</Balancer>
        </p>
        <p
          style={{
            "text-align": "left",
            "font-size": "14",
            display: "flex",
            "justify-content": "center",
          }}
        >
          <Balancer>
            This project was inspired by Adobe’s{" "}
            <a href=" https://github.com/adobe/balance-text" target="_blank">
              balance-text
            </a>{" "}
            project, NYT’s{" "}
            <a href="https://github.com/nytimes/text-balancer" target="_blank" rel="noreferrer">
              text-balancer
            </a>{" "}
            project, and Daniel Aleksandersen’s{" "}
            <a
              href="https://www.ctrl.blog/entry/text-wrap-balance.html"
              target="_blank"
              rel="noreferrer"
            >
              Improving the New York Times’ line wrap balancer
            </a>
            . If you want to learn more, you can also take a look at the{" "}
            <span class="code">
              <a
                href="https://drafts.csswg.org/css-text-4/#text-wrap"
                target="_blank"
                rel="noreferrer"
              >
                text-wrap: balance
              </a>
            </span>{" "}
            proposal.
          </Balancer>
        </p>
        <p style={{ "text-align": "center", "font-size": "14" }}>
          <Balancer>
            Special thanks to{" "}
            <a href="https://twitter.com/emilkowalski_" target="_blank" rel="noreferrer">
              Emil Kowalski
            </a>{" "}
            for testing and feedback. Created by{" "}
            <a href="https://twitter.com/shuding_" target="_blank" rel="noreferrer">
              Shu Ding
            </a>{" "}
            in 2023, released under the MIT license.
          </Balancer>
        </p>
        {/*<p*/}
        {/*  class="headline"*/}
        {/*  style={{*/}
        {/*    "font-size": "20",*/}
        {/*    "margin-bottom": "100",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <a*/}
        {/*    href="https://vercel.com"*/}
        {/*    target="_blank"*/}
        {/*    style={{*/}
        {/*      display: "inline-flex",*/}
        {/*      "justify-content": "center",*/}
        {/*      "align-items": "center",*/}
        {/*      gap: ".4rem",*/}
        {/*      "text-decoration": "none",*/}
        {/*      "white-space": "nowrap",*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <span>Deployed on</span>*/}
        {/*    <svg height="1.1em" viewBox="0 0 284 65" style={{ "margin-top": 2 }}>*/}
        {/*      <path d="M141.68 16.25c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm117.14-14.5c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zm-39.03 3.5c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9v-46h9zM37.59.25l36.95 64H.64l36.95-64zm92.38 5l-27.71 48-27.71-48h10.39l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10v14.8h-9v-34h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"></path>*/}
        {/*    </svg>*/}
        {/*  </a>*/}
        {/*</p>*/}
      </main>
    </Provider>
  );
}
