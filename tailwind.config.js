/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette sampled directly from the reference mobile screenshot.
        venmo: {
          blue: '#0074DE',
          blueHover: '#0063BE',
          blueDark: '#00539F',
          blueLight: '#E7F1FC',
        },
        ink: {
          DEFAULT: '#2F3032',
          muted: '#6B7076',
          soft: '#878C94',
          faint: '#A7A8A9',
        },
        surface: {
          page: '#F7F7F7',
          card: '#FFFFFF',
          hover: '#F2F4F7',
          // Field borders read as this once the reference hairline is
          // averaged over a whole CSS pixel.
          line: '#D7D9DB',
          app: '#E4E6EA',
          // Home feed chrome, sampled from the native-app reference.
          feed: '#EDEDEF',
          chip: '#F5F5F7',
          field: '#FBFBFC',
        },
        nav: {
          active: '#06269B',
          idle: '#0074DE',
          badge: '#D0242E',
        },
        meta: {
          // Connective words ("paid", "for") and the privacy/date line.
          soft: '#8F8F8F',
          privacy: '#666666',
        },
        state: {
          green: '#1DB954',
          red: '#E0245E',
          amber: '#F4A522',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display': ['64px', { lineHeight: '1', fontWeight: '700' }],
        'amount': ['40px', { lineHeight: '1.1', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        cardHover: '0 4px 12px rgba(0, 0, 0, 0.08)',
        dropdown: '0 8px 28px rgba(0, 0, 0, 0.12)',
        header: '0 1px 0 rgba(0, 0, 0, 0.06)',
        fab: '0 6px 20px rgba(0, 140, 255, 0.35)',
      },
      borderRadius: {
        pill: '999px',
        card: '14px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'check-draw': {
          '0%': { strokeDashoffset: '48' },
          '100%': { strokeDashoffset: '0' },
        },
        'spin-smooth': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        'check-draw': 'check-draw 0.5s ease-out forwards 0.2s',
        'spin-smooth': 'spin-smooth 0.8s linear infinite',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
