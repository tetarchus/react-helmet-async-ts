import React from 'react';

import { Dispatcher } from './Dispatcher';
import { HelmetContext } from './HelmetContext';
import { HelmetData } from './HelmetData';
import { mapChildrenToProps } from './utils';

import type { HelmetProps, HelmetPropsWithoutChildren } from './types';

const Helmet: React.FC<HelmetProps> = ({
  base,
  bodyAttributes,
  children,
  defaultTitle,
  defer = true,
  encodeSpecialCharacters = true,
  helmetData,
  htmlAttributes,
  link,
  meta,
  noscript,
  onChangeClientState,
  prioritizeSeoTags = false,
  script,
  style,
  title,
  titleAttributes,
  titleTemplate,
}: HelmetProps) => {
  let newProps: HelmetPropsWithoutChildren = {
    base,
    bodyAttributes,
    defaultTitle,
    defer,
    encodeSpecialCharacters,
    helmetData,
    htmlAttributes,
    link,
    meta,
    noscript,
    onChangeClientState,
    prioritizeSeoTags,
    script,
    style,
    title,
    titleAttributes,
    titleTemplate,
  };
  let data = helmetData;

  if (children != null) {
    newProps = mapChildrenToProps(children, newProps);
  }

  if (data != null && !(data instanceof HelmetData)) {
    data = new HelmetData(data.context);
  }

  return data instanceof HelmetData ? (
    <Dispatcher {...newProps} context={data.value} helmetData={undefined} />
  ) : (
    <HelmetContext.Consumer>
      {(value): JSX.Element => <Dispatcher {...newProps} context={value.context} />}
    </HelmetContext.Consumer>
  );
};

export { Helmet };
