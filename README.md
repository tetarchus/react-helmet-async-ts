# react-helmet-async-ts

[![CircleCI](https://circleci.com/gh/tetarchus/react-helmet-async-ts/tree/main.svg?style=svg)](https://circleci.com/gh/tetarchus/react-helmet-async-ts/tree/main)

**This is intended as a drop-in replacement for `react-helmet-async`, if you encounter any differences, please raise an Issue**

This package is a fork of [React Helmet Async](https://github.com/staylor/react-helmet-async) (which itself was a fork of [React Helmet](https://github.com/nfl/react-helmet)) but with stricter typings and written in typescript.

Usage is mostly identical to `react-helmet-async` however under the hood there are a few differences:

- `Helmet`, `HelmetContext`, and `HelmetProvider` are now Functional components, rather than Class Components.
- Testing has been rewritten to use React 18 and get rid of enzyme which doesn't appear to be getting any updates for React 18.

`<Helmet>` usage is synonymous with `react-helmet`, but server and client now requires `<HelmetProvider>` to encapsulate state per request. **The only major difference is that the attribute that identifies that a tag is managed by `Helmet` was renamed from `data-react-helmet` to `data-rh` in the `react-helmet-async` package, which has also carried over to this fork.**

`react-helmet` relies on `react-side-effect`, which is not thread-safe. If you are doing anything asynchronous on the server, you need Helmet to encapsulate data on a per-request basis, this package does just that.

## Usage

The main way that this package differs from `react-helmet` is that it requires using a Provider to encapsulate Helmet state for your React tree. If you use libraries like Redux or Apollo, you are already familiar with this paradigm:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const app = (
  <HelmetProvider>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

ReactDOM.hydrate(
  app,
  document.getElementById(‘app’)
);
```

On the server, we will no longer use static methods to extract state. `react-side-effect`
exposed a `.rewind()` method, which Helmet used when calling `Helmet.renderStatic()`. Instead, we are going
to pass a `context` prop to `HelmetProvider`, which will hold our state specific to each request.

```tsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const helmetContext = {};

const app = (
  <HelmetProvider context={helmetContext}>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

const html = renderToString(app);

const { helmet } = helmetContext;

// helmet.title.toString() etc…
```

## Streams

This package only works with streaming if your `<head>` data is output outside of `renderToNodeStream()`.
This is possible if your data hydration method already parses your React tree. Example:

```tsx
import through from 'through';
import { renderToNodeStream } from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import template from 'server/template';

const helmetContext = {};

const app = (
  <HelmetProvider context={helmetContext}>
    <App>
      <Helmet>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
  </HelmetProvider>
);

await getDataFromTree(app);

const [header, footer] = template({
  helmet: helmetContext.helmet,
});

res.status(200);
res.write(header);
renderToNodeStream(app)
  .pipe(
    through(
      function write(data) {
        this.queue(data);
      },
      function end() {
        this.queue(footer);
        this.queue(null);
      }
    )
  )
  .pipe(res);
```

## Usage in Jest

While testing in using jest, if there is a need to emulate SSR, there is a render helper function available in the `__tests__/setup` folder. Import this rather than the one from `@testing-library/react` and you can pass in a 2nd argument of `true` to emulate SSR. A third argument allows a custom `context` value to be passed. The `render` function then returns all the same properties as the `@testing-library/react` version, as well as the `context` to allow it to be used modified.

```tsx
const render = (
  node: JSX.Element,
  mockSSR: boolean = false,
  context: HelmetContext = {},
): ReturnType<typeof rtlRender> & { context: HelmetContext }

```

## Prioritizing tags for SEO

It is understood that in some cases for SEO, certain tags should appear earlier in the HEAD. Using the `prioritizeSeoTags` flag on any `<Helmet>` component allows the server render of react-helmet-async to expose a method for prioritizing relevant SEO tags.

In the component:

```tsx
<Helmet prioritizeSeoTags>
  <title>A fancy webpage</title>
  <link rel="notImportant" href="https://www.chipotle.com" />
  <meta name="whatever" value="notImportant" />
  <link rel="canonical" href="https://www.tacobell.com" />
  <meta property="og:title" content="A very important title"/>
</Helmet>
```

In your server template:

```tsx
<html>
  <head>
    ${helmet.title.toString()}
    ${helmet.priority.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.script.toString()}
  </head>
  ...
</html>
```

Will result in:

```html
<html>
  <head>
    <title>A fancy webpage</title>
    <meta property="og:title" content="A very important title"/>
    <link rel="canonical" href="https://www.tacobell.com" />
    <meta name="whatever" value="notImportant" />
    <link rel="notImportant" href="https://www.chipotle.com" />
  </head>
  ...
</html>
```

A list of prioritized tags and attributes can be found in [constants.js](./src/constants.js).

## Usage without Context

You can optionally use `<Helmet>` outside a context by manually creating a stateful `HelmetData` instance, and passing that stateful object to each `<Helmet>` instance:

```tsx
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet, HelmetData } from 'react-helmet-async';

const helmetData = new HelmetData({});

const app = (
    <App>
      <Helmet helmetData={helmetData}>
        <title>Hello World</title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      <h1>Hello World</h1>
    </App>
);

const html = renderToString(app);

const { helmet } = helmetData.context;
```

## License

Licensed under the Apache 2.0 License, Copyright © 2022 Tetarchus
