<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-wrap-balancer&background=tiles&project=%20" alt="solid-wrap-balancer">
</p>

# solid-wrap-balancer

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

[![npm version](https://badge.fury.io/js/solid-wrap-balancer.svg)](https://badge.fury.io/js/solid-wrap-balancer)

This project is a port of [react-wrap-balancer](https://github.com/shuding/react-wrap-balancer) made by [Shu Ding](https://twitter.com/shuding_) to solid.js

Simple Solid.js Component That Makes Titles More Readable

![Example](/example.png)

## Introduction

[**Solid Wrap Balancer**](https://solid-wrap-balancer.vercel.app) is a simple Solid Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like a single word in the last line, makes the content more “balanced”:

![Demo](/demo.gif)

## Usage

To start using the library, install it to your project:

```bash
npm i solid-wrap-balancer
```

And wrap text content with it:

```jsx
import { Balancer } from "solid-wrap-balancer";

// ...

function Title() {
  return (
    <h1>
      <Balancer>My Awesome Title</Balancer>
    </h1>
  );
}
```

### `<Balancer>`

`<Balancer>` is the main component of the library. It will automatically balance the text content inside it. It accepts the following props:

- **`as`** (_optional_): The HTML tag to be used to wrap the text content. Default to `span`.
- **`ratio`** (_optional_): The ratio of “balance-ness”, 0 <= ratio <= 1. Default to `1`.
- **`nonce`** (_optional_): The [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) attribute to allowlist inline script injection by the component.

### `<BalancerProvider>`

If you have multiple `<Balancer>` components used, it’s recommended (but optional) to also use
`<BalancerProvider>` to wrap the entire app. This will make them share the re-balance logic and reduce the HTML size:

```jsx
import { BalancerProvider } from "react-wrap-balancer";

// ...

function App() {
  return (
    <BalancerProvider>
      <MyApp />
    </BalancerProvider>
  );
}
```

For full documentation and use cases, please visit [**solid-wrap-balancer.vercel.app**](https://solid-wrap-balancer.vercel.app).

## Browser Support Information

Desktop:

| Browser | Min Version |
| :-----: | :---------: |
| Chrome  |     64      |
|  Edge   |     79      |
| Safari  |    13.1     |
| FireFox |     69      |
|  Opera  |     51      |
|   IE    | No Support  |

Mobile:

|     Browser     | Min Version |
| :-------------: | :---------: |
|     Chrome      |     64      |
|     Safari      |    13.4     |
|     Firefox     |     69      |
|      Opera      |     47      |
| WebView Android |     64      |

Cross-browser compatibility issues are mainly due to the fact that lib uses the ResizeObserver API. More information about this API can be found at this [link](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

If you are using a browser which version is lower than the versions in the table, please consider adding polyfill for this API or upgrade your browser.

## About

This project is a port of [react-wrap-balancer](https://github.com/shuding/react-wrap-balancer) made by [Shu Ding](https://twitter.com/shuding_) to solid.js
