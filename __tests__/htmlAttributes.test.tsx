/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react';

import { Helmet } from '../src';

import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, render } from './setup/testSetup';

describe('<html> attributes', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates html attributes', () => {
        expect.assertions(3);

        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              class: 'myClassName',
              lang: 'en',
            }}
          />,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('class')).toBe('myClassName');
        expect(htmlTag.getAttribute('lang')).toBe('en');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,lang');
      });

      it('sets attributes based on the deepest nested component', () => {
        expect.assertions(2);

        render(
          <div>
            <Helmet
              defer={false}
              htmlAttributes={{
                lang: 'en',
              }}
            />
            <Helmet
              defer={false}
              htmlAttributes={{
                lang: 'ja',
              }}
            />
          </div>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('lang')).toBe('ja');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
      });

      it('handles valueless attributes', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              amp: undefined,
            }}
          />,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBe('');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('amp');
      });

      it('clears html attributes that are handled within helmet', () => {
        expect.assertions(3);

        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'en',
              amp: undefined,
            }}
          />,
        );

        render(<Helmet defer={false} />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('lang')).toBeNull();
        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });

      it('updates with multiple additions and removals - overwrite and new', () => {
        expect.assertions(5);
        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'en',
              amp: undefined,
            }}
          />,
        );

        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'ja',
              id: 'html-tag',
              title: 'html tag',
            }}
          />,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute('lang')).toBe('ja');
        expect(htmlTag.getAttribute('id')).toBe('html-tag');
        expect(htmlTag.getAttribute('title')).toBe('html tag');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
      });

      it('updates with multiple additions and removals - all new', () => {
        expect.assertions(5);
        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'en',
              amp: undefined,
            }}
          />,
        );

        render(
          <Helmet
            defer={false}
            htmlAttributes={{
              id: 'html-tag',
              title: 'html tag',
            }}
          />,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute('lang')).toBeNull();
        expect(htmlTag.getAttribute('id')).toBe('html-tag');
        expect(htmlTag.getAttribute('title')).toBe('html tag');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
      });

      describe('When initialized outside of helmet', () => {
        beforeEach(() => {
          const htmlTag = document.documentElement;
          htmlTag.setAttribute('test', 'test');
        });

        it('does not clear attributes', () => {
          expect.assertions(2);

          render(<Helmet defer={false} />);

          const htmlTag = document.documentElement;

          expect(htmlTag.getAttribute('test')).toBe('test');
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });

        it('overwrites attributes if specified in helmet', () => {
          expect.assertions(2);

          render(
            <Helmet
              defer={false}
              htmlAttributes={{
                'data-test': 'helmet-attr',
              }}
            />,
          );

          const htmlTag = document.documentElement;

          expect(htmlTag.dataset['test']).toBe('helmet-attr');
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('data-test');
        });

        it('clears attributes once managed in helmet', () => {
          expect.assertions(2);

          render(
            <Helmet
              defer={false}
              htmlAttributes={{
                'data-test': 'helmet-attr',
              }}
            />,
          );

          render(<Helmet defer={false} />);

          const htmlTag = document.documentElement;

          expect(htmlTag.dataset['test']).toBeUndefined();
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });
      });
    });

    describe('Declarative API', () => {
      it('updates html attributes', () => {
        expect.assertions(3);

        render(
          <Helmet defer={false}>
            <html className='myClassName' lang='en' />
          </Helmet>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('class')).toBe('myClassName');
        expect(htmlTag.getAttribute('lang')).toBe('en');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,lang');
      });

      it('sets attributes based on the deepest nested component', () => {
        expect.assertions(2);

        render(
          <div>
            <Helmet defer={false}>
              <html lang='en' />
            </Helmet>
            <Helmet defer={false}>
              <html lang='ja' />
            </Helmet>
          </div>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('lang')).toBe('ja');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
      });

      it('handles valueless attributes', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - Property 'amp' does not exist on type 'DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>'. */}
            <html amp />
          </Helmet>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBe('true');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('amp');
      });

      it('clears html attributes that are handled within helmet', () => {
        expect.assertions(3);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - Property 'amp' does not exist on type 'DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>'. */}
            <html lang='en' amp />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('lang')).toBeNull();
        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });

      it('updates with multiple additions and removals - overwrite and new', () => {
        expect.assertions(5);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - Property 'amp' does not exist on type 'DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>'. */}
            <html lang='en' amp />
          </Helmet>,
        );

        render(
          <Helmet defer={false}>
            <html lang='ja' id='html-tag' title='html tag' />
          </Helmet>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute('lang')).toBe('ja');
        expect(htmlTag.getAttribute('id')).toBe('html-tag');
        expect(htmlTag.getAttribute('title')).toBe('html tag');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
      });

      it('updates with multiple additions and removals - all new', () => {
        expect.assertions(5);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - Property 'amp' does not exist on type 'DetailedHTMLProps<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>'. */}
            <html lang='en' amp />
          </Helmet>,
        );

        render(
          <Helmet defer={false}>
            <html id='html-tag' title='html tag' />
          </Helmet>,
        );

        const htmlTag = document.documentElement;

        expect(htmlTag.getAttribute('amp')).toBeNull();
        expect(htmlTag.getAttribute('lang')).toBeNull();
        expect(htmlTag.getAttribute('id')).toBe('html-tag');
        expect(htmlTag.getAttribute('title')).toBe('html tag');
        expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
      });

      describe('When initialized outside of helmet', () => {
        beforeEach(() => {
          const htmlTag = document.documentElement;
          htmlTag.setAttribute('test', 'test');
        });

        it('does not clear attributes', () => {
          expect.assertions(2);

          render(<Helmet defer={false} />);

          const htmlTag = document.documentElement;

          expect(htmlTag.getAttribute('test')).toBe('test');
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });

        it('overwrites attributes if specified in helmet', () => {
          expect.assertions(2);

          render(
            <Helmet defer={false}>
              <html data-test='helmet-attr' />
            </Helmet>,
          );

          const htmlTag = document.documentElement;

          expect(htmlTag.dataset['test']).toBe('helmet-attr');
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBe('data-test');
        });

        it('clears attributes once managed in helmet', () => {
          expect.assertions(2);

          render(
            <Helmet defer={false}>
              <html data-test='helmet-attr' />
            </Helmet>,
          );

          render(<Helmet defer={false} />);

          const htmlTag = document.documentElement;

          expect(htmlTag.dataset['test']).toBeUndefined();
          expect(htmlTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
        });
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders html attributes as React component', () => {
        expect.assertions(2);

        const { context } = render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'ga',
              className: 'myClassName',
            }}
          />,
          true,
        );

        const helmet = 'helmet' in context ? context.helmet : null;
        const { htmlAttributes } = helmet ?? {};

        const attrs = htmlAttributes?.toComponent();

        expect(attrs).toBeDefined();

        const view = ReactServer.renderToStaticMarkup(<html lang='en' {...attrs} />);

        expect(view).toMatchSnapshot();
      });

      it('renders html attributes as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            htmlAttributes={{
              lang: 'ga',
              class: 'myClassName',
            }}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.htmlAttributes).toBeDefined();
        expect(head?.htmlAttributes.toString).toBeDefined();
        expect(head?.htmlAttributes.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders html attributes as React component', () => {
        expect.assertions(2);

        const { context } = render(
          <Helmet defer={false}>
            <html lang='ga' className='myClassName' />
          </Helmet>,
          true,
        );

        const helmet = 'helmet' in context ? context.helmet : null;
        const { htmlAttributes } = helmet ?? {};
        const attrs = htmlAttributes?.toComponent();

        expect(attrs).toBeDefined();

        const view = ReactServer.renderToStaticMarkup(<html lang='en' {...attrs} />);

        expect(view).toMatchSnapshot();
      });

      it('renders html attributes as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <html lang='ga' className='myClassName' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.htmlAttributes).toBeDefined();
        expect(head?.htmlAttributes.toString).toBeDefined();
        expect(head?.htmlAttributes.toString()).toMatchSnapshot();
      });
    });
  });
});
