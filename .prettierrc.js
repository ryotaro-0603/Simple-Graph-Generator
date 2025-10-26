/**
 * @type {import('prettier').Options}
 **/
export default {
  singleQuote: true,
  semi: true,
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
