import { getPalette } from './palette';
import { calculateContentDensity, getScaledValues, getA4PageStyle } from './contentScaler';

const CREATIVE_COUNT = 30;

function variationIndex(templateId, count) {
  return ((templateId - 1) % count);
}

export function generateCreative(data, industry = 'creative', templateId) {
  const idx = variationIndex(templateId, CREATIVE_COUNT);
  const palette = getPalette(industry);
  
  // 30 UNIQUE FORMAL CREATIVE DESIGNS - Professional yet distinctive
  // Suitable for designers, marketers, creative professionals
  const designs = {
    // SOPHISTICATED ASYMMETRIC (1-6)
    0: { name: 'Sophisticated Asymmetric', font: '"Montserrat", sans-serif', layout: 'asymmetric-left', headerBg: palette.primary, sidebarBg: palette.light, sidebarWidth: 38, accentColor: palette.secondary, accentShape: 'vertical-bar', headerAlign: 'left' },
    1: { name: 'Modern Diagonal', font: '"Raleway", sans-serif', layout: 'diagonal-split', headerBg: palette.dark, sidebarBg: '#ffffff', sidebarWidth: 36, accentColor: palette.complement, accentShape: 'diagonal-line', headerAlign: 'left' },
    2: { name: 'Bold Offset', font: '"Poppins", sans-serif', layout: 'offset-left', headerBg: palette.light, sidebarBg: palette.primary + '10', sidebarWidth: 40, accentColor: palette.primary, accentShape: 'block-accent', headerAlign: 'left' },
    3: { name: 'Refined Right-Side', font: '"Inter", sans-serif', layout: 'asymmetric-right', headerBg: '#ffffff', sidebarBg: palette.neutral, sidebarWidth: 35, accentColor: palette.tertiary, accentShape: 'corner-accent', headerAlign: 'left' },
    4: { name: 'Contemporary Split', font: '"Work Sans", sans-serif', layout: 'split-modern', headerBg: palette.secondary, sidebarBg: '#ffffff', sidebarWidth: 37, accentColor: palette.complement, accentShape: 'underline-heavy', headerAlign: 'left' },
    5: { name: 'Artistic Frame', font: '"Quicksand", sans-serif', layout: 'framed-left', headerBg: palette.light, sidebarBg: palette.primary + '08', sidebarWidth: 39, accentColor: palette.primary, accentShape: 'frame-border', headerAlign: 'left' },
    
    // EDITORIAL/MAGAZINE (7-12)
    6: { name: 'Editorial Clean', font: '"Merriweather", serif', layout: 'editorial', headerBg: '#ffffff', sidebarBg: palette.light, sidebarWidth: 33, accentColor: palette.primary, accentShape: 'section-lines', headerAlign: 'left' },
    7: { name: 'Magazine Modern', font: '"Lora", serif', layout: 'magazine-style', headerBg: palette.primary, sidebarBg: '#ffffff', sidebarWidth: 35, accentColor: palette.secondary, accentShape: 'header-block', headerAlign: 'center' },
    8: { name: 'Press Layout', font: '"Playfair Display", serif', layout: 'press-format', headerBg: palette.dark, sidebarBg: palette.neutral, sidebarWidth: 32, accentColor: palette.complement, accentShape: 'top-stripe', headerAlign: 'center' },
    9: { name: 'Publication Style', font: '"Crimson Text", serif', layout: 'publication', headerBg: palette.light, sidebarBg: '#ffffff', sidebarWidth: 34, accentColor: palette.tertiary, accentShape: 'column-divider', headerAlign: 'left' },
    10: { name: 'Modern Editorial', font: '"Source Serif Pro", serif', layout: 'modern-magazine', headerBg: '#ffffff', sidebarBg: palette.primary + '06', sidebarWidth: 36, accentColor: palette.primary, accentShape: 'sidebar-highlight', headerAlign: 'left' },
    11: { name: 'Refined Magazine', font: '"Spectral", serif', layout: 'refined-editorial', headerBg: palette.secondary, sidebarBg: '#ffffff', sidebarWidth: 33, accentColor: palette.complement, accentShape: 'accent-bar', headerAlign: 'center' },
    
    // PORTFOLIO DESIGNS (13-18)
    12: { name: 'Portfolio Showcase', font: '"Nunito", sans-serif', layout: 'portfolio-grid', headerBg: palette.primary, sidebarBg: palette.light, sidebarWidth: 30, accentColor: palette.tertiary, accentShape: 'grid-accent', headerAlign: 'center' },
    13: { name: 'Visual Portfolio', font: '"Rubik", sans-serif', layout: 'visual-focus', headerBg: '#ffffff', sidebarBg: palette.neutral, sidebarWidth: 28, accentColor: palette.secondary, accentShape: 'photo-frame', headerAlign: 'left' },
    14: { name: 'Creative Gallery', font: '"Mukta", sans-serif', layout: 'gallery-style', headerBg: palette.light, sidebarBg: '#ffffff', sidebarWidth: 31, accentColor: palette.primary, accentShape: 'gallery-border', headerAlign: 'center' },
    15: { name: 'Project Focus', font: '"Karla", sans-serif', layout: 'project-based', headerBg: palette.dark, sidebarBg: palette.light, sidebarWidth: 29, accentColor: palette.complement, accentShape: 'project-marker', headerAlign: 'left' },
    16: { name: 'Work Showcase', font: '"Barlow", sans-serif', layout: 'work-display', headerBg: palette.primary, sidebarBg: '#ffffff', sidebarWidth: 32, accentColor: palette.tertiary, accentShape: 'showcase-line', headerAlign: 'center' },
    17: { name: 'Designer CV', font: '"DM Sans", sans-serif', layout: 'designer-layout', headerBg: '#ffffff', sidebarBg: palette.primary + '10', sidebarWidth: 30, accentColor: palette.secondary, accentShape: 'design-element', headerAlign: 'left' },
    
    // MODERN MINIMALIST (19-24)
    18: { name: 'Minimal Impact', font: '"Inter", sans-serif', layout: 'minimal-bold', headerBg: '#ffffff', sidebarBg: palette.light, sidebarWidth: 0, accentColor: palette.primary, accentShape: 'thin-line', headerAlign: 'left' },
    19: { name: 'Clean Statement', font: '"Roboto", sans-serif', layout: 'statement-minimal', headerBg: palette.primary, sidebarBg: '#ffffff', sidebarWidth: 0, accentColor: palette.secondary, accentShape: 'header-accent', headerAlign: 'center' },
    20: { name: 'Bold Minimalism', font: '"Montserrat", sans-serif', layout: 'bold-minimal', headerBg: palette.dark, sidebarBg: '#ffffff', sidebarWidth: 0, accentColor: palette.complement, accentShape: 'bold-underline', headerAlign: 'left' },
    21: { name: 'Refined Simple', font: '"Lato", sans-serif', layout: 'refined-minimal', headerBg: palette.light, sidebarBg: '#ffffff', sidebarWidth: 0, accentColor: palette.tertiary, accentShape: 'subtle-accent', headerAlign: 'left' },
    22: { name: 'Contemporary Clean', font: '"Poppins", sans-serif', layout: 'contemporary-minimal', headerBg: '#ffffff', sidebarBg: '#ffffff', sidebarWidth: 0, accentColor: palette.primary, accentShape: 'modern-line', headerAlign: 'center' },
    23: { name: 'Professional Minimal', font: '"Work Sans", sans-serif', layout: 'professional-clean', headerBg: palette.secondary, sidebarBg: '#ffffff', sidebarWidth: 0, accentColor: palette.complement, accentShape: 'pro-accent', headerAlign: 'left' },
    
    // INNOVATIVE HYBRID (25-30)
    24: { name: 'Hybrid Modern', font: '"Space Grotesk", sans-serif', layout: 'hybrid-layout', headerBg: palette.primary, sidebarBg: palette.neutral, sidebarWidth: 37, accentColor: palette.tertiary, accentShape: 'multi-accent', headerAlign: 'left' },
    25: { name: 'Mixed Format', font: '"Archivo", sans-serif', layout: 'mixed-style', headerBg: '#ffffff', sidebarBg: palette.primary + '12', sidebarWidth: 35, accentColor: palette.secondary, accentShape: 'layered-accent', headerAlign: 'left' },
    26: { name: 'Dual-Tone', font: '"Public Sans", sans-serif', layout: 'dual-color', headerBg: palette.light, sidebarBg: palette.dark, sidebarWidth: 36, accentColor: palette.complement, accentShape: 'dual-border', headerAlign: 'left' },
    27: { name: 'Structured Creative', font: '"Manrope", sans-serif', layout: 'structured-creative', headerBg: palette.dark, sidebarBg: '#ffffff', sidebarWidth: 34, accentColor: palette.primary, accentShape: 'structure-line', headerAlign: 'left' },
    28: { name: 'Balanced Artistic', font: '"Plus Jakarta Sans", sans-serif', layout: 'balanced-art', headerBg: palette.secondary, sidebarBg: palette.light, sidebarWidth: 38, accentColor: palette.tertiary, accentShape: 'art-element', headerAlign: 'center' },
    29: { name: 'Formal Creative Pro', font: '"Outfit", sans-serif', layout: 'formal-creative', headerBg: '#ffffff', sidebarBg: palette.neutral, sidebarWidth: 33, accentColor: palette.primary, accentShape: 'creative-border', headerAlign: 'left' }
  };
  
  const design = designs[idx];
  const hasSidebar = design.sidebarWidth > 0;
  const isRightSidebar = design.layout.includes('right');
  const isCentered = design.headerAlign === 'center';
  
  // Calculate content density for automatic scaling
  const density = calculateContentDensity(data);
  const scaled = getScaledValues(density, {
    baseFontSize: '10pt',
    titleSize: '20pt',
    sectionTitleSize: '13pt',
    entryTitleSize: '11pt'
  });
  
  // Professional creative CSS with formal polish
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Work+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700;900&display=swap');
    
    ${getA4PageStyle(density)}
    
    @page { 
      size: A4; 
      margin: ${density.isUltraHighDensity ? '10mm' : density.isVeryHighDensity ? '11mm' : '12mm'};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${design.font};
      font-size: ${scaled.baseFontSize};
      line-height: ${scaled.lineHeight};
      color: ${palette.text};
      background: #f3f4f6;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      hyphens: auto;
      display: flex;
      justify-content: center;
      padding: ${scaled.mainPadding};
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 12px 30px rgba(0,0,0,0.12);
      border-radius: 10px;
      overflow: hidden;
    }
    
    .header {
      background: ${design.headerBg};
      color: ${design.headerBg === '#ffffff' || design.headerBg.includes(palette.light) ? palette.text : '#ffffff'};
      padding: ${isCentered ? '30px 0 25px 0' : '28px 0 23px 0'};
      text-align: ${design.headerAlign};
      margin-bottom: 20px;
      position: relative;
      ${design.accentShape.includes('top-stripe') ? `border-top: 5px solid ${design.accentColor};` : ''}
      ${design.accentShape.includes('header-block') ? `border-bottom: 4px solid ${design.accentColor};` : ''}
      ${design.accentShape.includes('underline-heavy') ? `box-shadow: inset 0 -6px 0 ${design.accentColor};` : ''}
      box-shadow: inset 0 -6px 10px rgba(0,0,0,0.04);
    }
    
    ${design.accentShape === 'diagonal-line' ? `
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 100%;
      background: ${design.accentColor}15;
      transform: skewX(-10deg);
      transform-origin: top right;
    }
    ` : ''}
    
    ${design.accentShape === 'corner-accent' ? `
    .header::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
      height: 80px;
      background: ${design.accentColor};
      clip-path: polygon(100% 0, 100% 100%, 0 0);
    }
    ` : ''}
    
    .name {
      font-size: ${design.font.includes('Display') || design.font.includes('Playfair') ? '30pt' : '26pt'};
      font-weight: ${design.font.includes('serif') ? '700' : '800'};
      margin-bottom: 7px;
      letter-spacing: ${design.font.includes('serif') ? '0.5px' : '-0.5px'};
      line-height: 1.1;
      ${design.headerBg === '#ffffff' ? `color: ${palette.primary};` : ''}
    }
    
    .title {
      font-size: ${design.font.includes('serif') ? '13pt' : '12pt'};
      margin-bottom: 13px;
      font-weight: ${design.font.includes('serif') ? '500' : '600'};
      ${design.headerBg === '#ffffff' ? `color: ${design.accentColor};` : 'opacity: 0.92;'}
      letter-spacing: 0.5px;
    }
    
    .contact {
      font-size: 9.5pt;
      display: flex;
      ${isCentered ? 'justify-content: center;' : ''}
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 11px;
    }
    
    .contact-item {
      display: inline-block;
      ${design.headerBg === '#ffffff' ? `color: ${palette.muted};` : 'opacity: 0.88;'}
    }
    
    .container {
      display: flex;
      ${isRightSidebar ? 'flex-direction: row-reverse;' : ''}
      gap: ${hasSidebar ? '22px' : '0'};
      padding: 0 28px 28px 28px;
    }
    
    .sidebar {
      width: ${design.sidebarWidth}%;
      background: ${design.sidebarBg};
      color: ${design.sidebarBg.includes(palette.dark) ? '#ffffff' : palette.text};
      padding: ${hasSidebar ? '22px 18px' : '0'};
      ${design.accentShape === 'vertical-bar' ? `border-left: 6px solid ${design.accentColor};` : ''}
      ${design.accentShape === 'frame-border' ? `border: 2px solid ${design.accentColor}40; padding: 24px;` : ''}
      ${!hasSidebar ? 'display: none;' : ''}
    }
    
    .main {
      flex: 1;
    }
    
    .section {
      margin-bottom: 24px;
      page-break-inside: avoid;
      ${design.accentShape === 'section-lines' ? `border-left: 3px solid ${design.accentColor}30; padding-left: 15px;` : ''}
    }
    
    .section-title {
      font-size: ${design.font.includes('serif') ? '13pt' : '12.5pt'};
      font-weight: ${design.font.includes('serif') ? '700' : '800'};
      color: ${design.accentColor};
      text-transform: uppercase;
      margin-bottom: 14px;
      padding-bottom: 7px;
      border-bottom: 2.5px solid ${design.accentColor};
      letter-spacing: ${design.font.includes('serif') ? '1px' : '1.3px'};
      ${design.accentShape === 'block-accent' ? `background: ${design.accentColor}10; padding: 8px 12px;` : ''}
    }
    
    .sidebar .section-title {
      font-size: 11pt;
      color: ${design.sidebarBg.includes(palette.dark) ? '#ffffff' : design.accentColor};
      border-bottom-color: ${design.sidebarBg.includes(palette.dark) ? '#ffffff50' : design.accentColor + '50'};
    }
    
    .entry {
      margin-bottom: 17px;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    
    .entry-title {
      font-size: 11.5pt;
      font-weight: ${design.font.includes('serif') ? '700' : '800'};
      color: ${palette.text};
    }
    
    .entry-date {
      font-size: 9pt;
      color: ${palette.muted};
      white-space: nowrap;
      font-style: ${design.font.includes('serif') ? 'italic' : 'normal'};
    }
    
    .entry-subtitle {
      font-size: 10.5pt;
      color: ${design.accentColor};
      margin-bottom: 3px;
      font-weight: 600;
      ${design.font.includes('serif') ? 'font-style: italic;' : ''}
    }
    
    .entry-location {
      font-size: 9pt;
      color: ${palette.muted};
      margin-bottom: 6px;
      font-style: italic;
    }
    
    .entry-description {
      font-size: 10pt;
      color: ${palette.text};
      line-height: 1.65;
      margin-top: 6px;
      text-align: justify;
    }
    
    .entry-description ul {
      margin-left: 18px;
      margin-top: 4px;
    }
    
    .entry-description li {
      margin-bottom: 3px;
    }
    
    .skill-item {
      display: inline-block;
      margin: 0 6px 8px 0;
      padding: ${design.font.includes('serif') ? '6px 13px' : '7px 15px'};
      background: ${design.sidebarBg.includes(palette.dark) ? '#ffffff18' : design.accentColor + '15'};
      border: 1.5px solid ${design.sidebarBg.includes(palette.dark) ? '#ffffff45' : design.accentColor + '40'};
      border-radius: ${design.accentShape.includes('modern') ? '6px' : '3px'};
      font-size: 9pt;
      font-weight: 600;
      color: ${design.sidebarBg.includes(palette.dark) ? '#ffffff' : design.accentColor};
    }
    
    .sidebar-item {
      margin-bottom: 11px;
      font-size: 9.5pt;
    }
    
    .sidebar-item strong {
      display: block;
      margin-bottom: 3px;
      font-size: 10pt;
      font-weight: 700;
      color: ${design.sidebarBg.includes(palette.dark) ? '#ffffff' : design.accentColor};
    }
    
    .photo {
      width: ${isCentered ? '105px' : '95px'};
      height: ${isCentered ? '105px' : '95px'};
      border-radius: ${design.accentShape.includes('modern') || design.accentShape.includes('gallery') ? '8px' : '50%'};
      object-fit: cover;
      border: 4px solid ${design.headerBg === '#ffffff' ? design.accentColor + '40' : 'rgba(255,255,255,0.3)'};
      box-shadow: 0 3px 10px rgba(0,0,0,0.15);
    }
    /* premium cards and badges */
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 8px; }
    .meta-card { background: ${palette.light}; border: 1px solid ${palette.primary}18; border-radius: 10px; padding: 12px 14px; box-shadow: 0 8px 22px rgba(0,0,0,0.06); text-align: center; }
    .meta-value { font-weight: 800; font-size: 18px; color: ${design.accentColor}; margin-bottom: 4px; }
    .meta-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #6b7280; }
    .project-card, .award-card, .cert-card { background: ${palette.light}; border: 1px solid ${design.accentColor}18; border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
    .project-head { display: flex; justify-content: space-between; gap: 10px; align-items: baseline; flex-wrap: wrap; }
    .project-title { font-weight: 700; color: ${palette.text}; font-size: 12pt; }
    .project-role { font-size: 10pt; color: ${design.accentColor}; font-weight: 600; }
    .project-date { font-size: 9pt; color: #6b7280; font-style: italic; }
    .project-desc { margin-top: 6px; font-size: 10pt; color: #4b5563; line-height: 1.65; }
    .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .tag { background: ${design.accentColor}; color: ${design.headerBg === '#ffffff' ? '#ffffff' : '#0f172a'}; padding: 5px 12px; border-radius: 999px; font-size: 9.5pt; font-weight: 700; letter-spacing: 0.3px; }
    .award-card { border-left: 4px solid ${design.accentColor}; }
    .cert-card { border-left: 4px solid ${palette.primary}; }
    .reference-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
    .reference-item { background: ${palette.light}; border: 1px solid ${design.accentColor}18; border-radius: 8px; padding: 12px; }

    /* Print */
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border-radius: 0; width: 210mm; min-height: 297mm; }
      .header, .sidebar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `;
  
  const sidebarContent = hasSidebar ? `
    <div class="sidebar">
      ${data.skills && data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${data.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        </div>
      ` : ''}
      
      ${data.languages && data.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">Languages</div>
          ${data.languages.map(lang => `
            <div class="sidebar-item">
              <strong>${lang.name || 'Language'}</strong>
              ${lang.proficiency || 'Proficient'}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="sidebar-item">
              <strong>${cert.name || 'Certification'}</strong>
              ${cert.issuer || ''}${cert.date ? ` • ${cert.date}` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  ` : '';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.name || 'CV'} - ${design.name}</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          ${data.includePhoto && data.photoUrl ? `
            <div style="display: flex; align-items: center; gap: 20px; ${isCentered ? 'flex-direction: column; justify-content: center;' : ''}">
              <img src="${data.photoUrl}" alt="Photo" class="photo" />
              <div style="${isCentered ? 'text-align: center;' : 'flex: 1;'}">
                <div class="name">${data.name || 'Your Name'}</div>
                <div class="title">${data.professionalTitle || 'Professional Title'}</div>
                <div class="contact">
                  ${data.email ? `<span class="contact-item">${data.email}</span>` : ''}
                  ${data.phone ? `<span class="contact-item">${data.phone}</span>` : ''}
                  ${data.location ? `<span class="contact-item">${data.location}</span>` : ''}
                  ${data.linkedin ? `<span class="contact-item">${data.linkedin}</span>` : ''}
                </div>
              </div>
            </div>
          ` : `
            <div class="name">${data.name || 'Your Name'}</div>
            <div class="title">${data.professionalTitle || 'Professional Title'}</div>
            <div class="contact">
              ${data.email ? `<span class="contact-item">${data.email}</span>` : ''}
              ${data.phone ? `<span class="contact-item">${data.phone}</span>` : ''}
              ${data.location ? `<span class="contact-item">${data.location}</span>` : ''}
              ${data.linkedin ? `<span class="contact-item">${data.linkedin}</span>` : ''}
            </div>
          `}
        </div>
        
        <div class="container">
          ${sidebarContent}
          
          <div class="main">
            ${data.summary ? `
              <div class="section">
                <div class="section-title">Summary</div>
                <div class="entry-description">${data.summary}</div>
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
            
            ${data.experience && data.experience.length > 0 ? `
              <div class="section">
                <div class="section-title">Experience</div>
                ${data.experience.map(exp => `
                  <div class="entry">
                    <div class="entry-header">
                      <div class="entry-title">${exp.position || 'Position'}</div>
                      <div class="entry-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                    </div>
                    <div class="entry-subtitle">${exp.company || 'Company'}</div>
                    ${exp.location ? `<div class="entry-location">${exp.location}</div>` : ''}
                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${data.projects && data.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${data.projects.map(project => `
                  <div class="project-card">
                    <div class="project-head">
                      <div>
                        <div class="project-title">${project.title || project.name || 'Project'}</div>
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
            
            ${data.education && data.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${data.education.map(edu => `
                  <div class="entry">
                    <div class="entry-header">
                      <div class="entry-title">${edu.degree || 'Degree'}</div>
                      <div class="entry-date">${edu.startDate || ''} - ${edu.endDate || 'Present'}</div>
                    </div>
                    <div class="entry-subtitle">${edu.institution || 'Institution'}</div>
                    ${edu.location ? `<div class="entry-location">${edu.location}</div>` : ''}
                    ${edu.description ? `<div class="entry-description">${edu.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${!hasSidebar && data.skills && data.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Skills</div>
                <div>${data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}</div>
              </div>
            ` : ''}
            
            ${!hasSidebar && data.certifications && data.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications</div>
                ${data.certifications.map(cert => `
                  <div class="entry">
                    <div class="entry-title">${cert.name || 'Certification'}</div>
                    ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
                    ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
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
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

export function creativeMeta() {
  return { archetype: 'creative', total: CREATIVE_COUNT };
}
