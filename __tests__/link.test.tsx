import React from 'react';

import { Helmet } from '../src';

import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

describe('<link> tags', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates link tags', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            link={[
              {
                href: 'http://localhost/helmet',
                rel: 'canonical',
              },
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toBeDefined();

        const filteredTags = (Array.prototype.slice.call(existingTags) as Element[]).filter(
          (tag) =>
            (tag.getAttribute('href') === 'http://localhost/style.css' &&
              tag.getAttribute('rel') === 'stylesheet' &&
              tag.getAttribute('type') === 'text/css') ||
            (tag.getAttribute('href') === 'http://localhost/helmet' &&
              tag.getAttribute('rel') === 'canonical'),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(2);
      });

      it('clears all link tags if none are specified', () => {
        expect.assertions(2);

        render(
          <Helmet
            defer={false}
            link={[
              {
                href: 'http://localhost/helmet',
                rel: 'canonical',
              },
            ]}
          />,
        );

        render(<Helmet defer={false} />);

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "href" or "rel", even if they are valid for other tags', () => {
        expect.assertions(2);

        // Testing invalid properties
        // @ts-expect-error - ''http-equiv'' does not exist in type 'Partial<HTMLLinkElement>'
        render(<Helmet defer={false} link={[{ 'http-equiv': "won't work" }]} />);

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('correctly uses "rel" as the primary identification for tags with "rel" and "href", regardless of ordering', () => {
        expect.assertions(7);

        render(
          <div>
            <Helmet
              defer={false}
              link={[
                {
                  href: 'http://localhost/helmet',
                  rel: 'canonical',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/new',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  href: 'http://localhost/helmet/newest',
                  rel: 'canonical',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/newest');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('correctly uses the "href" as the primary identification for tags with rel="stylesheet", regardless of ordering', () => {
        expect.assertions(16);

        render(
          <div>
            <Helmet
              defer={false}
              link={[
                {
                  href: 'http://localhost/style.css',
                  rel: 'stylesheet',
                  type: 'text/css',
                  media: 'all',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'stylesheet',
                  href: 'http://localhost/inner.css',
                  type: 'text/css',
                  media: 'all',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe('http://localhost/style.css');
        expect(firstTag.getAttribute('rel')).toBe('stylesheet');
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.getAttribute('media')).toBe('all');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('stylesheet');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/inner.css');
        expect(secondTag.getAttribute('type')).toBe('text/css');
        expect(secondTag.getAttribute('media')).toBe('all');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('sets link tags based on deepest nested component', () => {
        expect.assertions(21);

        render(
          <div>
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet',
                },
                {
                  href: 'http://localhost/style.css',
                  rel: 'stylesheet',
                  type: 'text/css',
                  media: 'all',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/innercomponent',
                },
                {
                  href: 'http://localhost/inner.css',
                  rel: 'stylesheet',
                  type: 'text/css',
                  media: 'all',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag, thirdTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe('http://localhost/style.css');
        expect(firstTag.getAttribute('rel')).toBe('stylesheet');
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.getAttribute('media')).toBe('all');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.outerHTML).toMatchSnapshot();

        expect(thirdTag).toBeInstanceOf(Element);
        expect(thirdTag.getAttribute).toBeDefined();
        expect(thirdTag.getAttribute('href')).toBe('http://localhost/inner.css');
        expect(thirdTag.getAttribute('rel')).toBe('stylesheet');
        expect(thirdTag.getAttribute('type')).toBe('text/css');
        expect(thirdTag.getAttribute('media')).toBe('all');
        expect(thirdTag.outerHTML).toMatchSnapshot();
      });

      it('allows duplicate link tags if specified in the same component', () => {
        expect.assertions(12);

        render(
          <Helmet
            defer={false}
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('overrides duplicate link tags with a single link tag in a nested component', () => {
        expect.assertions(7);

        render(
          <div>
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet',
                },
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/component',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/innercomponent',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('overrides single link tag with duplicate link tags in a nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet',
                },
              ]}
            />
            <Helmet
              defer={false}
              link={[
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/component',
                },
                {
                  rel: 'canonical',
                  href: 'http://localhost/helmet/innercomponent',
                },
              ]}
            />
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(7);

        render(
          <Helmet
            defer={false}
            link={[
              // Testing invalid values
              // @ts-expect-error - ''http-equiv'' does not exist in type 'Partial<HTMLLinkElement>'
              { rel: 'icon', sizes: '192x192', href: null },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
            ]}
          />,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('updates link tags', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <link href='http://localhost/helmet' rel='canonical' />
            <link href='http://localhost/style.css' rel='stylesheet' type='text/css' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter(
          (tag) =>
            (tag.getAttribute('href') === 'http://localhost/style.css' &&
              tag.getAttribute('rel') === 'stylesheet' &&
              tag.getAttribute('type') === 'text/css') ||
            (tag.getAttribute('href') === 'http://localhost/helmet' &&
              tag.getAttribute('rel') === 'canonical'),
        );

        expect(filteredTags.length).toBeGreaterThanOrEqual(2);
      });

      it('clears all link tags if none are specified', () => {
        expect.assertions(2);
        render(
          <Helmet defer={false}>
            <link href='http://localhost/helmet' rel='canonical' />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "href" or "rel", even if they are valid for other tags', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            {/* Testing invalid properties
          @ts-expect-error - Property 'httpEquiv' does not exist on type ... */}
            <link httpEquiv="won't work" />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('correctly uses "rel" as the primary identification for tags with "rel" and "href", regardless of ordering', () => {
        expect.assertions(7);
        render(
          <div>
            <Helmet defer={false}>
              <link href='http://localhost/helmet' rel='canonical' />
            </Helmet>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet/new' />
            </Helmet>
            <Helmet defer={false}>
              <link href='http://localhost/helmet/newest' rel='canonical' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/newest');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('correctly uses the "href" as the primary identification for tags with rel="stylesheet", regardless of ordering', () => {
        expect.assertions(16);

        render(
          <div>
            <Helmet defer={false}>
              <link
                href='http://localhost/style.css'
                rel='stylesheet'
                type='text/css'
                media='all'
              />
            </Helmet>
            <Helmet defer={false}>
              <link
                rel='stylesheet'
                href='http://localhost/inner.css'
                type='text/css'
                media='all'
              />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe('http://localhost/style.css');
        expect(firstTag.getAttribute('rel')).toBe('stylesheet');
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.getAttribute('media')).toBe('all');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('stylesheet');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/inner.css');
        expect(secondTag.getAttribute('type')).toBe('text/css');
        expect(secondTag.getAttribute('media')).toBe('all');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('sets link tags based on deepest nested component', () => {
        expect.assertions(21);

        render(
          <div>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet' />
              <link
                href='http://localhost/style.css'
                rel='stylesheet'
                type='text/css'
                media='all'
              />
            </Helmet>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet/innercomponent' />
              <link
                href='http://localhost/inner.css'
                rel='stylesheet'
                type='text/css'
                media='all'
              />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag, thirdTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe('http://localhost/style.css');
        expect(firstTag.getAttribute('rel')).toBe('stylesheet');
        expect(firstTag.getAttribute('type')).toBe('text/css');
        expect(firstTag.getAttribute('media')).toBe('all');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.outerHTML).toMatchSnapshot();

        expect(thirdTag).toBeInstanceOf(Element);
        expect(thirdTag.getAttribute).toBeDefined();
        expect(thirdTag.getAttribute('href')).toBe('http://localhost/inner.css');
        expect(thirdTag.getAttribute('rel')).toBe('stylesheet');
        expect(thirdTag.getAttribute('type')).toBe('text/css');
        expect(thirdTag.getAttribute('media')).toBe('all');
        expect(thirdTag.outerHTML).toMatchSnapshot();
      });

      it('allows duplicate link tags if specified in the same component', () => {
        expect.assertions(12);

        render(
          <Helmet defer={false}>
            <link rel='canonical' href='http://localhost/helmet' />
            <link rel='canonical' href='http://localhost/helmet/component' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags.length).toBeGreaterThanOrEqual(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('overrides duplicate link tags with a single link tag in a nested component', () => {
        expect.assertions(7);

        render(
          <div>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet' />
              <link rel='canonical' href='http://localhost/helmet/component' />
            </Helmet>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet/innercomponent' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('overrides single link tag with duplicate link tags in a nested component', () => {
        expect.assertions(12);

        render(
          <div>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet' />
            </Helmet>
            <Helmet defer={false}>
              <link rel='canonical' href='http://localhost/helmet/component' />
              <link rel='canonical' href='http://localhost/helmet/innercomponent' />
            </Helmet>
          </div>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag, secondTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(2);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(firstTag.outerHTML).toMatchSnapshot();

        expect(secondTag).toBeInstanceOf(Element);
        expect(secondTag.getAttribute).toBeDefined();
        expect(secondTag.getAttribute('rel')).toBe('canonical');
        expect(secondTag.getAttribute('href')).toBe('http://localhost/helmet/innercomponent');
        expect(secondTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(7);

        render(
          <Helmet defer={false}>
            {/* Testing invalid values
          @ts-expect-error - Type 'null' is not assignable to type 'string | undefined' */}
            <link rel='icon' sizes='192x192' href={null} />
            <link rel='canonical' href='http://localhost/helmet/component' />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes) as Element[];
        const [firstTag] = existingTags;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('rel')).toBe('canonical');
        expect(firstTag.getAttribute('href')).toBe('http://localhost/helmet/component');
        expect(firstTag.outerHTML).toMatchSnapshot();
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders link tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet
            defer={false}
            link={[
              { href: 'http://localhost/helmet', rel: 'canonical' },
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.link).toBeDefined();
        expect(head?.link.toComponent).toBeDefined();

        const linkComponent = head?.link.toComponent() ?? [];

        expect(linkComponent).toStrictEqual(isArray);
        expect(linkComponent).toHaveLength(2);

        for (const link of linkComponent) {
          expect(link).toStrictEqual(expect.objectContaining({ type: 'link' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{linkComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders link tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            link={[
              { href: 'http://localhost/helmet', rel: 'canonical' },
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
              },
            ]}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.link).toBeDefined();
        expect(head?.link.toString).toBeDefined();
        expect(head?.link.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders link tags as React components', () => {
        expect.assertions(7);

        const { context } = render(
          <Helmet defer={false}>
            <link href='http://localhost/helmet' rel='canonical' />
            <link href='http://localhost/style.css' rel='stylesheet' type='text/css' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.link).toBeDefined();
        expect(head?.link.toComponent).toBeDefined();

        const linkComponent = head?.link.toComponent() ?? [];

        expect(linkComponent).toStrictEqual(isArray);
        expect(linkComponent).toHaveLength(2);

        for (const link of linkComponent) {
          expect(link).toStrictEqual(expect.objectContaining({ type: 'link' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{linkComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders link tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <link href='http://localhost/helmet' rel='canonical' />
            <link href='http://localhost/style.css' rel='stylesheet' type='text/css' />
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.link).toBeDefined();
        expect(head?.link.toString).toBeDefined();
        expect(head?.link.toString()).toMatchSnapshot();
      });
    });
  });
});
