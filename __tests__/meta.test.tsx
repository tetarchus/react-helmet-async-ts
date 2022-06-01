import React from 'react';

import { Helmet } from '..';
import { HELMET_ATTRIBUTE } from '../components/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

describe('<meta> tags', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates meta tags', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            meta={[
              { charset: 'utf-8' },
              {
                name: 'description',
                content: 'Test description',
              },
              {
                'http-equiv': 'content-type',
                content: 'text/html',
              },
              { property: 'og:type', content: 'article' },
              { itemprop: 'name', content: 'Test name itemprop' },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter(
          (tag) =>
            tag.getAttribute('charset') === 'utf-8' ||
            (tag.getAttribute('name') === 'description' &&
              tag.getAttribute('content') === 'Test description') ||
            (tag.getAttribute('http-equiv') === 'content-type' &&
              tag.getAttribute('content') === 'text/html') ||
            (tag.getAttribute('itemprop') === 'name' &&
              tag.getAttribute('content') === 'Test name itemprop'),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(4);
      });

      it('clears all meta tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false} meta={[{ name: 'description', content: 'Test description' }]} />,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "name", "http-equiv", "property", "charset", or "itemprop"', () => {
        expect.assertions(2);
        // Testing invalid properties
        // @ts-expect-error - 'href' does not exist in type...
        render(<Helmet defer={false} meta={[{ href: "won't work" }]} />);

        const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets meta tags based on deepest nested component', () => {
        expect.assertions(16);

        render(
          <div>
            <Helmet
              defer={false}
              meta={[
                { charset: 'utf-8' },
                {
                  name: 'description',
                  content: 'Test description',
                },
              ]}
            />
            <Helmet
              defer={false}
              meta={[
                {
                  name: 'description',
                  content: 'Inner description',
                },
                { name: 'keywords', content: 'test,meta,tags' },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag, thirdTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(3);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('charset')).toBe('utf-8');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Inner description');
        expect(secondTag.outerHTML).toMatchSnapshot();

        expect(thirdTag).toBeInstanceOf(Element);
        expect(thirdTag.getAttribute).toBeDefined();
        expect(thirdTag.getAttribute('name')).toBe('keywords');
        expect(thirdTag.getAttribute('content')).toBe('test,meta,tags');
        expect(thirdTag.outerHTML).toMatchSnapshot();
      });

      it('allows duplicate meta tags if specified in the same component', () => {
        expect.assertions(12);

        render(
          <Helmet
            defer={false}
            meta={[
              {
                name: 'description',
                content: 'Test description',
              },
              {
                name: 'description',
                content: 'Duplicate description',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Test description');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Duplicate description');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('overrides duplicate meta tags with single meta tag in a nested component', () => {
        expect.assertions(7);

        render(
          <div>
            <Helmet
              defer={false}
              meta={[
                {
                  name: 'description',
                  content: 'Test description',
                },
                {
                  name: 'description',
                  content: 'Duplicate description',
                },
              ]}
            />
            <Helmet
              defer={false}
              meta={[
                {
                  name: 'description',
                  content: 'Inner description',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Inner description');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('overrides single meta tag with duplicate meta tags in a nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet
              defer={false}
              meta={[
                {
                  name: 'description',
                  content: 'Test description',
                },
              ]}
            />
            <Helmet
              defer={false}
              meta={[
                {
                  name: 'description',
                  content: 'Inner description',
                },
                {
                  name: 'description',
                  content: 'Inner duplicate description',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Inner description');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Inner duplicate description');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            meta={[
              // Testing invalid values
              // @ts-expect-error - Type 'undefined' is not assignable to type 'string'
              {
                name: undefined,
                content: 'Inner duplicate description',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });

      it('fails gracefully when meta is wrong shape', () => {
        expect.assertions(3);

        const originalConsole = global.console;
        jest.spyOn(global.console, 'warn').mockImplementation();
        jest.spyOn(global.console, 'error').mockImplementation();
        // Testing invalid type
        // @ts-expect-error - 'name' does not exist in type
        render(<Helmet defer={false} meta={{ name: 'title', content: 'some title' }} />);

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);

        expect(global.console.warn).toHaveBeenCalledWith(
          'Helmet: meta should be of type "Array". Instead found type "object"',
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect((global.console.warn as jest.Mock).mock.calls[0][0]).toMatchSnapshot();

        global.console = originalConsole;
      });
    });

    describe('Declarative API', () => {
      it('updates meta tags', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <meta charSet='utf-8' />
            <meta name='description' content='Test description' />
            <meta httpEquiv='content-type' content='text/html' />
            <meta property='og:type' content='article' />
            <meta itemProp='name' content='Test name itemprop' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter(
          (tag) =>
            tag.getAttribute('charset') === 'utf-8' ||
            (tag.getAttribute('name') === 'description' &&
              tag.getAttribute('content') === 'Test description') ||
            (tag.getAttribute('http-equiv') === 'content-type' &&
              tag.getAttribute('content') === 'text/html') ||
            (tag.getAttribute('itemprop') === 'name' &&
              tag.getAttribute('content') === 'Test name itemprop'),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(4);
      });

      it('clears all meta tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <meta name='description' content='Test description' />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "name", "http-equiv", "property", "charset", or "itemprop"', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            {/* Testing invalid properties
          @ts-expect-error - Property 'href' does not exist on type ... */}
            <meta href="won't work" />
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets meta tags based on deepest nested component', () => {
        expect.assertions(16);

        render(
          <div>
            <Helmet defer={false}>
              <meta charSet='utf-8' />
              <meta name='description' content='Test description' />
            </Helmet>
            <Helmet defer={false}>
              <meta name='description' content='Inner description' />
              <meta name='keywords' content='test,meta,tags' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag, thirdTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(3);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('charset')).toBe('utf-8');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Inner description');
        expect(secondTag.outerHTML).toMatchSnapshot();

        expect(thirdTag).toBeInstanceOf(Element);
        expect(thirdTag.getAttribute).toBeDefined();
        expect(thirdTag.getAttribute('name')).toBe('keywords');
        expect(thirdTag.getAttribute('content')).toBe('test,meta,tags');
        expect(thirdTag.outerHTML).toMatchSnapshot();
      });

      it('allows duplicate meta tags if specified in the same component', () => {
        expect.assertions(12);

        render(
          <Helmet defer={false}>
            <meta name='description' content='Test description' />
            <meta name='description' content='Duplicate description' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Test description');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Duplicate description');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('overrides duplicate meta tags with single meta tag in a nested component', () => {
        expect.assertions(7);

        render(
          <div>
            <Helmet defer={false}>
              <meta name='description' content='Test description' />
              <meta name='description' content='Duplicate description' />
            </Helmet>
            <Helmet defer={false}>
              <meta name='description' content='Inner description' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Inner description');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('overrides single meta tag with duplicate meta tags in a nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet defer={false}>
              <meta name='description' content='Test description' />
            </Helmet>
            <Helmet defer={false}>
              <meta name='description' content='Inner description' />
              <meta name='description' content='Inner duplicate description' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('name')).toBe('description');
        expect(firstTag.getAttribute('content')).toBe('Inner description');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('name')).toBe('description');
        expect(secondTag.getAttribute('content')).toBe('Inner duplicate description');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            <meta name={undefined} content='Inner duplicate description' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders meta tags as React components', () => {
        expect.assertions(10);

        const { context } = render(
          <Helmet
            defer={false}
            meta={[
              { charset: 'utf-8' },
              {
                name: 'description',
                content: 'Test description & encoding of special characters like \' " > < `',
              },
              { 'http-equiv': 'content-type', content: 'text/html' },
              { property: 'og:type', content: 'article' },
              { itemprop: 'name', content: 'Test name itemprop' },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.meta).toBeDefined();
        expect(head?.meta.toComponent).toBeDefined();

        const metaComponent = head?.meta.toComponent() ?? [];

        expect(metaComponent).toStrictEqual(isArray);
        expect(metaComponent).toHaveLength(5);

        for (const meta of metaComponent) {
          expect(meta).toStrictEqual(expect.objectContaining({ type: 'meta' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{metaComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders meta tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            meta={[
              { charset: 'utf-8' },
              {
                name: 'description',
                content: 'Test description & encoding of special characters like \' " > < `',
              },
              { 'http-equiv': 'content-type', content: 'text/html' },
              { property: 'og:type', content: 'article' },
              { itemprop: 'name', content: 'Test name itemprop' },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.meta).toBeDefined();
        expect(head?.meta.toString).toBeDefined();
        expect(head?.meta.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders meta tags as React components', () => {
        expect.assertions(10);

        const { context } = render(
          <Helmet defer={false}>
            <meta charSet='utf-8' />
            <meta
              name='description'
              content={'Test description & encoding of special characters like \' " > < `'}
            />
            <meta httpEquiv='content-type' content='text/html' />
            <meta property='og:type' content='article' />
            <meta itemProp='name' content='Test name itemprop' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.meta).toBeDefined();
        expect(head?.meta.toComponent).toBeDefined();

        const metaComponent = head?.meta.toComponent() ?? [];

        expect(metaComponent).toStrictEqual(isArray);
        expect(metaComponent).toHaveLength(5);

        for (const meta of metaComponent) {
          expect(meta).toStrictEqual(expect.objectContaining({ type: 'meta' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{metaComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders meta tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <meta charSet='utf-8' />
            <meta
              name='description'
              content='Test description &amp; encoding of special characters like &#x27; " &gt; &lt; `'
            />
            <meta httpEquiv='content-type' content='text/html' />
            <meta property='og:type' content='article' />
            <meta itemProp='name' content='Test name itemprop' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.meta).toBeDefined();
        expect(head?.meta.toString).toBeDefined();
        expect(head?.meta.toString()).toMatchSnapshot();
      });
    });
  });
});
