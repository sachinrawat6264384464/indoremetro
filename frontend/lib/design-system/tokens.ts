// Indore Metro Official Clean White & Yellow Theme Tokens

export const tokens = {
  colors: {
    // Primary Brand Accent: Indore Metro Yellow (#F59E0B, #D97706)
    yellow: {
      primary: '#F59E0B',
      hover: '#D97706',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      badgeBorder: '#FDE68A',
    },
    // Background & Surface: Clean White & Light Grey (#FFFFFF, #F8FAFC, #F1F5F9)
    surface: {
      bg: '#F8FAFC',
      card: '#FFFFFF',
      border: '#E2E8F0',
      header: 'rgba(255, 255, 255, 0.95)',
    },
    // Text Hierarchy: Deep Navy & Slate (#0F172A, #334155, #64748B)
    text: {
      heading: '#0F172A',
      body: '#334155',
      muted: '#64748B',
    },
  },
  typography: {
    fonts: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  zIndex: {
    dropdown: 1000,
    stickyNav: 1020,
    mapControls: 1030,
    modalBackdrop: 1040,
    modalContent: 1050,
    toast: 1060,
  },
} as const;
