/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: {
        DEFAULT: '#0F48A3',
        700: '#1152bb',
        600: '#145dd2',
        500: '#1667e9',
        200: '#5c94f0',
        100: '#73a4f2',
        50: '#a2c2f6',
      },
      black: {
        DEFAULT: '#000',
        800: '#1f2024',
        700: '#1a1a1a',
        600: '#262626',
        500: '#2f3036',
        400: '#414042',
      },
      white: {
        DEFAULT: '#fff',
        700: '#f8f9fe',
        600: '#e8e9f1',
        500: '#f2f2f2',
        200: '#f7f7f7',
      },
      gray: {
        DEFAULT: '#7A7A7A',
        700: '#808080',
        600: '#999999',
        500: '#a6a6a6',
        400: '#c5c6cc',
        300: '#d6d7db',
      },
      green: {
        DEFAULT: '#22c55e',
        700: '#25da67',
        600: '#3bde77',
        500: '#70d093',
        200: '#e7f4e8',
        100: '#eef7ee',
      },
      purple: {
        DEFAULT: '#9186F4',
        700: '#958af4',
        600: '#aaa2f6',
        500: '#bfb9f8',
      },
      yellow: {
        DEFAULT: '#facc15',
        700: '#face1e',
        600: '#fbd437',
        500: '#fde047',
        200: '#feed9a',
        100: '#fef2b3',
        50: '#fff4e4',
      },
      red: {
        DEFAULT: '#ed3241',
        700: '#ef4352',
        600: '#f15b67',
        500: '#f3727d',
        200: '#f7a1a8',
        100: '#f9b9be',
        50: '#ffe2e5',
      },
      blue: {
        DEFAULT: '#006ffd',
        700: '#2897FF',
        600: '#4da9ff',
        500: '#6FBAFF',
        200: '#B4DBFF',
        100: '#cce6ff',
        50: '#EAF2FF',
      },
      opacity: 'rgb(0, 0, 0, 0.4)',
      transparent: 'transparent',
    },
    extend: {
      backgroundImage: {
        'linear-blue': 'linear-gradient(270deg, #003AD2 0%, #0097EC 100%)',
        'linear-login':
          'linear-gradient(90deg, rgba(15,72,163,1) 0%, rgba(15,72,163,0.85) 22%, rgba(15,72,163,0.85) 78%, rgba(15,72,163,1) 100%)',
      },
      fontFamily: {
        sans: 'var(--font-inter)',
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [
    require('@tailwindcss/forms'),
    require('prettier-plugin-tailwindcss'),
  ],
}
