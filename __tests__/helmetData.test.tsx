import React from 'react';

import { Helmet, HelmetData } from '..';
import { HELMET_ATTRIBUTE } from '../components/constants';

import { after, before, render } from './setup/testSetup';

describe('Helmet Data', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    it('renders without context', () => {
      expect.assertions(6);

      const helmetData = new HelmetData({});

      render(
        <Helmet
          base={{ target: '_blank', href: 'http://localhost/' }}
          defer={false}
          helmetData={helmetData}
        />,
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const [firstTag] = Array.prototype.slice.call(existingTags) as Element[];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://localhost/');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('renders declarative without context', () => {
      expect.assertions(6);

      const helmetData = new HelmetData({});

      render(
        <Helmet defer={false} helmetData={helmetData}>
          <base target='_blank' href='http://localhost/' />
        </Helmet>,
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const [firstTag] = Array.prototype.slice.call(existingTags) as Element[];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://localhost/');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('sets base tag based on deepest nested component', () => {
      expect.assertions(6);

      const helmetData = new HelmetData({});

      render(
        <div>
          <Helmet defer={false} helmetData={helmetData}>
            <base href='http://mysite.com' />
          </Helmet>
          <Helmet defer={false} helmetData={helmetData}>
            <base href='http://mysite.com/public' />
          </Helmet>
        </div>,
      );

      const existingTags = document.head.querySelectorAll(`base[${HELMET_ATTRIBUTE}]`);
      const [firstTag] = Array.prototype.slice.call(existingTags) as Element[];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toBe('http://mysite.com/public');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });

  describe('Server', () => {
    it('renders without context', () => {
      expect.assertions(3);

      const helmetData = new HelmetData({});

      render(
        <Helmet
          base={{ target: '_blank', href: 'http://localhost/' }}
          defer={false}
          helmetData={helmetData}
        />,
        true,
      );

      const head = helmetData.context.helmet;

      expect(head?.base).toBeDefined();
      expect(head?.base.toString).toBeDefined();
      expect(head?.base.toString()).toMatchSnapshot();
    });

    it('renders declarative without context', () => {
      expect.assertions(3);

      const helmetData = new HelmetData({});

      render(
        <Helmet defer={false} helmetData={helmetData}>
          <base target='_blank' href='http://localhost/' />
        </Helmet>,
        true,
      );

      const head = helmetData.context.helmet;

      expect(head?.base).toBeDefined();
      expect(head?.base.toString).toBeDefined();
      expect(head?.base.toString()).toMatchSnapshot();
    });

    it('sets base tag based on deepest nested component', () => {
      expect.assertions(3);

      const helmetData = new HelmetData({});

      render(
        <div>
          <Helmet defer={false} helmetData={helmetData}>
            <base href='http://mysite.com' />
          </Helmet>
          <Helmet defer={false} helmetData={helmetData}>
            <base href='http://mysite.com/public' />
          </Helmet>
        </div>,
        true,
      );

      const head = helmetData.context.helmet;

      expect(head?.base).toBeDefined();
      expect(head?.base.toString).toBeDefined();
      expect(head?.base.toString()).toMatchSnapshot();
    });

    it('works with the same context object but separate HelmetData instances', () => {
      expect.assertions(3);

      const initialContext = {};

      const { context } = render(
        <div>
          <Helmet defer={false} helmetData={new HelmetData(initialContext)}>
            <base href='http://mysite.com' />
          </Helmet>
          <Helmet defer={false} helmetData={new HelmetData(initialContext)}>
            <base href='http://mysite.com/public' />
          </Helmet>
        </div>,
        true,
      );

      const head = 'helmet' in context ? context.helmet : null;

      expect(head?.base).toBeDefined();
      expect(head?.base.toString).toBeDefined();
      expect(head?.base.toString()).toMatchSnapshot();
    });
  });
});
