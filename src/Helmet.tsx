import React from 'react';

import { Dispatcher } from './Dispatcher';
import { HelmetData } from './HelmetData';
import { Context } from './Provider';
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
    data = new HelmetData(data.context, data.instances);
  }

  return helmetData ? (
    <Dispatcher {...newProps} context={helmetData.value} helmetData={undefined} />
  ) : (
    <Context.Consumer>
      {(context): JSX.Element => <Dispatcher {...newProps} context={context} />}
    </Context.Consumer>
  );
};

export { Helmet };
