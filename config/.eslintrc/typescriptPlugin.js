module.exports = {
  plugins: ['@typescript-eslint'],
  settings: {},
  rules: {
    // Require that member overloads be consecutive
    // https://typescript-eslint.io/rules/adjacent-overload-signatures
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    // Require using either T[] or Array<T> for arrays
    // https://typescript-eslint.io/rules/array-type
    '@typescript-eslint/array-type': ['error', { default: 'array-simple', readonly: 'generic' }],
    // Ban @ts-<directive> comments from being used or requires descriptions after directive
    // https://typescript-eslint.io/rules/ban-ts-comment
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': 'allow-with-description',
        minimumDescriptionLength: 5,
      },
    ],
    // Ban // tslint:<rule-flag> comments from being used
    // https://typescript-eslint.io/rules/ban-tslint-comment
    '@typescript-eslint/ban-tslint-comment': 'error',
    // Ban specific types from being used
    // https://typescript-eslint.io/rules/ban-types
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string',
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean',
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number',
          },
          Symbol: {
            message: 'Use symbol instead',
            fixWith: 'symbol',
          },

          Function: {
            message: [
              'The `Function` type accepts any function-like value.',
              'It provides no type safety when calling the function, which can be a common source of bugs.',
              'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
              'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
            ].join('\n'),
          },

          // object typing
          Object: {
            message: [
              'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
              '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.',
            ].join('\n'),
          },
          '{}': {
            message: [
              '`{}` actually means "any non-nullish value".',
              '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
              '- If you want a type meaning "any value", you probably want `unknown` instead.',
            ].join('\n'),
          },
        },
        extendDefaults: true,
      },
    ],
    // Ensure that literals on classes are exposed in a consistent style
    // https://typescript-eslint.io/rules/class-literal-property-style
    '@typescript-eslint/class-literal-property-style': ['error', 'getters'],
    // Enforce or disallow the use of the record type
    // https://typescript-eslint.io/rules/consistent-indexed-object-style
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    // Enforces consistent usage of type assertions
    // https://typescript-eslint.io/rules/consistent-type-assertions
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
    ],
    // Enforce consistent use of either `interface` or `type`
    // https://typescript-eslint.io/rules/consistent-type-definitions
    // Off as need to use types for Styles, but interfaces should be preferred
    '@typescript-eslint/consistent-type-definitions': ['off', 'interface'],
    // Enforce consistent usage of type exports
    // https://typescript-eslint.io/rules/consistent-type-exports
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports', disallowTypeAnnotations: true },
    ],
    // Require a specific member delimiter style for interfaces and type literals
    // https://typescript-eslint.io/rules/member-delimiter-style
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
        multilineDetection: 'brackets',
      },
    ],
    // Require a consistent member declaration order
    // https://typescript-eslint.io/rules/member-ordering
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          // Index signature
          'signature',

          // Fields
          'protected-static-field',
          'private-static-field',
          'public-static-field',

          'protected-decorated-field',
          'private-decorated-field',
          'public-decorated-field',

          'protected-instance-field',
          'private-instance-field',
          'public-instance-field',

          'protected-abstract-field',
          'private-abstract-field',
          'public-abstract-field',

          'protected-field',
          'private-field',
          'public-field',

          'static-field',
          'instance-field',
          'abstract-field',

          'decorated-field',

          'field',

          // Constructors
          'protected-constructor',
          'private-constructor',
          'public-constructor',

          'constructor',

          // Getters
          'protected-static-get',
          'private-static-get',
          'public-static-get',

          'protected-decorated-get',
          'private-decorated-get',
          'public-decorated-get',

          'protected-instance-get',
          'private-instance-get',
          'public-instance-get',

          'protected-abstract-get',
          'private-abstract-get',
          'public-abstract-get',

          'protected-get',
          'private-get',
          'public-get',

          'static-get',
          'instance-get',
          'abstract-get',

          'decorated-get',

          'get',

          // Setters
          'protected-static-set',
          'private-static-set',
          'public-static-set',

          'protected-decorated-set',
          'private-decorated-set',
          'public-decorated-set',

          'protected-instance-set',
          'private-instance-set',
          'public-instance-set',

          'protected-abstract-set',
          'private-abstract-set',
          'public-abstract-set',

          'protected-set',
          'private-set',
          'public-set',

          'static-set',
          'instance-set',
          'abstract-set',

          'decorated-set',

          'set',

          // Methods
          'protected-static-method',
          'private-static-method',
          'public-static-method',

          'protected-decorated-method',
          'private-decorated-method',
          'public-decorated-method',

          'protected-instance-method',
          'private-instance-method',
          'public-instance-method',

          'protected-abstract-method',
          'private-abstract-method',
          'public-abstract-method',

          'protected-method',
          'private-method',
          'public-method',

          'static-method',
          'instance-method',
          'abstract-method',

          'decorated-method',

          'method',
        ],
      },
    ],
    // Enforce using a particular method signature syntax
    // https://typescript-eslint.io/rules/method-signature-style
    // property|method: Which signature type to use for functions
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    // Enforce naming conventions for everything across a codebase
    // https://typescript-eslint.io/rules/naming-convention
    // TODO: Do we want to enable this at all? The options are massive
    '@typescript-eslint/naming-convention': 'off',
    // camelcase: off // No longer required (do this in the original config)
    // The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and
    //  `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule
    //  already takes care of this. However if we would like private members to start with
    //  an underscore then it might be worth disabling that rule too, and enabling that here
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   // Allow camelCase variables, PascalCase variables, and UPPER_CASE variables
    //   {
    //     selector: 'variable',
    //     format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    //   },
    //   // Allow camelCase functions, and PascalCase functions
    //   {
    //     selector: 'function',
    //     format: ['camelCase', 'PascalCase'],
    //   },
    //   // Airbnb recommends PascalCase for classes, and although Airbnb does not make TypeScript
    //   //  recommendations, we are assuming this rule would similarly apply to anything
    //   //  "type like", including interfaces, type aliases, and enums
    //   {
    //     selector: 'typeLike',
    //     format: ['PascalCase'],
    //   },
    // ]
    // Disallow non-null assertion in locations that may be confusing
    // https://typescript-eslint.io/rules/no-confusing-non-null-assertion
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    // Disallow the delete operator with computed key expressions
    // https://typescript-eslint.io/rules/no-dynamic-delete
    '@typescript-eslint/no-dynamic-delete': 'error',
    // Disallow the declaration of empty interfaces
    // https://typescript-eslint.io/rules/no-empty-interface
    '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
    // Disallow usage of the any type
    // https://typescript-eslint.io/rules/no-explicit-any
    '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: false, ignoreRestArgs: false }],
    // Disallow extra non-null assertion
    // https://typescript-eslint.io/rules/no-extra-non-null-assertion
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    // Disallow the use of classes as namespaces
    // https://typescript-eslint.io/rules/no-extraneous-class
    '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        allowConstructorOnly: false,
        allowEmpty: false,
        allowStaticOnly: false,
        allowWithDecorator: false,
      },
    ],
    // Disallow explicit type declarations for variables or parameters initialized to a
    //  number, string, or boolean
    // https://typescript-eslint.io/rules/no-inferrable-types
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: true, ignoreProperties: false },
    ],
    // Disallow usage of `void` type outside of generic or return types
    // https://typescript-eslint.io/rules/no-invalid-void-type
    '@typescript-eslint/no-invalid-void-type': [
      'error',
      { allowInGenericTypeArguments: true, allowAsThisParameter: false },
    ],

    // Enforce valid definition of `new` and `constructor`
    // https://typescript-eslint.io/rules/no-misused-new
    '@typescript-eslint/no-misused-new': 'error',
    // Disallow the use of custom TypeScript modules and namespaces
    // https://typescript-eslint.io/rules/no-namespace
    '@typescript-eslint/no-namespace': [
      'error',
      { allowDeclarations: false, allowDefinitionFiles: true },
    ],
    // Disallow using a non-null assertion in the left operand of the nullish coalescing operator
    // https://typescript-eslint.io/rules/no-non-null-asserted-nullish-coalescing
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    // Disallow using a non-null assertion after an optional chain expression
    // https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    // Disallow non-null assertions using the `!` postfix operator
    // https://typescript-eslint.io/rules/no-non-null-assertion
    // Conflicts with another rule and is more succinct that 'as' assertion when not needed.
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Disallow the use of parameter properties in class constructors
    // https://typescript-eslint.io/rules/no-parameter-properties
    '@typescript-eslint/no-parameter-properties': ['error', { allows: ['public'] }],
    // Disallow invocation of `require()`
    // https://typescript-eslint.io/rules/no-require-imports
    // TODO: May only be able to enforce for ts/tsx as some js files need requires
    '@typescript-eslint/no-require-imports': 'error',
    // Disallow aliasing `this`
    // https://typescript-eslint.io/rules/no-this-alias
    '@typescript-eslint/no-this-alias': [
      'error',
      { allowDestructuring: true, allowedNames: ['self'] },
    ],
    // Disallow the use of type aliases
    // https://typescript-eslint.io/rules/no-type-alias
    // Off as want type aliases
    '@typescript-eslint/no-type-alias': [
      'off',
      {
        allowAliases: 'always',
        allowCallbacks: 'always',
        allowConditionalTypes: 'always',
        allowConstructors: 'always',
        allowLiterals: 'always',
        allowMappedTypes: 'always',
        allowTupleTypes: 'always',
        allowGenerics: 'always',
      },
    ],
    // Disallow unnecessary constraints on generic types
    // https://typescript-eslint.io/rules/no-unnecessary-type-constraint
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    // Disallow the use of require statements except in import statements
    // https://typescript-eslint.io/rules/no-var-requires
    // TODO: May need to enable on only ts/tsx files as cannot enforce on js
    '@typescript-eslint/no-var-requires': 'error',
    // Prefer usage of `as const` over literal type
    // https://typescript-eslint.io/rules/prefer-as-const
    '@typescript-eslint/prefer-as-const': 'error',
    // Enforce initializing each enums member value
    // https://typescript-eslint.io/rules/prefer-enum-initializers
    '@typescript-eslint/prefer-enum-initializers': 'error',
    // Enforce a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access
    //  the array being iterated
    // https://typescript-eslint.io/rules/prefer-for-of
    '@typescript-eslint/prefer-for-of': 'error',
    // Enforce use of function types instead of interfaces with call signatures
    // https://typescript-eslint.io/rules/prefer-function-type
    '@typescript-eslint/prefer-function-type': 'error',
    // Enforce all `enum` members to be literal values to prevent unintended enum member
    //  name shadow issues
    // https://typescript-eslint.io/rules/prefer-literal-enum-member
    '@typescript-eslint/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: false }],
    // Enforce the use of the `namespace` keyword instead of the module keyword to declare
    //  custom TypeScript modules
    // https://typescript-eslint.io/rules/prefer-namespace-keyword
    '@typescript-eslint/prefer-namespace-keyword': 'error',

    // Enforce using concise optional chain expressions instead of chained logical ands
    // https://typescript-eslint.io/rules/prefer-optional-chain
    '@typescript-eslint/prefer-optional-chain': 'error',
    // Enforce using `@ts-expect-error` over `@ts-ignore`
    // https://typescript-eslint.io/rules/prefer-ts-expect-error
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    // Enforce that members of a type union/intersection are sorted alphabetically
    // https://typescript-eslint.io/rules/sort-type-union-intersection-members
    '@typescript-eslint/sort-type-union-intersection-members': [
      'error',
      {
        checkIntersections: true,
        checkUnions: true,
        groupOrder: [
          'named',
          'keyword',
          'operator',
          'literal',
          'function',
          'import',
          'conditional',
          'object',
          'tuple',
          'intersection',
          'union',
          'nullish',
        ],
      },
    ],
    // Enforce preference level for triple slash directives versus ES6-style import declarations
    // https://typescript-eslint.io/rules/triple-slash-reference
    '@typescript-eslint/triple-slash-reference': [
      'error',
      { path: 'never', types: 'never', lib: 'never' },
    ],
    // Enforce consistent spacing around type annotations
    // https://typescript-eslint.io/rules/type-annotation-spacing
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      { before: false, after: true, overrides: { arrow: { before: true } } },
    ],
    // Requires type annotations to exist
    // https://typescript-eslint.io/rules/typedef
    // Off as implicit is better in most cases and this is enforced with other rules
    '@typescript-eslint/typedef': [
      'off',
      {
        arrayDestructuring: false,
        arrowParameter: false,
        memberVariableDeclaration: false,
        objectDestructuring: false,
        parameter: false,
        propertyDeclaration: false,
        variableDeclaration: false,
        variableDeclarationIgnoreFunction: false,
      },
    ],
    // Disallow any two overloads that could be unified into one by using a union or
    //  an optional/rest parameter
    // https://typescript-eslint.io/rules/unified-signatures
    '@typescript-eslint/unified-signatures': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'ES2015',
        tsconfigRootDir: `${__dirname}/../../`,
        project: ['./tsconfig.json', './tsconfig.testing.json'],
      },
      rules: {
        // Some rules are already handled by TS directly, therefore can be
        //  disabled for Typescript files
        'constructor-super': 'off', // ts(2335) & ts(2377)
        'getter-return': 'off', // ts(2378)
        'no-const-assign': 'off', // ts(2588)
        'no-dupe-args': 'off', // ts(2300)
        'no-dupe-class-members': 'off', // ts(2393) & ts(2300)
        'no-dupe-keys': 'off', // ts(1117)
        'no-func-assign': 'off', // ts(2539)
        'no-import-assign': 'off', // ts(2539) & ts(2540)
        'no-new-symbol': 'off', // ts(2588)
        'no-obj-calls': 'off', // ts(2349)
        'no-redeclare': 'off', // ts(2451)
        'no-setter-return': 'off', // ts(2408)
        'no-this-before-super': 'off', // ts(2376)
        'no-undef': 'off', // ts(2304)
        'no-unreachable': 'off', // ts(7027)
        'no-unsafe-negation': 'off', // ts(2365) & ts(2360) & ts(2358)
        'valid-typeof': 'off', // ts(2367)

        // Import
        'import/named': 'off',
        'import/no-namespace': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',

        // Flowtype
        'flowtype/no-types-missing-file-annotation': 'off',

        // Disallow awaiting a value that is not a Thenable
        // https://typescript-eslint.io/rules/await-thenable
        '@typescript-eslint/await-thenable': 'error',
        // Enforce consistent usage of type imports]
        // https://typescript-eslint.io/rules/consistent-type-imports
        '@typescript-eslint/consistent-type-exports': [
          'error',
          { fixMixedExportsWithInlineTypeSpecifier: true },
        ],
        // Require explicit return types on functions and class methods
        // https://typescript-eslint.io/rules/explicit-function-return-type
        // TODO: May want to disable if we want to be able to return implicitly
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: false,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
        // Require explicit accessibility modifiers on class properties and methods
        // https://typescript-eslint.io/rules/explicit-member-accessibility
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          { accessibility: 'explicit', ignoredMethodNames: [], overrides: {} },
        ],
        // Require explicit return and argument types on exported functions' and classes'
        //  public class methods
        // https://typescript-eslint.io/rules/explicit-module-boundary-types
        '@typescript-eslint/explicit-module-boundary-types': [
          'error',
          {
            allowArgumentsExplicitlyTypedAsAny: false,
            allowDirectConstAssertionInArrowFunctions: true,
            allowedNames: [],
            allowHigherOrderFunctions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        // Require that .toString() is only called on objects which provide useful information
        //  when stringified
        // https://typescript-eslint.io/rules/no-base-to-string
        '@typescript-eslint/no-base-to-string': ['error', { ignoredTypeNames: ['RegExp'] }],
        // Require expressions of type void to appear in statement position
        // https://typescript-eslint.io/rules/no-confusing-void-expression
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          { ignoreArrowShorthand: false, ignoreVoidOperator: false },
        ],
        // Requires Promise-like values to be handled appropriately
        // https://typescript-eslint.io/rules/no-floating-promises
        '@typescript-eslint/no-floating-promises': [
          'error',
          { ignoreVoid: true, ignoreIIFE: false },
        ],
        // Disallow iterating over an array with a for-in loop
        // https://typescript-eslint.io/rules/no-for-in-array
        '@typescript-eslint/no-for-in-array': 'error',
        // Disallow the `void` operator except when used to discard a value
        // https://typescript-eslint.io/rules/no-meaningless-void-operator
        '@typescript-eslint/no-meaningless-void-operator': ['error', { checkNever: true }],
        // Disallow using promises in places not designed to handle them
        // https://typescript-eslint.io/rules/no-misused-promises
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksConditionals: true, checksVoidReturn: true },
        ],
        // Disallow unnecessary equality comparisons against boolean literals
        // https://typescript-eslint.io/rules/no-unnecessary-boolean-literal-compare
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
          'error',
          {
            allowComparingNullableBooleansToTrue: true,
            allowComparingNullableBooleansToFalse: true,
          },
        ],
        '@typescript-eslint/no-unnecessary-condition': [
          'error',
          {
            allowConstantLoopConditions: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          },
        ],
        // Disallow conditionals where the type is always truthy or always falsy
        // https://typescript-eslint.io/rules/no-unnecessary-condition
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        // Enforce that type arguments will not be used if not required
        // https://typescript-eslint.io/rules/no-unnecessary-type-arguments
        '@typescript-eslint/no-unnecessary-type-arguments': 'error',
        // Disallow a type assertion that does not change the type of an expression
        // https://typescript-eslint.io/rules/no-unnecessary-type-assertion
        '@typescript-eslint/no-unnecessary-type-assertion': ['error', { typesToIgnore: [] }],
        // Disallow calling a function with an `any` type value
        // https://typescript-eslint.io/rules/no-unsafe-argument
        '@typescript-eslint/no-unsafe-argument': 'error',
        // Disallow assigning `any` to variables and properties
        // https://typescript-eslint.io/rules/no-unsafe-assignment
        '@typescript-eslint/no-unsafe-assignment': 'error',
        // Disallow calling an `any` type value
        // https://typescript-eslint.io/rules/no-unsafe-call
        '@typescript-eslint/no-unsafe-call': 'error',
        // Disallow member access on `any` typed variables
        // https://typescript-eslint.io/rules/no-unsafe-member-access
        '@typescript-eslint/no-unsafe-member-access': 'error',
        // Disallow returning `any` from a function
        // https://typescript-eslint.io/rules/no-unsafe-return
        '@typescript-eslint/no-unsafe-return': 'error',
        // Enforce a non-null assertion over explicit type cast when possible
        // https://typescript-eslint.io/rules/non-nullable-type-assertion-style
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        // Enforce `includes` method over `indexOf` method
        // https://typescript-eslint.io/rules/prefer-includes
        '@typescript-eslint/prefer-includes': 'error',
        // Enforce the usage of the nullish coalescing operator instead of logical chaining
        // https://typescript-eslint.io/rules/prefer-nullish-coalescing
        '@typescript-eslint/prefer-nullish-coalescing': [
          'error',
          { ignoreConditionalTests: true, ignoreMixedLogicalExpressions: true },
        ],
        // Enforce that private members are marked as `readonly` if they're never modified outside
        //  of the constructor
        // https://typescript-eslint.io/rules/prefer-readonly
        '@typescript-eslint/prefer-readonly': ['error', { onlyInlineLambdas: false }],
        // Enforce that function parameters are typed as `readonly` to prevent accidental
        //  mutation of inputs
        // https://typescript-eslint.io/rules/prefer-readonly-parameter-types
        // Off as complicates code, and already have `no-param-reassign` on
        '@typescript-eslint/prefer-readonly-parameter-types': [
          'off',
          {
            checkParameterProperties: true,
            ignoreInferredTypes: false,
            treatMethodsAsReadonly: false,
          },
        ],
        // Enforce using type parameter when calling `Array#reduce` instead of casting
        // https://typescript-eslint.io/rules/prefer-reduce-type-parameter
        '@typescript-eslint/prefer-reduce-type-parameter': 'error',
        // Enforce that `RegExp#exec` is used instead of `String#match` if no global flag is provided
        // https://typescript-eslint.io/rules/prefer-regexp-exec
        '@typescript-eslint/prefer-regexp-exec': 'error',
        // Enforce that `this` is used when only `this` type is returned
        // https://typescript-eslint.io/rules/prefer-return-this-type
        '@typescript-eslint/prefer-return-this-type': 'error',
        // Enforce the use of `String#startsWith` and `String#endsWith` instead of other equivalent
        ///  methods of checking substrings
        // https://typescript-eslint.io/rules/prefer-string-starts-ends-with
        '@typescript-eslint/prefer-string-starts-ends-with': 'error',
        // Enforce that a function or method that returns a Promise to be marked `async`
        // https://typescript-eslint.io/rules/promise-function-async
        '@typescript-eslint/promise-function-async': [
          'error',
          {
            allowAny: true,
            allowedPromiseNames: [],
            checkArrowFunctions: true,
            checkFunctionDeclarations: true,
            checkFunctionExpressions: true,
            checkMethodDeclarations: true,
          },
        ],
        // Enforce `Array#sort` calls to always provide a `compareFunction`
        // https://typescript-eslint.io/rules/require-array-sort-compare
        '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: false }],
        // Enforce that when adding two variables, operands must both be of type number or of
        //  type string
        // https://typescript-eslint.io/rules/restrict-plus-operands
        // Off as we want to allow shorthand casting
        '@typescript-eslint/restrict-plus-operands': [
          'off',
          { checkCompoundAssignments: false, allowAny: false },
        ],
        // Enforce template literal expressions to be of string type
        // https://typescript-eslint.io/rules/restrict-template-expressions
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowNumber: true,
            allowBoolean: false,
            allowAny: false,
            allowNullish: false,
            allowRegExp: false,
          },
        ],
        // Enforce the types allowed in boolean expressions
        // https://typescript-eslint.io/rules/strict-boolean-expressions
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: true,
            allowNumber: true,
            allowNullableObject: true,
            allowNullableBoolean: false,
            allowNullableString: false,
            allowNullableNumber: false,
            allowAny: false,
            allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
          },
        ],
        // Enforce that all options are included in a switch that checks a union type
        // https://typescript-eslint.io/rules/switch-exhaustiveness-check
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        // Enforce unbound methods are called with their expected scope
        // https://typescript-eslint.io/rules/unbound-method
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: false }],
      },
    },
  ],
};
