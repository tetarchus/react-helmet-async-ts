import invariant from 'invariant';
import React from 'react';
import ReactIs from 'react-is';

import {
  ATTRIBUTE_NAMES,
  HELMET_PROPS,
  HTML_TAG_MAP,
  TAG_NAMES,
  TAG_PROPERTIES,
  VALID_TAG_NAMES,
} from './constants';

import type { SEO_PRIORITY_TAGS } from './constants';
import type {
  ArrayType,
  ArrayTypeChildren,
  ArrayTypeChildrenArgs,
  HelmetProps,
  HelmetPropsWithoutChildren,
  HelmetState,
  ObjectTypeChildrenArgs,
  ObjectValues,
  ObjectValuesArray,
  Prioritizer,
  TagTypeMap,
} from './types';

const isArray = <T>(arg: Iterable<T> | unknown | null | undefined): arg is T[] =>
  Array.isArray(arg);

const includes = <U, T extends U>(arr: ReadonlyArray<T>, el: U): el is T => arr.includes(el as T);

const getInnermostProperty = <T extends keyof HelmetPropsWithoutChildren>(
  propsList: HelmetPropsWithoutChildren[],
  property: T,
): HelmetProps[T] | undefined => {
  for (const propsInstance of propsList) {
    if (Object.prototype.hasOwnProperty.call(propsInstance, property)) {
      return propsInstance[property];
    }
  }

  return undefined;
};

const getTitleFromPropsList = (propsList: HelmetPropsWithoutChildren[]): HelmetProps['title'] => {
  let innermostTitle = getInnermostProperty(propsList, TAG_NAMES.TITLE);
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join('');
  }
  if (innermostTemplate != null && innermostTitle != null) {
    // Use function arg to avoid need to escape $ characters
    return innermostTemplate.replace(/%s/gu, () => innermostTitle ?? '');
  }

  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);

  return innermostTitle ?? innermostDefaultTitle ?? undefined;
};

const getOnChangeClientState = (
  propsList: HelmetPropsWithoutChildren[],
): HelmetProps['onChangeClientState'] =>
  getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) ??
  ((): void => {
    /* Empty Function */
  });

const getAttributesFromPropsList = <T extends ObjectValues<typeof ATTRIBUTE_NAMES>>(
  tagType: T,
  propsList: HelmetPropsWithoutChildren[],
): HelmetProps[T] => {
  let attributeValues: HelmetProps[T] = {};
  for (const propsInstance of propsList) {
    const attributeProps = propsInstance[tagType];
    attributeValues = { ...attributeProps, ...attributeValues };
  }

  return attributeValues;
};

const getBaseTagFromPropsList = (
  primaryAttributes: ObjectValuesArray<typeof TAG_PROPERTIES>,
  propsList: HelmetPropsWithoutChildren[],
): Array<HelmetProps['base']> => {
  const innermostBaseTag: Array<HelmetProps['base']> = [];

  for (const propsInstance of propsList) {
    const baseProps = propsInstance[TAG_NAMES.BASE];
    if (baseProps != null && innermostBaseTag.length === 0) {
      for (const key of Object.keys(baseProps)) {
        const lowerCaseAttributeKey = key.toLowerCase();

        if (
          primaryAttributes.includes(lowerCaseAttributeKey) &&
          baseProps[lowerCaseAttributeKey] != null
        ) {
          innermostBaseTag.push(baseProps);
        }
      }
    }
  }
  return innermostBaseTag;
};

const warn = (msg: string): void => {
  // eslint-disable-next-line no-console
  console.warn(msg);
};

// eslint-disable-next-line complexity
const getTagsFromPropsList = <
  T extends ObjectValues<Pick<typeof TAG_NAMES, 'LINK' | 'META' | 'NOSCRIPT' | 'SCRIPT' | 'STYLE'>>,
>(
  tagName: T,
  primaryAttributes: ObjectValuesArray<typeof TAG_PROPERTIES>,
  propsList: HelmetPropsWithoutChildren[],
): HelmetProps[T] => {
  // Calculate list of tags, giving priority innermost component (end of the propslist)
  const approvedSeenTags = {};
  const approvedTags: Array<TagTypeMap[T]> = [];

  for (const propsInstance of propsList) {
    const tagInstance = propsInstance[tagName];
    if (tagInstance != null && !Array.isArray(tagInstance)) {
      warn(
        `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof tagInstance}"`,
      );
    } else if (tagInstance != null) {
      const instanceSeenTags = {};

      for (const tag of tagInstance.reverse()) {
        let primaryAttributeKey = '';
        for (const attributeKey of Object.keys(tag as TagTypeMap[T])) {
          const lowerCaseAttributeKey = attributeKey.toLowerCase();
          const tagAttribute = (tag as TagTypeMap[T])[lowerCaseAttributeKey] as unknown;
          const tagPrimaryAttribute = (tag as TagTypeMap[T])[primaryAttributeKey] as unknown;

          // Special rule with link tags, since rel and href are both primary tags, rel takes priority
          if (
            primaryAttributes.includes(lowerCaseAttributeKey) &&
            !(
              primaryAttributeKey === TAG_PROPERTIES.REL &&
              typeof tagPrimaryAttribute === 'string' &&
              tagPrimaryAttribute.toLowerCase() === 'canonical'
            ) &&
            !(
              lowerCaseAttributeKey === TAG_PROPERTIES.REL &&
              typeof tagAttribute === 'string' &&
              tagAttribute.toLowerCase() === 'stylesheet'
            )
          ) {
            primaryAttributeKey = lowerCaseAttributeKey;
          }
          // Special // Special case for innerHTML which doesn't work lowercasedcase for innerHTML which doesn't work lowercased
          if (
            primaryAttributes.includes(attributeKey) &&
            (attributeKey === TAG_PROPERTIES.INNER_HTML ||
              attributeKey === TAG_PROPERTIES.CSS_TEXT ||
              attributeKey === TAG_PROPERTIES.ITEM_PROP)
          ) {
            primaryAttributeKey = attributeKey;
          }
        }
        const primaryAttribute = (tag as TagTypeMap[T])[primaryAttributeKey] as unknown;
        if (primaryAttributeKey.trim() !== '' && typeof primaryAttribute === 'string') {
          const value = primaryAttribute.toLowerCase();

          let approvedTagEntry = approvedSeenTags[primaryAttributeKey] as Record<
            string,
            unknown
          > | null;
          let instanceTagEntry = instanceSeenTags[primaryAttributeKey] as Record<
            string,
            boolean
          > | null;

          if (approvedTagEntry == null) {
            approvedSeenTags[primaryAttributeKey] = {};
            approvedTagEntry = approvedSeenTags[primaryAttributeKey] as Record<string, unknown>;
          }

          if (instanceTagEntry == null) {
            instanceSeenTags[primaryAttributeKey] = {};
            instanceTagEntry = instanceSeenTags[primaryAttributeKey] as Record<string, boolean>;
          }

          if (approvedTagEntry[value] == null) {
            instanceTagEntry[value] = true;
            approvedTags.push(tag);
          }
        }
      }
      // Update seen tags with tags from this instance
      for (const attributeKey of Object.keys(instanceSeenTags)) {
        const tagUnion = {
          ...(approvedSeenTags[attributeKey] as Record<string, unknown>),
          ...(instanceSeenTags[attributeKey] as Record<string, boolean>),
        };

        approvedSeenTags[attributeKey] = tagUnion;
      }
    }
  }

  return approvedTags.reverse();
};

const getAnyTrueFromPropsList = (
  propsList: HelmetPropsWithoutChildren[],
  checkedTag: ObjectValues<typeof HELMET_PROPS>,
): boolean => {
  if (Array.isArray(propsList) && propsList.length > 0) {
    for (const propsInstance of propsList) {
      if (propsInstance[checkedTag] === true) {
        return true;
      }
    }
  }
  return false;
};

const reducePropsToState = (propsList: HelmetPropsWithoutChildren[]): HelmetState => ({
  baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], propsList),
  bodyAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.BODY, propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER) ?? false,
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS) ?? false,
  htmlAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.HTML, propsList),
  linkTags: getTagsFromPropsList(
    TAG_NAMES.LINK,
    [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF],
    propsList,
  ),
  metaTags: getTagsFromPropsList(
    TAG_NAMES.META,
    [
      TAG_PROPERTIES.NAME,
      TAG_PROPERTIES.CHARSET,
      TAG_PROPERTIES.HTTPEQUIV,
      TAG_PROPERTIES.PROPERTY,
      TAG_PROPERTIES.ITEM_PROP,
    ],
    propsList,
  ),
  noscriptTags: getTagsFromPropsList(TAG_NAMES.NOSCRIPT, [TAG_PROPERTIES.INNER_HTML], propsList),
  onChangeClientState: getOnChangeClientState(propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS),
  scriptTags: getTagsFromPropsList(
    TAG_NAMES.SCRIPT,
    [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
    propsList,
  ),
  styleTags: getTagsFromPropsList(TAG_NAMES.STYLE, [TAG_PROPERTIES.CSS_TEXT], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.TITLE, propsList),
});

const flattenArray = (possibleArray: string[] | string): string =>
  Array.isArray(possibleArray) ? possibleArray.join('') : possibleArray;

const checkIfPropsMatch = <T extends 'link' | 'meta' | 'script'>(
  props: ArrayType<HelmetProps[T]>,
  toMatch: ObjectValues<typeof SEO_PRIORITY_TAGS>,
): boolean => {
  if (props != null) {
    for (const key of Object.keys(props)) {
      const matchValues = toMatch[key] as string[] | string;
      // E.g. if rel exists in the list of allowed props [amphtml, alternate, etc]
      if (
        (Array.isArray(matchValues) && matchValues.includes(String(props[key]))) ||
        matchValues === props[key]
      ) {
        return true;
      }
    }
  }
  return false;
};

const prioritizer = <T extends 'link' | 'meta' | 'script'>(
  elementsList: HelmetProps[T],
  propsToMatch: ObjectValues<typeof SEO_PRIORITY_TAGS>,
): Prioritizer<T> => {
  const priorityOrder: Prioritizer<T> = { default: [], priority: [] };

  if (isArray(elementsList)) {
    for (const elementAttrs of elementsList) {
      if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
        priorityOrder.priority.push(elementAttrs as ArrayType<NonNullable<HelmetProps[T]>>);
      } else {
        priorityOrder.default.push(elementAttrs as ArrayType<NonNullable<HelmetProps[T]>>);
      }
    }
    return priorityOrder;
  }
  priorityOrder.default = [];
  return priorityOrder;
};

const mapNestedChildrenToProps = (
  child: React.ReactElement,
  nestedChildren: React.ReactNode,
): Record<string, string> | null => {
  if (nestedChildren == null) {
    return null;
  }

  switch (child.type) {
    case TAG_NAMES.SCRIPT:
    case TAG_NAMES.NOSCRIPT:
      return {
        innerHTML: String(nestedChildren),
      };

    case TAG_NAMES.STYLE:
      return {
        cssText: String(nestedChildren),
      };
    default:
      throw new Error(
        `<${child.type.toString()} /> elements are self-closing and can not contain children. Refer to our API for more information.`,
      );
  }
};

const flattenArrayTypeChildren = ({
  child,
  arrayTypeChildren,
  newChildProps,
  nestedChildren,
}: ArrayTypeChildrenArgs): Record<string, unknown> => ({
  ...arrayTypeChildren,
  [child.type.toString()]: [
    ...((arrayTypeChildren[child.type.toString()] as string | undefined) ?? []),
    {
      ...newChildProps,
      ...mapNestedChildrenToProps(child, nestedChildren),
    },
  ],
});

const mapObjectTypeChildren = ({
  child,
  newProps,
  newChildProps,
  nestedChildren,
}: ObjectTypeChildrenArgs): HelmetPropsWithoutChildren => {
  switch (child.type) {
    case TAG_NAMES.TITLE:
      return {
        ...newProps,
        [child.type.toString()]: nestedChildren,
        titleAttributes: { ...newChildProps },
      };

    case TAG_NAMES.BODY:
      return {
        ...newProps,
        bodyAttributes: { ...newChildProps },
      };

    case TAG_NAMES.HTML:
      return {
        ...newProps,
        htmlAttributes: { ...newChildProps },
      };
    default:
      return {
        ...newProps,
        [child.type.toString()]: { ...newChildProps },
      };
  }
};

const mapArrayTypeChildrenToProps = (
  arrayTypeChildren: ArrayTypeChildren,
  newProps: HelmetPropsWithoutChildren,
): HelmetPropsWithoutChildren => {
  let newFlattenedProps = { ...newProps };

  for (const arrayChildName of Object.keys(arrayTypeChildren)) {
    newFlattenedProps = {
      ...newFlattenedProps,
      [arrayChildName]: arrayTypeChildren[arrayChildName],
    };
  }

  return newFlattenedProps;
};

const warnOnInvalidChildren = (
  child: React.ReactElement,
  nestedChildren: React.ReactNode,
): true => {
  invariant(
    VALID_TAG_NAMES.includes(child.type.toString()),
    typeof child.type === 'function'
      ? `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.`
      : `Only elements types ${VALID_TAG_NAMES.join(
          ', ',
        )} are allowed. Helmet does not support rendering <${
          child.type
        }> elements. Refer to our API for more information.`,
  );

  invariant(
    nestedChildren == null ||
      typeof nestedChildren === 'string' ||
      (Array.isArray(nestedChildren) &&
        !nestedChildren.some((nestedChild) => typeof nestedChild !== 'string')),
    `Helmet expects a string as a child of <${child.type.toString()}>. Did you forget to wrap your children in braces? ( <${child.type.toString()}>{\`\`}</${child.type.toString()}> ) Refer to our API for more information.`,
  );

  return true;
};

const mapChildrenToProps = (
  children: React.ReactNode,
  newProps: HelmetPropsWithoutChildren,
): HelmetPropsWithoutChildren => {
  let arrayTypeChildren: ArrayTypeChildren = {};
  let updatedProps = newProps;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childType = ReactIs.typeOf(child);
      const {
        props: { children: nestedChildren, ...childProps },
      } = child as React.ReactElement<React.PropsWithChildren<unknown>>;
      let { type } = child;

      // Convert React props to HTML attributes
      const newChildProps: Record<string, unknown> = {};
      for (const key of Object.keys(childProps)) {
        newChildProps[(HTML_TAG_MAP[key] as string | undefined) ?? key] = childProps[key];
      }

      if (childType === ReactIs.Fragment) {
        type = childType.toString();
      } else {
        warnOnInvalidChildren(child, nestedChildren);
      }

      switch (type) {
        case TAG_NAMES.FRAGMENT:
          updatedProps = mapChildrenToProps(nestedChildren, updatedProps);
          break;
        case TAG_NAMES.LINK:
        case TAG_NAMES.META:
        case TAG_NAMES.NOSCRIPT:
        case TAG_NAMES.SCRIPT:
        case TAG_NAMES.STYLE:
          arrayTypeChildren = flattenArrayTypeChildren({
            child,
            arrayTypeChildren,
            newChildProps,
            nestedChildren,
          });
          break;
        default:
          updatedProps = mapObjectTypeChildren({
            child,
            newProps: updatedProps,
            newChildProps,
            nestedChildren,
          });
          break;
      }
    }
  });

  return mapArrayTypeChildrenToProps(arrayTypeChildren, updatedProps);
};

export {
  flattenArray,
  includes,
  isArray,
  mapChildrenToProps,
  prioritizer,
  reducePropsToState,
  warn,
};
