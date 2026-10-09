/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#132238',
          navyDark: '#0A1320',
          navyMuted: '#1E3557',
          orange: '#F58220',
          orangeHover: '#DC6E10',
          orangeLight: '#FFF4EA',
          slate: '#334155',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
        bharat: {
          saffron: '#F58220', // Logo primary accent orange
          gold: '#F79B48',
          marigold: '#F58220',
          terracotta: '#D96B0E',
          navy: '#132238', // Logo primary dark navy
          indigo: '#132238',
          deepBlue: '#0F1B2E',
          emerald: '#059669',
          sand: '#F8FAFC',
          cream: '#FFFFFF',
          charcoal: '#132238',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
