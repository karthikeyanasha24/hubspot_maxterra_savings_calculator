/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
      },
      colors: {
        customBlue: '#3EA0C6',
        customDarkBlue: '#20576D',
        darkGray: '#444445',
        selectedOrange: '#FC611D',
        unselectedGray: '#AFAFAF',
        borderLightGray: '#D9D9D9',
        gradientGreenStart: '#22C35F',
        gradientGreenEnd: '#049769',
        gradientBlueStart: '#1AA9E2',
        gradientBlueEnd: '#0F6D92',
        costBreakdownGray: '#25647D',
        maxterraCardBackground: '#E6FAE6',
        costBreakdownCurrentBg: '#6BBAD621',
        gradientOrangeStart: '#FC611D',
        gradientOrangeEnd: '#FE8A2F',
        placeholderGray: '#B3B3B3',
        textDarkBlack: '#141414',
      },
    },
  },
  plugins: [],
};