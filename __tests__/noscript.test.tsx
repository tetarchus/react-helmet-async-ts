import React from 'react';

import { Helmet } from '../src';

import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

describe('<noscript> tags', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates noscript tags', () => {
        expect.assertions(4);

        render(
          <Helmet
            defer={false}
            noscript={[
              {
                id: 'bar',
                innerHTML: `<link rel="stylesheet" type="text/css" href="foo.css" />`,
              },
            ]}
          />,
        );

        const existingTags = document.head.querySelectorAll('noscript');

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);
        expect(existingTags[0].id).toBe('bar');
        expect(existingTags[0].outerHTML).toMatchSnapshot();
      });

      it('clears all noscripts tags if none are specified', () => {
        expect.assertions(2);

        render(<Helmet defer={false} noscript={[{ id: 'bar' }]} />);

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "innerHTML"', () => {
        expect.assertions(2);

        // Testing invalid properties
        // @ts-expect-error =  'property' does not exist in type...
        render(<Helmet defer={false} noscript={[{ property: "won't work" }]} />);

        const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            noscript={[
              // Testing invalid values
              // @ts-expect-error -  Type 'undefined' is not assignable to type 'string'
              {
                innerHTML: undefined,
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });

    describe('Declarative API', () => {
      it('updates noscript tags', () => {
        expect.assertions(4);

        render(
          <Helmet defer={false}>
            <noscript id='bar'>{`<link rel="stylesheet" type="text/css" href="foo.css" />`}</noscript>
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll('noscript');

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);
        expect(existingTags[0].id).toBe('bar');
        expect(existingTags[0].outerHTML).toMatchSnapshot();
      });

      it('clears all noscripts tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <noscript id='bar' />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "innerHTML"', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <noscript property="won't work" />
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            <noscript>{undefined}</noscript>
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`noscript[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders noscript tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet
            defer={false}
            noscript={[
              {
                id: 'foo',
                innerHTML: '<link rel="stylesheet" type="text/css" href="/style.css" />',
              },
              {
                id: 'bar',
                innerHTML: '<link rel="stylesheet" type="text/css" href="/style2.css" />',
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.noscript).toBeDefined();
        expect(head?.noscript.toComponent).toBeDefined();

        const noscriptComponent = head?.noscript.toComponent() ?? [];

        expect(noscriptComponent).toStrictEqual(isArray);
        expect(noscriptComponent).toHaveLength(2);

        for (const noscript of noscriptComponent) {
          expect(noscript).toStrictEqual(expect.objectContaining({ type: 'noscript' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{noscriptComponent}</>);

        expect(view).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders noscript tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet defer={false}>
            <noscript id='foo'>{`<link rel="stylesheet" type="text/css" href="/style.css" />`}</noscript>
            <noscript id='bar'>{`<link rel="stylesheet" type="text/css" href="/style2.css" />`}</noscript>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.noscript).toBeDefined();
        expect(head?.noscript.toComponent).toBeDefined();

        const noscriptComponent = head?.noscript.toComponent() ?? [];

        expect(noscriptComponent).toStrictEqual(isArray);
        expect(noscriptComponent).toHaveLength(2);

        for (const noscript of noscriptComponent) {
          expect(noscript).toStrictEqual(expect.objectContaining({ type: 'noscript' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{noscriptComponent}</>);

        expect(view).toMatchSnapshot();
      });
    });
  });
});
