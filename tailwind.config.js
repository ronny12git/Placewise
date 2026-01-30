/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Placewise Brand Colors - Success Green Theme
        primary: {
          50: '#ecfdf5',   // Very light green
          100: '#d1fae5',  // Light green
          200: '#a7f3d0',  // Lighter green
          300: '#6ee7b7',  // Light-medium green
          400: '#34d399',  // Medium green
          500: '#10b981',  // Primary brand color (Emerald)
          600: '#059669',  // Dark green (hover states)
          700: '#047857',  // Darker green
          800: '#065f46',  // Very dark green
          900: '#064e3b',  // Almost black green
        },
        // Secondary/Accent colors
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // Teal accent
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Keep success, warning, error colors
        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(16, 185, 129, 0.15)',
        'brand-lg': '0 10px 40px 0 rgba(16, 185, 129, 0.20)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-accent': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      },
    },
  },
  plugins: [],
};