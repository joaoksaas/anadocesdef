/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        screen: { raw: 'screen' },
        'xxs': '200px',
        'xs': '275px',
        '1.5xs': '350px',
        '2xs': '500px',
        'smd': '1200px',
        'lg': '1060px',
        '2lg': '1074px',
        '3lg': '1174px',
      },
      colors: {
        primaria: "#efefef",
        secundaria: "#d09b7e",
        terciaria: "#c49075",
        quaternaria: "#3f1f18",
        quinaria: "#703d33",
        brandMarrom: "#1a0f08",
        brandMarromClaro: "#7d522f",
        brandMarromFundo: "#E0C0A2",
        brandMarromFundoClaro: "#F2CDAA",
        brandMarromFundoEscuro: "#ba9a7d",
        brandAmareloInput: "#e0c48d"
      },
      fontFamily: {
        allura: ['var(--allura-font)', 'cursive'],
        openSans: ['var(--open-sans-font)', 'sans-serif'],
        quicksand: ['var(--quicksand-font)', 'sans-serif'],
        matemasie: ['var(--matemasie-font)', 'sans-serif']
      },
    },
  },
  plugins: [],
};