import React from 'react';

import { Helmet } from '..';

import { after, before, render } from './setup/testSetup';

import type { HelmetState } from '../components/types';

describe('onChangeClientState', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('calls the client state change function with new state, addedTags and removedTags', () => {
        expect.assertions(19);

        const handleChangeClientState = jest.fn<
          unknown,
          [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
        >();
        render(
          <div>
            <Helmet
              base={{ href: 'http://mysite.com/' }}
              defer={false}
              link={[
                {
                  href: 'http://localhost/helmet',
                  rel: 'canonical',
                },
              ]}
              meta={[{ charset: 'utf-8' }]}
              script={[
                {
                  src: 'http://localhost/test.js',
                  type: 'text/javascript',
                },
              ]}
              title='Main Title'
              onChangeClientState={handleChangeClientState}
            />
          </div>,
        );

        expect(handleChangeClientState).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        );

        const [[newState, addedTags, removedTags]] = handleChangeClientState.mock.calls;

        expect(newState).toStrictEqual(expect.objectContaining({ title: 'Main Title' }));
        expect(newState.baseTag[0]).toStrictEqual(
          expect.objectContaining({
            href: 'http://mysite.com/',
          }),
        );
        expect(newState.metaTags?.[0]).toStrictEqual(expect.objectContaining({ charset: 'utf-8' }));
        expect(newState.linkTags?.[0]).toStrictEqual(
          expect.objectContaining({
            href: 'http://localhost/helmet',
            rel: 'canonical',
          }),
        );
        expect(newState.scriptTags?.[0]).toStrictEqual(
          expect.objectContaining({
            src: 'http://localhost/test.js',
            type: 'text/javascript',
          }),
        );

        expect(addedTags['baseTag']).toBeDefined();
        expect(addedTags['baseTag'][0]).toBeDefined();
        expect(addedTags['baseTag'][0].outerHTML).toMatchSnapshot();
        expect(addedTags['metaTags']).toBeDefined();
        expect(addedTags['metaTags'][0]).toBeDefined();
        expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();
        expect(addedTags['linkTags']).toBeDefined();
        expect(addedTags['linkTags'][0]).toBeDefined();
        expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();
        expect(addedTags['scriptTags']).toBeDefined();
        expect(addedTags['scriptTags'][0]).toBeDefined();
        expect(addedTags['scriptTags'][0].outerHTML).toMatchSnapshot();

        expect(removedTags).toStrictEqual({});
      });
    });

    describe('Declarative API', () => {
      it('calls the client state change function with new state, addedTags and removedTags', () => {
        expect.assertions(19);

        const handleChangeClientState = jest.fn<
          unknown,
          [HelmetState, Record<string, HTMLElement[]>, Record<string, HTMLElement[]>]
        >();
        render(
          <div>
            <Helmet defer={false} onChangeClientState={handleChangeClientState}>
              <base href='http://mysite.com/' />
              <link href='http://localhost/helmet' rel='canonical' />
              <meta charSet='utf-8' />
              <script src='http://localhost/test.js' type='text/javascript' />
              <title>Main Title</title>
            </Helmet>
          </div>,
        );

        expect(handleChangeClientState).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        );

        const [[newState, addedTags, removedTags]] = handleChangeClientState.mock.calls;

        expect(newState).toStrictEqual(expect.objectContaining({ title: 'Main Title' }));
        expect(newState.baseTag[0]).toStrictEqual(
          expect.objectContaining({
            href: 'http://mysite.com/',
          }),
        );
        expect(newState.metaTags?.[0]).toStrictEqual(expect.objectContaining({ charset: 'utf-8' }));
        expect(newState.linkTags?.[0]).toStrictEqual(
          expect.objectContaining({
            href: 'http://localhost/helmet',
            rel: 'canonical',
          }),
        );
        expect(newState.scriptTags?.[0]).toStrictEqual(
          expect.objectContaining({
            src: 'http://localhost/test.js',
            type: 'text/javascript',
          }),
        );

        expect(addedTags['baseTag']).toBeDefined();
        expect(addedTags['baseTag'][0]).toBeDefined();
        expect(addedTags['baseTag'][0].outerHTML).toMatchSnapshot();

        expect(addedTags['metaTags']).toBeDefined();
        expect(addedTags['metaTags'][0]).toBeDefined();
        expect(addedTags['metaTags'][0].outerHTML).toMatchSnapshot();

        expect(addedTags['linkTags']).toBeDefined();
        expect(addedTags['linkTags'][0]).toBeDefined();
        expect(addedTags['linkTags'][0].outerHTML).toMatchSnapshot();

        expect(addedTags['scriptTags']).toBeDefined();
        expect(addedTags['scriptTags'][0]).toBeDefined();
        expect(addedTags['scriptTags'][0].outerHTML).toMatchSnapshot();

        expect(removedTags).toStrictEqual({});
      });
    });
  });
});
