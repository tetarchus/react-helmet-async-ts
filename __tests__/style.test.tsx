import React from 'react';

import { Helmet } from '../src';

import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

describe('<style> tags', () => {
  beforeEach(before);
  afterEach(after);

  describe('Client', () => {
    describe('API', () => {
      it('updates style tags', () => {
        expect.assertions(10);

        const cssText1 = `
                  body {
                      background-color: green;
                  }
              `;
        const cssText2 = `
                  p {
                      font-size: 12px;
                  }
              `;
        render(
          <Helmet
            defer={false}
            style={[
              {
                type: 'text/css',
                cssText: cssText1,
              },
              {
                cssText: cssText2,
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];

        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.innerHTML).toStrictEqual(cssText1);
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.innerHTML).toStrictEqual(cssText2);
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('clears all style tags if none are specified', () => {
        expect.assertions(2);

        const cssText = `
                  body {
                      background-color: green;
                  }
              `;
        render(
          <Helmet
            defer={false}
            style={[
              {
                type: 'text/css',
                cssText,
              },
            ]}
          />,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "cssText"', () => {
        expect.assertions(2);

        // Testing invalid properties
        // @ts-expect-error =  'property' does not exist in type...
        render(<Helmet defer={false} style={[{ property: "won't work" }]} />);

        const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            style={[
              // Testing invalid values
              // @ts-expect-error - Type 'undefined' is not assignable to type 'string'
              {
                cssText: undefined,
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });

    describe('Declarative API', () => {
      it('updates style tags', () => {
        expect.assertions(10);

        const cssText1 = `
            body {
                background-color: green;
            }
        `;
        const cssText2 = `
            p {
                font-size: 12px;
            }
        `;

        render(
          <Helmet defer={false}>
            <style type='text/css'>{cssText1}</style>
            <style>{cssText2}</style>
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];

        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.innerHTML).toStrictEqual(cssText1);
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.innerHTML).toStrictEqual(cssText2);
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('clears all style tags if none are specified', () => {
        expect.assertions(2);
        const cssText = `
            body {
                background-color: green;
            }
        `;
        render(
          <Helmet defer={false}>
            <style type='text/css'>{cssText}</style>
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "cssText"', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <style property="won't work" />
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            <style>{undefined}</style>
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`style[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders style tags as React components', () => {
        expect.assertions(5);

        const { context } = render(
          <Helmet
            defer={false}
            style={[
              {
                type: 'text/css',
                cssText: `body {background-color: green;}`,
              },
              {
                type: 'text/css',
                cssText: `p {font-size: 12px;}`,
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.style).toBeDefined();
        expect(head?.style.toComponent).toBeDefined();

        const styleComponent = head?.style.toComponent() ?? [];

        expect(styleComponent).toStrictEqual(isArray);
        expect(styleComponent).toHaveLength(2);

        const view = ReactServer.renderToStaticMarkup(<>{styleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders style tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            style={[
              {
                type: 'text/css',
                cssText: `body {background-color: green;}`,
              },
              {
                type: 'text/css',
                cssText: `p {font-size: 12px;}`,
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.style).toBeDefined();
        expect(head?.style.toString).toBeDefined();
        expect(head?.style.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders style tags as React components', () => {
        expect.assertions(5);

        const { context } = render(
          <Helmet defer={false}>
            <style type='text/css'>{`body {background-color: green;}`}</style>
            <style type='text/css'>{`p {font-size: 12px;}`}</style>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.style).toBeDefined();
        expect(head?.style.toComponent).toBeDefined();

        const styleComponent = head?.style.toComponent();

        expect(styleComponent).toStrictEqual(isArray);
        expect(styleComponent).toHaveLength(2);

        const view = ReactServer.renderToStaticMarkup(<>{styleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders style tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <style type='text/css'>{`body {background-color: green;}`}</style>
            <style type='text/css'>{`p {font-size: 12px;}`}</style>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.style).toBeDefined();
        expect(head?.style.toString).toBeDefined();
        expect(head?.style.toString()).toMatchSnapshot();
      });
    });
  });
});
