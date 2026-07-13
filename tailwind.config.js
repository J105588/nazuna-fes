/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ポスター準拠 和風カラーパレット */
        'wafuu-kinari':   '#F7F3ED',
        'wafuu-silk':     '#EDE8DF',
        'wafuu-deep':     '#2B3A5C',
        'wafuu-sumi':     '#1E1E1E',
        'wafuu-shu':      '#D14B41',
        'wafuu-shu-dark': '#A33530',
        'wafuu-kincha':   '#C9A83E',
        'wafuu-ekasumi':  '#C4A265',
        'wafuu-ai':       '#264478',
        'wafuu-gray':     '#7C8494',
        /* 旧互換（ポスター演出用に維持） */
        'nazuna-red':     '#E51937',
        'nazuna-gold':    '#F5D061',
        'nazuna-deep':    '#050711',
      },
      fontFamily: {
        sans: ['Noto Sans JP', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Shippori Mincho B1', 'Zen Old Mincho', 'serif'],
        mono: ['Outfit', 'monospace'],
      },
    },
  },
  plugins: [],
}
