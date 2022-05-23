const TAG_PROPERTIES = {
  CHARSET: 'charset',
  CSS_TEXT: 'cssText',
  HREF: 'href',
  HTTPEQUIV: 'http-equiv',
  INNER_HTML: 'innerHTML',
  ITEM_PROP: 'itemprop',
  NAME: 'name',
  PROPERTY: 'property',
  REL: 'rel',
  SRC: 'src',
};

const ATTRIBUTE_NAMES = {
  BODY: 'bodyAttributes',
  HTML: 'htmlAttributes',
  TITLE: 'titleAttributes',
};

const TAG_NAMES = {
  BASE: 'base',
  BODY: 'body',
  HEAD: 'head',
  HTML: 'html',
  LINK: 'link',
  META: 'meta',
  NOSCRIPT: 'noscript',
  SCRIPT: 'script',
  STYLE: 'style',
  TITLE: 'title',
  FRAGMENT: 'Symbol(react.fragment)',
};

const SEO_PRIORITY_TAGS = {
  link: { rel: ['amphtml', 'canonical', 'alternate'] },
  script: { type: ['application/ld+json'] },
  meta: {
    charset: '',
    name: ['robots', 'description'],
    property: [
      'og:type',
      'og:title',
      'og:url',
      'og:image',
      'og:image:alt',
      'og:description',
      'twitter:url',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt',
      'twitter:card',
      'twitter:site',
    ],
  },
};

const VALID_TAG_NAMES = Object.keys(TAG_NAMES).map((tagName) => TAG_NAMES[tagName] as string);

const REACT_TAG_MAP = {
  accesskey: 'accessKey',
  charset: 'charSet',
  class: 'className',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  'http-equiv': 'httpEquiv',
  itemprop: 'itemProp',
  tabindex: 'tabIndex',
};

const HTML_TAG_MAP = Object.fromEntries(
  Object.keys(REACT_TAG_MAP).map((key) => [REACT_TAG_MAP[key as keyof typeof REACT_TAG_MAP], key]),
);

const HELMET_ATTRIBUTE = 'data-rh';

const HELMET_PROPS = {
  DEFAULT_TITLE: 'defaultTitle',
  DEFER: 'defer',
  ENCODE_SPECIAL_CHARACTERS: 'encodeSpecialCharacters',
  ON_CHANGE_CLIENT_STATE: 'onChangeClientState',
  TITLE_TEMPLATE: 'titleTemplate',
  PRIORITIZE_SEO_TAGS: 'prioritizeSeoTags',
};

export {
  ATTRIBUTE_NAMES,
  HELMET_ATTRIBUTE,
  HELMET_PROPS,
  HTML_TAG_MAP,
  REACT_TAG_MAP,
  SEO_PRIORITY_TAGS,
  TAG_NAMES,
  TAG_PROPERTIES,
  VALID_TAG_NAMES,
};
