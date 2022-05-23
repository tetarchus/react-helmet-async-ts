module.exports = {
  rules: {
    // Enforce consistent brace style for blocks
    // https://typescript-eslint.io/rules/brace-style
    '@typescript-eslint/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // Require or disallow trailing comma
    // https://typescript-eslint.io/rules/comma-dangle
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      },
    ],
    // Enforce consistent spacing before and after commas
    // https://typescript-eslint.io/rules/comma-spacing
    '@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
    // Enforce default parameters to be last
    // https://typescript-eslint.io/rules/default-param-last
    '@typescript-eslint/default-param-last': 'error',
    // Require or disallow spacing between function identifiers and their invocations
    // https://typescript-eslint.io/rules/func-call-spacing
    '@typescript-eslint/func-call-spacing': ['error', 'never'],
    // Enforce consistent indentation
    // https://typescript-eslint.io/rules/indent
    // Relying on prettier to enforce indentation
    '@typescript-eslint/indent': [
      'off',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        // MemberExpression: null,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        offsetTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
        ignoreComments: false,
      },
    ],
    // Require or disallow initialization in variable declarations
    // https://typescript-eslint.io/rules/init-declarations
    // Do not want to enforce as sometimes we don't want to initialize
    '@typescript-eslint/init-declarations': 'off',
    // Enforce consistent spacing before and after keywords
    // https://typescript-eslint.io/rules/keyword-spacing
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    // Require or disallow an empty line between class members
    // https://typescript-eslint.io/rules/lines-between-class-members
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: false },
    ],
    // Disallow generic Array constructors
    // https://typescript-eslint.io/rules/no-array-constructor
    '@typescript-eslint/no-array-constructor': 'error',
    // Disallow duplicate class members
    // https://typescript-eslint.io/rules/no-dupe-class-members
    '@typescript-eslint/no-dupe-class-members': 'error',
    // Disallow duplicate imports
    // https://typescript-eslint.io/rules/no-duplicate-imports
    // TODO: Replace with import/no-duplicates.md
    '@typescript-eslint/no-duplicate-imports': ['error', { includeExports: false }],
    // Disallow empty functions
    // https://typescript-eslint.io/rules/no-empty-function
    '@typescript-eslint/no-empty-function': ['error', { allow: [] }],
    // Disallow unnecessary parentheses
    // https://typescript-eslint.io/rules/no-extra-parens
    // Off as conflicts with prettier
    '@typescript-eslint/no-extra-parens': [
      'off',
      'all',
      {
        conditionalAssign: true,
        returnAssign: false,
        nestedBinaryExpressions: false,
        ignoreJSX: 'all', // delegate to eslint-plugin-react
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: false,
        enforceForNewInMemberExpressions: false,
        enforceForFunctionPrototypeMethods: false,
      },
    ],
    // Disallow unnecessary semicolons
    // https://typescript-eslint.io/rules/no-extra-semi
    '@typescript-eslint/no-extra-semi': 'error',
    // Disallow this keywords outside of classes or class-like objects
    // https://typescript-eslint.io/rules/no-invalid-this
    // TODO: Turn this off?
    '@typescript-eslint/no-invalid-this': ['error', { capIsConstructor: true }],
    // Disallow function declarations that contain unsafe references inside loop statements
    // https://typescript-eslint.io/rules/no-loop-func
    '@typescript-eslint/no-loop-func': 'error',
    // Disallow literal numbers that lose precision
    // https://typescript-eslint.io/rules/no-loss-of-precision
    '@typescript-eslint/no-loss-of-precision': 'error',
    // Disallow magic numbers
    // https://typescript-eslint.io/rules/no-magic-numbers
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 10, 100],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        detectObjects: false,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    // Disallow variable redeclaration
    // https://typescript-eslint.io/rules/no-redeclare
    '@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
    // Disallow specified modules when loaded by import
    // https://typescript-eslint.io/rules/no-restricted-imports
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'underscore',
            message: 'Please use `lodash` instead of `underscore`',
            allowTypeImports: false,
          },
        ],
        patterns: [],
      },
    ],
    // Disallow variable declarations from shadowing variables declared in the outer scope
    // https://typescript-eslint.io/rules/no-shadow
    '@typescript-eslint/no-shadow': [
      'error',
      {
        builtinGlobals: true,
        hoist: 'functions',
        allow: [],
        ignoreTypeValueShadow: false,
        ignoreFunctionTypeParameterNameValueShadow: false,
      },
    ],
    // Disallow unused expressions
    // https://typescript-eslint.io/rules/no-unused-expressions
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: false,
        enforceForJSX: true,
      },
    ],
    // Disallow unused variables
    // https://typescript-eslint.io/rules/no-unused-vars
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '[iI]gnored',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        caughtErrors: 'all',
      },
    ],
    // Disallow the use of variables before they are defined
    // https://typescript-eslint.io/rules/no-use-before-define
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: true,
        enums: true,
        typedefs: true,
        ignoreTypeReferences: false,
      },
    ],
    // Disallow unnecessary constructors
    // https://typescript-eslint.io/rules/no-useless-constructor
    '@typescript-eslint/no-useless-constructor': 'error',
    // Enforce consistent spacing inside braces
    // https://typescript-eslint.io/rules/object-curly-spacing
    '@typescript-eslint/object-curly-spacing': [
      'error',
      'always',
      { arraysInObjects: true, objectsInObjects: true },
    ],
    // Require or disallow padding lines between statements
    // https://typescript-eslint.io/rules/padding-line-between-statements
    // Do not want to require lines between each statement or not
    '@typescript-eslint/padding-line-between-statements': 'off',
    // Enforce the consistent use of either backticks, double, or single quotes
    // https://typescript-eslint.io/rules/quotes
    // TODO: Do we want to use backticks instead wherever possible?
    '@typescript-eslint/quotes': [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    // Require or disallow semicolons instead of ASI
    // https://typescript-eslint.io/rules/semi
    '@typescript-eslint/semi': ['error', 'always', { omitLastInOneLineBlock: false }],
    // Enforces consistent spacing before function parenthesis
    // https://typescript-eslint.io/rules/space-before-function-paren
    '@typescript-eslint/space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    // Require spacing around infix operators
    // https://typescript-eslint.io/rules/space-infix-ops
    '@typescript-eslint/space-infix-ops': ['error', { int32Hint: false }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'dot-notation': 'off',
        'no-implied-eval': 'off',
        'no-throw-literal': 'off',
        'no-return-await': 'off',
        'require-await': 'off',
        // Enforce dot notation whenever possible
        // https://typescript-eslint.io/rules/dot-notation
        '@typescript-eslint/dot-notation': [
          'error',
          {
            allowKeywords: true,
            allowPattern: '',
            allowPrivateClassPropertyAccess: false,
            allowProtectedClassPropertyAccess: false,
            allowIndexSignaturePropertyAccess: true,
          },
        ],
        // Disallow the use of eval()-like methods
        // https://typescript-eslint.io/rules/no-implied-eval
        '@typescript-eslint/no-implied-eval': 'error',
        // Disallow throwing literals as exceptions
        // https://typescript-eslint.io/rules/no-throw-literal
        '@typescript-eslint/no-throw-literal': 'error',
        // Disallow async functions which have no await expression
        // https://typescript-eslint.io/rules/require-await
        // The base rule is a bad rule according to airbnb
        '@typescript-eslint/require-await': 'off',
        // Enforces consistent returning of awaited values
        // https://typescript-eslint.io/rules/return-await
        '@typescript-eslint/return-await': ['error', 'never'],
      },
    },
  ],
};
