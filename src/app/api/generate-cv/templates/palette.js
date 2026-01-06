// FORMAL PROFESSIONAL COLOR PALETTES - Inspired by Fortune 500, McKinsey, Goldman Sachs, Top Law Firms
// Corporate, Conservative, Formal color schemes suitable for professional CVs/Resumes
// Each palette uses muted, sophisticated colors - NO bright/vibrant colors
export const INDUSTRY_PALETTES = {
  technology: { 
    primary: '#1d4ed8',      // Modern Navy
    secondary: '#0f172a',    // Deep Charcoal
    tertiary: '#475569',     // Slate Gray
    accent: '#06b6d4',       // Clean Teal
    dark: '#0b1220',         // Midnight
    light: '#f5f7fb',        // Off-White
    bg: '#ffffff',           // Pure White
    text: '#0b1220',         // Near Black
    muted: '#64748b',        // Medium Gray
    neutral: '#e2e8f0',      // Light Gray
    complement: '#22c55e'    // Emerald Accent
  },
  finance: { 
    primary: '#0f3e2c',      // Deep Forest
    secondary: '#7c5a2f',    // Aged Bronze
    tertiary: '#1f3a8a',     // Trust Navy
    accent: '#b45309',       // Muted Gold
    dark: '#0b0f0a',         // Near Black
    light: '#f7f5f2',        // Warm White
    bg: '#ffffff',           // Pure White
    text: '#0b0f0a',         // Near Black
    muted: '#6b665d',        // Warm Gray
    neutral: '#e8e3d9',      // Stone Gray
    complement: '#8c6d1f'    // Brass Accent
  },
  healthcare: { 
    primary: '#0f4c81',      // Medical Navy
    secondary: '#0b7285',    // Teal Deep
    tertiary: '#0f766e',     // Calm Green-Teal
    accent: '#38bdf8',       // Sky Accent
    dark: '#0a2f4f',         // Deep Blue
    light: '#f3f9fd',        // Clinical White
    bg: '#ffffff',           // Pure White
    text: '#0a2f4f',         // Medical Text
    muted: '#5b718c',        // Professional Gray
    neutral: '#d9e8f5',      // Light Blue
    complement: '#0f9fb6'    // Aqua Accent
  },
  education: { 
    primary: '#1d4ed8',      // Academic Blue
    secondary: '#4338ca',    // Royal Purple
    tertiary: '#6d28d9',     // Deep Purple
    accent: '#2563eb',       // Indigo Bright
    dark: '#1e1b4b',         // Dark Indigo
    light: '#f5f3ff',        // Lavender White
    bg: '#ffffff',           // Pure White
    text: '#1e1b4b',         // Dark Indigo
    muted: '#475569',        // Neutral Gray
    neutral: '#e0e7ff',      // Light Indigo
    complement: '#b45309'    // Scholar Gold
  },
  marketing: { 
    primary: '#b4233b',      // Refined Burgundy
    secondary: '#9a3412',    // Burnt Amber
    tertiary: '#8b1e74',     // Deep Rose Violet
    accent: '#c26b2b',       // Muted Gold
    dark: '#3f0a14',         // Deep Red
    light: '#fff4f5',        // Soft Blush
    bg: '#ffffff',           // Pure White
    text: '#3f0a14',         // Dark Red
    muted: '#7a6161',        // Warm Gray
    neutral: '#fde7ea',      // Blush
    complement: '#a16207'    // Bronze
  },
  engineering: { 
    primary: '#0f172a',      // Engineering Black
    secondary: '#1e3a8a',    // Technical Blue
    tertiary: '#b45309',     // Industrial Amber
    accent: '#334155',       // Steel Gray
    dark: '#020617',         // Carbon Black
    light: '#f1f5f9',        // Metal White
    bg: '#ffffff',           // Pure White
    text: '#0f172a',         // Engineering Black
    muted: '#475569',        // Industrial Gray
    neutral: '#cbd5e1',      // Light Steel
    complement: '#0ea5e9'    // Blueprint Blue
  },
  law: { 
    primary: '#1c2e4a',      // Attorney Navy
    secondary: '#735026',    // Legal Bronze
    tertiary: '#1f2937',     // Barrister Gray
    accent: '#b45309',       // Justice Gold
    dark: '#0b0d10',         // Judge Black
    light: '#f7f6f3',        // Court White
    bg: '#ffffff',           // Pure White
    text: '#0b0d10',         // Legal Black
    muted: '#4b5563',        // Professional Gray
    neutral: '#e5e7eb',      // Document Gray
    complement: '#8b5e34'    // Gavel Brown
  },
  creative: { 
    primary: '#5b21b6',      // Deep Purple
    secondary: '#1e3a8a',    // Navy Blue
    tertiary: '#4338ca',     // Indigo
    accent: '#7c3aed',       // Bright Indigo
    dark: '#312e81',         // Dark Indigo
    light: '#f7f2ff',        // Violet Tint
    bg: '#ffffff',           // Pure White
    text: '#1f1b4d',         // Dark Indigo
    muted: '#6b7280',        // Neutral Gray
    neutral: '#ede9fe',      // Indigo Light
    complement: '#b45309'    // Bronze Accent
  },
  research: { 
    primary: '#0f4c81',      // Deep Academic Blue
    secondary: '#1e3a8a',    // Royal Blue
    tertiary: '#0f766e',     // Cyan Dark
    accent: '#0284c7',       // Sky Blue
    dark: '#0f172a',         // Slate Black
    light: '#f0f7ff',        // Sky Tint
    bg: '#ffffff',           // Pure White
    text: '#0f172a',         // Near Black
    muted: '#475569',        // Slate Gray
    neutral: '#dbeafe',      // Blue Light
    complement: '#b45309'    // Scholar Gold
  },
  consulting: { 
    primary: '#1d3557',      // Consulting Navy
    secondary: '#8c5a2e',    // Professional Bronze
    tertiary: '#2f3e56',     // Charcoal
    accent: '#4b5563',       // Slate Medium
    dark: '#0f172a',         // Near Black
    light: '#f5f7fb',        // Slate White
    bg: '#ffffff',           // Pure White
    text: '#0f172a',         // Near Black
    muted: '#475569',        // Medium Gray
    neutral: '#e2e8f0',      // Light Gray
    complement: '#b45309'    // Gold Accent
  }
};

export function getPalette(industry = 'technology') {
  return INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
}
