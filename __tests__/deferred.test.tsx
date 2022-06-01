import React from 'react';

import { Helmet } from '..';

import { after, before, render } from './setup/testSetup';

describe('Deferred tags', () => {
  let spy: jest.SpyInstance<number, [arg: number]> | null = null;
  beforeAll(() => {
    window.__spy__ = (arg: number): number => arg;
  });

  beforeEach(() => {
    before();
    spy = jest.spyOn(window, '__spy__').mockImplementation();
  });

  afterEach(() => {
    if (spy != null) {
      spy.mock.calls.length = 0;
      spy = null;
    }
    after();
  });

  describe('API', () => {
    it('executes synchronously when defer={true} and async otherwise', async () => {
      expect.assertions(4);

      render(
        <div>
          <Helmet
            defer={false}
            script={[
              {
                innerHTML: `window.__spy__(1)`,
              },
            ]}
          />
          <Helmet
            script={[
              {
                innerHTML: `window.__spy__(2)`,
              },
            ]}
          />
        </div>,
      );

      expect(spy?.mock.calls.length).toBe(1);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          expect(spy?.mock.calls.length).toBe(2);
          expect(spy?.mock.calls[0][0]).toBe(1);
          expect(spy?.mock.calls[1][0]).toBe(2);

          resolve();
        });
      });
    });
  });

  describe('Declarative API', () => {
    it('executes synchronously when defer={true} and async otherwise', async () => {
      expect.assertions(4);

      render(
        <div>
          <Helmet defer={false}>
            <script>window.__spy__(1)</script>
          </Helmet>
          <Helmet>
            <script>window.__spy__(2)</script>
          </Helmet>
        </div>,
      );

      expect(spy?.mock.calls.length).toBe(1);

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          expect(spy?.mock.calls.length).toBe(2);
          expect(spy?.mock.calls[0][0]).toBe(1);
          expect(spy?.mock.calls[1][0]).toBe(2);

          resolve();
        });
      });
    });
  });
});
