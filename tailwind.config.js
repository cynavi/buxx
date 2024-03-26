/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      scale: {
        '150': '1.5'
      },
      screens: {
        '2xl': {'max': '1535px'}, // => @media (max-width: 1535px) { ... }
        'xl': {'max': '1279px'}, // => @media (max-width: 1279px) { ... }
        'lg': {'max': '1023px'}, // => @media (max-width: 1023px) { ... }
        'md': {'max': '767px'}, // => @media (max-width: 767px) { ... }
        'sm': {'max': '639px'}, // => @media (max-width: 639px) { ... }
      },
      minWidth: {
        '11/12': '91.666667% !important'
      },
      maxWidth: {
        '2/5': '40% !important',
        '3/5': '60% !important',
        '10/12': '83.333333% !important',
        '9/12': '75% !important',
        '8/12': '66.666667% !important',
      }
    },
  },
  plugins: [],
}

