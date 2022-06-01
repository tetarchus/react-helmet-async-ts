import { render as rtlRender } from '@testing-library/react';
import React from 'react';

import { HelmetContextProvider } from '../../src';
import { clearInstances } from '../../src/HelmetData';

import type { HelmetContext, HelmetProviderProps } from '../../src';

let unmount: (() => void) | null = null;

const render = (
  node: JSX.Element,
  mockSSR: boolean = false,
  context: HelmetContext = {},
): Omit<ReturnType<typeof rtlRender>, 'unmount'> & { context: HelmetContext } => {
  const props: HelmetProviderProps = {};
  if (mockSSR) {
    props.context = context;
    props.ssr = true;
  }

  const { unmount: rtlUnmount, ...rest } = rtlRender(
    <React.StrictMode>
      <HelmetContextProvider {...props}>{node}</HelmetContextProvider>
    </React.StrictMode>,
  );
  unmount = rtlUnmount;
  return { ...rest, context };
};

const before = (): void => {
  document.head.innerHTML = '';
};

const after = (): void => {
  unmount?.();
  clearInstances();
};

const isArray = {
  asymmetricMatch: (actual: unknown): boolean => Array.isArray(actual),
};

export { after, before, isArray, render };
