module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'development' ? 'warn' : 'error',
    'no-console': process.env.NODE_ENV === 'development' ? 'warn' : 'error',
  },
}
