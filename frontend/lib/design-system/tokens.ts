// Indore Metro Design System Tokens

export const tokens = {
  colors: {
    brand: {
      navyDark: '#070A12',
      navyPanel: '#0F172A',
      navyBorder: '#1E293B',
      primary: '#3B82F6', // Metro Blue
      primaryHover: '#2563EB',
      accentAmber: '#F59E0B', // Yellow Line Accent
      accentTeal: '#0D9488',
      emeraldSuccess: '#10B981',
      roseDanger: '#EF4444',
    },
    lines: {
      yellow: {
        hex: '#F59E0B',
        name: 'Yellow Line (Priority Corridor)',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
        badgeText: '#FBBF24',
        badgeBorder: 'rgba(245, 158, 11, 0.3)',
      },
      blue: {
        hex: '#3B82F6',
        name: 'Blue Line (Proposed)',
        badgeBg: 'rgba(59, 130, 246, 0.15)',
        badgeText: '#60A5FA',
        badgeBorder: 'rgba(59, 130, 246, 0.3)',
      },
    },
    status: {
      operational: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
      testing: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
      under_construction: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
      planned: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
      disrupted: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
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

export type LineKey = keyof typeof tokens.colors.lines;
export type StatusKey = keyof typeof tokens.colors.status;
