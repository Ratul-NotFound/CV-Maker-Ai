import { getPalette } from './palette';
import { calculateContentDensity, getScaledValues, getA4PageStyle } from './contentScaler';

const MODERN_COUNT = 30;

function variationIndex(templateId, count) {
  return ((templateId - 1) % count);
}

export function generateModern(data, industry = 'technology', templateId) {
  const idx = variationIndex(templateId, MODERN_COUNT);
  const palette = getPalette(industry);
  
  // 30 WORLD-CLASS UNIQUE MODERN DESIGNS - Each template is completely differentiable
  const templates = [
    // TEMPLATE 1: Executive Diamond - Premium sidebar with geometric accent
    { 
      layout: 'sidebar-left-32', 
      colorScheme: 'executive', 
      headerStyle: 'hero', 
      font: 'roboto', 
      accentStyle: 'left-border',
      headerPadding: '40px 35px',
      sectionSpacing: '20px',
      entrySpacing: '16px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '10pt',
      lineHeight: '1.45',
      uniqueFeatures: {
        entryShadow: '0 2px 8px rgba(0,0,0,0.05)',
        cardStyle: true,
        headerShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    },
    
    // TEMPLATE 2: Teal Wave - Flowing gradient design
    { 
      layout: 'sidebar-left-35', 
      colorScheme: 'slate-teal', 
      headerStyle: 'split', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '10pt',
      lineHeight: '1.45',
      uniqueFeatures: {
        sectionBackground: 'rgba(45, 212, 191, 0.03)',
        roundedCorners: '8px'
      }
    },
    
    // TEMPLATE 3: Purple Fusion - Modern gradient with clip-path header
    { 
      layout: 'sidebar-left-30', 
      colorScheme: 'modern-gradient', 
      headerStyle: 'banner-full', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '38px 35px 30px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45',
      uniqueFeatures: {
        headerClipPath: true,
        accentGlow: '0 0 20px rgba(102, 126, 234, 0.2)'
      }
    },
    
    // TEMPLATE 4: Burgundy Classic - Elegant serif right-sidebar
    { 
      layout: 'sidebar-right-32', 
      colorScheme: 'burgundy', 
      headerStyle: 'centered', 
      font: 'georgia', 
      accentStyle: 'underline',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 5: Royal Impact - Wide sidebar with thick borders
    { 
      layout: 'sidebar-left-38', 
      colorScheme: 'royal-blue', 
      headerStyle: 'top-banner', 
      font: 'roboto', 
      accentStyle: 'thick-border',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 6: Violet Cosmos - Starry gradient hero header
    { 
      layout: 'sidebar-left-33', 
      colorScheme: 'charcoal-violet', 
      headerStyle: 'gradient-hero', 
      font: 'lato', 
      accentStyle: 'gradient-bar',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 7: Corporate Split - 60/40 dark split screen
    { 
      layout: 'split-screen-40-60', 
      colorScheme: 'modern-split', 
      headerStyle: 'split-header', 
      font: 'roboto', 
      accentStyle: 'vertical-line',
      headerPadding: '40px 50px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 8: Banner Executive - Full-width banner with border accent
    { 
      layout: 'banner-header', 
      colorScheme: 'executive-banner', 
      headerStyle: 'full-banner', 
      font: 'roboto', 
      accentStyle: 'horizontal-bar',
      headerPadding: '38px 35px 30px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 9: Tech Terminal - Monospace code-style dark theme
    { 
      layout: 'split-screen-35-65', 
      colorScheme: 'tech-modern', 
      headerStyle: 'split-header', 
      font: 'roboto-mono', 
      accentStyle: 'code-style',
      headerPadding: '40px 50px',
      sectionSpacing: '28px',
      entrySpacing: '14px',
      titleSize: '30px',
      sectionTitleSize: '18px',
      entryTitleSize: '17px',
      fontSize: '13px',
      lineHeight: '1.5',
      uniqueFeatures: {
        codeBlock: true,
        terminalBorders: '1px solid rgba(0, 255, 136, 0.3)',
        monoBackground: '#0a0e27'
      }
    },
    
    // TEMPLATE 10: Swiss Minimal - Clean two-column with subtle grid
    { 
      layout: 'top-header-two-col', 
      colorScheme: 'minimalist', 
      headerStyle: 'centered-clean', 
      font: 'helvetica', 
      accentStyle: 'minimal-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 11: Photo Luxury - Full sidebar photo with dark overlay
    { 
      layout: 'sidebar-photo-35', 
      colorScheme: 'photo-accent', 
      headerStyle: 'photo-sidebar', 
      font: 'didact', 
      accentStyle: 'photo-border',
      headerPadding: '40px 50px',
      sectionSpacing: '28px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '18px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 12: Gradient Hero - Large gradient header with decorative circles
    { 
      layout: 'gradient-header-split', 
      colorScheme: 'gradient-modern', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 13: Swiss Pure - Ultra minimal single column
    { 
      layout: 'minimalist-single', 
      colorScheme: 'swiss-clean', 
      headerStyle: 'minimal-top', 
      font: 'helvetica', 
      accentStyle: 'thin-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45',
      uniqueFeatures: {
        ultraClean: true,
        hairlineBorders: '0.5px solid #e0e0e0',
        maximumWhitespace: true
      }
    },
    
    // TEMPLATE 14: Scandi Light - Narrow sidebar with hover effects
    { 
      layout: 'minimalist-sidebar-25', 
      colorScheme: 'scandi-minimal', 
      headerStyle: 'clean-header', 
      font: 'roboto', 
      accentStyle: 'side-accent',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 15: Modern Grid - Two-column with gradient accents
    { 
      layout: 'clean-two-column', 
      colorScheme: 'modern-clean', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '38px 35px',
      sectionSpacing: '28px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '18px',
      entryTitleSize: '17px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 16: Academic Formal - Traditional serif centered layout
    { 
      layout: 'academic-formal', 
      colorScheme: 'traditional', 
      headerStyle: 'formal-centered', 
      font: 'times', 
      accentStyle: 'traditional-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 17: Timeline Progress - Vertical timeline with connecting dots
    { 
      layout: 'timeline-modern', 
      colorScheme: 'timeline-blue', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'timeline-dots',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45',
      uniqueFeatures: {
        timelineDots: true,
        verticalLine: 'gradient',
        dotGlow: '0 0 10px rgba(102, 126, 234, 0.5)'
      }
    },
    
    // TEMPLATE 18: Centered Elegance - Ultra minimal centered design
    { 
      layout: 'centered-minimalist', 
      colorScheme: 'ultra-minimal', 
      headerStyle: 'centered-elegant', 
      font: 'georgia', 
      accentStyle: 'understated',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 19: Bold Creative - Gradient sidebar with large hero
    { 
      layout: 'creative-bold-sidebar', 
      colorScheme: 'bold-creative', 
      headerStyle: 'creative-hero', 
      font: 'roboto', 
      accentStyle: 'bold-accent',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 20: Marketing Orange - Vibrant gradient banner with icons
    { 
      layout: 'marketing-modern', 
      colorScheme: 'marketing-orange', 
      headerStyle: 'marketing-banner', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '38px 35px 30px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 21: Design Portfolio - Minimal aesthetic with subtle accents
    { 
      layout: 'design-portfolio', 
      colorScheme: 'design-aesthetic', 
      headerStyle: 'minimal-top', 
      font: 'lato', 
      accentStyle: 'thin-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 22: Startup Energy - Vibrant gradient with modern spacing
    { 
      layout: 'startup-modern', 
      colorScheme: 'startup-vibrant', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 23: Agency Bold - Split header with gradient accents
    { 
      layout: 'agency-creative', 
      colorScheme: 'agency-bold', 
      headerStyle: 'creative-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 24: Freelance Pro - Clean two-column with soft colors
    { 
      layout: 'freelance-modern', 
      colorScheme: 'freelance-pro', 
      headerStyle: 'top-banner', 
      font: 'lato', 
      accentStyle: 'thick-border',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 25: Corporate Navy - Formal with numbered sections
    { 
      layout: 'corporate-executive', 
      colorScheme: 'corp-navy', 
      headerStyle: 'executive-formal', 
      font: 'times', 
      accentStyle: 'corporate-line',
      headerPadding: '38px 35px',
      sectionSpacing: '20px',
      entrySpacing: '16px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '12pt',
      lineHeight: '1.5',
      uniqueFeatures: {
        sectionNumbers: true,
        formalBorders: '2px solid #e8e8e8',
        premiumShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }
    },
    
    // TEMPLATE 26: Finance Professional - Conservative serif with borders
    { 
      layout: 'finance-professional', 
      colorScheme: 'finance-blue', 
      headerStyle: 'top-banner', 
      font: 'georgia', 
      accentStyle: 'thick-border',
      headerPadding: '38px 35px',
      sectionSpacing: '20px',
      entrySpacing: '16px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '12pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 27: Healthcare Modern - Gradient banner with professional spacing
    { 
      layout: 'healthcare-modern', 
      colorScheme: 'healthcare-blue', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 28: Legal Traditional - Classic serif with subtle accents
    { 
      layout: 'legal-traditional', 
      colorScheme: 'legal-formal', 
      headerStyle: 'formal-centered', 
      font: 'times', 
      accentStyle: 'traditional-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    },
    
    // TEMPLATE 29: Consulting Clean - Minimal white with precise typography
    { 
      layout: 'consulting-pro', 
      colorScheme: 'consulting-clean', 
      headerStyle: 'centered-clean', 
      font: 'roboto', 
      accentStyle: 'minimal-line',
      headerPadding: '38px 35px',
      sectionSpacing: '18px',
      entrySpacing: '15px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.45'
    },
    
    // TEMPLATE 30: Data Science - Dark tech theme with gradient effects
    { 
      layout: 'data-science', 
      colorScheme: 'tech-data', 
      headerStyle: 'gradient-hero', 
      font: 'roboto', 
      accentStyle: 'gradient-bar',
      headerPadding: '40px 35px',
      sectionSpacing: '18px',
      entrySpacing: '14px',
      titleSize: '28px',
      sectionTitleSize: '14px',
      entryTitleSize: '13px',
      fontSize: '11pt',
      lineHeight: '1.5'
    }
  ];
  
  const template = templates[idx];
  const hasSidebar = template.sidebarBg !== 'none';
  const isRightSidebar = template.layout.includes('right');
  
  // Premium color scheme definitions inspired by reference templates
  const colorSchemes = {
    executive: {
      headerBg: '#0f172a',
      headerText: '#f8fafc',
      sidebarBg: '#1e293b',
      sidebarText: '#e2e8f0',
      accentColor: '#3b82f6',
      sectionTitleColor: '#0f172a',
      highlightColor: '#60a5fa'
    },
    'slate-teal': {
      headerBg: '#134e4a',
      headerText: '#f0fdfa',
      sidebarBg: '#ccfbf1',
      sidebarText: '#115e59',
      accentColor: '#14b8a6',
      sectionTitleColor: '#0f766e',
      highlightColor: '#2dd4bf'
    },
    'modern-gradient': {
      headerBg: '#0c4a6e',
      headerText: '#e0f2fe',
      sidebarBg: '#bfdbfe',
      sidebarText: '#1e3a8a',
      accentColor: '#0ea5e9',
      sectionTitleColor: '#075985',
      highlightColor: '#38bdf8'
    },
    burgundy: {
      headerBg: '#7f1d1d',
      headerText: '#fef2f2',
      sidebarBg: '#fee2e2',
      sidebarText: '#7f1d1d',
      accentColor: '#dc2626',
      sectionTitleColor: '#991b1b',
      highlightColor: '#f87171'
    },
    'royal-blue': {
      headerBg: '#1e3a8a',
      headerText: '#dbeafe',
      sidebarBg: '#bfdbfe',
      sidebarText: '#1e3a8a',
      accentColor: '#2563eb',
      sectionTitleColor: '#1e40af',
      highlightColor: '#60a5fa'
    },
    'charcoal-violet': {
      headerBg: '#5b21b6',
      headerText: '#f5f3ff',
      sidebarBg: '#ddd6fe',
      sidebarText: '#5b21b6',
      accentColor: '#8b5cf6',
      sectionTitleColor: '#6b21a8',
      highlightColor: '#a78bfa'
    },
    'modern-split': {
      headerBg: '#0f172a',
      headerText: '#f1f5f9',
      sidebarBg: '#334155',
      sidebarText: '#cbd5e1',
      accentColor: '#60a5fa',
      sectionTitleColor: '#0f172a',
      highlightColor: '#94a3b8'
    },
    'executive-banner': {
      headerBg: '#18181b',
      headerText: '#ffffff',
      sidebarBg: '#fafafa',
      sidebarText: '#27272a',
      accentColor: '#3b82f6',
      sectionTitleColor: '#18181b',
      highlightColor: '#71717a'
    },
    'tech-modern': {
      headerBg: '#083344',
      headerText: '#cffafe',
      sidebarBg: '#155e75',
      sidebarText: '#a5f3fc',
      accentColor: '#06b6d4',
      sectionTitleColor: '#0e7490',
      highlightColor: '#22d3ee'
    },
    minimalist: {
      headerBg: '#ffffff',
      headerText: '#1e293b',
      sidebarBg: '#f8fafc',
      sidebarText: '#334155',
      accentColor: '#0f172a',
      sectionTitleColor: '#0f172a',
      highlightColor: '#64748b'
    },
    'photo-accent': {
      headerBg: '#18181b',
      headerText: '#ffffff',
      sidebarBg: '#27272a',
      sidebarText: '#fafafa',
      accentColor: '#f4f4f5',
      sectionTitleColor: '#18181b',
      highlightColor: '#a1a1aa'
    },
    'gradient-modern': {
      headerBg: '#1e40af',
      headerText: '#dbeafe',
      sidebarBg: '#bfdbfe',
      sidebarText: '#1e3a8a',
      accentColor: '#3b82f6',
      sectionTitleColor: '#1e40af',
      highlightColor: '#60a5fa'
    },
    'swiss-clean': {
      headerBg: '#ffffff',
      headerText: '#171717',
      sidebarBg: '#fafafa',
      sidebarText: '#404040',
      accentColor: '#171717',
      sectionTitleColor: '#0a0a0a',
      highlightColor: '#737373'
    },
    'scandi-minimal': {
      headerBg: '#fafaf9',
      headerText: '#1c1917',
      sidebarBg: '#ffffff',
      sidebarText: '#44403c',
      accentColor: '#292524',
      sectionTitleColor: '#1c1917',
      highlightColor: '#78716c'
    },
    'modern-clean': {
      headerBg: '#1e293b',
      headerText: '#ffffff',
      sidebarBg: '#f8fafc',
      sidebarText: '#1e293b',
      accentColor: '#2563eb',
      sectionTitleColor: '#0f172a',
      highlightColor: '#475569'
    },
    traditional: {
      headerBg: '#ffffff',
      headerText: '#1c1917',
      sidebarBg: '#fafaf9',
      sidebarText: '#44403c',
      accentColor: '#0a0a0a',
      sectionTitleColor: '#1c1917',
      highlightColor: '#78716c'
    },
    'timeline-blue': {
      headerBg: '#312e81',
      headerText: '#e0e7ff',
      sidebarBg: '#c7d2fe',
      sidebarText: '#3730a3',
      accentColor: '#6366f1',
      sectionTitleColor: '#4338ca',
      highlightColor: '#818cf8'
    },
    'ultra-minimal': {
      headerBg: '#f8fafc',
      headerText: '#0f172a',
      sidebarBg: '#ffffff',
      sidebarText: '#334155',
      accentColor: '#3b82f6',
      sectionTitleColor: '#0f172a',
      highlightColor: '#60a5fa'
    },
    'bold-creative': {
      headerBg: '#581c87',
      headerText: '#fae8ff',
      sidebarBg: '#e9d5ff',
      sidebarText: '#6b21a8',
      accentColor: '#a855f7',
      sectionTitleColor: '#7e22ce',
      highlightColor: '#c084fc'
    },
    'marketing-orange': {
      headerBg: '#065f46',
      headerText: '#d1fae5',
      sidebarBg: '#a7f3d0',
      sidebarText: '#065f46',
      accentColor: '#10b981',
      sectionTitleColor: '#047857',
      highlightColor: '#34d399'
    },
    'design-aesthetic': {
      headerBg: '#18181b',
      headerText: '#f5f5f5',
      sidebarBg: '#f5f5f5',
      sidebarText: '#27272a',
      accentColor: '#71717a',
      sectionTitleColor: '#3f3f46',
      highlightColor: '#a1a1aa'
    },
    'startup-vibrant': {
      headerBg: '#9f1239',
      headerText: '#ffe4e6',
      sidebarBg: '#fecdd3',
      sidebarText: '#9f1239',
      accentColor: '#f43f5e',
      sectionTitleColor: '#be123c',
      highlightColor: '#fb7185'
    },
    'agency-bold': {
      headerBg: '#9a3412',
      headerText: '#fed7aa',
      sidebarBg: '#fed7aa',
      sidebarText: '#9a3412',
      accentColor: '#f97316',
      sectionTitleColor: '#c2410c',
      highlightColor: '#fb923c'
    },
    'freelance-pro': {
      headerBg: '#78350f',
      headerText: '#fef3c7',
      sidebarBg: '#fde68a',
      sidebarText: '#78350f',
      accentColor: '#f59e0b',
      sectionTitleColor: '#b45309',
      highlightColor: '#fbbf24'
    },
    'corp-navy': {
      headerBg: '#1e3a8a',
      headerText: '#dbeafe',
      sidebarBg: '#93c5fd',
      sidebarText: '#1e3a8a',
      accentColor: '#2563eb',
      sectionTitleColor: '#1e40af',
      highlightColor: '#60a5fa'
    },
    'finance-blue': {
      headerBg: '#1e40af',
      headerText: '#dbeafe',
      sidebarBg: '#93c5fd',
      sidebarText: '#1e3a8a',
      accentColor: '#3b82f6',
      sectionTitleColor: '#1e40af',
      highlightColor: '#60a5fa'
    },
    'healthcare-blue': {
      headerBg: '#155e75',
      headerText: '#cffafe',
      sidebarBg: '#a5f3fc',
      sidebarText: '#155e75',
      accentColor: '#06b6d4',
      sectionTitleColor: '#0e7490',
      highlightColor: '#22d3ee'
    },
    'legal-formal': {
      headerBg: '#1c1917',
      headerText: '#fafaf9',
      sidebarBg: '#f5f5f4',
      sidebarText: '#44403c',
      accentColor: '#78716c',
      sectionTitleColor: '#292524',
      highlightColor: '#a8a29e'
    },
    'consulting-clean': {
      headerBg: '#0f172a',
      headerText: '#f1f5f9',
      sidebarBg: '#e2e8f0',
      sidebarText: '#334155',
      accentColor: '#475569',
      sectionTitleColor: '#1e293b',
      highlightColor: '#94a3b8'
    },
    'tech-data': {
      headerBg: '#0c4a6e',
      headerText: '#e0f2fe',
      sidebarBg: '#164e63',
      sidebarText: '#67e8f9',
      accentColor: '#0ea5e9',
      sectionTitleColor: '#0369a1',
      highlightColor: '#38bdf8'
    }
  };
  
  const colors = colorSchemes[template.colorScheme] || colorSchemes.executive;

  // Calculate sidebar width based on layout
  const getSidebarWidth = () => {
    if (!hasSidebar) return '0%';
    if (template.layout.includes('sidebar-left-32') || template.layout.includes('sidebar-right-32')) return '32%';
    if (template.layout.includes('sidebar-left-35') || template.layout.includes('sidebar-right-35')) return '35%';
    if (template.layout.includes('sidebar-left-30') || template.layout.includes('sidebar-right-30')) return '30%';
    if (template.layout.includes('sidebar-left-38')) return '38%';
    if (template.layout.includes('sidebar-left-33')) return '33%';
    if (template.layout.includes('split-screen-40-60')) return '40%';
    if (template.layout.includes('split-screen-35-65')) return '35%';
    if (template.layout.includes('minimalist-sidebar-25')) return '25%';
    if (template.layout.includes('photo-35')) return '35%';
    return '32%';
  };
  
  const sidebarWidth = getSidebarWidth();
  
  // Use universal content scaler for consistent A4 fitting
  const density = calculateContentDensity(data);
  const scaled = getScaledValues(density, {
    baseFontSize: '10pt',
    titleSize: '20pt',
    sectionTitleSize: '12pt',
    entryTitleSize: '11pt'
  });
  
  // Dynamic typography and spacing values from template
  const headerPadding = template.headerPadding || scaled.headerPadding;
  const sectionSpacing = template.sectionSpacing || scaled.sectionSpacing;
  const entrySpacing = template.entrySpacing || scaled.entrySpacing;
  const titleSize = scaled.titleSize;
  const sectionTitleSize = scaled.sectionTitleSize;
  const entryTitleSize = scaled.entryTitleSize;
  const baseFontSize = scaled.baseFontSize;
  const baseLineHeight = scaled.lineHeight;
  
  // Unique visual features per template
  const uniqueFeatures = template.uniqueFeatures || {};
  const entryShadow = uniqueFeatures.entryShadow || 'none';
  const cardStyle = uniqueFeatures.cardStyle || false;
  const sectionBackground = uniqueFeatures.sectionBackground || 'transparent';
  const roundedCorners = uniqueFeatures.roundedCorners || '0';
  const headerClipPath = uniqueFeatures.headerClipPath || false;
  const accentGlow = uniqueFeatures.accentGlow || 'none';
  const codeBlock = uniqueFeatures.codeBlock || false;
  const terminalBorders = uniqueFeatures.terminalBorders || 'none';
  const ultraClean = uniqueFeatures.ultraClean || false;
  const hairlineBorders = uniqueFeatures.hairlineBorders || 'none';
  const timelineDots = uniqueFeatures.timelineDots || false;
  const dotGlow = uniqueFeatures.dotGlow || 'none';
  const sectionNumbers = uniqueFeatures.sectionNumbers || false;
  const formalBorders = uniqueFeatures.formalBorders || 'none';
  const premiumShadow = uniqueFeatures.premiumShadow || 'none';
  
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&family=Lato:wght@300;400;700;900&family=Open+Sans:wght@300;400;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500;600;700&family=Georgia&family=Times&family=Didact+Gothic&family=Helvetica+Neue&family=Nunito:wght@300;400;600;700;800&family=Calibri&family=Garamond&display=swap');
    
    ${getA4PageStyle(density)}
    
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    body {
      font-family: '${template.font === 'inter' ? 'Inter' : template.font === 'roboto' ? 'Roboto' : template.font === 'lato' ? 'Lato' : template.font === 'opensans' ? 'Open Sans' : template.font === 'merriweather' ? 'Merriweather' : template.font === 'poppins' ? 'Poppins' : template.font === 'montserrat' ? 'Montserrat' : template.font === 'roboto-mono' ? 'Roboto Mono' : template.font === 'georgia' ? 'Georgia' : template.font === 'times' ? 'Times New Roman' : template.font === 'didact' ? 'Didact Gothic' : template.font === 'helvetica' ? 'Helvetica Neue' : template.font === 'helvetica-neue' ? 'Helvetica Neue' : template.font === 'nunito' ? 'Nunito' : template.font === 'calibri' ? 'Calibri' : template.font === 'garamond' ? 'Garamond' : template.font === 'arial' ? 'Arial' : 'Inter'}', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: ${baseFontSize};
      line-height: ${baseLineHeight};
      color: #2c3e50;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8eef2 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      background: white;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: ${colors.headerBg};
      color: ${colors.headerText};
      padding: ${headerPadding};
      min-height: ${data.includePhoto && data.photoUrl ? '200px' : 'auto'};
      display: flex;
      align-items: center;
      ${template.headerStyle === 'centered' || template.headerStyle === 'centered-clean' || template.headerStyle === 'centered-elegant' || template.headerStyle === 'formal-centered' ? 'text-align: center; justify-content: center;' : ''}
      ${template.layout.includes('banner-header') ? 'border-bottom: 2px solid ' + colors.accentColor + ';' : ''}
      position: relative;
    }
    
    ${template.headerStyle === 'gradient-hero' || template.headerStyle === 'creative-hero' ? `
    .header::before {
      content: "";
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      top: -100px;
      right: -100px;
    }
    ` : ''}
    
    ${codeBlock ? `
    .header::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 136, 0.03) 2px,
        rgba(0, 255, 136, 0.03) 4px
      );
      pointer-events: none;
    }
    ` : ''}
    
    .name {
      font-size: ${titleSize};
      font-weight: ${template.font === 'times' || template.font === 'georgia' || template.font === 'garamond' ? '400' : '700'};
      margin-bottom: ${parseInt(titleSize) > 44 ? '10px' : '8px'};
      letter-spacing: ${template.font === 'times' || template.font === 'georgia' ? '1px' : template.headerStyle === 'formal-centered' ? '2px' : '-0.5px'};
      line-height: 1.1;
      ${template.headerStyle === 'formal-centered' ? 'text-transform: uppercase;' : ''}
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    .title {
      font-size: ${parseInt(titleSize) > 44 ? '24px' : parseInt(titleSize) > 42 ? '22px' : '18px'};
      margin-bottom: ${template.headerStyle === 'centered' ? '25px' : '20px'};
      font-weight: ${template.font === 'times' || template.font === 'georgia' ? '300' : '500'};
      opacity: ${colors.headerText === '#ffffff' ? '0.95' : '0.85'};
      letter-spacing: ${template.headerStyle === 'formal-centered' ? '3px' : '0.5px'};
      ${template.headerStyle === 'formal-centered' ? 'text-transform: uppercase;' : ''}
      ${template.font === 'merriweather' || template.font === 'georgia' ? 'font-style: italic;' : ''}
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    .contact {
      font-size: ${parseInt(baseFontSize)}px;
      display: flex;
      ${template.headerStyle === 'centered' || template.headerStyle === 'centered-clean' || template.headerStyle === 'centered-elegant' || template.headerStyle === 'formal-centered' ? 'justify-content: center;' : ''}
      gap: ${parseInt(titleSize) > 44 ? '30px' : '25px'};
      flex-wrap: wrap;
      margin-top: ${template.headerStyle === 'centered' ? '25px' : '15px'};
      font-weight: 400;
      max-width: 100%;
      overflow: hidden;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: ${colors.headerText === '#ffffff' ? '0.9' : '0.8'};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .container {
      display: flex;
      ${isRightSidebar ? 'flex-direction: row-reverse;' : ''}
      min-height: ${template.layout.includes('banner-header') ? 'auto' : 'calc(297mm - 180px)'};
      flex: 1;
      overflow: hidden;
    }
    
    .sidebar {
      width: ${sidebarWidth};
      background: ${colors.sidebarBg};
      color: ${colors.sidebarText};
      padding: ${hasSidebar ? scaled.sidebarPadding : '0'};
      ${!hasSidebar ? 'display: none;' : ''}
      ${colors.sidebarText === '#ffffff' ? 'box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);' : ''}
      flex-shrink: 0;
      overflow: hidden;
    }
    
    ${template.layout === 'photo-sidebar-35' && colors.sidebarBg === '#222' ? `
    .sidebar::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 45%;
      background: #999;
      background-size: cover;
      background-position: center;
    }
    ` : ''}
    
    .main {
      flex: 1;
      padding: ${scaled.mainPadding};
      background: ${template.layout.includes('gradient') ? '#ffffff' : 'transparent'};
      overflow: hidden;
    }
    
    .section {
      margin-bottom: ${template.layout.includes('executive') ? '20px' : '18px'};
      page-break-inside: avoid;
      padding-bottom: 2px;
      ${sectionBackground !== 'transparent' ? 'background: ' + sectionBackground + '; padding: ' + (parseInt(scaled.sectionSpacing) / 1.5) + 'px; border-radius: ' + roundedCorners + ';' : ''}
      ${ultraClean ? 'margin-bottom: ' + sectionSpacing + ';' : ''}
    }
    
    .section-title {
      font-size: ${sectionTitleSize};
      font-weight: 700;
      color: ${colors.sectionTitleColor};
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: ${scaled.sectionTitleMargin};
      padding-bottom: ${parseInt(scaled.sectionTitleMargin) * 0.4}px;
      border-bottom: 1.5px solid ${colors.sectionTitleColor};
      display: flex;
      align-items: center;
    }
    
    ${template.accentStyle === 'gold-line' || template.accentStyle === 'professional' ? `
    .section-title::before {
      content: "";
      width: 40px;
      height: ${template.accentStyle === 'gold-line' ? '2px' : '4px'};
      background: ${template.accentStyle === 'gold-line' ? 'linear-gradient(90deg, ' + colors.accentColor + ', ' + colors.highlightColor + ')' : colors.accentColor};
      border-radius: 2px;
    }
    ` : ''}
    
    .sidebar .section-title {
      font-size: ${parseInt(sectionTitleSize) < 16 ? '12px' : parseInt(sectionTitleSize) - 2 + 'px'};
      color: ${colors.sidebarText};
      ${colors.sidebarText === '#ffffff' ? 'border-color: rgba(255,255,255,0.3);' : 'border-color: ' + colors.accentColor + ';'}
      ${template.layout.includes('minimalist') || parseInt(sectionTitleSize) < 16 ? 'text-transform: uppercase; letter-spacing: 1px;' : ''}
    }
    
    .profile-img {
      width: ${scaled.photoSize};
      height: ${scaled.photoSize};
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${colors.headerText === '#ffffff' ? 'rgba(255,255,255,0.3)' : '#cccccc'};
      margin: ${template.layout === 'photo-sidebar-35' ? '0 auto 15px' : '0'};
      display: ${template.layout === 'photo-sidebar-35' ? 'block' : 'inline-block'};
      flex-shrink: 0;
    }
    
    .entry {
      margin-bottom: ${template.layout.includes('executive') ? '16px' : '14px'};
      padding-bottom: ${template.layout.includes('executive') ? '4px' : '3px'};
      ${template.layout.includes('timeline') || template.accentStyle === 'timeline-dots' ? 'padding-left: 20px; position: relative;' : ''}
      ${template.layout.includes('executive') && !template.layout.includes('timeline') ? 'border-bottom: 1px solid #e5e7eb;' : ''}
      page-break-inside: avoid;
    }
    
    .entry:last-child {
      ${template.layout.includes('executive') || formalBorders !== 'none' ? 'border-bottom: none;' : ''}
    }
    
    ${template.layout.includes('timeline') || template.accentStyle === 'timeline-dots' ? `
    .entry::before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${colors.accentColor};
      ${colors.sidebarText === '#ffffff' ? 'background: white;' : ''}
      border: ${colors.sidebarText === '#ffffff' ? '3px solid ' + colors.accentColor : '3px solid white'};
      ${dotGlow !== 'none' ? 'box-shadow: ' + dotGlow + ';' : ''}
    }
    
    .entry::after {
      content: "";
      position: absolute;
      left: 5.5px;
      top: 20px;
      width: 1px;
      height: calc(100% + 10px);
      background: linear-gradient(180deg, ${colors.accentColor}, ${colors.highlightColor});
    }
    
    .entry:last-child::after {
      display: none;
    }
    ` : ''}
    
    ${template.layout.includes('minimalist') ? `
    .entry {
      padding-left: 20px;
      border-left: 2px solid #ecf0f1;
    }
    ` : ''}
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
      flex-wrap: wrap;
      gap: 10px;
      padding-bottom: 1px;
    }
    
    .entry-title {
      font-size: ${entryTitleSize};
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      letter-spacing: -0.01em;
      margin-bottom: 3px;
    }
    
    .entry-date {
      font-size: ${parseInt(baseFontSize) > 10 ? '11px' : '10px'};
      color: #64748b;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
      ${template.font === 'roboto-mono' ? 'font-family: "Roboto Mono", monospace; background: #f1f5f9; padding: 2px 5px; border-radius: 3px;' : ''}
      ${template.layout.includes('minimalist') ? 'font-style: italic;' : ''}
    }
    
    .entry-subtitle {
      font-size: ${parseInt(entryTitleSize) - 1}px;
      color: ${colors.accentColor};
      margin-bottom: 4px;
      font-weight: 600;
      ${template.font === 'merriweather' || template.font === 'georgia' || template.font === 'times' ? 'font-style: italic;' : ''}
      letter-spacing: 0;
      line-height: 1.4;
    }
    
    .entry-location {
      font-size: ${parseInt(baseFontSize) > 10 ? '11px' : '10px'};
      color: #64748b;
      margin-bottom: 6px;
      font-style: italic;
      font-weight: 500;
      line-height: 1.3;
    }
    
    .entry-description {
      font-size: ${baseFontSize};
      color: #475569;
      line-height: ${parseFloat(baseLineHeight) + 0.05};
      margin-top: ${scaled.entryMarginTop};
      text-align: left;
      font-weight: 400;
      letter-spacing: 0;
      ${scaled.descriptionMaxLines > 0 ? 'display: -webkit-box; -webkit-line-clamp: ' + scaled.descriptionMaxLines + '; -webkit-box-orient: vertical; overflow: hidden;' : ''}
    }
    
    .entry-description ul {
      margin-left: 18px;
      margin-top: 6px;
      margin-bottom: 6px;
      padding-left: 0;
      list-style: ${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'none' : 'disc'};
    }
    
    .entry-description li {
      margin-bottom: 4px;
      line-height: ${parseFloat(baseLineHeight) + 0.05};
      color: #475569;
      ${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'padding-left: 15px; position: relative;' : 'padding-left: 3px;'}
    }
    
    .entry-description ul li::marker {
      color: ${colors.accentColor};
      font-weight: 700;
    }
    
    ${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? `
    .entry-description li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: ${colors.accentColor};
      font-weight: bold;
    }
    ` : ''}
    
    .skill-item {
      display: block;
      margin-bottom: 5px;
      padding-left: 12px;
      position: relative;
      font-size: ${parseInt(baseFontSize)};
      font-weight: 400;
      color: ${colors.sidebarText};
      line-height: ${parseFloat(baseLineHeight)};
      ${template.font === 'roboto-mono' && (template.layout.includes('tech') || template.colorScheme === 'tech-data') ? 'font-family: "Roboto Mono", monospace;' : ''}
    }
    
    .skill-item::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      color: ${colors.accentColor};
      font-weight: 800;
      font-size: 16px;
      line-height: 1.2;
    }
    
    
    
    .sidebar-item {
      margin-bottom: ${template.layout.includes('executive') ? '10px' : '8px'};
      font-size: ${baseFontSize};
      line-height: ${parseFloat(baseLineHeight) - 0.05};
    }
    
    .sidebar-item strong {
      display: block;
      margin-bottom: ${template.layout.includes('minimalist') ? '4px' : '2px'};
      font-size: ${parseInt(baseFontSize) > 10 ? '12px' : template.layout.includes('executive') ? '12px' : '11px'};
      font-weight: ${template.font === 'times' || template.font === 'georgia' ? '600' : '700'};
      color: ${colors.sidebarText === '#ffffff' ? '#ffffff' : template.layout.includes('minimalist') ? '#0f172a' : colors.accentColor};
    }
    
    .sidebar-item-sub {
      font-size: 10px;
      color: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.85)' : '#64748b'};
      ${template.layout.includes('minimalist') ? 'margin-top: 2px;' : ''}
    }
    
    .progress-bar {
      height: ${template.layout.includes('minimalist') || template.layout.includes('executive') ? '5px' : '6px'};
      background: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.25)' : '#e2e8f0'};
      border-radius: ${template.layout.includes('minimalist') ? '2px' : '8px'};
      overflow: hidden;
      margin-top: ${template.layout.includes('minimalist') ? '6px' : '4px'};
    }
    
    .progress-fill {
      height: 100%;
      background: ${colors.sidebarText === '#ffffff' ? '#ffffff' : 'linear-gradient(90deg, ' + colors.accentColor + ' 0%, ' + colors.highlightColor + ' 100%)'};
      border-radius: ${template.layout.includes('minimalist') ? '2px' : '8px'};
      transition: width 0.3s ease;
    }
    
    ${template.layout.includes('corporate') || template.layout.includes('executive') ? `
    .section-number {
      font-size: 40px;
      color: ${colors.accentColor};
      font-weight: bold;
      margin-right: 15px;
      opacity: 0.2;
    }
    ` : ''}
    
    @page {
      size: A4;
      margin: 0;
    }
    
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      body {
        background: none;
        padding: 0;
        margin: 0;
      }
      
      .page {
        box-shadow: none;
        margin: 0;
        width: 210mm !important;
        height: 297mm !important;
        min-height: 297mm !important;
        max-height: 297mm !important;
        border-radius: 0;
        page-break-after: always;
        overflow: hidden !important;
        display: block;
      }
      
      .container {
        height: auto;
        max-height: none;
      }
      
      .main, .sidebar {
        overflow: visible;
      }
      
      .entry {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .section {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      .entry-header {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        break-after: avoid;
      }
      
      img {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      
      ${cardStyle ? `
      .entry {
        box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
      }
      ` : ''}
    }
  `;


  const sidebarContent = hasSidebar ? `
    <div class="sidebar">
      ${template.layout === 'photo-sidebar-35' && data.includePhoto && data.photoUrl ? `
        <div style="position: relative; z-index: 1; text-align: center; margin-bottom: 30px;">
          <img src="${data.photoUrl}" alt="${data.name || 'Profile Photo'}" class="profile-img" />
        </div>
      ` : ''}
      
      ${(data.skillsData && (data.skillsData.technical?.length > 0 || data.skillsData.soft?.length > 0 || data.skillsData.tools?.length > 0)) || (data.skills && data.skills.length > 0) ? `
        <div class="section">
          <div class="section-title">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'TECH STACK' : template.layout.includes('executive') ? 'CORE COMPETENCIES' : template.layout.includes('minimalist') ? 'SKILLS' : 'Skills & Expertise'}</div>
          
          ${data.skillsData ? `
            ${data.skillsData.technical && data.skillsData.technical.length > 0 ? `
              <div style="margin-bottom: ${density.isUltraHighDensity ? '8px' : '12px'};">
                <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.9)' : colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '4px' : '6px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '⚡ Technical' : '💻 Hard Skills'}</div>
                ${template.layout.includes('minimalist') || template.layout === 'healthcare-modern' ? 
                  `<ul style="list-style: none;">${data.skillsData.technical.map(skill => `<li class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(59, 130, 246, 0.15)' : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#60a5fa' : '#2563eb'};">${skill}</li>`).join('')}</ul>` :
                  data.skillsData.technical.map(skill => `<span class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(59, 130, 246, 0.15)' : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#60a5fa' : '#2563eb'};">${skill}</span>`).join('')
                }
              </div>
            ` : ''}
            
            ${data.skillsData.soft && data.skillsData.soft.length > 0 ? `
              <div style="margin-bottom: ${density.isUltraHighDensity ? '8px' : '12px'};">
                <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.9)' : colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '4px' : '6px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '🤝 Interpersonal' : '🎯 Soft Skills'}</div>
                ${template.layout.includes('minimalist') || template.layout === 'healthcare-modern' ? 
                  `<ul style="list-style: none;">${data.skillsData.soft.map(skill => `<li class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(34, 197, 94, 0.15)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(21, 128, 61, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#4ade80' : '#16a34a'};">${skill}</li>`).join('')}</ul>` :
                  data.skillsData.soft.map(skill => `<span class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(34, 197, 94, 0.15)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(21, 128, 61, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#4ade80' : '#16a34a'};">${skill}</span>`).join('')
                }
              </div>
            ` : ''}
            
            ${data.skillsData.tools && data.skillsData.tools.length > 0 ? `
              <div style="margin-bottom: ${density.isUltraHighDensity ? '8px' : '12px'};">
                <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.9)' : colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '4px' : '6px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '🛠️ Toolchain' : '🔧 Tools & Tech'}</div>
                ${template.layout.includes('minimalist') || template.layout === 'healthcare-modern' ? 
                  `<ul style="list-style: none;">${data.skillsData.tools.map(skill => `<li class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(168, 85, 247, 0.15)' : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(126, 34, 206, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#c084fc' : '#7e22ce'};">${skill}</li>`).join('')}</ul>` :
                  data.skillsData.tools.map(skill => `<span class="skill-item" style="background: ${colors.sidebarText === '#ffffff' ? 'rgba(168, 85, 247, 0.15)' : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(126, 34, 206, 0.08) 100%)'}; border-color: ${colors.sidebarText === '#ffffff' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.3)'}; color: ${colors.sidebarText === '#ffffff' ? '#c084fc' : '#7e22ce'};">${skill}</span>`).join('')
                }
              </div>
            ` : ''}
          ` : `
            ${template.layout.includes('minimalist') || template.layout === 'healthcare-modern' ? 
              `<ul style="list-style: none;">${data.skills.map(skill => `<li class="skill-item">${skill}</li>`).join('')}</ul>` :
              data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')
            }
          `}
        </div>
      ` : ''}
      
      ${data.languages && data.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">${template.layout.includes('minimalist') ? 'LANGUAGES' : 'Languages'}</div>
          ${data.languages.map(lang => {
            const proficiencyLevel = lang.proficiency === 'Native' || lang.proficiency === 'native' ? 100 : 
                                    lang.proficiency === 'Fluent' || lang.proficiency === 'fluent' ? 95 : 
                                    lang.proficiency === 'Advanced' || lang.proficiency === 'advanced' ? 85 : 
                                    lang.proficiency === 'Intermediate' || lang.proficiency === 'intermediate' ? 70 : 
                                    lang.proficiency === 'Basic' || lang.proficiency === 'basic' ? 50 : 
                                    lang.proficiency === 'Professional' || lang.proficiency === 'professional' ? 80 : 80;
            return `
            <div class="sidebar-item">
              <strong>${lang.language || lang.name || 'Language'}</strong>
              <div class="sidebar-item-sub">${lang.proficiency || 'Proficient'}</div>
              ${!template.layout.includes('minimalist') && !template.layout.includes('tech') ? `<div class="progress-bar"><div class="progress-fill" style="width: ${proficiencyLevel}%"></div></div>` : ''}
            </div>
          `;}).join('')}
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">${template.layout.includes('minimalist') ? 'CERTIFICATIONS' : template.layout.includes('healthcare') ? 'BOARD CERTIFICATIONS' : 'Certifications'}</div>
          ${data.certifications.map(cert => `
            <div class="sidebar-item">
              <strong>${cert.title || cert.name || 'Certification'}</strong>
              ${cert.issuer ? `<div class="sidebar-item-sub">${cert.issuer}</div>` : ''}
              ${cert.date ? `<div class="sidebar-item-sub">${cert.date}</div>` : ''}
              ${cert.credentialId ? `<div class="sidebar-item-sub" style="font-size: 11px; font-family: monospace; color: ${colors.sidebarText === '#ffffff' ? 'rgba(255,255,255,0.6)' : '#999'};">ID: ${cert.credentialId}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${template.layout === 'photo-sidebar-35' ? `
        <div class="section">
          <div class="section-title">CONTACT</div>
          <div class="sidebar-item" style="font-size: 13px; word-break: break-all;">
            ${data.email || 'email@example.com'}
          </div>
          ${data.phone ? `<div class="sidebar-item" style="font-size: 13px;">${data.phone}</div>` : ''}
          ${data.location ? `<div class="sidebar-item" style="font-size: 13px;">${data.location}</div>` : ''}
          ${data.address ? `<div class="sidebar-item" style="font-size: 13px;">${data.address}</div>` : ''}
          ${data.city && data.postalCode ? `<div class="sidebar-item" style="font-size: 13px;">${data.city} ${data.postalCode}</div>` : ''}
          ${data.linkedin ? `<div class="sidebar-item" style="font-size: 13px; word-break: break-all;">LinkedIn: ${data.linkedin}</div>` : ''}
          ${data.github ? `<div class="sidebar-item" style="font-size: 13px; word-break: break-all;">GitHub: ${data.github}</div>` : ''}
          ${data.website || data.portfolio ? `<div class="sidebar-item" style="font-size: 13px; word-break: break-all;">Website: ${data.website || data.portfolio}</div>` : ''}
          ${data.orcid ? `<div class="sidebar-item" style="font-size: 13px; word-break: break-all;">ORCID: ${data.orcid}</div>` : ''}
          ${data.nationality ? `<div class="sidebar-item" style="font-size: 13px;">Nationality: ${data.nationality}</div>` : ''}
          ${data.dob ? `<div class="sidebar-item" style="font-size: 13px;">DOB: ${data.dob}</div>` : ''}
        </div>
      ` : ''}
    </div>
  ` : '';
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.name || 'Professional CV'}</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          ${data.includePhoto && data.photoUrl && !template.layout.includes('photo-sidebar') && template.headerStyle !== 'banner-full' ? `
            <div style="display: flex; align-items: center; gap: ${template.headerStyle === 'hero' || template.headerStyle === 'gradient-hero' ? '30px' : '24px'}; width: 100%; max-width: 100%; ${template.headerStyle === 'centered' || template.headerStyle === 'centered-clean' || template.headerStyle === 'centered-elegant' || template.headerStyle === 'formal-centered' ? 'flex-direction: column; text-align: center;' : ''}">
              <img src="${data.photoUrl}" alt="${data.name || 'Profile Photo'}" class="profile-img" />
              <div style="flex: 1; min-width: 0; overflow: hidden; ${template.headerStyle === 'centered' || template.headerStyle === 'centered-clean' || template.headerStyle === 'centered-elegant' || template.headerStyle === 'formal-centered' ? 'text-align: center;' : ''}">
                <div class="name">${data.name || 'Your Name'}</div>
                <div class="title">${data.professionalTitle || 'Professional Title'}</div>
                ${!template.layout.includes('photo-sidebar') ? `
                <div class="contact">
                  ${data.email ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📧' : '✉'} ${data.email}</span>` : ''}
                  ${data.phone ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📱' : '☎'} ${data.phone}</span>` : ''}
                  ${data.location ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📍' : '📍'} ${data.location}</span>` : ''}
                  ${data.linkedin ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '💼' : '💼'} ${data.linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '').replace('linkedin.com/in/', '').replace('www.linkedin.com/in/', '')}</span>` : ''}
                  ${data.github ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '💻' : '💻'} ${data.github.replace('https://github.com/', '').replace('https://www.github.com/', '').replace('github.com/', '').replace('www.github.com/', '')}</span>` : ''}
                  ${data.website || data.portfolio ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '🌐' : '🌐'} ${(data.website || data.portfolio).replace('https://', '').replace('http://', '').replace('www.', '')}</span>` : ''}
                  ${data.orcid ? `<span class="contact-item">🔬 ${data.orcid.replace('https://orcid.org/', '').replace('orcid.org/', '')}</span>` : ''}
                </div>
                ` : ''}
              </div>
            </div>
          ` : `
            ${template.layout.includes('creative') || template.layout.includes('marketing') || template.layout.includes('bold') ? `
              <div style="display: grid; grid-template-columns: ${data.includePhoto && data.photoUrl ? '160px 1fr' : '1fr'}; gap: 30px; align-items: center;">
                ${data.includePhoto && data.photoUrl ? `
                  <div style="width: 160px; height: 160px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 64px; color: ${colors.accentColor}; font-weight: bold; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    ${(data.name || 'YN').split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                ` : ''}
                <div>
                  <div class="name">${data.name || 'Your Name'}</div>
                  <div class="title">${data.professionalTitle || 'Professional Title'}</div>
                  ${!template.layout.includes('photo-sidebar') ? `
                  <div class="contact">
                    ${data.email ? `<span class="contact-item">📧 ${data.email}</span>` : ''}
                    ${data.phone ? `<span class="contact-item">📱 ${data.phone}</span>` : ''}
                    ${data.location ? `<span class="contact-item">📍 ${data.location}</span>` : ''}
                    ${data.linkedin ? `<span class="contact-item">💼 ${data.linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '').replace('linkedin.com/in/', '').replace('www.linkedin.com/in/', '')}</span>` : ''}
                    ${data.github ? `<span class="contact-item">💻 ${data.github.replace('https://github.com/', '').replace('https://www.github.com/', '').replace('github.com/', '').replace('www.github.com/', '')}</span>` : ''}
                    ${data.website || data.portfolio ? `<span class="contact-item">🌐 ${(data.website || data.portfolio).replace('https://', '').replace('http://', '').replace('www.', '')}</span>` : ''}
                    ${data.orcid ? `<span class="contact-item">🔬 ${data.orcid.replace('https://orcid.org/', '').replace('orcid.org/', '')}</span>` : ''}
                  </div>
                  ` : ''}
                </div>
              </div>
            ` : `
              <div class="name">${data.name || 'Your Name'}</div>
              <div class="title">${data.professionalTitle || 'Professional Title'}</div>
              ${!template.layout.includes('photo-sidebar') ? `
              <div class="contact">
                ${data.email ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📧' : '✉'} ${data.email}</span>` : ''}
                ${data.phone ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📱' : '☎'} ${data.phone}</span>` : ''}
                ${data.location ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '📍' : '📍'} ${data.location}</span>` : ''}
                ${data.linkedin ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '💼' : '💼'} ${data.linkedin.replace('https://www.linkedin.com/in/', '').replace('https://linkedin.com/in/', '').replace('linkedin.com/in/', '').replace('www.linkedin.com/in/', '')}</span>` : ''}
                ${data.github ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '💻' : '💻'} ${data.github.replace('https://github.com/', '').replace('https://www.github.com/', '').replace('github.com/', '').replace('www.github.com/', '')}</span>` : ''}
                ${data.website || data.portfolio ? `<span class="contact-item">${template.layout.includes('tech') || template.colorScheme === 'tech-data' ? '🌐' : '🌐'} ${(data.website || data.portfolio).replace('https://', '').replace('http://', '').replace('www.', '')}</span>` : ''}
                ${data.orcid ? `<span class="contact-item">🔬 ${data.orcid.replace('https://orcid.org/', '').replace('orcid.org/', '')}</span>` : ''}
              </div>
              ` : ''}
            `}
          `}
        </div>
        
        <div class="container">
          ${sidebarContent}
          
          <div class="main">
            ${data.summary ? `
              <div class="section">
                ${template.layout.includes('corporate-executive') || template.layout.includes('finance') ? '<span class="section-number">01</span>' : ''}
                <div class="section-title">${template.layout.includes('minimalist') ? 'PROFILE' : template.layout.includes('executive') || template.layout.includes('corporate') ? 'Executive Summary' : template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'System.out.println("About Me")' : template.layout.includes('marketing') || template.layout.includes('creative') ? 'About Me' : 'Professional Summary'}</div>
                <div class="entry-description">${data.summary}</div>
              </div>
            ` : ''}
            
            ${data.experience && data.experience.length > 0 ? `
              <div class="section">
                ${template.layout.includes('corporate-executive') || template.layout.includes('finance') ? '<span class="section-number">02</span>' : ''}
                <div class="section-title">${template.layout.includes('minimalist') ? 'EXPERIENCE' : template.layout.includes('executive') || template.layout.includes('corporate') ? 'Professional Experience' : template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'git log --experience' : template.layout.includes('healthcare') ? 'Clinical Experience' : template.layout.includes('timeline') ? 'Work Timeline' : 'Work Experience'}</div>
                ${data.experience.map((exp, idx) => `
                  <div class="entry">
                    <div class="entry-header">
                      <div>
                        <div class="entry-title">${exp.position || 'Position'}</div>
                        ${exp.company ? `<div class="entry-subtitle">${exp.company}</div>` : ''}
                      </div>
                      <div class="entry-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                    </div>
                    ${exp.location ? `<div class="entry-location">${exp.location}</div>` : ''}
                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.education && data.education.length > 0 ? `
              <div class="section">
                ${template.layout.includes('corporate-executive') || template.layout.includes('finance') ? '<span class="section-number">03</span>' : ''}
                <div class="section-title">${template.layout.includes('minimalist') ? 'EDUCATION' : template.layout.includes('executive') || template.layout.includes('corporate') ? 'Education & Credentials' : template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'cat education.log' : template.layout.includes('healthcare') ? 'Education & Training' : 'Education'}</div>
                ${data.education.map(edu => `
                  <div class="entry">
                    <div class="entry-header">
                      <div>
                        <div class="entry-title">${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}</div>
                        ${edu.institution ? `<div class="entry-subtitle">${edu.institution}</div>` : ''}
                        ${edu.grade ? `<div class="entry-subtitle" style="color: ${colors.accentColor}; font-weight: 600; margin-top: 4px;">Grade: ${edu.grade}</div>` : ''}
                      </div>
                      <div class="entry-date">${edu.startDate || ''} ${edu.endDate ? '- ' + edu.endDate : ''}</div>
                    </div>
                    ${edu.location ? `<div class="entry-location">${edu.location}</div>` : ''}
                    ${edu.thesis ? `<div class="entry-description"><strong>Thesis:</strong> ${edu.thesis}</div>` : ''}
                    ${edu.description ? `<div class="entry-description">${edu.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${!hasSidebar && ((data.skillsData && (data.skillsData.technical?.length > 0 || data.skillsData.soft?.length > 0 || data.skillsData.tools?.length > 0)) || (data.skills && data.skills.length > 0)) ? `
              <div class="section">
                ${template.layout.includes('corporate-executive') || template.layout.includes('finance') ? '<span class="section-number">04</span>' : ''}
                <div class="section-title">${template.layout.includes('minimalist') ? 'SKILLS' : template.layout.includes('executive') || template.layout.includes('corporate') ? 'Core Competencies' : template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'ls /skills/*' : 'Skills & Technologies'}</div>
                ${data.skillsData ? `
                  ${data.skillsData.technical && data.skillsData.technical.length > 0 ? `
                    <div style="margin-bottom: ${density.isUltraHighDensity ? '10px' : '15px'};">
                      <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '5px' : '8px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '⚡ Technical Skills' : '💻 Hard Skills'}</div>
                      <div>${data.skillsData.technical.map(skill => `<span class="skill-item" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.08) 100%); border-color: rgba(59, 130, 246, 0.3); color: #2563eb;">${skill}</span>`).join('')}</div>
                    </div>
                  ` : ''}
                  ${data.skillsData.soft && data.skillsData.soft.length > 0 ? `
                    <div style="margin-bottom: ${density.isUltraHighDensity ? '10px' : '15px'};">
                      <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '5px' : '8px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '🤝 Interpersonal Skills' : '🎯 Soft Skills'}</div>
                      <div>${data.skillsData.soft.map(skill => `<span class="skill-item" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(21, 128, 61, 0.08) 100%); border-color: rgba(34, 197, 94, 0.3); color: #16a34a;">${skill}</span>`).join('')}</div>
                    </div>
                  ` : ''}
                  ${data.skillsData.tools && data.skillsData.tools.length > 0 ? `
                    <div style="margin-bottom: ${density.isUltraHighDensity ? '10px' : '15px'};">
                      <div style="font-size: ${parseInt(baseFontSize) - 1}px; font-weight: 600; color: ${colors.accentColor}; margin-bottom: ${density.isUltraHighDensity ? '5px' : '8px'}; text-transform: uppercase; letter-spacing: 0.5px;">${template.layout.includes('tech') ? '🛠️ Development Tools' : '🔧 Tools & Technologies'}</div>
                      <div>${data.skillsData.tools.map(skill => `<span class="skill-item" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(126, 34, 206, 0.08) 100%); border-color: rgba(168, 85, 247, 0.3); color: #7e22ce;">${skill}</span>`).join('')}</div>
                    </div>
                  ` : ''}
                ` : `
                  <div>${data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}</div>
                `}
              </div>
            ` : ''}
            
            ${!hasSidebar && data.certifications && data.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">${template.layout.includes('minimalist') ? 'CERTIFICATIONS' : template.layout.includes('healthcare') ? 'Board Certifications' : 'Certifications & Awards'}</div>
                ${data.certifications.map(cert => `
                  <div class="entry">
                    <div class="entry-title">${cert.title || cert.name || 'Certification'}</div>
                    ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
                    ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
                    ${cert.credentialId ? `<div style="font-size: 12px; color: #666; margin-top: 5px; font-family: monospace;">Credential ID: ${cert.credentialId}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.projects && data.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">${template.layout.includes('minimalist') ? 'PROJECTS' : template.layout.includes('tech') || template.colorScheme === 'tech-data' ? 'ls /projects/*' : template.layout.includes('creative') ? 'Portfolio Projects' : 'Key Projects'}</div>
                ${data.projects.map(project => `
                  <div class="entry">
                    <div class="entry-header">
                      <div>
                        <div class="entry-title">${project.name || 'Project Name'}</div>
                        ${project.technologies ? `<div class="entry-subtitle">Technologies: ${Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}</div>` : ''}
                      </div>
                      ${project.link ? `<div class="entry-date" style="font-size: 11px; opacity: 0.7;">🔗</div>` : ''}
                    </div>
                    ${project.description ? `<div class="entry-description">${project.description}</div>` : ''}
                    ${project.link ? `<div style="font-size: ${parseInt(baseFontSize) - 1}px; color: ${colors.accentColor}; margin-top: ${scaled.entryMarginTop}; word-break: break-all; font-family: monospace;">🔗 ${project.link.replace('https://', '').replace('http://', '')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.publications && data.publications.length > 0 ? `
              <div class="section">
                <div class="section-title">${template.layout.includes('minimalist') ? 'PUBLICATIONS' : template.layout.includes('healthcare') ? 'Research & Publications' : template.layout.includes('academic') || template.layout.includes('scopus') ? 'Academic Publications' : 'Publications'}</div>
                ${data.publications.map((pub, idx) => `
                  <div class="entry">
                    <div class="entry-title">${pub.title || 'Publication Title'}</div>
                    ${pub.authors ? `<div class="entry-subtitle" style="font-style: italic;">${pub.authors}</div>` : ''}
                    ${pub.journal ? `<div class="entry-subtitle">${pub.journal}${pub.year ? `, ${pub.year}` : ''}</div>` : (pub.year ? `<div class="entry-subtitle">${pub.year}</div>` : '')}
                    ${pub.doi ? `<div style="font-size: ${parseInt(baseFontSize) - 1}px; color: #666; margin-top: 5px; font-family: monospace;">DOI: ${pub.doi}</div>` : ''}
                    ${pub.link ? `<div style="font-size: ${parseInt(baseFontSize) - 1}px; color: ${colors.accentColor}; margin-top: 5px; word-break: break-all; font-family: monospace;">🔗 ${pub.link.replace('https://', '').replace('http://', '')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

export function modernMeta() {
  return { archetype: 'modern', total: MODERN_COUNT };
} 
