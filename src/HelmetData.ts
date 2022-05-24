import { mapStateOnServer } from './server';

import type { HelmetDataContext, HelmetProps, HelmetServerState } from './types';

const domInstances: HelmetProps[] = [];

const clearInstances = (): void => {
  domInstances.length = 0;
};

class HelmetData {
  public readonly instances: HelmetProps[] = [];

  public canUseDOM: boolean;

  public context: HelmetDataContext = {};

  public readonly value = {
    setHelmet: (serverState: HelmetServerState | null): void => {
      this.context.helmet = serverState;
    },
    helmetInstances: {
      get: (): HelmetProps[] => (this.canUseDOM ? domInstances : this.instances),
      add: (instance: HelmetProps): void => {
        (this.canUseDOM ? domInstances : this.instances).push(instance);
      },
      remove: (instance: HelmetProps): void => {
        const index = (this.canUseDOM ? domInstances : this.instances).indexOf(instance);
        (this.canUseDOM ? domInstances : this.instances).splice(index, 1);
      },
    },
  };

  public constructor(context: HelmetDataContext, canUseDOM = typeof document !== 'undefined') {
    this.context = context;
    this.canUseDOM = canUseDOM;

    if (!canUseDOM) {
      this.context.helmet = mapStateOnServer({
        baseTag: {},
        bodyAttributes: {},
        encode: true,
        htmlAttributes: {},
        linkTags: [],
        metaTags: [],
        noscriptTags: [],
        scriptTags: [],
        styleTags: [],
        title: '',
        titleAttributes: {},
      });
    }
  }
}

export { clearInstances, HelmetData };
