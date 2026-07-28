/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
        },
        secondary: {
          DEFAULT: '#06B6D4',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        elevated: {
          light: '#F1F5F9',
          dark: '#172033',
        },
        border: {
          light: '#E2E8F0',
          dark: '#243047',
        },
      },
      borderRadius: {
        main: '14px',
        card: '12px',
        control: '10px',
      },
    },
  },
  plugins: [],
};
