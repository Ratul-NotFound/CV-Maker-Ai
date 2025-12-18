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
        ai: {
          primary: '#3b82f6',   // AI Blue
          secondary: '#8b5cf6', // Violet
          accent: '#06b6d4',    // Cyan
          dark: '#020617',      // Deep Slate
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'border-rotate': 'rotate-gradient 6s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' },
        },
        'rotate-gradient': {
          'to': { '--angle': '360deg' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.bg-angle': {
          'background-image': 'linear-gradient(var(--angle), var(--tw-gradient-stops))',
        },
      })
    },
  ],
}