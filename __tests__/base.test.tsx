import React from 'react';

import { Helmet } from '../src';
import { HELMET_ATTRIBUTE } from '../src/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

const hrefs = ['http://mysite.com/', 'http://mysite.com/public'];

describe('<base> tag', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates base tag', () => {
        expect.assertions(2);

        render(<Helmet base={{ href: hrefs[0] }} defer={false} />);

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`),
        ) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter((tag) => tag.getAttribute('href') === hrefs[0]);

        expect(filteredTags).toHaveLength(1);
      });

      it('clears the base tag if one is not specified', () => {
        expect.assertions(3);

        render(<Helmet base={{ href: hrefs[0] }} defer={false} />);
        const initialTag = (
          Array.prototype.slice.call(
            document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`),
          ) as Element[]
        ).filter((tag) => tag.getAttribute('href') === hrefs[0]);
        expect(initialTag).toHaveLength(1);

        render(<Helmet defer={false} />);

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`),
        ) as Element[];

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "href"', () => {
        expect.assertions(2);

        // @ts-expect-error - testing invalid properties
        render(<Helmet base={{ property: "won't work" }} defer={false} />);
        const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets base tag based on deepest nested component', () => {
        expect.assertions(6);

        render(
          <div>
            <Helmet base={{ href: hrefs[0] }} defer={false} />
            <Helmet base={{ href: hrefs[1] }} defer={false} />
          </div>,
        );

        const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        const [firstTag] = Array.prototype.slice.call(existingTags) as Element[];
        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe(hrefs[1]);
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);
        // @ts-expect-error - testing invalid properties
        render(<Helmet base={{ href: undefined }} defer={false} />);

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`),
        );

        expect(existingTags).toHaveLength(0);
      });
    });

    describe('Declarative API', () => {
      it('updates base tag', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <base href={hrefs[0]} />
          </Helmet>,
        );

        const existingTags = Array.prototype.slice.call(
          document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`),
        ) as Element[];

        expect(existingTags).toBeDefined();

        const filteredTags = existingTags.filter((tag) => tag.getAttribute('href') === hrefs[0]);

        expect(filteredTags).toHaveLength(1);
      });

      it('clears the base tag if one is not specified', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <base href={hrefs[0]} />
          </Helmet>,
        );
        render(<Helmet defer={false} />);

        const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('does not accept tags without "href"', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            <base property="won't work" />
          </Helmet>,
        );

        const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(0);
      });

      it('sets base tag based on deepest nested component', () => {
        expect.assertions(6);

        render(
          <div>
            <Helmet defer={false}>
              <base href={hrefs[0]} />
            </Helmet>
            <Helmet defer={false}>
              <base href={hrefs[1]} />
            </Helmet>
          </div>,
        );

        const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
        const firstTag = Array.prototype.slice.call(existingTags)[0] as Element;

        expect(existingTags).toBeDefined();
        expect(existingTags).toHaveLength(1);

        expect(firstTag).toBeInstanceOf(Element);
        expect(firstTag.getAttribute).toBeDefined();
        expect(firstTag.getAttribute('href')).toBe(hrefs[1]);
        expect(firstTag.outerHTML).toMatchSnapshot();
      });

      it('does not render tag when primary attribute is null', () => {
        expect.assertions(1);

        render(
          <Helmet defer={false}>
            <base href={undefined} />
          </Helmet>,
        );

        const tagNodes = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
        const existingTags = Array.prototype.slice.call(tagNodes);

        expect(existingTags).toHaveLength(0);
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('renders base tag as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet base={{ target: '_blank', href: hrefs[0] }} defer={false} />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.base).toBeDefined();
        expect(head?.base.toComponent).toBeDefined();

        const baseComponent = head?.base.toComponent() ?? [];

        expect(baseComponent).toStrictEqual(isArray);
        expect(baseComponent).toHaveLength(1);

        for (const base of baseComponent) {
          expect(base).toStrictEqual(expect.objectContaining({ type: 'base' }));
        }

        const view = ReactServer.renderToStaticMarkup(baseComponent[0]);

        expect(view).toMatchSnapshot();
      });

      it('renders base tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet base={{ target: '_blank', href: hrefs[0] }} defer={false} />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.base).toBeDefined();
        expect(head?.base.toString).toBeDefined();
        expect(head?.base.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('renders base tag as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet defer={false}>
            <base target='_blank' href={hrefs[0]} />
          </Helmet>,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.base).toBeDefined();
        expect(head?.base.toComponent).toBeDefined();

        const baseComponent = head?.base.toComponent() ?? [];

        expect(baseComponent).toStrictEqual(isArray);
        expect(baseComponent).toHaveLength(1);

        for (const base of baseComponent) {
          expect(base).toStrictEqual(expect.objectContaining({ type: 'base' }));
        }

        const view = ReactServer.renderToStaticMarkup(baseComponent[0]);

        expect(view).toMatchSnapshot();
      });

      it('renders base tags as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <base target='_blank' href={hrefs[0]} />
          </Helmet>,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.base).toBeDefined();
        expect(head?.base.toString).toBeDefined();
        expect(head?.base.toString()).toMatchSnapshot();
      });
    });
  });
});
