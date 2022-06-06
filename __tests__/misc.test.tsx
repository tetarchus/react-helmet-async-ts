import React from 'react';

import { Helmet } from '../src';
import { HELMET_ATTRIBUTE } from '../src/constants';

import { after, before, render } from './setup/testSetup';

import type { HelmetState } from '../src/types';

describe('Misc', () => {
  beforeEach(before);
  afterEach(after);

  describe('API', () => {
    it('encodes special characters', () => {
      expect.assertions(7);
      render(
        <Helmet
          defer={false}
          meta={[
            {
              name: 'description',
              content: 'This is "quoted" text and & and \'.',
            },
          ]}
        />,
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const [firstTag] = existingTags;

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('name')).toBe('description');
      expect(firstTag.getAttribute('content')).toBe('This is "quoted" text and & and \'.');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('does not change the DOM if it recevies identical props', () => {
      expect.assertions(1);

      const handleChangeClientState = jest.fn();
      render(
        <Helmet
          defer={false}
          meta={[{ name: 'description', content: 'Test description' }]}
          title='Test Title'
          onChangeClientState={handleChangeClientState}
        />,
      );

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet
          defer={false}
          meta={[{ name: 'description', content: 'Test description' }]}
          title='Test Title'
          onChangeClientState={handleChangeClientState}
        />,
      );

      expect(handleChangeClientState.mock.calls).toHaveLength(1);
    });

    it('does not write the DOM if the client and server are identical', () => {
      expect.assertions(1);
      document.head.innerHTML = `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript" />`;

      const handleChangeClientState = jest.fn<
        unknown,
        [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
      >();
      render(
        <Helmet
          defer={false}
          script={[
            {
              src: 'http://localhost/test.js',
              type: 'text/javascript',
            },
          ]}
          onChangeClientState={handleChangeClientState}
        />,
      );

      expect(handleChangeClientState).not.toHaveBeenCalled();
    });

    it('only adds new tags and preserves tags when rendering additional Helmet instances', () => {
      expect.assertions(19);

      const handleChangeClientState = jest.fn<
        unknown,
        [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
      >();
      let addedTags: Record<string, HTMLElement[]>;
      let removedTags: Record<string, HTMLElement[]>;
      render(
        <Helmet
          defer={false}
          link={[
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
          meta={[{ name: 'description', content: 'Test description' }]}
          onChangeClientState={handleChangeClientState}
        />,
      );

      expect(handleChangeClientState).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
      );

      [[, addedTags, removedTags]] = handleChangeClientState.mock.calls;

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags['metaTags'][0]).toBeDefined();
      expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags['linkTags'][0]).toBeDefined();
      expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).toStrictEqual({});

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet
          defer={false}
          link={[
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
            {
              href: 'http://localhost/style2.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
          meta={[{ name: 'description', content: 'New description' }]}
          onChangeClientState={handleChangeClientState}
        />,
      );

      expect(handleChangeClientState.mock.calls).toHaveLength(2);

      [, [, addedTags, removedTags]] = handleChangeClientState.mock.calls;

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags['metaTags'][0]).toBeDefined();
      expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags['linkTags'][0]).toBeDefined();
      expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).toHaveProperty('metaTags');
      expect(removedTags['metaTags'][0]).toBeDefined();
      expect(removedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).not.toHaveProperty('linkTags');
    });

    it('does not accept nested Helmets', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet defer={false} title='Test Title'>
            <Helmet defer={false} title={"Title you'll never see"} />
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        'You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('recognizes valid tags regardless of attribute ordering', () => {
      expect.assertions(7);

      render(
        <Helmet defer={false} meta={[{ content: 'Test Description', name: 'description' }]} />,
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag.getAttribute('name')).toBe('description');
      expect(existingTag.getAttribute('content')).toBe('Test Description');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('runs requestAnimationFrame as expected', async () => {
      expect.assertions(2);

      await new Promise<void>((resolve) => {
        requestAnimationFrame((cb) => {
          expect(cb).toBeDefined();
          expect(typeof cb).toBe('number');

          resolve();
        });
      });
    });
  });

  describe('Declarative API', () => {
    it('encodes special characters', () => {
      expect.assertions(7);

      render(
        <Helmet defer={false}>
          <meta name='description' content={'This is "quoted" text and & and \'.'} />
        </Helmet>,
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag.getAttribute('name')).toBe('description');
      expect(existingTag.getAttribute('content')).toBe('This is "quoted" text and & and \'.');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('does not change the DOM if it recevies identical props', () => {
      expect.assertions(1);

      const handleChangeClientState = jest.fn();
      render(
        <Helmet defer={false} onChangeClientState={handleChangeClientState}>
          <meta name='description' content='Test description' />
          <title>Test Title</title>
        </Helmet>,
      );

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet defer={false} onChangeClientState={handleChangeClientState}>
          <meta name='description' content='Test description' />
          <title>Test Title</title>
        </Helmet>,
      );

      expect(handleChangeClientState.mock.calls).toHaveLength(1);
    });

    it('does not write the DOM if the client and server are identical', () => {
      expect.assertions(1);

      document.head.innerHTML = `<script ${HELMET_ATTRIBUTE}="true" src="http://localhost/test.js" type="text/javascript" />`;

      const handleChangeClientState = jest.fn<
        unknown,
        [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
      >();
      render(
        <Helmet defer={false} onChangeClientState={handleChangeClientState}>
          <script src='http://localhost/test.js' type='text/javascript' />
        </Helmet>,
      );

      expect(handleChangeClientState).not.toHaveBeenCalled();
    });

    it('only adds new tags and preserves tags when rendering additional Helmet instances', () => {
      expect.assertions(19);

      const handleChangeClientState = jest.fn<
        unknown,
        [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
      >();
      let addedTags: Record<string, HTMLElement[]>;
      let removedTags: Record<string, HTMLElement[]>;
      render(
        <Helmet defer={false} onChangeClientState={handleChangeClientState}>
          <link href='http://localhost/style.css' rel='stylesheet' type='text/css' />
          <meta name='description' content='Test description' />
        </Helmet>,
      );

      expect(handleChangeClientState).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.any(Object),
      );

      [[, addedTags, removedTags]] = handleChangeClientState.mock.calls;

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags['metaTags'][0]).toBeDefined();
      expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags['linkTags'][0]).toBeDefined();
      expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).toStrictEqual({});

      // Re-rendering will pass new props to an already mounted Helmet
      render(
        <Helmet defer={false} onChangeClientState={handleChangeClientState}>
          <link href='http://localhost/style.css' rel='stylesheet' type='text/css' />
          <link href='http://localhost/style2.css' rel='stylesheet' type='text/css' />
          <meta name='description' content='New description' />
        </Helmet>,
      );

      expect(handleChangeClientState.mock.calls).toHaveLength(2);

      [, [, addedTags, removedTags]] = handleChangeClientState.mock.calls;

      expect(addedTags).toHaveProperty('metaTags');
      expect(addedTags['metaTags'][0]).toBeDefined();
      expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(addedTags).toHaveProperty('linkTags');
      expect(addedTags['linkTags'][0]).toBeDefined();
      expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).toHaveProperty('metaTags');
      expect(removedTags['metaTags'][0]).toBeDefined();
      expect(removedTags['metaTags'][0].outerHTML).toMatchSnapshot();
      expect(removedTags).not.toHaveProperty('linkTags');
    });

    it('does not accept nested Helmets', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet defer={false}>
            <title>Test Title</title>
            <Helmet defer={false}>
              <title>Title you will never see</title>
            </Helmet>
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        'You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('throws on invalid elements', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet defer={false}>
            <title>Test Title</title>
            <div>
              <title>Title you will never see</title>
            </div>
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        'Only elements types base, body, Symbol(react.fragment), head, html, link, meta, noscript, script, style, title are allowed. Helmet does not support rendering <div> elements. Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('throws on invalid self-closing elements', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet>
            <title>Test Title</title>
            <div />
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        'Only elements types base, body, Symbol(react.fragment), head, html, link, meta, noscript, script, style, title are allowed. Helmet does not support rendering <div> elements. Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('throws on invalid strings as children', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet>
            <title>Test Title</title>
            {/* eslint-disable-next-line react/void-dom-elements-no-children */}
            <link href='http://localhost/helmet' rel='canonical'>
              test
            </link>
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        '<link /> elements are self-closing and can not contain children. Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('throws on invalid children', () => {
      expect.assertions(1);

      const consoleError = global.console.error;
      jest.spyOn(global.console, 'error').mockImplementation();

      const renderInvalid = (): void => {
        render(
          <Helmet defer={false}>
            <title>Test Title</title>
            <script>
              <title>Title you will never see</title>
            </script>
          </Helmet>,
        );
      };

      expect(renderInvalid).toThrow(
        'Helmet expects a string as a child of <script>. Did you forget to wrap your children in braces? ( <script>{``}</script> ) Refer to our API for more information.',
      );

      global.console.error = consoleError;
    });

    it('handles undefined children', () => {
      expect.assertions(1);

      const charSet = undefined;

      render(
        <Helmet defer={false}>
          {/* Testing undefined children */}
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions */}
          {charSet && <meta charSet={charSet} />}
          <title>Test Title</title>
        </Helmet>,
      );

      expect(document.title).toBe('Test Title');
    });

    it('recognizes valid tags regardless of attribute ordering', () => {
      expect.assertions(7);

      render(
        <Helmet defer={false}>
          <meta content='Test Description' name='description' />
        </Helmet>,
      );

      const existingTags = document.head.querySelectorAll(`meta[${HELMET_ATTRIBUTE}]`);
      const existingTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(existingTag).toBeInstanceOf(Element);
      expect(existingTag.getAttribute).toBeDefined();
      expect(existingTag.getAttribute('name')).toBe('description');
      expect(existingTag.getAttribute('content')).toBe('Test Description');
      expect(existingTag.outerHTML).toMatchSnapshot();
    });

    it('runs requestAnimationFrame as expected', async () => {
      expect.assertions(2);
      await new Promise<void>((resolve) => {
        requestAnimationFrame((cb) => {
          expect(cb).toBeDefined();
          expect(typeof cb).toBe('number');

          resolve();
        });
      });
    });
  });
});
