import React from 'react';

import { Helmet } from '..';
import { HELMET_ATTRIBUTE, HTML_TAG_MAP } from '../components/constants';

import { ReactServer } from './setup/encoderFix';
import { after, before, render } from './setup/testSetup';

describe('<body> attributes', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('Valid attributes', () => {
      const attributeList = {
        accessKey: 'c',
        className: 'test',
        contentEditable: 'true',
        contextMenu: 'mymenu',
        'data-animal-type': 'lion',
        dir: 'rtl',
        draggable: 'true',
        dropzone: 'copy',
        hidden: 'true',
        id: 'test',
        lang: 'fr',
        spellcheck: 'true',
        style: 'color:green',
        tabIndex: '-1',
        title: 'test',
        translate: 'no',
      };

      for (const attribute of Object.keys(attributeList)) {
        it(`has valid '${attribute}'`, () => {
          expect.assertions(2);
          const attrValue = attributeList[attribute as keyof typeof attributeList];

          const attr = {
            [attribute]: attrValue,
          };

          render(
            <Helmet defer={false}>
              <body {...attr} />
            </Helmet>,
          );

          const bodyTag = document.body;

          const reactCompatAttr = HTML_TAG_MAP[attribute] || attribute;

          expect(bodyTag.getAttribute(reactCompatAttr)).toStrictEqual(attrValue);
          expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toStrictEqual(reactCompatAttr);
        });
      }
    });

    it('updates multiple body attributes', () => {
      expect.assertions(3);

      render(
        <Helmet defer={false}>
          <body className='myClassName' tabIndex={-1} />
        </Helmet>,
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('class')).toBe('myClassName');
      expect(bodyTag.getAttribute('tabindex')).toBe('-1');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('class,tabindex');
    });

    it('sets attributes based on the deepest nested component', () => {
      expect.assertions(2);

      render(
        <div>
          <Helmet defer={false}>
            <body lang='en' />
          </Helmet>
          <Helmet defer={false}>
            <body lang='ja' />
          </Helmet>
        </div>,
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('lang')).toBe('ja');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang');
    });

    it('handles valueless attributes', () => {
      expect.assertions(2);

      render(
        <Helmet defer={false}>
          <body hidden />
        </Helmet>,
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('hidden')).toBe('true');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears body attributes that are handled within helmet', () => {
      expect.assertions(3);

      render(
        <Helmet defer={false}>
          <body lang='en' hidden />
        </Helmet>,
      );

      render(<Helmet defer={false} />);

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('lang')).toBeNull();
      expect(bodyTag.getAttribute('hidden')).toBeNull();
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });

    it('updates with multiple additions and removals - overwrite and new', () => {
      expect.assertions(5);

      render(
        <Helmet defer={false}>
          <body lang='en' hidden />
        </Helmet>,
      );

      render(
        <Helmet defer={false}>
          <body lang='ja' id='body-tag' title='body tag' />
        </Helmet>,
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('hidden')).toBeNull();
      expect(bodyTag.getAttribute('lang')).toBe('ja');
      expect(bodyTag.getAttribute('id')).toBe('body-tag');
      expect(bodyTag.getAttribute('title')).toBe('body tag');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,id,title');
    });

    it('updates with multiple additions and removals - all new', () => {
      expect.assertions(5);

      render(
        <Helmet defer={false}>
          <body lang='en' hidden />
        </Helmet>,
      );

      render(
        <Helmet defer={false}>
          <body id='body-tag' title='body tag' />
        </Helmet>,
      );

      const bodyTag = document.body;

      expect(bodyTag.getAttribute('hidden')).toBeNull();
      expect(bodyTag.getAttribute('lang')).toBeNull();
      expect(bodyTag.getAttribute('id')).toBe('body-tag');
      expect(bodyTag.getAttribute('title')).toBe('body tag');
      expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('id,title');
    });

    describe('When initialized outside of helmet', () => {
      beforeEach(() => {
        const bodyTag = document.body;
        bodyTag.setAttribute('test', 'test');
      });

      it('does not clear attributes', () => {
        expect.assertions(2);

        render(<Helmet defer={false} />);

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('test')).toBe('test');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });

      it('overwrites attributes if specified in helmet', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - testing */}
            <body test='helmet-attr' />
          </Helmet>,
        );

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('test')).toBe('helmet-attr');
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBe('test');
      });

      it('clears attributes once managed in helmet', () => {
        expect.assertions(2);

        render(
          <Helmet defer={false}>
            {/* @ts-expect-error - testing */}
            <body test='helmet-attr' />
          </Helmet>,
        );

        render(<Helmet defer={false} />);

        const bodyTag = document.body;

        expect(bodyTag.getAttribute('test')).toBeNull();
        expect(bodyTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
      });
    });
  });

  describe('Server', () => {
    describe('Declarative API', () => {
      it('renders body attributes as React component', () => {
        expect.assertions(2);

        const { context } = render(
          <Helmet defer={false}>
            <body lang='ga' className='myClassName' />
          </Helmet>,
          true,
        );

        const helmet = 'helmet' in context ? context.helmet : null;

        const { bodyAttributes } = helmet ?? {};

        const attrs = bodyAttributes?.toComponent();

        expect(attrs).toBeDefined();

        const view = ReactServer.renderToStaticMarkup(<body lang='en' {...attrs} />);

        expect(view).toMatchSnapshot();
      });

      it('renders body attributes as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet>
            <body lang='ga' className='myClassName' />
          </Helmet>,
          true,
        );

        const helmet = 'helmet' in context ? context.helmet : null;

        const { bodyAttributes } = helmet ?? {};

        expect(bodyAttributes).toBeDefined();
        expect(bodyAttributes?.toString).toBeDefined();
        expect(bodyAttributes?.toString()).toMatchSnapshot();
      });
    });
  });
});
