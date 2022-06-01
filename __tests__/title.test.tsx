import React from 'react';

import { Helmet } from '..';

import { ReactServer } from './setup/encoderFix';
import { after, before, isArray, render } from './setup/testSetup';

const NullComponent = (): null => null;

describe('Title', () => {
  beforeEach(before);
  afterEach(after);

  describe('Browser', () => {
    describe('API', () => {
      it('updates page title', () => {
        expect.assertions(1);

        render(<Helmet defer={false} defaultTitle='Fallback' title='Test Title' />);

        expect(document.title).toMatchSnapshot();
      });

      it('updates page title with multiple children', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false} title='Test Title' />
            <Helmet defer={false} title='Child One Title' />
            <Helmet defer={false} title='Child Two Title' />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('sets title based on deepest nested component', () => {
        expect.assertions(1);
        render(
          <div>
            <Helmet defer={false} title='Main Title' />
            <Helmet defer={false} title='Nested Title' />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('sets title using deepest nested component with a defined title', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false} title='Main Title' />
            <Helmet defer={false} />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses defaultTitle if no title is defined', () => {
        expect.assertions(1);

        render(
          <Helmet
            defaultTitle='Fallback'
            defer={false}
            title=''
            titleTemplate='This is a %s of the titleTemplate feature'
          />,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses a titleTemplate if defined', () => {
        expect.assertions(1);

        render(
          <Helmet
            defaultTitle='Fallback'
            defer={false}
            title='Test'
            titleTemplate='This is a %s of the titleTemplate feature'
          />,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('replaces multiple title strings in titleTemplate', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            title='Test'
            titleTemplate='This is a %s of the titleTemplate feature. Another %s.'
          />,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses a titleTemplate based on deepest nested component', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet
              defer={false}
              title='Test'
              titleTemplate='This is a %s of the titleTemplate feature'
            />
            <Helmet
              defer={false}
              title='Second Test'
              titleTemplate='A %s using nested titleTemplate attributes'
            />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('merges deepest component title with nearest upstream titleTemplate', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet
              defer={false}
              title='Test'
              titleTemplate='This is a %s of the titleTemplate feature'
            />
            <Helmet defer={false} title='Second Test' />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('renders dollar characters in a title correctly when titleTemplate present', () => {
        expect.assertions(1);

        const dollarTitle = 'te$t te$$t te$$$t te$$$$t';

        render(<Helmet defer={false} title={dollarTitle} titleTemplate='This is a %s' />);

        expect(document.title).toMatchSnapshot();
      });

      it('does not encode all characters with HTML character entity equivalents', () => {
        expect.assertions(1);

        const chineseTitle = '膣膗 鍆錌雔';

        render(
          <div>
            <Helmet defer={false} title={chineseTitle} />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('correctly renderspage title with "itemprop" prop', () => {
        expect.assertions(2);

        render(
          <Helmet
            defaultTitle='Fallback'
            defer={false}
            title='Test Title with itemProp'
            titleAttributes={{ itemprop: 'name' }}
          />,
        );

        const titleTag = document.querySelectorAll('title')[0];

        expect(document.title).toMatchSnapshot();
        expect(titleTag.getAttribute('itemprop')).toBe('name');
      });
    });

    describe('Declarative API', () => {
      it('updates page title', () => {
        expect.assertions(1);

        render(
          <Helmet defaultTitle='Fallback' defer={false}>
            <title>Test Title</title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('updates page title and allows children containing expressions', () => {
        expect.assertions(1);

        const someValue = 'Some Great Title';

        render(
          <Helmet defer={false}>
            <title>
              Title:
              {someValue}
            </title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('updates page title with multiple children', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false}>
              <title>Test Title</title>
            </Helmet>
            <Helmet defer={false}>
              <title>Child One Title</title>
            </Helmet>
            <Helmet defer={false}>
              <title>Child Two Title</title>
            </Helmet>
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('sets title based on deepest nested component', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false}>
              <title>Main Title</title>
            </Helmet>
            <Helmet defer={false}>
              <title>Nested Title</title>
            </Helmet>
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('sets title using deepest nested component with a defined title', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false}>
              <title>Main Title</title>
            </Helmet>
            <Helmet defer={false} />
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses defaultTitle if no title is defined', () => {
        expect.assertions(1);

        render(
          <Helmet
            defaultTitle='Fallback'
            defer={false}
            titleTemplate='This is a %s of the titleTemplate feature'
          >
            <title />
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses a titleTemplate if defined', () => {
        expect.assertions(1);

        render(
          <Helmet
            defaultTitle='Fallback'
            defer={false}
            titleTemplate='This is a %s of the titleTemplate feature'
          >
            <title>Test</title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('replaces multiple title strings in titleTemplate', () => {
        expect.assertions(1);

        render(
          <Helmet
            defer={false}
            titleTemplate='This is a %s of the titleTemplate feature. Another %s.'
          >
            <title>Test</title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('uses a titleTemplate based on deepest nested component', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false} titleTemplate='This is a %s of the titleTemplate feature'>
              <title>Test</title>
            </Helmet>
            <Helmet defer={false} titleTemplate='A %s using nested titleTemplate attributes'>
              <title>Second Test</title>
            </Helmet>
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('merges deepest component title with nearest upstream titleTemplate', () => {
        expect.assertions(1);

        render(
          <div>
            <Helmet defer={false} titleTemplate='This is a %s of the titleTemplate feature'>
              <title>Test</title>
            </Helmet>
            <Helmet defer={false}>
              <title>Second Test</title>
            </Helmet>
          </div>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('renders dollar characters in a title correctly when titleTemplate present', () => {
        expect.assertions(1);
        const dollarTitle = 'te$t te$$t te$$$t te$$$$t';

        render(
          <Helmet defer={false} titleTemplate='This is a %s'>
            <title>{dollarTitle}</title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('does not encode all characters with HTML character entity equivalents', () => {
        expect.assertions(1);

        const chineseTitle = '膣膗 鍆錌雔';

        render(
          <Helmet defer={false}>
            <title>{chineseTitle}</title>
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('correctly renderspage title with "itemprop" prop', () => {
        expect.assertions(2);

        render(
          <Helmet defaultTitle='Fallback' defer={false}>
            <title itemProp='name'>Test Title with itemProp</title>
          </Helmet>,
        );

        const titleTag = document.querySelectorAll('title')[0];

        expect(document.title).toMatchSnapshot();
        expect(titleTag.getAttribute('itemprop')).toBe('name');
      });

      it('retains existing title tag when no title tag is defined', () => {
        expect.assertions(1);

        document.head.innerHTML = `<title>Existing Title</title>`;

        render(
          <Helmet defer={false}>
            <meta name='keywords' content='stuff' />
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();
      });

      it('clears title tag if empty title is defined', () => {
        expect.assertions(2);
        render(
          <Helmet defer={false}>
            <title>Existing Title</title>
            <meta name='keywords' content='stuff' />
          </Helmet>,
        );

        expect(document.title).toMatchSnapshot();

        render(
          <Helmet defer={false}>
            <title />
            <meta name='keywords' content='stuff' />
          </Helmet>,
        );

        expect(document.title).toBe('');
      });
    });
  });

  describe('Server', () => {
    describe('API', () => {
      it('provides initial values if no state is found', () => {
        expect.assertions(3);

        const { context } = render(<NullComponent />, true);
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.meta).toBeDefined();
        expect(head?.meta.toString).toBeDefined();
        expect(head?.meta.toString()).toBe('');
      });

      it('encodes special characters in title', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false} title='Dangerous <script> include' />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('opts out of string encoding', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            encodeSpecialCharacters={false}
            title={"This is text and & and '."}
          />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet defer={false} title='Dangerous <script> include' />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toComponent).toBeDefined();

        const titleComponent = head?.title.toComponent() ?? [];

        expect(titleComponent).toStrictEqual(isArray);
        expect(titleComponent).toHaveLength(1);

        for (const title of titleComponent) {
          expect(title).toStrictEqual(expect.objectContaining({ type: 'title' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{titleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders title with itemprop name as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet
            defer={false}
            title='Title with Itemprop'
            titleAttributes={{ itemprop: 'name' }}
          />,
          true,
        );
        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toComponent).toBeDefined();

        const titleComponent = head?.title.toComponent() ?? [];

        expect(titleComponent).toStrictEqual(isArray);
        expect(titleComponent).toHaveLength(1);

        for (const title of titleComponent) {
          expect(title).toStrictEqual(expect.objectContaining({ type: 'title' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{titleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders title tag as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false} title='Dangerous <script> include' />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title with itemprop name as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet
            defer={false}
            title='Title with Itemprop'
            titleAttributes={{ itemprop: 'name' }}
          />,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();

        const titleString = head?.title.toString();

        expect(titleString).toMatchSnapshot();
      });

      it('does not encode all characters with HTML character entity equivalents', () => {
        expect.assertions(3);

        const chineseTitle = '膣膗 鍆錌雔';

        const { context } = render(
          <div>
            <Helmet defer={false} title={chineseTitle} />
          </div>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });
    });

    describe('Declarative API', () => {
      it('encodes special characters in title', () => {
        expect.assertions(3);
        const { context } = render(
          <Helmet defer={false}>
            <title>{`Dangerous <script> include`}</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('opts out of string encoding', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet encodeSpecialCharacters={false}>
            {/* Testing unescaped characters */}
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <title>This is text and & and '.</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet defer={false}>
            <title>{`Dangerous <script> include`}</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toComponent).toBeDefined();

        const titleComponent = head?.title.toComponent() ?? [];

        expect(titleComponent).toStrictEqual(isArray);
        expect(titleComponent).toHaveLength(1);

        for (const title of titleComponent) {
          expect(title).toStrictEqual(expect.objectContaining({ type: 'title' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{titleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders title with itemprop name as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet defer={false}>
            <title itemProp='name'>Title with Itemprop</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toComponent).toBeDefined();

        const titleComponent = head?.title.toComponent() ?? [];

        expect(titleComponent).toStrictEqual(isArray);
        expect(titleComponent).toHaveLength(1);

        for (const title of titleComponent) {
          expect(title).toStrictEqual(expect.objectContaining({ type: 'title' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{titleComponent}</>);

        expect(view).toMatchSnapshot();
      });

      it('renders title tag as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <title>{'Dangerous <script> include'}</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title and allows children containing expressions', () => {
        expect.assertions(3);

        const someValue = 'Some Great Title';

        const { context } = render(
          <Helmet defer={false}>
            <title>
              Title:
              {someValue}
            </title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title with itemprop name as string', () => {
        expect.assertions(3);

        const { context } = render(
          <Helmet defer={false}>
            <title itemProp='name'>Title with Itemprop</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();

        const titleString = head?.title.toString();

        expect(titleString).toMatchSnapshot();
      });

      it('does not encode all characters with HTML character entity equivalents', () => {
        expect.assertions(3);

        const chineseTitle = '膣膗 鍆錌雔';

        const { context } = render(
          <div>
            <Helmet defer={false}>
              <title>{chineseTitle}</title>
            </Helmet>
          </div>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });
    });

    describe('RenderStatic', () => {
      it('html encodes title', () => {
        expect.assertions(3);
        const { context } = render(
          <Helmet defer={false}>
            <title>{`Dangerous <script> include`}</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toString).toBeDefined();
        expect(head?.title.toString()).toMatchSnapshot();
      });

      it('renders title as React component', () => {
        expect.assertions(6);

        const { context } = render(
          <Helmet defer={false}>
            <title>{`Dangerous <script> include`}</title>
          </Helmet>,
          true,
        );

        const head = 'helmet' in context ? context.helmet : null;

        expect(head?.title).toBeDefined();
        expect(head?.title.toComponent).toBeDefined();

        const titleComponent = head?.title.toComponent() ?? [];

        expect(titleComponent).toStrictEqual(isArray);
        expect(titleComponent).toHaveLength(1);

        for (const title of titleComponent) {
          expect(title).toStrictEqual(expect.objectContaining({ type: 'title' }));
        }

        const view = ReactServer.renderToStaticMarkup(<>{titleComponent}</>);

        expect(view).toMatchSnapshot();
      });
    });
  });
});
