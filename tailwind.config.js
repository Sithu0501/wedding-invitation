/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFDB73',
          400: '#FFD14D',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9C7D25',
          800: '#80641C',
          900: '#644B13',
        },
        emerald: {
          50: '#EAFAF2',
          100: '#C5F2DE',
          200: '#9AEAC6',
          300: '#6FDDB0',
          400: '#5DD9A0',
          500: '#2EAD70',
          600: '#27966A',
          700: '#208060',
          800: '#196A55',
          900: '#12544A',
        },
        ivory: '#FFFFF0',
        charcoal: '#2D2D2D',
        cream: '#FDF8F0',
        blush: '#F5E6E0',
        rose: {
          50: '#FFF0F3',
          100: '#FFD9E2',
          200: '#FFC2D1',
          300: '#FFABC0',
          400: '#FF94AF',
          500: '#E8738A',
          600: '#D15C73',
          700: '#BA455C',
          800: '#A32E45',
          900: '#8C172E',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-500px) rotate(720deg)', opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #2EAD70 0%, #5DD9A0 50%, #2EAD70 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(46,173,112,0.9) 0%, rgba(45,45,45,0.95) 100%)',
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.2)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
    },
  },
  plugins: [],
}