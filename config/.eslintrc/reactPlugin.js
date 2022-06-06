module.exports = {
  plugins: ['react'],
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
      formComponents: [],
      linkComponents: [{ name: 'Link', linkAttribute: 'to' }],
    },
  },
  rules: {
    // Enforces consistent naming for boolean props
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/boolean-prop-naming.md
    'react/boolean-prop-naming': [
      'error',
      {
        propTypeNames: ['bool', 'boolean'],
        rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
        message: 'Please use the "is" or "has" prefix for "{{propName}}" to indicate a boolean',
        validateNested: true,
      },
    ],
    // Prevent usage of `button` elements without an explicit `type` attribute
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
    'react/button-has-type': ['error', { button: true, submit: true, reset: true }],
    // Enforce all defaultProps have a corresponding non-required PropType
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/default-props-match-prop-types.md
    'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: false }],
    // Enforce consistent usage of destructuring assignment of props, state, and context
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': ['error', 'always'],
    // Prevent missing displayName in a React component definition
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/display-name.md
    'react/display-name': ['error', { ignoreTranspilerName: false }],
    // Forbid certain props on Components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-component-props.md
    // Don't want to disallow prop names at this stage
    'react/forbid-component-props': ['off', { forbid: ['className', 'style'] }],
    // Forbid certain props on DOM Nodes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-dom-props.md
    'react/forbid-dom-props': ['off', { forbid: [] }],
    // Forbid certain elements
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-elements.md
    // TODO: Once old elements are retired but still available in the files add them here
    // TODO: Could also potentially add the Base components here, and add an eslint-ignore-error
    //  comment for components that are meant to extend?
    'react/forbid-elements': ['error', { forbid: [] }],
    // Forbid foreign propTypes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
    // Not using prop types
    'react/forbid-foreign-prop-types': 'off',
    // Forbid certain propTypes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
    // Not using prop types
    'react/forbid-prop-types': [
      'off',
      { forbid: [], checkContextTypes: false, checkChildContextTypes: false },
    ],
    // Enforce a specific function type for function components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/function-component-definition.md
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
    ],
    // Ensure destructuring and symmetric naming of useState hook value and setter variables
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/hook-use-state.md
    // TODO: Uncomment once upgraded to v7.29 of eslint-plugin-react. This rule is currently not
    //  in a release
    // 'react/hook-use-state': 'error',
    // Enforce boolean attributes notation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    'react/jsx-boolean-value': ['error', 'never', { always: [] }],
    // Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-child-element-spacing.md
    // Not needing to enforce - only want to explicitly add space
    'react/jsx-child-element-spacing': 'off',
    // Validate closing bracket location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
    'react/jsx-closing-bracket-location': [
      'error',
      { nonEmpty: 'tag-aligned', selfClosing: 'tag-aligned' },
    ],
    // Validate closing tag location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
    'react/jsx-closing-tag-location': 'error',
    // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    // Enforce linebreaks in curly braces in JSX attributes and expressions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
    'react/jsx-curly-newline': ['error', { multiline: 'consistent', singleline: 'consistent' }],
    // Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
    'react/jsx-curly-spacing': [
      'error',
      { when: 'never', attributes: true, children: true, allowMultiline: true },
    ],
    // Enforce or disallow spaces around equal signs in JSX attributes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
    'react/jsx-equals-spacing': ['error', 'never'],
    // Restrict file extensions that may contain JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { allow: 'always', extensions: ['.jsx', '.tsx'] }],
    // Configure the position of the first property
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    // Enforce shorthand or standard form for React fragments
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-fragments.md
    'react/jsx-fragments': ['error', 'syntax'],
    // Enforce event handler naming conventions in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-handler-names.md
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
        checkLocalVariables: true,
        checkInlineFunction: false,
      },
    ],
    // Validate JSX indentation
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
    // Turned off to let prettier deal with indentation
    'react/jsx-indent': ['off', 2, { checkAttributes: true, indentLogicalExpressions: true }],
    // Validate props indentation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
    'react/jsx-indent-props': ['error', { indentMode: 2, ignoreTernaryOperator: false }],
    // Detect missing `key` prop
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-key.md
    'react/jsx-key': ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true }],
    // Validate JSX maximum depth
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-depth.md
    // Don't want to enforce a maximum depth
    'react/jsx-max-depth': 'off',
    // Limit maximum of props on a single line in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
    // Require or prevent a new line after jsx elements and expressions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-newline.md
    'react/jsx-newline': ['error', { prevent: true }],
    // No `.bind()` or Arrow Functions in JSX Props
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
    // TODO: Look into this more
    'react/jsx-no-bind': [
      'error',
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false,
      },
    ],
    // Prevent comments from being inserted as text nodes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
    'react/jsx-no-comment-textnodes': 'error',
    // Prevent react contexts from taking non-stable values
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-constructed-context-values.md
    'react/jsx-no-constructed-context-values': 'error',
    // Prevent duplicate properties in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    // Prevent usage of string literals in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-literals.md
    // Don't need to enforce in our use case
    'react/jsx-no-literals': [
      'off',
      { noStrings: false, allowedStrings: [], ignoreProps: false, noAttributeStrings: false },
    ],
    // Prevent usage of `javascript:` URLs
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-script-url.md
    // TODO: Add props to check if errors show in console
    'react/jsx-no-script-url': ['error', []],
    // Prevent usage of unsafe target='_blank'
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
    // TODO: May need to turn this off if it causes an issue
    'react/jsx-no-target-blank': [
      'error',
      {
        allowReferrer: false,
        enforceDynamicLinks: 'always',
        warnOnSpreadAttributes: false,
        links: true,
        forms: false,
      },
    ],
    // Disallow undeclared variables in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    'react/jsx-no-undef': ['error', { allowGlobals: true }],
    // Disallow unnecessary fragments
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-useless-fragment.md
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    // One JSX Element Per Line
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-one-expression-per-line.md
    'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    // Enforce PascalCase for user-defined JSX components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
    'react/jsx-pascal-case': [
      'error',
      { allowAllCaps: false, allowLeadingUnderscore: false, allowNamespace: false, ignore: [] },
    ],
    // Disallow multiple spaces between inline JSX props
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
    // Off as core rule no-multi-spaces is on and enforces this
    'react/jsx-props-no-multi-spaces': 'off',
    // Disallow JSX props spreading
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
    // Off as spreading is useful
    'react/jsx-props-no-spreading': [
      'off',
      { html: 'enforce', custom: 'enforce', explicitSpread: 'enforce', exceptions: [] },
    ],
    // Enforce defaultProps declarations alphabetical sorting
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-default-props.md
    // Do not want to force order props
    'react/jsx-sort-default-props': ['off', { ignoreCase: true }],
    // Enforce props alphabetical sorting
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
    // Do not want to order props
    'react/jsx-sort-props': [
      'off',
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: true,
        noSortAlphabetically: true,
        reservedFirst: true,
      },
    ],
    // Validate whitespace in and around the JSX opening and closing brackets
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-tag-spacing.md
    'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      },
    ],
    // Prevent React to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
    // Not needed as React will either be a global var or declared in the file
    // TODO: Should be disabled once using React 17 as well
    'react/jsx-uses-react': 'off',
    // Prevent variables used in JSX to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
    'react/jsx-uses-vars': 'error',
    // Prevent missing parentheses around multiline JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens',
        assignment: 'parens',
        return: 'parens',
        arrow: 'parens',
        condition: 'ignore',
        logical: 'ignore',
        prop: 'ignore',
      },
    ],
    // Prevent using this.state within a this.setState
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
    'react/no-access-state-in-setstate': 'error',
    // Prevent adjacent inline elements not separated by whitespace
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-adjacent-inline-elements.md
    // Doesn't actually seem to help with anything
    'react/no-adjacent-inline-elements': 'off',
    // Prevent usage of Array index in keys
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
    'react/no-array-index-key': 'warn',
    // Lifecycle methods should be methods on the prototype, not class fields
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-arrow-function-lifecycle.md
    'react/no-arrow-function-lifecycle': 'error',
    // Prevent passing of children as props
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
    'react/no-children-prop': ['error', { allowFunctions: false }],
    // Prevent usage of dangerous JSX properties
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger': 'warn',
    // Prevent problem with children and props.dangerouslySetInnerHTML
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
    'react/no-danger-with-children': 'error',
    // Prevent usage of deprecated methods
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
    'react/no-deprecated': 'error',
    // Prevent usage of setState in componentDidMount
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-mount-set-state.md
    'react/no-did-mount-set-state': 'error',
    // Prevent usage of setState in componentDidUpdate
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    'react/no-did-update-set-state': 'error',
    // Prevent direct mutation of this.state
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
    'react/no-direct-mutation-state': 'error',
    // Prevent usage of findDOMNode
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    'react/no-find-dom-node': 'error',
    // Prevent usage of invalid attributes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-invalid-html-attribute.md
    'react/no-invalid-html-attribute': ['error', ['rel']],
    // Prevent usage of isMounted
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
    'react/no-is-mounted': 'error',
    // Prevent multiple component definition per file
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-multi-comp.md
    'react/no-multi-comp': ['error', { ignoreStateless: false }],
    // Enforce that namespaces are not used in React elements
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-namespace.md
    'react/no-namespace': 'error',
    // Prevent usage of shouldComponentUpdate when extending React.PureComponent
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md
    'react/no-redundant-should-component-update': 'error',
    // Prevent usage of the return value of ReactDOM.render
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
    'react/no-render-return-value': 'error',
    // Prevent usage of setState
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-set-state.md
    // Don't want to prevent setState
    'react/no-set-state': 'off',
    // Prevent using string references
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
    'react/no-string-refs': ['error', { noTemplateLiterals: true }],
    // Prevent this from being used in stateless functional components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
    'react/no-this-in-sfc': 'error',
    // Prevents common typos
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-typos.md
    'react/no-typos': 'error',
    // Prevent invalid characters from appearing in markup
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
    'react/no-unescaped-entities': ['error', { forbid: ['>', '"', "'", '}'] }],
    // Prevent usage of unknown DOM property
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    'react/no-unknown-property': ['error', { ignore: [] }],
    // Prevent usage of unsafe lifecycle methods
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md
    'react/no-unsafe': ['error', { checkAliases: true }],
    // Prevent creating unstable components inside components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unstable-nested-components.md
    'react/no-unstable-nested-components': ['error', { allowAsProps: false }],
    // Prevent declaring unused methods of component class
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-class-component-methods.md
    'react/no-unused-class-component-methods': 'error',
    // Prevent definitions of unused propTypes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
    'react/no-unused-prop-types': [
      'error',
      { ignore: [], customValidators: [], skipShapeProps: true },
    ],
    // Prevent definitions of unused state
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-state.md
    'react/no-unused-state': 'error',
    // Prevent usage of setState in componentWillUpdate
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
    'react/no-will-update-set-state': ['error', 'disallow-in-func'],
    // Enforce ES5 or ES6 class for React Components
    'react/prefer-es6-class': ['error', 'always'],
    // Prefer exact proptype definitions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-exact-props.md
    // Not using prop types
    'react/prefer-exact-props': 'off',
    // Enforce that props are read-only
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-read-only-props.md
    // Not using flow
    'react/prefer-read-only-props': 'off',
    // Enforce stateless React Components to be written as a pure function
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': ['error', { ignorePureComponents: false }],
    // Prevent missing props validation in a React component definition
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/prop-types': ['error', { ignore: [], customValidators: [], skipUndeclared: false }],
    // Prevent missing React when using JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    // TODO: Disable once using React 17 runtime
    'react/react-in-jsx-scope': 'error',
    // Enforce a defaultProps definition for every prop that is not a required
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
    'react/require-default-props': [
      'error',
      { forbidDefaultForRequired: false, ignoreFunctionalComponents: true },
    ],
    // Enforce React components to have a shouldComponentUpdate method
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-optimization.md
    'react/require-optimization': ['error', { allowDecorators: [] }],
    // Enforce ES5 or ES6 class for returning value in render function
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
    'react/require-render-return': 'error',
    // Prevent extra closing tags for components without children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    'react/self-closing-comp': ['error', { component: true, html: true }],
    // Enforce component methods order
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
    // Do not want to enforce a method order
    'react/sort-comp': [
      'off',
      {
        order: ['static-methods', 'lifecycle', 'everything-else', 'render'],
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'state',
            'getInitialState',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
        },
      },
    ],
    // Enforce propTypes declarations alphabetical sorting
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md
    'react/sort-prop-types': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: true,
        requiredFirst: true,
        sortShapeProp: true,
        noSortAlphabetically: true,
      },
    ],
    // Enforce state initialization style
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
    'react/state-in-constructor': ['error', 'always'],
    // Enforces where React component static properties should be positioned
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
    'react/static-property-placement': [
      'error',
      'static public field',
      {
        childContextTypes: 'static public field',
        contextTypes: 'static public field',
        contextType: 'static public field',
        defaultProps: 'static public field',
        displayName: 'static public field',
        propTypes: 'static public field',
      },
    ],
    // Enforce style prop value being an object
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
    'react/style-prop-object': ['error', { allow: [] }],
    // Prevent void DOM elements (e.g. `<img />`, `<br />`) from receiving children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
    'react/void-dom-elements-no-children': 'error',
  },
};
