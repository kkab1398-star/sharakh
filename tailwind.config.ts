import type { Config } from 'tailwindcss';
import { colors, spacing, borderRadius, shadows, sizing } from './lib/design-system';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Uber Style Primary
        primary: colors.uberBlack,
        secondary: colors.uberBlue,
        accent: colors.uberYellow,

        // Extended palette
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
        info: colors.info,

        // Legacy CAT System (for compatibility)
        cat: {
          yellow: colors.uberYellow,
          black: colors.uberBlack,
          dark: colors.uberBlack,
          red: colors.danger,
          green: colors.success,
          white: colors.white,
          muted: colors.text.tertiary,
          gray: colors.gray[500],
          mid: colors.gray[400],
          light: colors.gray[50],
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        barlow: ['Barlow Condensed', 'sans-serif'],
        sans: ['Cairo', 'Barlow Condensed', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '20px' }],
        lg: ['18px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '36px' }],
      },
      spacing: {
        ...spacing,
        // Legacy 4px grid system
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        ...borderRadius,
        // Legacy aliases
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        ...shadows,
        // Legacy aliases
        xs: shadows.sm,
        'yellow-glow': '0 4px 12px rgba(255, 205, 17, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-in-right': 'slideInFromRight 300ms ease-out',
        'slide-in-left': 'slideInFromLeft 300ms ease-out',
        'spin-slow': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shake: 'shake 400ms ease-in-out',
        'scale-in': 'scaleIn 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideInFromRight: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        slideInFromLeft: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        scaleIn: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      transitionDuration: {
        200: '200ms',
        300: '300ms',
        400: '400ms',
      },
      zIndex: {
        0: '0',
        10: '10',
        20: '20',
        30: '30',
        40: '40',
        50: '50',
        auto: 'auto',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // Responsive utilities for RTL support
    function ({ addUtilities }: any) {
      const rtlUtilities = {
        '.rtl-grid': {
          direction: 'rtl',
        },
        '.ltr-text': {
          direction: 'ltr',
        },
        '.flex-row-reverse-rtl': {
          '@media (dir: rtl)': {
            flexDirection: 'row-reverse',
          },
        },
      };
      addUtilities(rtlUtilities);
    },
  ],
};

export default config;
