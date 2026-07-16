// ============================================
// DESIGN SYSTEM - PartnerOps (Uber Style)
// ============================================
// This is the unified design system - use everywhere
// No hardcoded colors/spacing anywhere!

// 🎨 COLORS - Uber Style Colors
export const colors = {
  // Uber Primary Colors
  uberBlack: '#111111',
  uberBlue: '#1B76D2',
  uberYellow: '#FFCD11', // CAT Yellow for Equipment

  // Extended Palette
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F7F7F7',
    100: '#EBEBEB',
    200: '#D0D0D0',
    300: '#999999',
    400: '#666666',
    500: '#333333',
    900: '#111111',
  },

  // Semantic Colors
  success: '#12A754',
  danger: '#D0021B',
  warning: '#FFAA00',
  info: '#1B76D2',

  // Status Colors (for equipment/drivers)
  active: '#12A754',
  inactive: '#999999',
  pending: '#FFAA00',
  error: '#D0021B',

  // Text
  text: {
    primary: '#111111',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#CCCCCC',
    white: '#FFFFFF',
  },

  // Background
  bg: {
    white: '#FFFFFF',
    light: '#F7F7F7',
    gray: '#EBEBEB',
    dark: '#111111',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

// 🔤 TYPOGRAPHY
export const typography = {
  families: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  sizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
};

// 📐 SPACING - Consistent Spacing Scale
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
};

// 🎭 BORDER RADIUS
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};

// 🌊 SHADOWS - Uber Style Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  md: '0 2px 8px rgba(0, 0, 0, 0.12)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.16)',
  xl: '0 8px 24px rgba(0, 0, 0, 0.20)',
  '2xl': '0 12px 32px rgba(0, 0, 0, 0.24)',
};

// ⏱️ TRANSITIONS
export const transitions = {
  fast: '100ms ease-out',
  base: '200ms ease-out',
  slow: '300ms ease-out',
};

// 📱 BREAKPOINTS
export const breakpoints = {
  mobile: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// 🎯 SIZING
export const sizing = {
  // Button Heights
  button: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
    xl: '3.5rem',    // 56px
  },
  // Input Heights
  input: {
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem',
  },
  // Icon Sizes
  icon: {
    xs: '1rem',      // 16px
    sm: '1.25rem',   // 20px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '2.5rem',    // 40px
    '2xl': '3rem',   // 48px
  },
  // Sidebar Width
  sidebar: {
    compact: '200px',
    full: '280px',
  },
  // Header Height
  header: '64px',
  // Bottom Nav Height
  bottomNav: '80px',
};

// Helper: Get CSS variable name
export const cssVar = (name: string) => `var(--${name})`;

// Export all as const for type safety
export const DS = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  sizing,
} as const;

export default DS;
