module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "@vue/airbnb",
    "@vue/typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["eslint-plugin-vue", "eslint-plugin-prettier"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": "error",
    "space-before-function-paren": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "func-names": "off",
    "no-bitwise": "off",
    "prefer-rest-params": "off",
    "no-trailing-spaces": "off",
    "comma-dangle": "off",
    "quote-props": "off",
    "consistent-return": "off",
    "no-plusplus": "off",
    "prefer-spread": "warn",
    "no-tabs": "warn",
    "no-unused-vars": "warn",
    "no-void": "off",
    "no-nested-ternary": "off",
    "import/no-unresolved": "off",
    "no-return-assign": "warn",
    "linebreak-style": "off",
    "prefer-destructuring": "off",
    "no-restricted-syntax": "warn",
    "arrow-parens": "off",
    "import/extensions": "off",
    "import/order": "off",
    "import/no-extraneous-dependencies": "off",
    "object-curly-newline": "warn",
    "object-curly-spacing": "warn",
    "import/no-cycle": "off",
    "no-continue": "off",
    "vue/no-unused-components": "warn",
    camelcase: "off",
    "dot-notation": "warn",
    "arrow-body-style": "warn",
    "import/prefer-default-export": "warn",
    "no-unused-expressions": "warn",
    semi: "off",
    indent: "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
  globals: {},
};