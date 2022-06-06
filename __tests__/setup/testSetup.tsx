import { render as rtlRender } from '@testing-library/react';
import React from 'react';

import { HelmetProvider } from '../../src';
import { clearInstances } from '../../src/HelmetData';

import type { HelmetContext, HelmetProviderProps } from '../../src';

declare global {
  interface Window {
    __spy__?: (arg: number) => number;
  }
}

let unmount: (() => void) | null = null;

const render = (
  node: JSX.Element,
  mockSSR: boolean = false,
  context: HelmetContext = {},
): ReturnType<typeof rtlRender> & { context: HelmetContext } => {
  const props: HelmetProviderProps = {};
  if (mockSSR) {
    props.context = context;
    props.ssr = true;
  }

  const { unmount: rtlUnmount, ...rest } = rtlRender(
    <React.StrictMode>
      <HelmetProvider {...props}>{node}</HelmetProvider>
    </React.StrictMode>,
  );
  unmount = rtlUnmount;
  return { unmount: rtlUnmount, ...rest, context };
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
