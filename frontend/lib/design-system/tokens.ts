// Indore Metro Strict Official 3-Color Design Tokens
// Palette extracted directly from Official Indore Metro Yellow-Navy-Silver Train Livery

export const tokens = {
  colors: {
    // 1. Primary Brand Accent: Indore Metro Train Yellow (#F59E0B, #FBBF24, #EAB308)
    yellow: {
      primary: '#F59E0B',
      bright: '#FBBF24',
      amber: '#EAB308',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeText: '#FBBF24',
      badgeBorder: 'rgba(245, 158, 11, 0.3)',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    // 2. Base Dark Theme: Deep Navy & Midnight Charcoal (#070A12, #0F172A, #1E293B)
    navy: {
      dark: '#070A12',
      panel: '#0F172A',
      border: '#1E293B',
      card: 'rgba(15, 23, 42, 0.7)',
    },
    // 3. Metallic Silver & Crisp Light Text (#F8FAFC, #CBD5E1, #94A3B8)
    silver: {
      light: '#F8FAFC',
      textMuted: '#CBD5E1',
      subtext: '#94A3B8',
      borderSubtle: 'rgba(226, 232, 240, 0.1)',
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
