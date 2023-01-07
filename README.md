<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-wrap-balancer&background=tiles&project=%20" alt="solid-wrap-balancer">
</p>

# solid-wrap-balancer

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

[![npm version](https://badge.fury.io/js/solid-wrap-balancer.svg)](https://badge.fury.io/js/solid-wrap-balancer)

This project is a port of [react-wrap-balancer](https://github.com/shuding/react-wrap-balancer) made by [Shu Ding](https://twitter.com/shuding_) to solid.js

Simple Solid.js Component That Makes Titles More Readable

## Introduction

[**Solid Wrap Balancer**](https://solid-wrap-balancer.vercel.app) is a simple Solid Component that makes your titles more readable in different viewport sizes. It improves the wrapping to avoid situations like a single word in the last line, makes the content more “balanced”:

![Demo](/demo.gif)

## Usage

To start using the library, install it to your project:

```bash
npm i solid-wrap-balancer
# or
yarn add solid-wrap-balancer
# or
pnpm add solid-wrap-balancer
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

## About

This project is a port of [react-wrap-balancer](https://github.com/shuding/react-wrap-balancer) made by [Shu Ding](https://twitter.com/shuding_) to solid.js


## Flow
If there is a context - it initialize it with realyout function. The Rebalancer init script for each element, but if it has a context - it uses its existing relayout function from the global window context. In SSR it inject hte ratio prop to the element. When the component load it search for the script and call it with the component id. The script is a resizable observer that try to rebalance text according to ratio. If Decrease it's with to see if the height changes and go to the smallest width that the height keep the same. When unmount / ratio changes - clean observer and element function.
