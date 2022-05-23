import type { HelmetData } from './HelmetData';

type HelmetProps = {
  base?: Partial<HTMLBaseElement> | undefined;
  bodyAttributes?: Partial<HTMLBodyElement> | undefined;
  children?: React.ReactNode;
  defaultTitle?: string | undefined;
  defer?: boolean | undefined;
  encodeSpecialCharacters?: boolean | undefined;
  helmetData?: HelmetData | undefined;
  htmlAttributes?: Partial<HTMLHtmlElement> | undefined;
  link?: Array<Partial<HTMLLinkElement>> | undefined;
  meta?: Array<Partial<HTMLMetaElement>> | undefined;
  noscript?: Array<Partial<HTMLElement>> | undefined;
  onChangeClientState?: (() => void) | undefined;
  prioritizeSeoTags?: boolean | undefined;
  script?: Array<Partial<HTMLScriptElement>> | undefined;
  style?: Array<Partial<HTMLStyleElement>> | undefined;
  title?: string | undefined;
  titleAttributes?: Partial<HTMLTitleElement> | undefined;
  titleTemplate?: string | undefined;
};

type HelmetPropsWithoutChildren = Omit<HelmetProps, 'children'>;

type ArrayTypeChildren = Record<string, unknown>;

type ArrayTypeChildrenArgs = {
  child: React.ReactElement;
  arrayTypeChildren: ArrayTypeChildren;
  newChildProps: Record<string, unknown>;
  nestedChildren: React.ReactNode;
};

type ObjectTypeChildrenArgs = {
  child: React.ReactElement;
  newProps: HelmetPropsWithoutChildren;
  newChildProps: Record<string, unknown>;
  nestedChildren: React.ReactNode;
};
/**
   * Provider Prop Types
    static propTypes = {
    context: PropTypes.shape({
      helmet: PropTypes.shape(),
    }),
    children: PropTypes.node.isRequired,
  };

  export const providerShape = PropTypes.shape({
  setHelmet: PropTypes.func,
  helmetInstances: PropTypes.shape({
    get: PropTypes.func,
    add: PropTypes.func,
    remove: PropTypes.func,
  }),
});
   */

// interface OtherElementAttributes {
//   [key: string]: string | number | boolean | null | undefined;
// }

// type HtmlProps = JSX.IntrinsicElements['html'] & OtherElementAttributes;

// type BodyProps = JSX.IntrinsicElements['body'] & OtherElementAttributes;

// type LinkProps = JSX.IntrinsicElements['link'];

// type MetaProps = JSX.IntrinsicElements['meta'];

// export interface HelmetTags {
//   baseTag: Array<any>;
//   linkTags: Array<HTMLLinkElement>;
//   metaTags: Array<HTMLMetaElement>;
//   noscriptTags: Array<any>;
//   scriptTags: Array<HTMLScriptElement>;
//   styleTags: Array<HTMLStyleElement>;
// }

// export interface HelmetProps {
//   async?: boolean;
//   base?: any;
//   bodyAttributes?: BodyProps;
//   defaultTitle?: string;
//   defer?: boolean;
//   encodeSpecialCharacters?: boolean;
//   helmetData?: HelmetData;
//   htmlAttributes?: HtmlProps;
//   onChangeClientState?: (newState: any, addedTags: HelmetTags, removedTags: HelmetTags) => void;
//   link?: LinkProps[];
//   meta?: MetaProps[];
//   noscript?: Array<any>;
//   script?: Array<any>;
//   style?: Array<any>;
//   title?: string;
//   titleAttributes?: Object;
//   titleTemplate?: string;
//   prioritizeSeoTags?: boolean;
// }

type HelmetDatum = {
  toString: () => string;
  toComponent: () => React.Component;
};

type HelmetHTMLBodyDatum = {
  toString: () => string;
  toComponent: () => React.HTMLAttributes<HTMLBodyElement>;
};

type HelmetHTMLElementDatum = {
  toString: () => string;
  toComponent: () => React.HTMLAttributes<HTMLHtmlElement>;
};

type HelmetServerState = {
  base: HelmetDatum;
  bodyAttributes: HelmetHTMLBodyDatum;
  htmlAttributes: HelmetHTMLElementDatum;
  link: HelmetDatum;
  meta: HelmetDatum;
  noscript: HelmetDatum;
  script: HelmetDatum;
  style: HelmetDatum;
  title: HelmetDatum;
  // titleAttributes: HelmetDatum;
  priority: HelmetDatum;
};

type HelmetDataContext = {
  helmet?: HelmetServerState;
};

type DispatcherContext = HelmetData['value'];

type DispatcherProps = {
  context: DispatcherContext;
};

// export class HelmetProvider extends React.Component<React.PropsWithChildren<ProviderProps>> {
//   static canUseDOM: boolean;
// }
// }

export type {
  ArrayTypeChildren,
  ArrayTypeChildrenArgs,
  DispatcherProps,
  HelmetDataContext,
  HelmetProps,
  HelmetPropsWithoutChildren,
  HelmetServerState,
  ObjectTypeChildrenArgs,
};
