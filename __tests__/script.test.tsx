import React from 'react';

import { Helmet } from '../src';
import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

describe('<script> tags', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates script tags', () => {
        expect.assertions(2);

        const scriptInnerHTML = `
                {
                  "@context": "http://schema.org",
                  "@type": "NewsArticle",
                  "url": "http://localhost/helmet"
                }
              `;
        render(
          <Helmet
            defer={false}
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
              {
                src: 'http://localhost/test2.js',
                type: 'text/javascript',
              },
              {
                type: 'application/ld+json',
                innerHTML: scriptInnerHTML,
              },
            ]}
          />,
        );

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll('script'),
        ) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter(
          (tag) =>
            (tag.getAttribute('src') === 'http://localhost/test.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('src') === 'http://localhost/test2.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('type') === 'application/ld+json' &&
              tag.innerHTML === scriptInnerHTML),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(3);
      });

      it('clears all scripts tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
            ]}
          />,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "src"', () => {
        expect.assertions(2);

        // Testing invalid properties
        // @ts-expect-error =  'property' does not exist in type...
        render(<Helmet defer={false} script={[{ property: "won't work" }]} />);

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets script tags based on deepest nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet
              defer={false}
              script={[
                {
                  src: 'http://localhost/test.js',
                  type: 'text/javascript',
                },
              ]}
            />
            <Helmet
              defer={false}
              script={[
                {
                  src: 'http://localhost/test2.js',
                  type: 'text/javascript',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('src')).toBe('http://localhost/test.js');
        expect(firstTag.getAttribute('type')).toBe('text/javascript');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('src')).toBe('http://localhost/test2.js');
        expect(secondTag.getAttribute('type')).toBe('text/javascript');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('sets undefined attribute values to empty strings', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            script={[
              // Testing invalid values
              // @ts-expect-error - Type 'undefined' is not assignable to type 'boolean'
              {
                src: 'foo.js',
                async: undefined,
              },
            ]}
          />,
        );

        const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTag).toBeDefined();
        expect(existingTag?.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute (src) is null', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            script={[
              // Testing invalid values
              // @ts-expect-error - Type 'undefined' is not assignable to type 'string'
              {
                src: undefined,
                type: 'text/javascript',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute (innerHTML) is null', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            script={[
              // Testing invalid values
              // @ts-expect-error - Type 'undefined' is not assignable to type 'string'
              {
                innerHTML: undefined,
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });

    describe('Declarative API', () => {
      it('updates script tags', () => {
        expect.assertions(2);

        const scriptInnerHTML = `
          {
            "@context": "http://schema.org",
            "@type": "NewsArticle",
            "url": "http://localhost/helmet"
          }
        `;
        render(
          <Helmet defer={false}>
            <script src='http://localhost/test.js' type='text/javascript' />
            <script src='http://localhost/test2.js' type='text/javascript' />
            <script type='application/ld+json'>{scriptInnerHTML}</script>
          </Helmet>,
        );

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll('script'),
        ) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter(
          (tag) =>
            (tag.getAttribute('src') === 'http://localhost/test.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('src') === 'http://localhost/test2.js' &&
              tag.getAttribute('type') === 'text/javascript') ||
            (tag.getAttribute('type') === 'application/ld+json' &&
              tag.innerHTML === scriptInnerHTML),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(3);
      });

      it('clears all scripts tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <script src='http://localhost/test.js' type='text/javascript' />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "src"', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <script property="won't work" />
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets script tags based on deepest nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet defer={false}>
              <script src='http://localhost/test.js' type='text/javascript' />
              <script src='http://localhost/test2.js' type='text/javascript' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('src')).toBe('http://localhost/test.js');
        expect(firstTag.getAttribute('type')).toBe('text/javascript');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('src')).toBe('http://localhost/test2.js');
        expect(secondTag.getAttribute('type')).toBe('text/javascript');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('sets undefined attribute values to empty strings', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <script src='foo.js' async={undefined} />
          </Helmet>,
        );

        const existingTag = document.head.querySelector(`script[${HELMET_ATTRIBUTE}]`);

        expect(existingTag).toBeDefined();
        expect(existingTag?.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute (src) is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            <script src={undefined} type='text/javascript' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });

      it('does not render tag when primary attribute (innerHTML) is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            {/* Testing invalid values
          @ts-expect-error - Type 'undefined' is not assignable to type 'boolean' */}
            <script innerHTML={undefined} />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`script[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders script tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet
            defer={false}
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
              {
                src: 'http://localhost/test2.js',
                type: 'text/javascript',
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.script).toBeDefined();
        expect(head?.script.toComponent).toBeDefined();

        const scriptComponent = head?.script.toComponent() ?? [];

        expect(scriptComponent).toStrictEqual(isArray);
        expect(scriptComponent).toHaveLength(2);

        for (const script of scriptComponent) {
          expect(script).toStrictEqual(expect.objectContaining({ type: 'script' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{scriptComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders script tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            script={[
              {
                src: 'http://localhost/test.js',
                type: 'text/javascript',
              },
              {
                src: 'http://localhost/test2.js',
                type: 'text/javascript',
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.script).toBeDefined();
        expect(head?.script.toString).toBeDefined();
        expect(head?.script.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders script tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet defer={false}>
            <script src='http://localhost/test.js' type='text/javascript' />
            <script src='http://localhost/test2.js' type='text/javascript' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.script).toBeDefined();
        expect(head?.script.toComponent).toBeDefined();

        const scriptComponent = head?.script.toComponent() ?? [];

        expect(scriptComponent).toStrictEqual(isArray);
        expect(scriptComponent).toHaveLength(2);

        for (const script of scriptComponent) {
          expect(script).toStrictEqual(expect.objectContaining({ type: 'script' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{scriptComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders script tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <script src='http://localhost/test.js' type='text/javascript' />
            <script src='http://localhost/test2.js' type='text/javascript' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.script).toBeDefined();
        expect(head?.script.toString).toBeDefined();
        expect(head?.script.toString()).toMatchSnapshot();
      });
    });
  });
});
