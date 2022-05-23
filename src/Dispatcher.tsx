import React from 'react';

import { handleStateChangeOnClient } from './client';
import { Provider } from './Provider';
import { mapStateOnServer } from './server';
import { reducePropsToState } from './utils';

import type { DispatcherProps, HelmetServerState } from './types';

const Dispatcher: React.FC<DispatcherProps> = ({ context }: DispatcherProps) => {
  const [rendered, setRendered] = React.useState(false);

  // componentWillUnmount() {
  //   const { helmetInstances } = this.props.context;
  //   helmetInstances.remove(this);
  //   this.emitChange();
  // }

  const emitChange = React.useCallback(() => {
    const { helmetInstances, setHelmet } = context;
    let serverState: HelmetServerState | null = null;
    const state = reducePropsToState(helmetInstances.get().map((instance) => ({ ...instance })));
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state);
    }
    setHelmet(serverState);

    return () => {
      const { helmetInstances } = context;
      helmetInstances.remove(this);
    };
  }, []);

  const init = React.useCallback(() => {
    if (rendered) {
      return;
    }

    setRendered(true);

    const { helmetInstances } = context;
    helmetInstances.add(this);
    emitChange();
  }, []);

  init();

  return null;
};

export { Dispatcher };
