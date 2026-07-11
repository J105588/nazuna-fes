/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nazuna-red': '#E51937',
        'nazuna-gold': '#F5D061',
        'nazuna-cyan': '#00D2FF',
        'nazuna-deep': '#060919',
        'nazuna-card': '#0d132a',
      },
      fontFamily: {
        sans: ['Noto Sans JP', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Zen Old Mincho', 'serif'],
        mono: ['Outfit', 'monospace'],
      },
    },
  },
  plugins: [],
}
