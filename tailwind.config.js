/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:  '#0A0E1A',
          surface:  '#111827',
          elevated: '#1C2333',
          hover:    '#232D42',
        },
        accent: {
          blue:           '#4F8EF7',
          'blue-hover':   '#6BA3F9',
          purple:         '#7C3AED',
          'purple-hover': '#8B5CF6',
        },
        nawer: {
          success:          '#10B981',
          warning:          '#F59E0B',
          error:            '#EF4444',
          'text-primary':   '#F1F5F9',
          'text-secondary': '#94A3B8',
          'text-muted':     '#475569',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          active:  'rgba(79,142,247,0.4)',
        },
      },
      fontFamily: {
        ui:      ['IBM Plex Sans', 'sans-serif'],
        content: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        elevated:    '0 8px 32px rgba(0,0,0,0.6)',
        'glow-blue': '0 0 20px rgba(79,142,247,0.2)',
      },
    },
  },
  plugins: [],
}
