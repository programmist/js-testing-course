module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "comma-dangle": "off",
    "space-before-function-paren": ["error", "never"],
  },
};
