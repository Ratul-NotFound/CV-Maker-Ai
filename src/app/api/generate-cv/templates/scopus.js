import { getPalette } from './palette';
import { calculateContentDensity, getScaledValues, getA4PageStyle } from './contentScaler';

// Academic Scopus CV - World-Class Research & University Format
// Used for PhD applications, research positions, academic scholarships
const SCOPUS_COUNT = 10;

function variationIndex(templateId, count) {
  return ((templateId - 1) % count);
}

export function generateScopus(data, industry = 'research', templateId) {
  const idx = variationIndex(templateId, SCOPUS_COUNT);
  const palette = getPalette(industry);
  
  // 10 distinct academic layouts
  const layouts = [
    { sidebarWidth: '30%', headerStyle: 'classic', accentColor: '#1e40af' },
    { sidebarWidth: '35%', headerStyle: 'modern', accentColor: '#0d4a2d' },
    { sidebarWidth: '0%', headerStyle: 'centered', accentColor: '#7c2d12' },
    { sidebarWidth: '28%', headerStyle: 'classic', accentColor: '#1e3a8a' },
    { sidebarWidth: '32%', headerStyle: 'modern', accentColor: '#4a1d96' },
    { sidebarWidth: '0%', headerStyle: 'classic', accentColor: '#831843' },
    { sidebarWidth: '30%', headerStyle: 'centered', accentColor: '#0e7490' },
    { sidebarWidth: '33%', headerStyle: 'modern', accentColor: '#6d28d9' },
    { sidebarWidth: '0%', headerStyle: 'classic', accentColor: '#134e4a' },
    { sidebarWidth: '31%', headerStyle: 'centered', accentColor: '#9f1239' }
  ];
  
  const layout = layouts[idx];
  const hasSidebar = layout.sidebarWidth !== '0%';
  
  // Calculate content density for automatic scaling
  const density = calculateContentDensity(data);
  const scaled = getScaledValues(density, {
    baseFontSize: '11pt',
    titleSize: '22pt',
    sectionTitleSize: '13pt',
    entryTitleSize: '11.5pt'
  });
  
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
    
    ${getA4PageStyle(density)}
    
    @page { 
      size: A4; 
      margin: ${density.isUltraHighDensity ? '14mm' : density.isVeryHighDensity ? '16mm' : '20mm'};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Crimson Text', 'Lora', 'Times New Roman', Georgia, serif;
      font-size: ${scaled.baseFontSize};
      line-height: ${scaled.lineHeight};
      color: #1a1a1a;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      display: flex;
      gap: ${hasSidebar ? '20px' : '0'};
    }
    
    .sidebar {
      width: ${layout.sidebarWidth};
      ${!hasSidebar ? 'display: none;' : ''}
      background: ${hasSidebar ? `linear-gradient(to bottom, ${layout.accentColor}08 0%, #f8f9fa 100%)` : 'transparent'};
      padding: ${hasSidebar ? '20px 16px' : '0'};
      border-right: ${hasSidebar ? `3px solid ${layout.accentColor}20` : 'none'};
    }
    
    .main {
      flex: 1;
    }
    
    .header {
      ${layout.headerStyle === 'centered' ? 'text-align: center;' : ''}
      margin-bottom: 28px;
      padding-bottom: 18px;
      border-bottom: 3px solid transparent;
      border-image: linear-gradient(90deg, ${layout.accentColor} 0%, ${layout.secondaryColor} 100%) 1;
      position: relative;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -6px;
      ${layout.headerStyle === 'centered' ? 'left: 50%; transform: translateX(-50%);' : 'left: 0;'}
      width: ${layout.headerStyle === 'centered' ? '120px' : '160px'};
      height: 3px;
      background: linear-gradient(90deg, ${layout.secondaryColor} 0%, ${layout.tertiaryColor} 100%);
    }
    
    .name {
      font-family: 'Libre Baskerville', 'Lora', 'Crimson Text', serif;
      font-size: 26pt;
      font-weight: bold;
      background: linear-gradient(135deg, #1a1a1a 0%, ${layout.accentColor} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      letter-spacing: 0.8px;
      line-height: 1.1;
    }
    
    .title {
      font-family: 'Lora', 'Crimson Text', serif;
      font-size: 14pt;
      color: ${layout.accentColor};
      font-style: italic;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.3px;
    }
    
    .contact {
      font-size: 10pt;
      color: #333333;
      ${layout.headerStyle === 'centered' ? 'display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;' : ''}
    }
    
    .contact-item {
      ${layout.headerStyle === 'centered' ? '' : 'margin-right: 15px;'}
    }
    
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: ${layout.accentColor};
      text-transform: uppercase;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 1.5px solid ${layout.accentColor};
      letter-spacing: 0.8px;
    }
    
    .entry {
      margin-bottom: 14px;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .entry-title {
      font-size: 11.5pt;
      font-weight: bold;
      color: #000000;
    }
    
    .entry-date {
      font-size: 10pt;
      color: #666666;
      font-style: italic;
    }
    
    .entry-subtitle {
      font-size: 10.5pt;
      color: #333333;
      font-style: italic;
      margin-bottom: 3px;
    }
    
    .entry-location {
      font-size: 9.5pt;
      color: #666666;
      margin-bottom: 4px;
    }
    
    .entry-description {
      font-size: 10pt;
      color: #000000;
      line-height: 1.6;
      margin-top: 4px;
    }
    
    .publication {
      margin-bottom: 10px;
      padding-left: 20px;
      text-indent: -20px;
      font-size: 10pt;
      line-height: 1.6;
    }
    
    .publication-authors {
      font-weight: bold;
    }
    
    .publication-title {
      font-style: italic;
    }
    
    .publication-journal {
      color: #333333;
    }
    
    .skill-item {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: 6px;
      padding: 4px 10px;
      background: #e5e7eb;
      border-radius: 3px;
      font-size: 9.5pt;
      color: #000000;
    }
    
    .sidebar .section {
      margin-bottom: 18px;
    }
    
    .sidebar .section-title {
      font-size: 11pt;
      margin-bottom: 10px;
    }
    
    .sidebar-item {
      font-size: 9.5pt;
      margin-bottom: 6px;
      color: #000000;
    }
    
    .metrics {
      background: #f0f9ff;
      padding: 12px;
      border-left: 3px solid ${layout.accentColor};
      margin-bottom: 16px;
    }
    
    .metric-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 10pt;
    }
    
    .metric-label {
      font-weight: bold;
      color: #000000;
    }
    
    .metric-value {
      color: ${layout.accentColor};
      font-weight: bold;
    }
  `;
  
  const sidebarContent = hasSidebar ? `
    <div class="sidebar">
      ${data.skills && data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          ${data.skills.map(skill => `<div class="sidebar-item">• ${skill}</div>`).join('')}
        </div>
      ` : ''}
      
      ${data.languages && data.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">Languages</div>
          ${data.languages.map(lang => `
            <div class="sidebar-item"><strong>${lang.name || 'Language'}:</strong> ${lang.proficiency || 'Proficient'}</div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certifications.map(cert => `
            <div class="sidebar-item">• ${cert.name || 'Certification'}</div>
            ${cert.date ? `<div class="sidebar-item" style="margin-left: 10px; font-size: 8.5pt; color: #666;">${cert.date}</div>` : ''}
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
      <style>${css}</style>
    </head>
    <body>
      <div class="header">
        <div class="name">${data.name || 'Full Name'}</div>
        <div class="title">${data.professionalTitle || 'Research Scholar'}</div>
        <div class="contact">
          ${data.email ? `<span class="contact-item">✉ ${data.email}</span>` : ''}
          ${data.phone ? `<span class="contact-item">☎ ${data.phone}</span>` : ''}
          ${data.location ? `<span class="contact-item">📍 ${data.location}</span>` : ''}
          ${data.linkedin ? `<span class="contact-item">🔗 ${data.linkedin}</span>` : ''}
        </div>
      </div>
      
      <div class="container">
        ${sidebarContent}
        
        <div class="main">
          ${data.summary ? `
            <div class="section">
              <div class="section-title">Research Profile</div>
              <div class="entry-description">${data.summary}</div>
            </div>
          ` : ''}
          
          <div class="metrics">
            <div class="metric-item">
              <span class="metric-label">Research Focus:</span>
              <span class="metric-value">${industry === 'research' ? 'Multidisciplinary Research' : industry.charAt(0).toUpperCase() + industry.slice(1)}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Publications:</span>
              <span class="metric-value">${data.publications ? data.publications.length : (data.experience ? data.experience.length : 0)}+</span>
            </div>
          </div>
          
          ${data.education && data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Academic Qualifications</div>
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
          
          ${data.experience && data.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Research Experience</div>
              ${data.experience.map(exp => `
                <div class="entry">
                  <div class="entry-header">
                    <div class="entry-title">${exp.position || 'Position'}</div>
                    <div class="entry-date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
                  </div>
                  <div class="entry-subtitle">${exp.company || 'Institution'}</div>
                  ${exp.location ? `<div class="entry-location">${exp.location}</div>` : ''}
                  ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${data.publications && data.publications.length > 0 ? `
            <div class="section">
              <div class="section-title">Publications</div>
              ${data.publications.map((pub, index) => `
                <div class="publication">
                  [${index + 1}] <span class="publication-authors">${pub.authors || data.name || 'Author'}.</span>
                  <span class="publication-title">"${pub.title || 'Research Title'}."</span>
                  <span class="publication-journal">${pub.journal || 'Journal Name'}, ${pub.year || new Date().getFullYear()}.</span>
                  ${pub.doi ? ` DOI: ${pub.doi}` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${!hasSidebar && data.skills && data.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Technical Skills</div>
              <div>${data.skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}</div>
            </div>
          ` : ''}
          
          ${!hasSidebar && data.certifications && data.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications & Awards</div>
              ${data.certifications.map(cert => `
                <div class="entry">
                  <div class="entry-title">${cert.name || 'Certification'}</div>
                  ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
                  ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return html;
}

export function scopusMeta() {
  return { archetype: 'scopus', total: SCOPUS_COUNT };
}
