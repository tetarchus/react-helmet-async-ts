import { getDocument } from 'ssr-window';

import { HELMET_ATTRIBUTE, TAG_NAMES, TAG_PROPERTIES } from './constants';
import { flattenArray, isArray } from './utils';

import type {
  ArrayType,
  CheckedUpdatedTags,
  HelmetProps,
  HelmetState,
  ObjectValues,
  UpdatedTags,
} from './types';

const doc = getDocument();

const checkRemoval = (
  oldTags: Element[],
  newTags: Element[],
  newElement:
    | HTMLBaseElement
    | HTMLElement
    | HTMLLinkElement
    | HTMLMetaElement
    | HTMLScriptElement
    | HTMLStyleElement,
): CheckedUpdatedTags => {
  let indexToDelete = -1;
  const updatedOldTags = [...oldTags];
  const updatedNewTags = [...newTags];
  const match = updatedOldTags.some((existingTag, index) => {
    indexToDelete = index;
    return newElement.isEqualNode(existingTag);
  });
  if (match && indexToDelete > -1) {
    updatedOldTags.splice(indexToDelete, 1);
  } else {
    updatedNewTags.push(newElement);
  }

  return { updatedOldTags, updatedNewTags };
};

const updateTags = <
  T extends ObjectValues<
    Pick<typeof TAG_NAMES, 'BASE' | 'LINK' | 'META' | 'NOSCRIPT' | 'SCRIPT' | 'STYLE'>
  >,
>(
  type: T,
  tags: HelmetProps[T],
): UpdatedTags => {
  const headElement = doc.head;
  const tagNodes = headElement.querySelectorAll(`${type}[${HELMET_ATTRIBUTE}]`);
  let oldTags = Array.prototype.slice.call(tagNodes) as Element[];
  let newTags = [] as Element[];

  if (tags != null && 'length' in tags && isArray(tags) && tags.length > 0) {
    for (const tag of tags) {
      const currentTag = tag as ArrayType<NonNullable<HelmetProps[T]>>;
      const newElement = document.createElement(type);

      for (const attribute of Object.keys(currentTag)) {
        if (Object.prototype.hasOwnProperty.call(currentTag, attribute)) {
          if (attribute === TAG_PROPERTIES.INNER_HTML) {
            newElement.innerHTML = currentTag.innerHTML ?? '';
          } else if (attribute === TAG_PROPERTIES.CSS_TEXT) {
            if (newElement.styleSheet != null) {
              newElement.styleSheet.cssText = (currentTag.cssText as string | undefined) ?? '';
            } else {
              newElement.append(document.createTextNode(currentTag.cssText));
            }
          } else {
            const value = (currentTag[attribute] as string | undefined) ?? '';
            newElement.setAttribute(attribute, value);
          }
        }
      }

      newElement.setAttribute(HELMET_ATTRIBUTE, 'true');

      // Remove a duplicate tag from domTagstoRemove, so it isn't cleared.
      const { updatedOldTags, updatedNewTags } = checkRemoval(oldTags, newTags, newElement);
      oldTags = [...updatedOldTags];
      newTags = [...updatedNewTags];
    }
  }

  for (const tag of oldTags) tag.remove();
  for (const tag of newTags) headElement.append(tag);

  return {
    oldTags,
    newTags,
  };
};

const updateAttributes = <T extends ObjectValues<typeof TAG_NAMES>>(
  tagName: T,
  attributes: HelmetState['bodyAttributes'] | HelmetState['htmlAttributes'],
): void => {
  const elementTag = document.querySelectorAll(tagName)[0] as Element | undefined;
  const elementAttributes = { ...attributes };

  if (elementTag != null) {
    const helmetAttributeString = elementTag.getAttribute(HELMET_ATTRIBUTE);
    const helmetAttributes = helmetAttributeString != null ? helmetAttributeString.split(',') : [];
    const attributesToRemove = [...helmetAttributes];
    const attributeKeys = Object.keys(elementAttributes);

    for (const attribute of attributeKeys) {
      const value = (elementAttributes[attribute] as string | undefined) ?? '';

      if (elementTag.getAttribute(attribute) !== value) {
        elementTag.setAttribute(attribute, value);
      }

      if (!helmetAttributes.includes(attribute)) {
        helmetAttributes.push(attribute);
      }

      const indexToSave = attributesToRemove.indexOf(attribute);
      if (indexToSave !== -1) {
        attributesToRemove.splice(indexToSave, 1);
      }
    }

    for (let i = attributesToRemove.length - 1; i >= 0; i -= 1) {
      elementTag.removeAttribute(attributesToRemove[i]);
    }

    if (helmetAttributes.length === attributesToRemove.length) {
      elementTag.removeAttribute(HELMET_ATTRIBUTE);
    } else if (elementTag.getAttribute(HELMET_ATTRIBUTE) !== attributeKeys.join(',')) {
      elementTag.setAttribute(HELMET_ATTRIBUTE, attributeKeys.join(','));
    }
  }
};

const updateTitle = (
  title: HelmetState['title'],
  attributes: HelmetState['titleAttributes'],
): void => {
  if (typeof title !== 'undefined' && document.title !== title) {
    document.title = flattenArray(title);
  }

  updateAttributes(TAG_NAMES.TITLE, attributes);
};

const commitTagChanges = (newState: HelmetState, cb?: () => void): void => {
  const {
    baseTag,
    bodyAttributes,
    htmlAttributes,
    linkTags,
    metaTags,
    noscriptTags,
    onChangeClientState,
    scriptTags,
    styleTags,
    title,
    titleAttributes,
  } = newState;
  updateAttributes(TAG_NAMES.BODY, bodyAttributes);
  updateAttributes(TAG_NAMES.HTML, htmlAttributes);

  updateTitle(title, titleAttributes);

  const tagUpdates = {
    baseTag: updateTags(TAG_NAMES.BASE, baseTag),
    linkTags: updateTags(TAG_NAMES.LINK, linkTags),
    metaTags: updateTags(TAG_NAMES.META, metaTags),
    noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, noscriptTags),
    scriptTags: updateTags(TAG_NAMES.SCRIPT, scriptTags),
    styleTags: updateTags(TAG_NAMES.STYLE, styleTags),
  };

  const addedTags = {};
  const removedTags = {};

  for (const tagType of Object.keys(tagUpdates)) {
    const { newTags, oldTags } = tagUpdates[tagType] as UpdatedTags;

    if (newTags.length > 0) {
      addedTags[tagType] = newTags;
    }
    if (oldTags.length > 0) {
      removedTags[tagType] = oldTags;
    }
  }

  cb?.();

  onChangeClientState?.(newState, addedTags, removedTags);
};

let _helmetCallback: number | null = null;

const handleStateChangeOnClient = (newState: HelmetState): void => {
  if (_helmetCallback != null) {
    cancelAnimationFrame(_helmetCallback);
  }

  if (newState.defer ?? false) {
    _helmetCallback = requestAnimationFrame(() => {
      commitTagChanges(newState, () => {
        _helmetCallback = null;
      });
    });
  } else {
    commitTagChanges(newState);
    _helmetCallback = null;
  }
};

export { handleStateChangeOnClient };
