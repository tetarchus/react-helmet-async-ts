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

import type {
  ArrayTypeChildren,
  ArrayTypeChildrenArgs,
  HelmetPropsWithoutChildren,
  ObjectTypeChildrenArgs,
} from './types';

const getInnermostProperty = (propsList, property) => {
  for (let i = propsList.length - 1; i >= 0; i -= 1) {
    const props = propsList[i];

    if (Object.prototype.hasOwnProperty.call(props, property)) {
      return props[property];
    }
  }

  return null;
};

const getTitleFromPropsList = (propsList) => {
  let innermostTitle = getInnermostProperty(propsList, TAG_NAMES.TITLE);
  const innermostTemplate = getInnermostProperty(propsList, HELMET_PROPS.TITLE_TEMPLATE);
  if (Array.isArray(innermostTitle)) {
    innermostTitle = innermostTitle.join('');
  }
  if (innermostTemplate && innermostTitle) {
    // use function arg to avoid need to escape $ characters
    return innermostTemplate.replace(/%s/g, () => innermostTitle);
  }

  const innermostDefaultTitle = getInnermostProperty(propsList, HELMET_PROPS.DEFAULT_TITLE);

  return innermostTitle || innermostDefaultTitle || undefined;
};

const getOnChangeClientState = (propsList) =>
  getInnermostProperty(propsList, HELMET_PROPS.ON_CHANGE_CLIENT_STATE) || (() => {});

const getAttributesFromPropsList = (tagType, propsList) =>
  propsList
    .filter((props) => typeof props[tagType] !== 'undefined')
    .map((props) => props[tagType])
    .reduce((tagAttrs, current) => ({ ...tagAttrs, ...current }), {});

const getBaseTagFromPropsList = (primaryAttributes, propsList) =>
  propsList
    .filter((props) => typeof props[TAG_NAMES.BASE] !== 'undefined')
    .map((props) => props[TAG_NAMES.BASE])
    .reverse()
    .reduce((innermostBaseTag, tag) => {
      if (!innermostBaseTag.length) {
        const keys = Object.keys(tag);

        for (let i = 0; i < keys.length; i += 1) {
          const attributeKey = keys[i];
          const lowerCaseAttributeKey = attributeKey.toLowerCase();

          if (
            primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 &&
            tag[lowerCaseAttributeKey]
          ) {
            return innermostBaseTag.concat(tag);
          }
        }
      }

      return innermostBaseTag;
    }, []);

// eslint-disable-next-line no-console
const warn = (msg) => console && typeof console.warn === 'function' && console.warn(msg);

const getTagsFromPropsList = (tagName, primaryAttributes, propsList) => {
  // Calculate list of tags, giving priority innermost component (end of the propslist)
  const approvedSeenTags = {};

  return propsList
    .filter((props) => {
      if (Array.isArray(props[tagName])) {
        return true;
      }
      if (typeof props[tagName] !== 'undefined') {
        warn(
          `Helmet: ${tagName} should be of type "Array". Instead found type "${typeof props[
            tagName
          ]}"`,
        );
      }
      return false;
    })
    .map((props) => props[tagName])
    .reverse()
    .reduce((approvedTags, instanceTags) => {
      const instanceSeenTags = {};

      instanceTags
        .filter((tag) => {
          let primaryAttributeKey;
          const keys = Object.keys(tag);
          for (let i = 0; i < keys.length; i += 1) {
            const attributeKey = keys[i];
            const lowerCaseAttributeKey = attributeKey.toLowerCase();

            // Special rule with link tags, since rel and href are both primary tags, rel takes priority
            if (
              primaryAttributes.indexOf(lowerCaseAttributeKey) !== -1 &&
              !(
                primaryAttributeKey === TAG_PROPERTIES.REL &&
                tag[primaryAttributeKey].toLowerCase() === 'canonical'
              ) &&
              !(
                lowerCaseAttributeKey === TAG_PROPERTIES.REL &&
                tag[lowerCaseAttributeKey].toLowerCase() === 'stylesheet'
              )
            ) {
              primaryAttributeKey = lowerCaseAttributeKey;
            }
            // Special case for innerHTML which doesn't work lowercased
            if (
              primaryAttributes.indexOf(attributeKey) !== -1 &&
              (attributeKey === TAG_PROPERTIES.INNER_HTML ||
                attributeKey === TAG_PROPERTIES.CSS_TEXT ||
                attributeKey === TAG_PROPERTIES.ITEM_PROP)
            ) {
              primaryAttributeKey = attributeKey;
            }
          }

          if (!primaryAttributeKey || !tag[primaryAttributeKey]) {
            return false;
          }

          const value = tag[primaryAttributeKey].toLowerCase();

          if (!approvedSeenTags[primaryAttributeKey]) {
            approvedSeenTags[primaryAttributeKey] = {};
          }

          if (!instanceSeenTags[primaryAttributeKey]) {
            instanceSeenTags[primaryAttributeKey] = {};
          }

          if (!approvedSeenTags[primaryAttributeKey][value]) {
            instanceSeenTags[primaryAttributeKey][value] = true;
            return true;
          }

          return false;
        })
        .reverse()
        .forEach((tag) => approvedTags.push(tag));

      // Update seen tags with tags from this instance
      const keys = Object.keys(instanceSeenTags);
      for (let i = 0; i < keys.length; i += 1) {
        const attributeKey = keys[i];
        const tagUnion = {
          ...approvedSeenTags[attributeKey],
          ...instanceSeenTags[attributeKey],
        };

        approvedSeenTags[attributeKey] = tagUnion;
      }

      return approvedTags;
    }, [])
    .reverse();
};

const getAnyTrueFromPropsList = (propsList, checkedTag) => {
  if (Array.isArray(propsList) && propsList.length) {
    for (let index = 0; index < propsList.length; index += 1) {
      const prop = propsList[index];
      if (prop[checkedTag]) {
        return true;
      }
    }
  }
  return false;
};

const reducePropsToState = (propsList) => ({
  baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], propsList),
  bodyAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.BODY, propsList),
  defer: getInnermostProperty(propsList, HELMET_PROPS.DEFER),
  encode: getInnermostProperty(propsList, HELMET_PROPS.ENCODE_SPECIAL_CHARACTERS),
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
  scriptTags: getTagsFromPropsList(
    TAG_NAMES.SCRIPT,
    [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
    propsList,
  ),
  styleTags: getTagsFromPropsList(TAG_NAMES.STYLE, [TAG_PROPERTIES.CSS_TEXT], propsList),
  title: getTitleFromPropsList(propsList),
  titleAttributes: getAttributesFromPropsList(ATTRIBUTE_NAMES.TITLE, propsList),
  prioritizeSeoTags: getAnyTrueFromPropsList(propsList, HELMET_PROPS.PRIORITIZE_SEO_TAGS),
});

const flattenArray = (possibleArray) =>
  Array.isArray(possibleArray) ? possibleArray.join('') : possibleArray;

const checkIfPropsMatch = (props, toMatch) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i += 1) {
    // e.g. if rel exists in the list of allowed props [amphtml, alternate, etc]
    if (toMatch[keys[i]] && toMatch[keys[i]].includes(props[keys[i]])) {
      return true;
    }
  }
  return false;
};

const prioritizer = (elementsList, propsToMatch) => {
  if (Array.isArray(elementsList)) {
    return elementsList.reduce(
      (acc, elementAttrs) => {
        if (checkIfPropsMatch(elementAttrs, propsToMatch)) {
          acc.priority.push(elementAttrs);
        } else {
          acc.default.push(elementAttrs);
        }
        return acc;
      },
      { priority: [], default: [] },
    );
  }
  return { default: elementsList };
};

// FIXME: Not needed?
const without = (obj, key) => {
  return {
    ...obj,
    [key]: undefined,
  };
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
        innerHTML: nestedChildren,
      };

    case TAG_NAMES.STYLE:
      return {
        cssText: nestedChildren,
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
    ...(arrayTypeChildren[child.type.toString()] ?? []),
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
        [child.type]: nestedChildren,
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

  return mapArrayTypeChildrenToProps(arrayTypeChildren, newProps);
};

export { flattenArray, mapChildrenToProps, prioritizer, reducePropsToState, without };
