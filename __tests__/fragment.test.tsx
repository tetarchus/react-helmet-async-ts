import React from 'react';

import { Helmet } from '../src';

import { render } from './setup/testSetup';

describe('React.Fragments', () => {
  it('parses Fragments', () => {
    expect.assertions(1);
    render(
      <Helmet defer={false}>
        <>
          <title>Hello</title>
          <meta charSet='utf-8' />
        </>
      </Helmet>,
    );

    expect(document.title).toMatchSnapshot();
  });

  it('parses nested Fragments', () => {
    expect.assertions(1);

    render(
      <Helmet defer={false}>
        <>
          <title>Foo</title>
          <>
            <title>Bar</title>
            <title>Baz</title>
          </>
        </>
      </Helmet>,
    );

    expect(document.title).toMatchSnapshot();
  });
});
