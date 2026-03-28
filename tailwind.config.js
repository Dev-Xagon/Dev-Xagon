/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        medieval: ['MedievalSharp', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#fdf8f0',
          100: '#f9eedd',
          200: '#f2dbb8',
          300: '#e9c48a',
          400: '#dfa85c',
          500: '#d6903a',
          600: '#c87a2f',
          700: '#a66028',
          800: '#854d27',
          900: '#6c4023',
        },
        dragon: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#fbcdcd',
          300: '#f7a8a8',
          400: '#f07575',
          500: '#e54848',
          600: '#d12828',
          700: '#af1f1f',
          800: '#911d1d',
          900: '#791e1e',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        fantasy: {
          'primary': '#d6903a',
          'primary-content': '#1a0e00',
          'secondary': '#6c4023',
          'secondary-content': '#fdf8f0',
          'accent': '#e54848',
          'accent-content': '#ffffff',
          'neutral': '#2a2a2e',
          'neutral-content': '#d4d4d8',
          'base-100': '#1e1b2e',
          'base-200': '#16132a',
          'base-300': '#0f0d1f',
          'base-content': '#e8e6f0',
          'info': '#6fa3d6',
          'success': '#4ade80',
          'warning': '#fbbf24',
          'error': '#ef4444',
        },
      },
    ],
  },
}
