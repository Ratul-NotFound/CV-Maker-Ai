import { getPalette } from './palette';
import { calculateContentDensity, getScaledValues, getA4PageStyle } from './contentScaler';

// Official Europass CV - Matches European Union Standard Format
// Used for university scholarships, EU job applications, academic positions
const EUROPASS_COUNT = 1;

export function generateEuropass(data, industry = 'education', templateId) {
  const palette = getPalette(industry);
  
  // Calculate content density for automatic scaling
  const density = calculateContentDensity(data);
  const scaled = getScaledValues(density, {
    baseFontSize: '11pt',
    titleSize: '18pt',
    sectionTitleSize: '12pt',
    entryTitleSize: '11pt'
  });
  
  const css = `
    ${getA4PageStyle(density)}
    
    @page { 
      size: A4; 
      margin: ${density.isUltraHighDensity ? '12mm' : density.isVeryHighDensity ? '14mm' : '18mm'};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: ${scaled.baseFontSize};
      line-height: ${scaled.lineHeight};
      color: #000000;
      background: #ffffff;
    }
    
    .europass-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid ${palette.primary};
    }
    
    .europass-title {
      font-size: 16pt;
      font-weight: bold;
      color: ${palette.primary};
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    .europass-subtitle {
      font-size: 9pt;
      color: #666666;
      font-style: italic;
    }
    
    .personal-info {
      margin-bottom: 18px;
    }
    
    .personal-info h1 {
      font-size: ${scaled.titleSize};
      font-weight: bold;
      color: #000000;
      margin-bottom: ${scaled.sectionTitleMargin};
      text-transform: uppercase;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 12px;
      font-size: 10pt;
      margin-top: 8px;
    }
    
    .contact-label {
      font-weight: bold;
      color: #333333;
    }
    
    .contact-value {
      color: #000000;
    }
    
    .section {
      margin-bottom: ${scaled.sectionSpacing};
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: ${scaled.sectionTitleSize};
      font-weight: bold;
      color: ${palette.primary};
      text-transform: uppercase;
      margin-bottom: ${scaled.sectionTitleMargin};
      padding-bottom: 4px;
      border-bottom: 1.5px solid ${palette.primary};
      letter-spacing: 0.5px;
    }
    
    .entry {
      margin-bottom: ${scaled.entrySpacing};
      padding-left: 0;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    
    .entry-title {
      font-size: 11pt;
      font-weight: bold;
      color: #000000;
    }
    
    .entry-date {
      font-size: 10pt;
      color: #666666;
      font-style: italic;
    }
    
    .entry-subtitle {
      font-size: 10pt;
      color: #333333;
      margin-bottom: 3px;
    }
    
    .entry-location {
      font-size: 9pt;
      color: #666666;
      margin-bottom: 4px;
    }
    
    .entry-description {
      font-size: 10pt;
      color: #000000;
      line-height: 1.5;
      margin-top: 4px;
    }
    
    .entry-description ul {
      margin-left: 18px;
      margin-top: 3px;
    }
    
    .entry-description li {
      margin-bottom: 2px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 8px;
      font-size: 10pt;
    }
    
    .skill-category {
      font-weight: bold;
      color: #000000;
    }
    
    .skill-list {
      color: #000000;
    }
    
    .languages-section {
      margin-top: 8px;
    }
    
    .language-entry {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 10pt;
    }
    
    .language-name {
      font-weight: bold;
      color: #000000;
    }
    
    .language-level {
      color: #333333;
    }
    
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #cccccc;
      font-size: 8pt;
      color: #999999;
      text-align: center;
    }
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${css}</style>
    </head>
    <body>
      <div class="europass-header">
        <div class="europass-title">Curriculum Vitae</div>
        <div class="europass-subtitle">Europass Format</div>
      </div>
      
      <div class="personal-info">
        <h1>${data.name || 'Full Name'}</h1>
        <div class="contact-grid">
          ${data.email ? `<div class="contact-label">Email:</div><div class="contact-value">${data.email}</div>` : ''}
          ${data.phone ? `<div class="contact-label">Phone:</div><div class="contact-value">${data.phone}</div>` : ''}
          ${data.location ? `<div class="contact-label">Address:</div><div class="contact-value">${data.location}</div>` : ''}
          ${data.linkedin ? `<div class="contact-label">LinkedIn:</div><div class="contact-value">${data.linkedin}</div>` : ''}
        </div>
      </div>
      
      ${data.summary ? `
        <div class="section">
          <div class="section-title">Personal Statement</div>
          <div class="entry-description">${data.summary}</div>
        </div>
      ` : ''}
      
      ${data.experience && data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
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
      
      ${data.education && data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education and Training</div>
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
      
      ${data.skills && data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Personal Skills</div>
          <div class="skills-grid">
            <div class="skill-category">Technical Skills:</div>
            <div class="skill-list">${data.skills.join(' • ')}</div>
          </div>
        </div>
      ` : ''}
      
      ${data.languages && data.languages.length > 0 ? `
        <div class="section">
          <div class="section-title">Language Skills</div>
          <div class="languages-section">
            ${data.languages.map(lang => `
              <div class="language-entry">
                <div class="language-name">${lang.name || 'Language'}</div>
                <div class="language-level">${lang.proficiency || 'Proficient'}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${data.certifications && data.certifications.length > 0 ? `
        <div class="section">
          <div class="section-title">Additional Information</div>
          ${data.certifications.map(cert => `
            <div class="entry">
              <div class="entry-title">${cert.name || 'Certification'}</div>
              ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
              ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="footer">
        © European Union, 2002-2024 | europass.cedefop.europa.eu
      </div>
    </body>
    </html>
  `;
  
  return html;
}

export function europassMeta() {
  return { archetype: 'europass', total: EUROPASS_COUNT };
}
