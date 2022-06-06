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
  const [currentProps] = React.useState({ context, restProps });

  const emitChange = React.useCallback(() => {
    if ('setHelmet' in currentProps.context) {
      const { helmetInstances, setHelmet } = currentProps.context;
      let serverState: HelmetServerState | null = null;
      const state = reducePropsToState(
        helmetInstances
          .get()
          .map((instance) => ({ ...instance }))
          .reverse(),
      );
      if (canUseDOM) {
        handleStateChangeOnClient(state);
      } else {
        serverState = mapStateOnServer(state);
      }
      setHelmet(serverState);
    }
  }, [canUseDOM, currentProps]);

  const init = React.useCallback(() => {
    if (!rendered) {
      setRendered(true);

      if ('helmetInstances' in currentProps.context) {
        const { helmetInstances } = currentProps.context;
        helmetInstances.add(currentProps.restProps);
        emitChange();
      }
    }
  }, [currentProps, emitChange, rendered]);

  React.useEffect(() => {
    init();
    return () => {
      if ('helmetInstances' in currentProps.context) {
        const { helmetInstances } = currentProps.context;
        helmetInstances.remove(currentProps.restProps);
      }
    };
  }, [currentProps, init]);

  React.useEffect(() => {
    emitChange();
  }, [currentProps.context, emitChange]);

  return null;
};

export { Dispatcher };
