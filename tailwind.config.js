/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        el: {
          black: '#000000',
          white: '#FFFFFF',
          green: {
            DEFAULT: '#009A33',
            light: '#B2FFBF',
          },
          gray: {
            darker: '#191919',
            dark: '#353230',
            DEFAULT: '#CDC8C2',
            light: '#F2EFEC',
          },
          red: {
            DEFAULT: '#D73333',
            light: '#FFBBBB',
          },
          yellow: {
            DEFAULT: '#FFD15F',
            light: '#FFE39B',
          },
        },
      },
      fontSize: {
        'display': 'clamp(4rem, 12vw, 5rem)',
        'h1': 'clamp(2rem, 5vw, 2.5rem)',
        'h2': 'clamp(1.25rem, 3vw, 1.5rem)',
        'body': '1rem',
        'caption': '0.875rem',
      },
      fontWeight: {
        normal: '400',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
}
