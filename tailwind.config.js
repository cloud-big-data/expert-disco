module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      'dark-400': '#011549',
      'dark-300': '#022379',
      'dark-200': '#6D87CD',
      'dark-100': '#D7E2FE',
      'purple-100': '#F5F1FF',
      'purple-200': '#CAB0FF',
      'purple-300': '#A179F4',
      'purple-400': '#6E30F2',
      'purple-Gradient': 'linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%)',
      'red-400': '#F94F4F',
      'red-300': '#ec7063',
      'red-200': '#F5B7B1',
      'red-100': '#FADBD8',
      'warning-100': '#fff5e2',
      'warning-200': '#f4dbab',
      'blue-400': '#86E2FF',
      'green-400': '#73FFCD',
      'peach-400': '#FAC698',
      'soft-gray-400': '#b8b8d9',
      'default-bg': '#f7f7fc',
      faintBorderColor: '#EAF5F7',
    },
    boxShadow: {
      sm: '0px 2px 6px rgba(0, 0, 0, 0.25);',
      normal: '10px 10px 30px #d9d9d9, -10px -10px 30px #ffffff',
      xs: 'rgba(0, 0, 0, 0.03) 0px 2px 0px 0px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
