/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a1a18',
          50: '#f2f1ed',
          100: '#f0ede8',
          200: '#e0ddd8',
          900: '#1a1a18',
        },
        marketplace: {
          paper: '#fbf5ee',
          cream: '#fff3e4',
          ink: '#2a1a12',
          muted: '#9a7561',
          accent: '#c56a2b',
          'accent-dark': '#8e3f1a',
          gold: '#f2b05f',
          sage: '#d7c3a4',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
