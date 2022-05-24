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
import { flattenArray, includes, prioritizer, warn } from './utils';

import type {
  ArrayType,
  HelmetDatum,
  HelmetHTMLBodyDatum,
  HelmetHTMLElementDatum,
  HelmetProps,
  HelmetServerState,
  HelmetState,
  HelmetTags,
  InitProps,
  MethodTags,
  ObjectValues,
  PriorityMethods,
  PriorityMethodsArgs,
  TagTypeMap,
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
  tags: Array<ArrayType<NonNullable<HelmetProps[T]>>> | ArrayType<NonNullable<HelmetProps[T]>>,
  encode: HelmetProps['encodeSpecialCharacters'],
): string => {
  let tagString = '';
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      let attributeHtml = '';
      for (const attribute of Object.keys(tag)) {
        if (!(attribute === TAG_PROPERTIES.INNER_HTML || attribute === TAG_PROPERTIES.CSS_TEXT)) {
          const attr =
            tag[attribute] == null
              ? attribute
              : `${attribute}="${encodeSpecialCharacters(tag[attribute] as string, encode)}"`;

          attributeHtml = attributeHtml.trim() !== '' ? `${attributeHtml} ${attr}` : attr;
        }
      }
      const tagContent = typeof tag !== 'string' && 'innerHTML' in tag ? tag.innerHTML : '';
      const isSelfClosing = includes(SELF_CLOSING_TAGS, type as string);

      tagString = `${tagString}<${type} ${HELMET_ATTRIBUTE}="true" ${attributeHtml}${
        isSelfClosing ? `/>` : `>${tagContent}</${type}>`
      }`;
    }
  }
  return tagString;
};

const convertElementAttributesToReactProps = <T extends ObjectValues<typeof ATTRIBUTE_NAMES>>(
  attributes: HelmetProps[T],
  initProps?: InitProps, // = {},
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
  _type: typeof TAG_NAMES.TITLE,
  title: HelmetProps['title'],
  attributes: HelmetProps['titleAttributes'],
): Array<React.ReactElement<InitProps>> => {
  // Assigning into an array to define toString function on it
  const initProps: InitProps = {
    key: title ?? '',
    [HELMET_ATTRIBUTE]: true,
  };
  const props = convertElementAttributesToReactProps(attributes, initProps);

  return [React.createElement(TAG_NAMES.TITLE, props, title)];
};

const generateTagsAsReactComponent = <T extends keyof Omit<HelmetServerState, 'priority'>>(
  type: T,
  tags: HelmetTags<T>,
): Array<React.ReactElement<InitProps>> =>
  Array.isArray(tags)
    ? tags.map((tag, i) => {
        const newProps: React.HTMLAttributes<TagTypeMap[T]> = {};
        const mappedTag: InitProps = {
          key: i,
          [HELMET_ATTRIBUTE]: true,
        };

        for (const attribute of Object.keys(tag)) {
          const mappedAttribute = (REACT_TAG_MAP[attribute] as string | undefined) ?? attribute;

          if (
            mappedAttribute === TAG_PROPERTIES.INNER_HTML ||
            mappedAttribute === TAG_PROPERTIES.CSS_TEXT
          ) {
            const content = typeof tag !== 'string' && 'innerHTML' in tag ? tag.innerHTML : '';
            newProps.dangerouslySetInnerHTML = { __html: content };
          } else {
            newProps[mappedAttribute] = tag[attribute] as unknown;
          }
        }

        return React.createElement(type, mappedTag);
      })
    : [];

const getMethodsForTag = <T extends keyof Omit<HelmetServerState, 'priority'>>(
  type: T,
  tags: MethodTags<T>,
  encode: HelmetProps['encodeSpecialCharacters'],
): HelmetDatum | HelmetHTMLBodyDatum | HelmetHTMLElementDatum => {
  const validTitleTags = 'title' in tags && 'titleAttributes' in tags && type === TAG_NAMES.TITLE;
  const validOtherTags = !('title' in tags);
  const defaultMethods = {
    toComponent: (): Array<React.ReactElement<InitProps>> => [],
    toString: (): string => '',
  };
  switch (type) {
    case TAG_NAMES.TITLE:
      if (!validTitleTags) {
        warn(`getMethodsForTag 'title' was not passed both the title and its attributes`);
        return defaultMethods;
      }
      return {
        toComponent: (): Array<React.ReactElement<InitProps>> =>
          generateTitleAsReactComponent(type, tags.title, tags.titleAttributes),
        toString: (): string =>
          generateTitleAsString(type, tags.title, tags.titleAttributes, encode),
      };
    case ATTRIBUTE_NAMES.BODY:
    case ATTRIBUTE_NAMES.HTML:
      if (!validOtherTags) {
        warn(`getMethodsForTag '${type}' was passed an incorrect object rather than tags`);
        return defaultMethods;
      }
      return {
        toComponent: ():
          | InitProps & (HelmetProps['bodyAttributes'] | HelmetProps['htmlAttributes']) =>
          convertElementAttributesToReactProps(Array.isArray(tags) ? tags[0] : tags),
        toString: (): string =>
          generateElementAttributesAsString(Array.isArray(tags) ? tags[0] : tags),
      };
    default:
      if (!validOtherTags) {
        warn(`getMethodsForTag '${type}' was passed an incorrect object rather than tags`);
        return defaultMethods;
      }
      return {
        toComponent: (): Array<React.ReactElement<InitProps>> =>
          generateTagsAsReactComponent(type, Array.isArray(tags) ? tags : []),
        toString: (): string => generateTagsAsString(type, Array.isArray(tags) ? tags : [], encode),
      };
  }
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
  if (prioritizeSeoTags != null) {
    ({ priorityMethods, linkTagDefaults, metaTagDefaults, scriptTagDefaults } = getPriorityMethods({
      linkTags,
      metaTags,
      scriptTags,
      encode,
    }));
  }
  return {
    base: getMethodsForTag(TAG_NAMES.BASE, baseTag ?? {}, encode) as HelmetDatum,
    bodyAttributes: getMethodsForTag(
      ATTRIBUTE_NAMES.BODY,
      bodyAttributes ?? {},
      encode,
    ) as HelmetHTMLBodyDatum,
    htmlAttributes: getMethodsForTag(
      ATTRIBUTE_NAMES.HTML,
      htmlAttributes ?? {},
      encode,
    ) as HelmetHTMLElementDatum,
    link: getMethodsForTag(TAG_NAMES.LINK, linkTagDefaults ?? [], encode) as HelmetDatum,
    meta: getMethodsForTag(TAG_NAMES.META, metaTagDefaults ?? [], encode) as HelmetDatum,
    noscript: getMethodsForTag(TAG_NAMES.NOSCRIPT, noscriptTags ?? [], encode) as HelmetDatum,
    priority: priorityMethods,
    script: getMethodsForTag(TAG_NAMES.SCRIPT, scriptTagDefaults ?? [], encode) as HelmetDatum,
    style: getMethodsForTag(TAG_NAMES.STYLE, styleTags ?? [], encode) as HelmetDatum,
    title: getMethodsForTag(TAG_NAMES.TITLE, { title, titleAttributes }, encode) as HelmetDatum,
  };
};

export { mapStateOnServer };
