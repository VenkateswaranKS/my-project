/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff8ed',
          100: '#ffefd2',
          200: '#ffdba4',
          300: '#ffc06d',
          400: '#ff9a33',
          500: '#ff7a0a',
          600: '#f05d00',
          700: '#c74700',
          800: '#9e3a06',
          900: '#7f330a',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0b9c8',
          400: '#8492a8',
          500: '#64748b',
          600: '#4d5a70',
          700: '#3e4859',
          800: '#363f4d',
          900: '#1f2530',
          950: '#131720',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,23,32,0.04), 0 8px 24px rgba(19,23,32,0.06)',
        'card-hover': '0 4px 8px rgba(19,23,32,0.06), 0 16px 40px rgba(19,23,32,0.12)',
        pop: '0 12px 32px rgba(240,93,0,0.28)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pop-qty': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.22,1,0.36,1) both',
        'pop-qty': 'pop-qty 0.3s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
