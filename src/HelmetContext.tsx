import React from 'react';

import { HelmetData } from './HelmetData';

import type { HelmetContextValue, HelmetProviderProps } from './types';

const defaultValue: HelmetContextValue = {
  canUseDOM: typeof document !== 'undefined',
  context: {},
};

const HelmetContext: React.Context<HelmetContextValue> = React.createContext(defaultValue);

const HelmetContextProvider: React.FC<HelmetProviderProps> = ({
  children,
  context = defaultValue.context,
}: HelmetProviderProps) => {
  const { canUseDOM } = React.useContext(HelmetContext);
  const contextValue = React.useMemo(
    () => ({ canUseDOM, context: new HelmetData(context, canUseDOM) }),
    [canUseDOM, context],
  );

  return <HelmetContext.Provider value={contextValue}>{children}</HelmetContext.Provider>;
};

export { HelmetContext, HelmetContextProvider };
