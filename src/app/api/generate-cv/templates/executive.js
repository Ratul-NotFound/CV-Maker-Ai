import { getPalette } from './palette';
import { calculateContentDensity, getScaledValues, getA4PageStyle } from './contentScaler';

const EXECUTIVE_COUNT = 30;

function variationIndex(templateId, count) {
  return ((templateId - 1) % count);
}

export function generateExecutive(data, industry = 'consulting', templateId) {
  const idx = variationIndex(templateId, EXECUTIVE_COUNT);
  const palette = getPalette(industry);
  
  // 30 premium executive designs inspired by Fortune 500 standards
  const templates = [
    // Classic Premium (1-6) - Navy/Gold Corporate
    { layout: 'sidebar-left', sidebarWidth: '32%', headerStyle: 'gradient-full', colorScheme: 'navy-gold', prestige: 'executive' },
    { layout: 'sidebar-left', sidebarWidth: '30%', headerStyle: 'solid-block', colorScheme: 'charcoal-teal', prestige: 'executive' },
    { layout: 'sidebar-left', sidebarWidth: '35%', headerStyle: 'gradient-full', colorScheme: 'slate-blue', prestige: 'executive' },
    { layout: 'full-width', sidebarWidth: '0%', headerStyle: 'centered-border', colorScheme: 'monochrome', prestige: 'ceo' },
    { layout: 'sidebar-left', sidebarWidth: '33%', headerStyle: 'gradient-full', colorScheme: 'burgundy-cream', prestige: 'executive' },
    { layout: 'sidebar-left', sidebarWidth: '28%', headerStyle: 'solid-block', colorScheme: 'forest-green', prestige: 'executive' },
    
    // Modern Split (7-12) - Split screen designs
    { layout: 'split-screen', sidebarWidth: '35%', headerStyle: 'full-color', colorScheme: 'royal-blue', prestige: 'partner' },
    { layout: 'split-screen', sidebarWidth: '40%', headerStyle: 'full-color', colorScheme: 'charcoal-violet', prestige: 'partner' },
    { layout: 'split-screen', sidebarWidth: '35%', headerStyle: 'full-color', colorScheme: 'swiss-red', prestige: 'partner' },
    { layout: 'split-screen', sidebarWidth: '38%', headerStyle: 'full-color', colorScheme: 'earth-tone', prestige: 'partner' },
    { layout: 'split-screen', sidebarWidth: '42%', headerStyle: 'full-color', colorScheme: 'navy-bronze', prestige: 'partner' },
    { layout: 'split-screen', sidebarWidth: '36%', headerStyle: 'full-color', colorScheme: 'teal-dark', prestige: 'partner' },
    
    // Banner Style (13-18) - Top banner with content below
    { layout: 'banner-top', sidebarWidth: '35%', headerStyle: 'banner-full', colorScheme: 'executive-navy', prestige: 'cfo' },
    { layout: 'banner-top', sidebarWidth: '0%', headerStyle: 'banner-gradient', colorScheme: 'gradient-purple', prestige: 'cfo' },
    { layout: 'banner-top', sidebarWidth: '32%', headerStyle: 'banner-full', colorScheme: 'healthcare-blue', prestige: 'director' },
    { layout: 'banner-top', sidebarWidth: '0%', headerStyle: 'banner-solid', colorScheme: 'classic-navy', prestige: 'director' },
    { layout: 'banner-top', sidebarWidth: '38%', headerStyle: 'banner-gradient', colorScheme: 'marketing-orange', prestige: 'director' },
    { layout: 'banner-top', sidebarWidth: '35%', headerStyle: 'banner-full', colorScheme: 'medical-cyan', prestige: 'director' },
    
    // Terminal/Tech (19-21) - Developer focused
    { layout: 'terminal-style', sidebarWidth: '35%', headerStyle: 'code-block', colorScheme: 'dark-terminal', prestige: 'tech-lead' },
    { layout: 'terminal-style', sidebarWidth: '0%', headerStyle: 'code-header', colorScheme: 'cyber-green', prestige: 'tech-lead' },
    { layout: 'terminal-style', sidebarWidth: '33%', headerStyle: 'code-block', colorScheme: 'matrix-black', prestige: 'tech-lead' },
    
    // Photo-Centric (22-24) - With photo prominence
    { layout: 'photo-sidebar', sidebarWidth: '35%', headerStyle: 'photo-left', colorScheme: 'professional-dark', prestige: 'senior' },
    { layout: 'photo-header', sidebarWidth: '0%', headerStyle: 'photo-center', colorScheme: 'minimalist-clean', prestige: 'senior' },
    { layout: 'photo-sidebar', sidebarWidth: '38%', headerStyle: 'photo-left', colorScheme: 'creative-bold', prestige: 'creative' },
    
    // Minimalist Premium (25-30) - Clean & sophisticated
    { layout: 'minimalist', sidebarWidth: '0%', headerStyle: 'line-accent', colorScheme: 'minimal-serif', prestige: 'premium' },
    { layout: 'minimalist', sidebarWidth: '0%', headerStyle: 'centered-clean', colorScheme: 'swiss-style', prestige: 'premium' },
    { layout: 'minimalist-sidebar', sidebarWidth: '30%', headerStyle: 'subtle-header', colorScheme: 'elegant-gray', prestige: 'premium' },
    { layout: 'minimalist', sidebarWidth: '0%', headerStyle: 'bold-name', colorScheme: 'architect-style', prestige: 'premium' },
    { layout: 'minimalist-sidebar', sidebarWidth: '28%', headerStyle: 'line-accent', colorScheme: 'lawyer-classic', prestige: 'premium' },
    { layout: 'full-width', sidebarWidth: '0%', headerStyle: 'academic-style', colorScheme: 'journal-format', prestige: 'academic' }
  ];
  
  const template = templates[idx];
  const hasSidebar = template.sidebarWidth !== '0%';
  
  // Calculate content density for automatic scaling
  const density = calculateContentDensity(data);
  const scaled = getScaledValues(density, {
    baseFontSize: '10.5pt',
    titleSize: '22pt',
    sectionTitleSize: '13pt',
    entryTitleSize: '11.5pt'
  });
  
  // Premium color schemes matching reference templates
  const colorSchemes = {
    // Executive palettes (match reference templates)
    'navy-gold': { primary: '#1e3a5f', secondary: '#d4af37', accent: '#b8985f', bg: '#ffffff', text: '#1f2937', light: '#f8fafc' },
    'charcoal-teal': { primary: '#1a202c', secondary: '#16a085', accent: '#1abc9c', bg: '#ffffff', text: '#2d3748', light: '#edf2f7' },
    'burgundy-cream': { primary: '#7f1d1d', secondary: '#fca5a5', accent: '#eabcbc', bg: '#ffffff', text: '#2a2a2a', light: '#fff1f2' },
    'forest-green': { primary: '#14532d', secondary: '#22c55e', accent: '#86efac', bg: '#ffffff', text: '#1a2e1a', light: '#f0fdf4' },
    'royal-blue': { primary: '#0f172a', secondary: '#2563eb', accent: '#93c5fd', bg: '#ffffff', text: '#1e293b', light: '#eff6ff' },
    'charcoal-violet': { primary: '#18181b', secondary: '#7c3aed', accent: '#c4b5fd', bg: '#ffffff', text: '#1f2937', light: '#f5f3ff' },
    'swiss-red': { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171', bg: '#ffffff', text: '#111827', light: '#fef2f2' },
    'earth-tone': { primary: '#78350f', secondary: '#d6d3d1', accent: '#a16207', bg: '#ffffff', text: '#431407', light: '#fff7ed' },
    'navy-bronze': { primary: '#0b132b', secondary: '#6f4e37', accent: '#b08d57', bg: '#ffffff', text: '#1f2937', light: '#f7fafc' },
    'teal-dark': { primary: '#0f766e', secondary: '#2dd4bf', accent: '#99f6e4', bg: '#ffffff', text: '#0f172a', light: '#ecfeff' },
    'executive-navy': { primary: '#003366', secondary: '#0066cc', accent: '#3399ff', bg: '#ffffff', text: '#1f2937', light: '#f8fafb' },
    'gradient-purple': { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb', bg: '#ffffff', text: '#1f2937', light: '#f8f9ff' },
    'marketing-orange': { primary: '#FA6B5A', secondary: '#FF8C42', accent: '#FFB142', bg: '#ffffff', text: '#2c1d14', light: '#fef6f2' },
    'healthcare-blue': { primary: '#2C5F8D', secondary: '#3A7CA5', accent: '#5B9CC5', bg: '#ffffff', text: '#243b53', light: '#f8fafb' },
    'minimal-serif': { primary: '#2c3e50', secondary: '#7f8c8d', accent: '#34495e', bg: '#ffffff', text: '#2c3e50', light: '#ffffff' },
    'professional-dark': { primary: '#0f172a', secondary: '#1f2937', accent: '#38bdf8', bg: '#0b1220', text: '#e5e7eb', light: '#111827' },
    'creative-bold': { primary: '#ff6b6b', secondary: '#ee5a6f', accent: '#ffd166', bg: '#ffffff', text: '#1f2937', light: '#fff5f5' },
    'minimalist-clean': { primary: '#111827', secondary: '#6b7280', accent: '#374151', bg: '#ffffff', text: '#1f2937', light: '#f9fafb' },
    'academic-style': { primary: '#1e3a5f', secondary: '#6b7280', accent: '#b08d57', bg: '#ffffff', text: '#111827', light: '#f7f7f7' }
  };
  
  const colors = colorSchemes[template.colorScheme] || colorSchemes['navy-gold'];
  
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;600;700;800&family=Roboto:wght@300;400;500;700&display=swap');
    
    ${getA4PageStyle(density)}
    
    @page { 
      size: A4; 
      margin: ${density.isUltraHighDensity ? '12mm' : density.isVeryHighDensity ? '15mm' : (template.layout === 'full-width' ? '20mm' : '18mm')};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${template.prestige === 'academic' ? "'Merriweather', Georgia, serif" : "'Inter', 'Segoe UI', sans-serif"};
      font-size: ${scaled.baseFontSize};
      line-height: ${scaled.lineHeight};
      color: ${colors.text};
      background: #f3f4f6;
      display: flex;
      justify-content: center;
      padding: ${scaled.mainPadding};
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      hyphens: auto;
    }
    
    .cv-container {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      background: ${colors.bg};
      overflow: hidden;
      ${template.layout === 'split-screen' || template.layout === 'photo-sidebar' ? 'display: flex;' : ''}
      ${template.layout === 'banner-top' ? 'display: flex; flex-direction: column;' : ''}
      box-shadow: ${template.layout !== 'full-width' ? '0 10px 30px rgba(0,0,0,0.12)' : 'none'};
      overflow: hidden;
      border-radius: ${template.layout === 'full-width' ? '0' : '8px'};
    }
    
    /* HEADER STYLES */
    .header {
      ${template.headerStyle === 'gradient-full' ? `
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        color: white;
        padding: 56px 48px;
        box-shadow: inset 0 -6px 12px rgba(0,0,0,0.06);
      ` : template.headerStyle === 'banner-full' ? `
        background: ${colors.primary};
        color: white;
        padding: 48px 52px;
        box-shadow: inset 0 -6px 12px rgba(0,0,0,0.04);
      ` : template.headerStyle === 'banner-gradient' ? `
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
        color: white;
        padding: 64px 52px;
        clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        box-shadow: inset 0 -8px 18px rgba(0,0,0,0.06);
      ` : template.headerStyle === 'centered-border' ? `
        text-align: center;
        padding: 44px 0 36px;
        border-bottom: 3px solid ${colors.primary};
        margin-bottom: 36px;
      ` : template.headerStyle === 'code-block' ? `
        background: ${colors.light};
        color: ${colors.primary};
        padding: 16px 32px;
        border-bottom: 2px solid ${colors.primary};
        font-family: 'Courier New', monospace;
        font-size: 12px;
      ` : `
        padding: 42px 52px;
        background: ${colors.bg};
      `}

      /* Ensure content inside header aligns and uses clear hierarchy */
      .header-row { display: flex; align-items: center; gap: 28px; }
      .header-left { flex: 0 0 auto; }
      .header-right { flex: 1; }
      .header-stamp { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8; }
    }

    /* Header content elements */
    .header .name { font-size: ${template.prestige === 'ceo' ? '46px' : template.prestige === 'premium' ? '48px' : '40px'}; letter-spacing: 1px; margin: 0 0 6px 0; line-height: 1; }
    .header .job-title { font-size: 16px; color: ${template.headerStyle.includes('banner') ? 'rgba(255,255,255,0.92)' : '#667085'}; font-weight: 500; margin-bottom: 8px; }
    .header .contact-info { opacity: 0.9; font-size: 13px; margin-top: 6px; }

    /* Profile image in header */
    .header .profile-img {
      width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.18); box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    
    .name {
      font-size: ${template.prestige === 'ceo' ? '44pt' : template.prestige === 'premium' ? '48px' : '38pt'};
      font-weight: ${template.layout === 'minimalist' ? '300' : '700'};
      margin-bottom: ${template.headerStyle === 'centered-border' ? '10px' : '12px'};
      ${template.layout === 'minimalist' ? 'letter-spacing: 2px; text-transform: uppercase;' : ''}
      ${template.headerStyle === 'code-block' ? `color: ${colors.primary}; text-shadow: 0 0 10px ${colors.primary}40;` : ''}
      font-family: ${template.prestige === 'academic' ? "'Playfair Display', serif" : "'Inter', sans-serif"};
    }
    
    .job-title {
      font-size: ${template.prestige === 'ceo' ? '20pt' : '18pt'};
      margin-bottom: 20px;
      font-weight: ${template.layout === 'minimalist' ? '400' : '500'};
      ${template.headerStyle === 'centered-border' ? `color: ${colors.secondary};` : ''}
      ${template.layout === 'minimalist' ? 'text-transform: uppercase; letter-spacing: 3px;' : ''}
    }
    
    .contact-info {
      display: flex;
      ${template.headerStyle === 'centered-border' ? 'justify-content: center;' : ''}
      gap: ${template.layout === 'banner-top' ? '15px' : '25px'};
      flex-wrap: wrap;
      font-size: ${template.layout === 'minimalist' ? '13px' : '14px'};
      ${template.headerStyle === 'centered-border' ? 'margin-top: 20px;' : ''}
      opacity: 0.9;
    }
    
    /* SIDEBAR STYLES */
    .sidebar {
      width: ${template.sidebarWidth};
      background: ${template.layout === 'split-screen' ? colors.primary : colors.light};
      color: ${template.layout === 'split-screen' ? 'white' : colors.text};
      padding: ${hasSidebar ? '44px 34px' : '0'};
      ${!hasSidebar ? 'display: none;' : ''}
      ${template.layout === 'photo-sidebar' ? 'position: relative;' : ''}
      ${template.layout === 'split-screen' ? 'display: flex; flex-direction: column; gap: 26px;' : ''}
      ${template.layout !== 'split-screen' ? 'display: flex; flex-direction: column; gap: 24px;' : ''}
    }
    
    ${template.layout === 'photo-sidebar' ? `
    .profile-photo {
      width: 100%;
      height: 44%;
      background: #999;
      background-size: cover;
      background-position: center;
      margin-bottom: 26px;
      border-radius: 6px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    ` : ''}

    .sidebar-section { margin-bottom: 26px; }
    .sidebar-title {
      font-size: ${template.layout === 'split-screen' ? '13px' : '15px'};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: ${template.layout === 'split-screen' ? '2px' : '1.2px'};
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: ${template.layout === 'split-screen' ? '1px solid rgba(255,255,255,0.12)' : `2px solid ${colors.primary}20`};
    }

    .sidebar .contact-info div, .sidebar .sidebar-list li { margin-bottom: 12px; font-size: 13px; }
    .sidebar .profile-phrase { font-size: 13px; color: ${template.layout === 'split-screen' ? 'rgba(255,255,255,0.85)' : '#6b7280'}; }

    /* Skill pills for sidebar */
    .skill-pill { display:inline-block; margin: 0 8px 8px 0; padding:6px 12px; border-radius: 999px; background: ${template.layout === 'split-screen' ? colors.secondary : colors.light}; color: ${template.layout === 'split-screen' ? 'white' : colors.text}; font-weight:600; font-size:12px; }

    
    /* MAIN CONTENT */
    .main-content {
      flex: 1;
      padding: ${template.layout === 'banner-top' ? '40px 50px' : '40px 45px'};
    }
    
    ${template.layout === 'banner-top' && hasSidebar ? `
    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
    }
    ` : ''}
    
    .section {
      margin-bottom: ${template.layout === 'minimalist' ? '45px' : '35px'};
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: ${template.layout === 'minimalist' ? '14px' : template.layout === 'banner-top' ? '26px' : '20px'};
      font-weight: ${template.layout === 'minimalist' ? '600' : '700'};
      color: ${colors.primary};
      text-transform: uppercase;
      letter-spacing: ${template.layout === 'minimalist' ? '2px' : '1.5px'};
      margin-bottom: ${template.layout === 'minimalist' ? '25px' : '20px'};
      padding-bottom: ${template.layout === 'banner-top' ? '12px' : '10px'};
      position: relative;
      ${template.layout === 'banner-top' ? `
        position: relative;
      ` : `
        border-bottom: 2px solid ${colors.primary};
      `}
    }
    
    ${template.layout === 'banner-top' ? `
    .section-title::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 4px;
      background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
      border-radius: 2px;
    }
    ` : ''}
    
    ${template.layout === 'minimalist' ? `
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${colors.primary};
    }
    ` : ''}
    
    /* EXPERIENCE ENTRIES */
    .experience-item {
      margin-bottom: ${template.layout === 'minimalist' ? '30px' : '25px'};
      ${template.layout === 'minimalist' ? 'padding-left: 20px; border-left: 2px solid #ecf0f1;' : ''}
      ${template.layout === 'terminal-style' ? `
        background: ${colors.light};
        padding: 25px;
        border-radius: 8px;
        border: 1px solid ${colors.primary}20;
      ` : ''}
    }
    
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .exp-title {
      font-size: ${template.layout === 'banner-top' ? '20px' : '18px'};
      font-weight: ${template.layout === 'minimalist' ? '600' : '700'};
      color: ${template.layout === 'terminal-style' ? colors.primary : colors.text};
    }
    
    .exp-company {
      font-size: ${template.layout === 'banner-top' ? '16px' : '15px'};
      color: ${colors.secondary};
      margin-bottom: 8px;
      font-weight: ${template.layout === 'minimalist' ? '400' : '500'};
      ${template.layout === 'minimalist' ? 'font-style: italic;' : ''}
    }
    
    .exp-date {
      font-size: ${template.layout === 'minimalist' ? '14px' : '13px'};
      color: ${template.layout === 'terminal-style' ? colors.primary : '#888'};
      ${template.layout === 'minimalist' || template.layout === 'banner-top' ? 'font-style: italic;' : ''}
    }
    
    .exp-description {
      font-size: ${template.layout === 'banner-top' ? '15px' : '14px'};
      line-height: ${template.layout === 'minimalist' ? '1.7' : '1.6'};
      color: #555;
      margin-top: 8px;
      text-align: justify;
    }
    
    .exp-description ul {
      list-style: ${template.layout === 'terminal-style' ? 'none' : 'disc'};
      margin-left: ${template.layout === 'terminal-style' ? '0' : '20px'};
      margin-top: 8px;
      padding-left: ${template.layout === 'terminal-style' ? '0' : '4px'};
    }
    
    .exp-description li {
      margin-bottom: 6px;
      ${template.layout === 'terminal-style' ? `
        padding-left: 20px;
        position: relative;
      ` : ''}
    }
    
    ${template.layout === 'terminal-style' ? `
    .exp-description li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: ${colors.primary};
    }
    ` : ''}
    
    /* SKILLS */
    .skill-item {
      ${template.layout === 'split-screen' ? `
        margin-bottom: 15px;
      ` : `
        display: inline-block;
        margin: 0 8px 10px 0;
        padding: 8px 16px;
        background: ${colors.light};
        border: 1px solid ${colors.primary}30;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        color: ${colors.text};
      `}
    }
    
    ${template.layout === 'split-screen' ? `
    .skill-name {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 13px;
    }
    
    .skill-bar {
      height: 6px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .skill-fill {
      height: 100%;
      background: ${colors.accent};
      border-radius: 3px;
    }
    ` : ''}
    
    /* Utilities & small components */
    .badge { display:inline-block; padding:4px 10px; border-radius: 6px; font-weight:700; font-size:11px; background: ${colors.accent}20; color: ${colors.primary}; }
    .progress { height:6px; background:#eee; border-radius: 6px; overflow:hidden; }
    .progress > .fill { height:100%; background: ${colors.accent}; }
    .section-accent { display:block; height:4px; width:48px; background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}); margin-top:8px; border-radius:2px; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin: 10px 0 4px; }
    .meta-card { background: ${colors.light}; border: 1px solid ${colors.primary}20; border-radius: 8px; padding: 14px 12px; text-align: center; box-shadow: 0 6px 18px rgba(0,0,0,0.04); }
    .meta-value { font-weight: 800; font-size: 18px; color: ${colors.primary}; margin-bottom: 4px; letter-spacing: 0.5px; }
    .meta-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
    .project-card, .cert-card, .award-card { background: ${colors.light}; border: 1px solid ${colors.primary}15; border-radius: 10px; padding: 16px 18px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.05); }
    .project-head, .cert-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 6px; flex-wrap: wrap; }
    .project-title { font-weight: 700; color: ${colors.text}; font-size: 16px; }
    .project-role { font-size: 13px; color: ${colors.secondary}; font-weight: 600; }
    .project-date, .cert-date { font-size: 12px; color: #6b7280; font-style: italic; }
    .project-desc { font-size: 14px; line-height: 1.65; color: #4b5563; margin-top: 8px; }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .tag { background: ${colors.accent}; color: ${template.layout === 'terminal-style' ? colors.primary : colors.bg}; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px; }
    .award-card { border-left: 4px solid ${colors.primary}; }
    .cert-card { border-left: 4px solid ${colors.secondary}; }
    .quote-block { background: ${colors.light}; border-left: 4px solid ${colors.primary}; padding: 14px 16px; border-radius: 8px; font-style: italic; color: #4b5563; margin-top: 10px; }
    .reference-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
    .reference-item { background: ${colors.light}; padding: 12px 14px; border-radius: 8px; border: 1px solid ${colors.primary}15; }
    
    /* PRINT STYLES */
    @media print {
      body { background: white; padding: 0; }

      .cv-container { box-shadow: none; width: 210mm; min-height: 297mm; margin: 0 auto; }

      .header, .sidebar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

      /* Page-break controls for longer CVs */
      .section { page-break-inside: avoid; }
      
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `;
  
  // Generate HTML based on layout
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${css}</style>
    </head>
    <body>
      <div class="cv-container">
        ${generateHeader(data, template, colors)}
        ${generateContent(data, template, hasSidebar, colors)}
      </div>
    </body>
    </html>
  `;
  
  return html;
}

function generateHeader(data, template, colors) {
  if (template.layout === 'split-screen') {
    return ''; // Header integrated into sidebar
  }
  
  return `
    <div class="header">
      ${data.includePhoto && data.photoUrl && template.layout !== 'photo-sidebar' ? `
        <div style="display: flex; align-items: center; gap: 30px; ${template.headerStyle === 'centered-border' ? 'justify-content: center;' : ''}">
          <img src="${data.photoUrl}" alt="Profile" style="width: ${template.headerStyle === 'centered-border' ? '160px' : '150px'}; height: ${template.headerStyle === 'centered-border' ? '160px' : '150px'}; border-radius: 50%; object-fit: cover; border: 4px solid ${template.headerStyle.includes('banner') ? 'rgba(255,255,255,0.3)' : colors.primary}40;" />
          <div style="flex: 1;">
            <h1 class="name">${data.name || 'Professional Name'}</h1>
            <div class="job-title">${data.professionalTitle || 'Professional Title'}</div>
            <div class="contact-info">
              ${data.email ? `<span>${data.email}</span>` : ''}
              ${data.phone ? `<span>${data.phone}</span>` : ''}
              ${data.location ? `<span>${data.location}</span>` : ''}
              ${data.linkedin ? `<span>${data.linkedin}</span>` : ''}
            </div>
          </div>
        </div>
      ` : `
        <h1 class="name">${data.name || 'Professional Name'}</h1>
        <div class="job-title">${data.professionalTitle || 'Professional Title'}</div>
        <div class="contact-info">
          ${data.email ? `<span>${data.email}</span>` : ''}
          ${data.phone ? `<span>${data.phone}</span>` : ''}
          ${data.location ? `<span>${data.location}</span>` : ''}
          ${data.linkedin ? `<span>${data.linkedin}</span>` : ''}
        </div>
      `}
    </div>
  `;
}

function generateContent(data, template, hasSidebar, colors) {
  const sidebarHtml = hasSidebar ? generateSidebar(data, template, colors) : '';
  const mainHtml = generateMainContent(data, template, hasSidebar);
  
  if (template.layout === 'split-screen') {
    return sidebarHtml + mainHtml;
  } else if (template.layout === 'banner-top' && hasSidebar) {
    return `<div class="content-grid">${mainHtml}${sidebarHtml}</div>`;
  } else {
    return sidebarHtml + mainHtml;
  }
}

function generateSidebar(data, template, colors) {
  return `
    <div class="sidebar">
      ${template.layout === 'photo-sidebar' && data.includePhoto && data.photoUrl ? `
        <div class="profile-photo" style="background-image: url('${data.photoUrl}');"></div>
      ` : ''}
      
      ${template.layout === 'split-screen' ? `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 class="name" style="font-size: 36px; margin-bottom: 10px;">${data.name || 'Name'}</h1>
          <div class="job-title" style="font-size: 18px; margin-bottom: 25px;">${data.professionalTitle || 'Title'}</div>
        </div>
        
        <div class="sidebar-section">
          <div class="sidebar-title">CONTACT</div>
          ${data.email ? `<div style="margin-bottom: 12px; font-size: 13px;">${data.email}</div>` : ''}
          ${data.phone ? `<div style="margin-bottom: 12px; font-size: 13px;">${data.phone}</div>` : ''}
          ${data.location ? `<div style="margin-bottom: 12px; font-size: 13px;">${data.location}</div>` : ''}
          ${data.linkedin ? `<div style="margin-bottom: 12px; font-size: 13px;">${data.linkedin}</div>` : ''}
        </div>
      ` : ''}

      ${template.layout !== 'split-screen' ? `
        <div class="sidebar-section">
          <div class="sidebar-title">Contact</div>
          ${data.email ? `<div style="margin-bottom: 10px; font-size: 13px;">${data.email}</div>` : ''}
          ${data.phone ? `<div style="margin-bottom: 10px; font-size: 13px;">${data.phone}</div>` : ''}
          ${data.location ? `<div style="margin-bottom: 10px; font-size: 13px;">${data.location}</div>` : ''}
          ${data.linkedin ? `<div style="margin-bottom: 10px; font-size: 13px;">${data.linkedin}</div>` : ''}
        </div>
      ` : ''}
      
      ${data.skills && data.skills.length > 0 ? `
        <div class="sidebar-section">
          <div class="sidebar-title">${template.layout === 'split-screen' ? 'SKILLS' : 'Core Skills'}</div>
          ${template.layout === 'split-screen' ? 
            data.skills.map(skill => `
              <div class="skill-item">
                <div class="skill-name"><span>${skill}</span><span>90%</span></div>
                <div class="skill-bar"><div class="skill-fill" style="width: 90%"></div></div>
              </div>
            `).join('') :
            data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')
          }
        </div>
      ` : ''}
      
      ${data.languages && data.languages.length > 0 ? `
        <div class="sidebar-section">
          <div class="sidebar-title">Languages</div>
          ${data.languages.map(lang => `
            <div style="margin-bottom: 10px; font-size: 13px;">
              <strong>${lang.name || 'Language'}</strong>: ${lang.proficiency || 'Proficient'}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${template.layout !== 'split-screen' && data.education && data.education.length > 0 ? `
        <div class="sidebar-section">
          <div class="sidebar-title">Education Highlights</div>
          ${data.education.slice(0, 2).map(edu => `
            <div style="margin-bottom: 12px;">
              <div style="font-weight:700; font-size:13px;">${edu.degree || 'Degree'}</div>
              <div style="font-size:12px; color:#6b7280;">${edu.institution || 'Institution'}</div>
              <div style="font-size:12px; color:#9ca3af;">${edu.endDate || edu.startDate || ''}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function generateMainContent(data, template, hasSidebar) {
  return `
    <div class="main-content">
      ${data.summary ? `
        <div class="section">
          <div class="section-title">${template.prestige === 'academic' ? 'Research Profile' : 'Professional Summary'}</div>
          <div class="exp-description">${data.summary}</div>
        </div>
      ` : ''}

      ${data.metrics && data.metrics.length > 0 ? `
        <div class="section">
          <div class="section-title">Key Metrics</div>
          <div class="meta-grid">
            ${data.metrics.map(metric => `
              <div class="meta-card">
                <div class="meta-value">${metric.value || ''}</div>
                <div class="meta-label">${metric.label || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${!hasSidebar && data.skills && data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Core Skills</div>
          <div class="tag-row">
            ${data.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      ${data.experience && data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="exp-header">
                <div class="exp-title">${exp.position || 'Position'}</div>
                <div class="exp-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
              </div>
              <div class="exp-company">${exp.company || 'Company'}</div>
              ${exp.location ? `<div style="font-size: 13px; color: #888; margin-bottom: 8px;">${exp.location}</div>` : ''}
              ${exp.description ? `<div class="exp-description">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.projects && data.projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Key Projects</div>
          ${data.projects.map(project => `
            <div class="project-card">
              <div class="project-head">
                <div>
                  <div class="project-title">${project.title || 'Project'}</div>
                  ${project.role ? `<div class="project-role">${project.role}</div>` : ''}
                </div>
                <div class="project-date">${project.startDate || ''}${project.endDate ? ' - ' + project.endDate : ''}</div>
              </div>
              ${project.description ? `<div class="project-desc">${project.description}</div>` : ''}
              ${project.technologies && project.technologies.length ? `<div class="tag-row">${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.awards && data.awards.length > 0 ? `
        <div class="section">
          <div class="section-title">Achievements</div>
          ${data.awards.map(award => `
            <div class="award-card">
              <div class="project-head">
                <div class="project-title">${award.title || 'Award'}</div>
                <div class="project-date">${award.year || ''}</div>
              </div>
              ${award.issuer ? `<div class="project-role">${award.issuer}</div>` : ''}
              ${award.description ? `<div class="project-desc">${award.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.education && data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education.map(edu => `
            <div class="experience-item">
              <div class="exp-header">
                <div class="exp-title">${edu.degree || 'Degree'}</div>
                <div class="exp-date">${edu.startDate || ''} - ${edu.endDate || 'Present'}</div>
              </div>
              <div class="exp-company">${edu.institution || 'Institution'}</div>
              ${edu.location ? `<div style="font-size: 13px; color: #888; margin-bottom: 8px;">${edu.location}</div>` : ''}
              ${edu.description ? `<div class="exp-description">${edu.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="cert-card">
              <div class="cert-head">
                <div class="project-title">${cert.name || 'Certification'}</div>
                <div class="cert-date">${cert.year || cert.date || ''}</div>
              </div>
              ${cert.issuer ? `<div class="project-role">${cert.issuer}</div>` : ''}
              ${cert.description ? `<div class="project-desc">${cert.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${!hasSidebar && data.languages && data.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">Languages</div>
          <div class="tag-row">
            ${data.languages.map(lang => `<span class="tag">${lang.name || 'Language'}${lang.proficiency ? ' • ' + lang.proficiency : ''}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${data.references && data.references.length > 0 ? `
        <div class="section">
          <div class="section-title">References</div>
          <div class="reference-list">
            ${data.references.map(ref => `
              <div class="reference-item">
                <div class="project-title">${ref.name || 'Reference'}</div>
                ${ref.position ? `<div class="project-role">${ref.position}</div>` : ''}
                ${ref.contact ? `<div class="project-desc" style="margin-top:6px;">${ref.contact}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function executiveMeta() {
  return { archetype: 'executive', total: EXECUTIVE_COUNT };
}