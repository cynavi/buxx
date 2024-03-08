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
        '11/12': '91.666667%'
      }
    },
  },
  plugins: [],
}

