/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const CracoLessPlugin = require('craco-less');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@text-color': '#011549',
              '@link-color': '#011549',
              '@primary-color': '#8d34ff',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
