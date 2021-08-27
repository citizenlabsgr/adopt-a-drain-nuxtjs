module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    requireConfigFile: false,
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  extends: [
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
  }
}
