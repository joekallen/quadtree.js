module.exports = {
  configuration: {
    rules: {
      'no-var-requires': true,
      typedef: [
        true,
        'call-signature',
        'parameter',
        'arrow-parameter',
        'property-declaration',
        'variable-declaration',
        'member-variable-declaration'
      ],

      /**
       * Functionality
       */
      curly: true,
      'no-arg': true,
      'no-conditional-assignment': true,
      'no-console': [
        true,
        'debug',
        'log',
        'error'
      ],
      'no-debugger': true,
      'no-duplicate-key': true,
      'no-duplicate-variable': true,
      'no-empty': true,
      'no-eval': true,
      'no-invalid-this': true,
      'no-shadowed-variable': true,
      'no-unused-expression': true,
      'no-unused-variable': true,
      'no-use-before-declare': true,
      'no-var-keyword': true,
      'triple-equals': true,
      'use-isnan': true,
      'use-strict': true,

      /**
       * Maintainability
       */
      'eofline': true,
      'indent': [true, 'spaces'],
      'linebreak-style': [true, 'LF'],
      'max-line-length': [true, 120],
      'no-default-export': true,
      'no-mergeable-namespace': true,
      'no-require-imports': false,
      'no-trailing-whitespace': true,

      /**
       * Style
       */
      align: [true, 'parameters', 'statements'],
      'class-name': true,
      'comment-format': [true, 'check-space', 'check-uppercase'],
      'interface-name': [true, 'never-prefix'],
      'jsdoc-format': true,
      'new-parens': true,
      'no-consecutive-blank-lines': true,
      'no-constructor-vars': true,
      'one-line': [true, 'check-catch', 'check-finally'],
      quotemark: [
        true,
        'single',
        'avoid-escape'
      ],
      semicolon: [true, 'always'],
      'variable-name': [true, 'ban-keywords', 'check-format', 'allow-leading-underscore'],
      whitespace: [true, 'check-branch', 'check-decl','check-operator', 'check-module', 'check-separator', 'check-typecast', 'check-typecast']
    }
  },
  emitErrors: false,
  failOnHint: false
};
