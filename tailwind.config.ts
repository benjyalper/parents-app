import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm, calm, respectful
        primary: {
          50:  '#fdf6f0',
          100: '#fae8d8',
          200: '#f4ccaa',
          300: '#ecaa74',
          400: '#e2853c',
          500: '#d96b20',
          600: '#c05416',
          700: '#a04014',
          800: '#823516',
          900: '#6b2d15',
        },
        warm: {
          50:  '#fdfbf7',
          100: '#f9f3e8',
          200: '#f1e3cc',
          300: '#e5cca8',
          400: '#d6af7e',
          500: '#c4925a',
          600: '#ab7744',
          700: '#8e6038',
          800: '#744f30',
          900: '#60412a',
        },
        calm: {
          50:  '#f5f7fa',
          100: '#eaeff5',
          200: '#d0dcea',
          300: '#a8bfd6',
          400: '#799dbd',
          500: '#5580a7',
          600: '#42678d',
          700: '#375373',
          800: '#314660',
          900: '#2c3c51',
        },
      },
      fontFamily: {
        // Good Hebrew-compatible fonts
        sans: ['Segoe UI', 'Tahoma', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px rgba(0,0,0,0.08)',
        card: '0 4px 24px rgba(0,0,0,0.10)',
        modal: '0 8px 40px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
