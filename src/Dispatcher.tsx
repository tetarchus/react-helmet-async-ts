import React from 'react';

import { handleStateChangeOnClient } from './client';
import { HelmetContext } from './HelmetContext';
import { mapStateOnServer } from './server';
import { reducePropsToState } from './utils';

import type { DispatcherProps, HelmetServerState } from './types';

const Dispatcher: React.FC<DispatcherProps> = (props: DispatcherProps) => {
  const [rendered, setRendered] = React.useState(false);
  const { canUseDOM } = React.useContext(HelmetContext);
  const { context, ...restProps } = props;

  const emitChange = React.useCallback(() => {
    if ('setHelmet' in context) {
      const { helmetInstances, setHelmet } = context;
      let serverState: HelmetServerState | null = null;
      const state = reducePropsToState(helmetInstances.get().map((instance) => ({ ...instance })));

      if (canUseDOM) {
        handleStateChangeOnClient(state);
      } else {
        serverState = mapStateOnServer(state);
      }
      setHelmet(serverState);
    }
  }, [canUseDOM, context]);

  const init = React.useCallback(() => {
    if (!rendered) {
      setRendered(true);

      if ('helmetInstances' in context) {
        const { helmetInstances } = context;
        helmetInstances.add(restProps);
        emitChange();
      }
    }
  }, [context, emitChange, rendered, restProps]);

  React.useEffect(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    emitChange();
    return () => {
      if ('helmetInstances' in context) {
        const { helmetInstances } = context;
        helmetInstances.remove(restProps);
      }
    };
  }, [context, emitChange, restProps]);

  return null;
};

export { Dispatcher };
