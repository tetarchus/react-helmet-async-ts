import React from 'react';

import {
  ATTRIBUTE_NAMES,
  HELMET_ATTRIBUTE,
  REACT_TAG_MAP,
  SELF_CLOSING_TAGS,
  SEO_PRIORITY_TAGS,
  TAG_NAMES,
  TAG_PROPERTIES,
} from './constants';
import { flattenArray, includes, prioritizer } from './utils';

import type {
  ArrayType,
  HelmetDatum,
  HelmetHTMLBodyDatum,
  HelmetHTMLElementDatum,
  HelmetProps,
  HelmetServerState,
  HelmetState,
  InitProps,
  ObjectValues,
  PriorityMethods,
  PriorityMethodsArgs,
  TagMap,
  TagTypeMap,
  TitleTags,
} from './types';

const encodeSpecialCharacters = (str: string, encode: boolean = true): string => {
  if (!encode) {
    return String(str);
  }

  return String(str)
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#x27;');
};

const generateElementAttributesAsString = <T extends ObjectValues<typeof ATTRIBUTE_NAMES>>(
  attributes: HelmetProps[T],
): string => {
  let attrString = '';
  if (attributes != null) {
    for (const key of Object.keys(attributes)) {
      const attr =
        typeof attributes[key] !== 'undefined' ? `${key}="${attributes[key] as string}"` : `${key}`;
      attrString = attrString.trim() !== '' ? `${attrString} ${attr}` : attr;
    }
  }
  return attrString;
};

const generateTitleAsString = (
  type: typeof TAG_NAMES.TITLE,
  title: HelmetProps['title'],
  attributes: HelmetProps['titleAttributes'],
  encode: HelmetProps['encodeSpecialCharacters'],
): string => {
  const attributeString = generateElementAttributesAsString(attributes);
  const flattenedTitle = flattenArray(title ?? '');
  return attributeString
    ? `<${type} ${HELMET_ATTRIBUTE}="true" ${attributeString}>${encodeSpecialCharacters(
        flattenedTitle,
        encode,
      )}</${type}>`
    : `<${type} ${HELMET_ATTRIBUTE}="true">${encodeSpecialCharacters(
        flattenedTitle,
        encode,
      )}</${type}>`;
};

const generateTagsAsString = <T extends keyof Omit<HelmetServerState, 'priority'>>(
  type: T,
  tags: Array<ArrayType<HelmetProps[T]>> | ArrayType<HelmetProps[T]>,
  encode: HelmetProps['encodeSpecialCharacters'],
): string => {
  let tagString = '';
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      let attributeHtml = '';
      if (tag != null) {
        for (const attribute of Object.keys(tag)) {
          if (!(attribute === TAG_PROPERTIES.INNER_HTML || attribute === TAG_PROPERTIES.CSS_TEXT)) {
            const attr =
              tag[attribute] == null
                ? attribute
                : `${attribute}="${encodeSpecialCharacters(tag[attribute] as string, encode)}"`;

            attributeHtml = attributeHtml.trim() !== '' ? `${attributeHtml} ${attr}` : attr;
          }
        }
        const tagContent =
          typeof tag !== 'string' && 'innerHTML' in tag
            ? (tag.innerHTML as string)
            : typeof tag !== 'string' && 'cssText' in tag
            ? (tag.cssText as string)
            : '';
        const isSelfClosing = includes(SELF_CLOSING_TAGS, type as string);

        tagString = `${tagString}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${
          isSelfClosing ? `/>` : `>${tagContent}</${type}>`
        }`;
      }
    }
  }
  return tagString;
};

const convertElementAttributesToReactProps = <
  T extends ObjectValues<Pick<typeof ATTRIBUTE_NAMES, 'BODY' | 'HTML' | 'TITLE'>>,
>(
  attributes: HelmetProps[T],
  initProps?: InitProps,
): HelmetProps[T] & InitProps => {
  const newProps: HelmetProps[T] = {};
  if (attributes != null) {
    for (const key of Object.keys(attributes)) {
      newProps[(REACT_TAG_MAP[key] as string | undefined) ?? key] = attributes[key] as unknown;
    }
  }
  return { ...initProps, ...newProps };
};

const generateTitleAsReactComponent = (
  type: typeof TAG_NAMES.TITLE,
  title: HelmetState['title'],
  attributes: HelmetState['titleAttributes'],
): Array<React.ReactElement<InitProps>> => {
  // Assigning into an array to define toString function on it
  const initProps: InitProps = {
    key: title ?? '',
    [HELMET_ATTRIBUTE]: true,
  };
  const props = convertElementAttributesToReactProps(
    attributes,
    initProps,
  ) as HelmetState['titleAttributes'];

  return props != null ? [React.createElement(type, props, title)] : [];
};

const generateTagsAsReactComponent = <T extends keyof Omit<HelmetServerState, 'priority'>>(
  type: T,
  tags: Array<ArrayType<HelmetProps[T]>> | ArrayType<HelmetProps[T]>,
): Array<React.ReactElement<InitProps>> => {
  const components: Array<React.ReactElement<InitProps>> = [];
  if (Array.isArray(tags)) {
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const newProps: React.HTMLAttributes<TagTypeMap[T]> = {};
      const mappedTag: InitProps = {
        key: i,
        [HELMET_ATTRIBUTE]: true,
      };
      if (tag != null) {
        for (const attribute of Object.keys(tag)) {
          const mappedAttribute = (REACT_TAG_MAP[attribute] as string | undefined) ?? attribute;

          if (
            mappedAttribute === TAG_PROPERTIES.INNER_HTML ||
            mappedAttribute === TAG_PROPERTIES.CSS_TEXT
          ) {
            const content =
              typeof tag !== 'string' && 'innerHTML' in tag
                ? (tag.innerHTML as string)
                : typeof tag !== 'string' && 'cssText' in tag
                ? (tag.cssText as string)
                : '';
            newProps.dangerouslySetInnerHTML = { __html: content };
          } else {
            newProps[mappedAttribute] = tag[attribute] as unknown;
          }
        }
      }
      components.push(React.createElement(type, { ...mappedTag, ...newProps }));
    }
  }
  return components;
};

const getMethodsForBodyTag = <T extends typeof ATTRIBUTE_NAMES.BODY>(
  _type: T,
  tags: HelmetProps[T],
): HelmetHTMLBodyDatum => ({
  toComponent: (): HelmetProps[TagMap[T]] & InitProps => convertElementAttributesToReactProps(tags),
  toString: (): string => generateElementAttributesAsString(tags),
});

const getMethodsForHtmlTag = <T extends typeof ATTRIBUTE_NAMES.HTML>(
  _type: T,
  tags: HelmetProps[T],
): HelmetHTMLElementDatum => ({
  toComponent: (): HelmetProps[TagMap[T]] & InitProps => convertElementAttributesToReactProps(tags),
  toString: (): string => generateElementAttributesAsString(tags),
});

const getMethodsForTitleTag = <T extends typeof TAG_NAMES.TITLE>(
  type: T,
  tags: TitleTags,
  encode: HelmetProps['encodeSpecialCharacters'],
): HelmetDatum => ({
  toComponent: (): Array<React.ReactElement<InitProps>> =>
    generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
  toString: (): string => generateTitleAsString(type, tags.title, tags.titleAttributes, encode),
});

const getMethodsForTag = <
  T extends keyof Omit<HelmetServerState, 'body' | 'html' | 'priority' | 'title'>,
>(
  type: T,
  tags: Array<ArrayType<HelmetProps[T]>> | ArrayType<HelmetProps[T]> | undefined,
  encode: HelmetProps['encodeSpecialCharacters'],
): HelmetDatum => {
  const defaultMethods = {
    toComponent: (): Array<React.ReactElement<InitProps>> => [],
    toString: (): string => '',
  };
  if (tags != null) {
    return {
      toComponent: () => generateTagsAsReactComponent(type, tags),
      toString: () => generateTagsAsString(type, tags, encode),
    };
  }
  return defaultMethods;
};

const getPriorityMethods = ({
  encode,
  linkTags,
  metaTags,
  scriptTags,
}: PriorityMethodsArgs): PriorityMethods => {
  const link = prioritizer(linkTags, SEO_PRIORITY_TAGS.link);
  const meta = prioritizer(metaTags, SEO_PRIORITY_TAGS.meta);
  const script = prioritizer(scriptTags, SEO_PRIORITY_TAGS.script);

  // Need to have toComponent() and toString() functions
  const priorityMethods = {
    toComponent: (): Array<React.ReactElement<InitProps>> => [
      ...generateTagsAsReactComponent(TAG_NAMES.META, meta.priority),
      ...generateTagsAsReactComponent(TAG_NAMES.LINK, link.priority),
      ...generateTagsAsReactComponent(TAG_NAMES.SCRIPT, script.priority),
    ],
    toString: (): string =>
      // Generate all the tags as strings and concatenate them
      `${getMethodsForTag(TAG_NAMES.META, meta.priority, encode).toString()} ${getMethodsForTag(
        TAG_NAMES.LINK,
        link.priority,
        encode,
      ).toString()} ${getMethodsForTag(TAG_NAMES.SCRIPT, script.priority, encode).toString()}`,
  };

  return {
    priorityMethods,
    metaTagDefaults: meta.default,
    linkTagDefaults: link.default,
    scriptTagDefaults: script.default,
  };
};

const mapStateOnServer = ({
  baseTag,
  bodyAttributes,
  encode,
  htmlAttributes,
  linkTags,
  metaTags,
  noscriptTags,
  prioritizeSeoTags,
  scriptTags,
  styleTags,
  title = '',
  titleAttributes,
}: HelmetState): HelmetServerState => {
  let linkTagDefaults = linkTags;
  let metaTagDefaults = metaTags;
  let scriptTagDefaults = scriptTags;

  let priorityMethods = {
    toComponent: (): React.ReactElement[] => [],
    toString: () => '',
  };

  if (prioritizeSeoTags === true) {
    ({ priorityMethods, linkTagDefaults, metaTagDefaults, scriptTagDefaults } = getPriorityMethods({
      linkTags,
      metaTags,
      scriptTags,
      encode,
    }));
  }
  return {
    base: getMethodsForTag(TAG_NAMES.BASE, baseTag, encode),
    bodyAttributes: getMethodsForBodyTag(ATTRIBUTE_NAMES.BODY, bodyAttributes),
    htmlAttributes: getMethodsForHtmlTag(ATTRIBUTE_NAMES.HTML, htmlAttributes),
    link: getMethodsForTag(TAG_NAMES.LINK, linkTagDefaults, encode),
    meta: getMethodsForTag(TAG_NAMES.META, metaTagDefaults, encode),
    noscript: getMethodsForTag(TAG_NAMES.NOSCRIPT, noscriptTags, encode),
    priority: priorityMethods,
    script: getMethodsForTag(TAG_NAMES.SCRIPT, scriptTagDefaults, encode),
    style: getMethodsForTag(TAG_NAMES.STYLE, styleTags, encode),
    title: getMethodsForTitleTag(TAG_NAMES.TITLE, { title, titleAttributes }, encode),
  };
};

export { mapStateOnServer };
