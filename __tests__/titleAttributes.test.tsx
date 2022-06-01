import React from 'react';

import { Helmet } from '..';

import { HELMET_ATTRIBUTE } from '../components/constants';

import { after, before, render } from './setup/testSetup';

describe('<title> attributes', () => {
  beforeEach(() => {
    before();
    document.head.innerHTML = `<title>Test Title</title>`;
  });
  afterEach(after);

  describe('API', () => {
    it('updates title attributes', () => {
      expect.assertions(2);

      render(
        <Helmet
          defer={false}
          titleAttributes={{
            itemprop: 'name',
          }}
        />,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('itemprop')).toBe('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('itemprop');
    });

    it('sets attributes based on the deepest nested component', () => {
      expect.assertions(3);

      render(
        <div>
          <Helmet
            defer={false}
            titleAttributes={{
              lang: 'en',
              hidden: undefined,
            }}
          />
          <Helmet
            defer={false}
            titleAttributes={{
              lang: 'ja',
            }}
          />
        </div>,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('lang')).toBe('ja');
      expect(titleTag.getAttribute('hidden')).toBe('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,hidden');
    });

    it('handles valueless attributes', () => {
      expect.assertions(2);

      render(
        <Helmet
          defer={false}
          titleAttributes={{
            hidden: undefined,
          }}
        />,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('hidden')).toBe('');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      expect.assertions(3);

      render(
        <Helmet
          defer={false}
          titleAttributes={{
            lang: 'en',
            hidden: undefined,
          }}
        />,
      );

      render(<Helmet defer={false} />);

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('lang')).toBeNull();
      expect(titleTag.getAttribute('hidden')).toBeNull();
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });

  describe('Declarative API', () => {
    it('updates title attributes', () => {
      expect.assertions(2);

      render(
        <Helmet defer={false}>
          <title itemProp='name' />
        </Helmet>,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('itemprop')).toBe('name');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('itemprop');
    });

    it('sets attributes based on the deepest nested component', () => {
      expect.assertions(3);

      render(
        <div>
          <Helmet defer={false}>
            <title lang='en' hidden />
          </Helmet>
          <Helmet defer={false}>
            <title lang='ja' />
          </Helmet>
        </div>,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('lang')).toBe('ja');
      expect(titleTag.getAttribute('hidden')).toBe('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('lang,hidden');
    });

    it('handles valueless attributes', () => {
      expect.assertions(2);

      render(
        <Helmet defer={false}>
          <title hidden />
        </Helmet>,
      );

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('hidden')).toBe('true');
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBe('hidden');
    });

    it('clears title attributes that are handled within helmet', () => {
      expect.assertions(3);

      render(
        <Helmet defer={false}>
          <title lang='en' hidden />
        </Helmet>,
      );

      render(<Helmet defer={false} />);

      const titleTag = document.querySelectorAll('title')[0];

      expect(titleTag.getAttribute('lang')).toBeNull();
      expect(titleTag.getAttribute('hidden')).toBeNull();
      expect(titleTag.getAttribute(HELMET_ATTRIBUTE)).toBeNull();
    });
  });
});
