/**
 * @type {import('prettier').Options}
 **/
export default {
  singleQuote: true,
  semi: true,
  printWidth: 120,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.{astro,svg}',
      options: {
        parser: 'astro',
      },
    },
  ],
};
