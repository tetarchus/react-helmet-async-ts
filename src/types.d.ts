import type { HELMET_ATTRIBUTE } from './constants';
import type { HelmetData } from './HelmetData';
import type React from 'react';

type ArrayType<T> = T extends Array<infer U> | ReadonlyArray<infer U> ? U : T;
type EmptyObject = Record<never, never>;
type ObjectValues<T extends Record<PropertyKey, unknown>, K extends PropertyKey = keyof T> = T[K];
type ObjectValuesArray<T extends Record<PropertyKey, unknown>> = Array<ObjectValues<T>>;

type InitProps = {
  key?: number | string | null | undefined;
  [HELMET_ATTRIBUTE]?: boolean;
};

type HTMLElementAttributes = JSX.IntrinsicElements['html'] &
  React.DataHTMLAttributes &
  React.HTMLAttributes<HTMLHtmlElement> & {
    amp?: boolean | undefined;
    class?: string;
  };

type TagTypeMap = {
  base: Partial<HTMLBaseElement>;
  body: Partial<JSX.IntrinsicElements['body']>;
  bodyAttributes: Partial<JSX.IntrinsicElements['body']>;
  html: Partial<HTMLElementAttributes>;
  htmlAttributes: Partial<HTMLElementAttributes>;
  link: Partial<HTMLLinkElement>;
  meta: Partial<
    HTMLMetaElement & {
      charset?: string;
      'http-equiv':
        | 'content-security-policy'
        | 'content-type'
        | 'default-style'
        | 'refresh'
        | 'x-ua-compatible';
      property?: string;
      itemprop?: string;
    }
  >;
  noscript: Partial<HTMLElement>;
  script: Partial<HTMLScriptElement>;
  style: Partial<HTMLStyleElement & { cssText?: string }>;
  title: Partial<JSX.IntrinsicElements['title'] & { itemprop?: string }>;
};

type UpdatedTags = { oldTags: Element[]; newTags: Element[] };

type CheckedUpdatedTags = { updatedOldTags: Element[]; updatedNewTags: Element[] };

type HelmetDatum = {
  toComponent: () => Array<React.ReactElement<InitProps>>;
  toString: () => string;
};

type HelmetHTMLBodyDatum = {
  toComponent: () => HelmetProps['bodyAttributes'] & InitProps;
  toString: () => string;
};

type HelmetHTMLElementDatum = {
  toComponent: () => HelmetProps['htmlAttributes'] & InitProps;
  toString: () => string;
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
  priority: HelmetDatum;
};

type HelmetDataContext = {
  helmet?: HelmetServerState | null;
};

type HelmetProps = {
  base: TagTypeMap['base'] | undefined;
  bodyAttributes: TagTypeMap['body'] | undefined;
  children?: React.ReactNode;
  defaultTitle: string | undefined;
  defer: boolean;
  encodeSpecialCharacters: boolean;
  helmetData: HelmetData | { context: HelmetDataContext; instances: HelmetProps[] } | undefined;
  htmlAttributes: TagTypeMap['html'] | undefined;
  link: Array<TagTypeMap['link']> | undefined;
  meta: Array<TagTypeMap['meta']> | undefined;
  noscript: Array<TagTypeMap['noscript']> | undefined;
  onChangeClientState:
    | ((
        newState: HelmetState,
        addedTags: Record<string, HTMLElement[]>,
        removedTags: Record<string, HTMLElement[]>,
      ) => void)
    | undefined;
  prioritizeSeoTags: boolean;
  script: Array<TagTypeMap['script']> | undefined;
  style: Array<TagTypeMap['style']> | undefined;
  title: string | undefined;
  titleAttributes: TagTypeMap['title'] | undefined;
  titleTemplate: string | undefined;
};

type HelmetPropsWithoutChildren = Omit<HelmetProps, 'children'>;

type Prioritizer<T extends 'link' | 'meta' | 'script'> = {
  default: Array<ArrayType<NonNullable<HelmetProps[T]>>>;
  priority: Array<ArrayType<NonNullable<HelmetProps[T]>>>;
};

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

type TagMap = {
  base: 'baseTag';
  body: 'bodyAttributes';
  bodyAttributes: 'bodyAttributes';
  html: 'htmlAttributes';
  htmlAttributes: 'htmlAttributes';
  link: 'linkTags';
  meta: 'metaTags';
  noscript: 'noscriptTags';
  script: 'scriptTags';
  style: 'styleTags';
  title: 'title';
};

type HelmetState = {
  baseTag: Array<HelmetProps['base']>;
  bodyAttributes: HelmetProps['bodyAttributes'];
  defer: HelmetProps['defer'];
  encode: HelmetProps['encodeSpecialCharacters'];
  htmlAttributes: HelmetProps['htmlAttributes'];
  linkTags: HelmetProps['link'];
  metaTags: HelmetProps['meta'];
  noscriptTags: HelmetProps['noscript'];
  onChangeClientState?: HelmetProps['onChangeClientState'];
  prioritizeSeoTags?: HelmetProps['prioritizeSeoTags'];
  scriptTags: HelmetProps['script'];
  styleTags: HelmetProps['style'];
  title?: HelmetProps['title'];
  titleAttributes: HelmetProps['titleAttributes'];
};

type TitleTags = { title: HelmetProps['title']; titleAttributes: HelmetProps['titleAttributes'] };

type DispatcherContext = HelmetData['value'] & HelmetDataContext;

type HelmetContext = DispatcherContext | EmptyObject;

type HelmetProviderProps = {
  children?: React.ReactNode;
  context?: HelmetContext;
  ssr?: boolean;
};

type PriorityMethodsArgs = {
  encode: HelmetState['encode'];
  metaTags: HelmetState['metaTags'];
  linkTags: HelmetState['linkTags'];
  scriptTags: HelmetState['scriptTags'];
};

type PriorityMethods = {
  priorityMethods: HelmetDatum;
  linkTagDefaults: Prioritizer<'link'>['default'];
  metaTagDefaults: Prioritizer<'meta'>['default'];
  scriptTagDefaults: Prioritizer<'script'>['default'];
};

type HelmetContextValue = {
  canUseDOM: boolean;
  context: HelmetContext;
};

type DispatcherProps = HelmetProps & {
  context: HelmetContext;
};

export type {
  ArrayType,
  ArrayTypeChildren,
  ArrayTypeChildrenArgs,
  CheckedUpdatedTags,
  DispatcherProps,
  HelmetContext,
  HelmetContextValue,
  HelmetDataContext,
  HelmetDatum,
  HelmetHTMLBodyDatum,
  HelmetHTMLElementDatum,
  HelmetProps,
  HelmetPropsWithoutChildren,
  HelmetProviderProps,
  HelmetServerState,
  HelmetState,
  InitProps,
  ObjectTypeChildrenArgs,
  ObjectValues,
  ObjectValuesArray,
  Prioritizer,
  PriorityMethods,
  PriorityMethodsArgs,
  TagMap,
  TagTypeMap,
  TitleTags,
  UpdatedTags,
};
