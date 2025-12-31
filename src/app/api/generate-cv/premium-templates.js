// ============================================================
// 🌟 PREMIUM WORLD-CLASS CV TEMPLATES
// ============================================================
// Enhanced templates based on world-class standards:
// - Modern: Inspired by Google, Apple, and tech industry leaders
// - Europass: Official EU format for global opportunities
// - Scopus: Academic research standard
// - Creative: Modern design-focused layouts
// - Executive: C-level professional presentations

const INDUSTRY_PALETTES = {
  technology: {
    primary: '#2563eb',
    secondary: '#0f172a',
    accent: '#3b82f6',
    background: '#f8fafc',
    text: '#1e293b',
    light: '#e0e7ff'
  },
  finance: {
    primary: '#1e40af',
    secondary: '#0f172a',
    accent: '#374151',
    background: '#ffffff',
    text: '#111827',
    light: '#dbeafe'
  },
  healthcare: {
    primary: '#059669',
    secondary: '#065f46',
    accent: '#10b981',
    background: '#f0fdf4',
    text: '#064e3b',
    light: '#d1fae5'
  },
  education: {
    primary: '#7c3aed',
    secondary: '#5b21b6',
    accent: '#8b5cf6',
    background: '#faf5ff',
    text: '#3b0764',
    light: '#ede9fe'
  },
  marketing: {
    primary: '#ec4899',
    secondary: '#be185d',
    accent: '#f472b6',
    background: '#fdf2f8',
    text: '#831843',
    light: '#fbcfe8'
  },
  engineering: {
    primary: '#ea580c',
    secondary: '#9a3412',
    accent: '#f97316',
    background: '#fff7ed',
    text: '#7c2d12',
    light: '#fed7aa'
  },
  law: {
    primary: '#6d28d9',
    secondary: '#4c1d95',
    accent: '#8b5cf6',
    background: '#faf5ff',
    text: '#3b0764',
    light: '#ede9fe'
  },
  creative: {
    primary: '#db2777',
    secondary: '#9d174d',
    accent: '#ec4899',
    background: '#fdf2f8',
    text: '#831843',
    light: '#fbcfe8'
  },
  research: {
    primary: '#0d9488',
    secondary: '#115e59',
    accent: '#14b8a6',
    background: '#f0fdfa',
    text: '#134e4a',
    light: '#ccfbf1'
  },
  consulting: {
    primary: '#0e7490',
    secondary: '#155e75',
    accent: '#06b6d4',
    background: '#ecfeff',
    text: '#164e63',
    light: '#cffafe'
  }
};

// ============================================================
// 🎯 MODERN TEMPLATE VARIATIONS (World-Class)
// ============================================================

/**
 * Modern Template 5: Minimalist Professional
 * Inspired by: LinkedIn, Indeed, ATS-optimized systems
 * Features: Clean, scannable, ATS-friendly
 */
function modernTemplate5(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const languages = data.languages || [];

  const renderBullets = (text) => {
    if (!text) return '';
    return text.split('\n').filter(Boolean).map(line => `<li>${line.trim()}</li>`).join('');
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'} - Professional Resume</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --text: ${palette.text};
        --light: ${palette.light};
      }
      @page { size: A4; margin: 12mm; }
      body {
        font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        color: var(--text);
        line-height: 1.6;
        font-size: 10pt;
        width: 210mm;
        height: 297mm;
      }
      .container {
        width: 100%;
        padding: 12mm;
        background: white;
      }
      .header {
        margin-bottom: 10mm;
        border-left: 4mm solid var(--primary);
        padding-left: 8mm;
      }
      .header h1 {
        font-size: 18pt;
        font-weight: 700;
        margin-bottom: 2mm;
        letter-spacing: -0.5pt;
      }
      .header .title {
        font-size: 11pt;
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 3mm;
      }
      .contact {
        display: flex;
        flex-wrap: wrap;
        gap: 8mm;
        font-size: 9pt;
        color: #666;
      }
      .section {
        margin-bottom: 8mm;
      }
      .section-title {
        font-size: 11pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1pt;
        color: var(--primary);
        margin-bottom: 4mm;
        padding-bottom: 2mm;
        border-bottom: 1pt solid #e0e0e0;
      }
      .entry {
        margin-bottom: 4mm;
        page-break-inside: avoid;
      }
      .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 1mm;
      }
      .entry-title {
        font-weight: 700;
        font-size: 10.5pt;
      }
      .entry-subtitle {
        font-size: 10pt;
        color: var(--primary);
        font-weight: 600;
      }
      .entry-date {
        font-size: 9pt;
        color: #888;
        white-space: nowrap;
      }
      .entry-description {
        font-size: 9.5pt;
        color: #444;
        margin-left: 0;
      }
      .entry-description ul {
        margin: 2mm 0 2mm 5mm;
        padding-left: 5mm;
      }
      .entry-description li {
        margin-bottom: 1.5mm;
      }
      .skills-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6mm;
      }
      .skill-category h4 {
        font-size: 9.5pt;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 2mm;
      }
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 3mm;
      }
      .skill {
        background: var(--light);
        color: var(--primary);
        padding: 2mm 5mm;
        border-radius: 1mm;
        font-size: 8.5pt;
        font-weight: 500;
        white-space: nowrap;
      }
      @media print {
        body { margin: 0; padding: 0; }
        .container { margin: 0; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${personalInfo.fullName || 'Your Name'}</h1>
        <div class="title">${personalInfo.professionalTitle || 'Professional'}</div>
        <div class="contact">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
          ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
          ${personalInfo.linkedin ? `<span>LinkedIn: ${personalInfo.linkedin}</span>` : ''}
        </div>
      </div>

      ${personalInfo.summary ? `
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div style="font-size: 9.5pt; line-height: 1.5; text-align: justify;">
          ${personalInfo.summary}
        </div>
      </div>
      ` : ''}

      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experience.map(exp => `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${exp.position || ''}</div>
              <div class="entry-subtitle">${exp.company || ''}</div>
            </div>
            <div class="entry-date">${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
          </div>
          ${exp.description ? `<div class="entry-description"><ul>${renderBullets(exp.description)}</ul></div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map(edu => `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${edu.degree || ''}</div>
              <div class="entry-subtitle">${edu.institution || ''}</div>
            </div>
            <div class="entry-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
          ${skills.slice(0, 20).map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </div>
      ` : ''}

      ${languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Languages</div>
        <div style="font-size: 9.5pt;">
          ${languages.map(lang => `<div>${lang}</div>`).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  </body>
  </html>
  `;
}

/**
 * Modern Template 6: Bold Progressive
 * Inspired by: Startup culture, tech companies (Stripe, GitHub)
 * Features: Modern typography, accent colors, dynamic layout
 */
function modernTemplate6(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);

  const renderBullets = (text) => {
    if (!text) return '';
    return text.split('\n').filter(Boolean).map(line => `<li>${line.trim()}</li>`).join('');
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --text: ${palette.text};
        --light: ${palette.light};
      }
      @page { size: A4; margin: 15mm; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        color: var(--text);
        background: white;
        width: 210mm;
        height: 297mm;
      }
      .wrapper {
        padding: 15mm;
        height: 100%;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12mm;
        padding-bottom: 8mm;
        border-bottom: 3pt solid var(--primary);
      }
      .name-block h1 {
        font-size: 20pt;
        font-weight: 800;
        margin-bottom: 3mm;
        line-height: 1.1;
      }
      .name-block .title {
        font-size: 12pt;
        color: var(--primary);
        font-weight: 600;
        letter-spacing: 0.5pt;
        text-transform: uppercase;
      }
      .contact-block {
        text-align: right;
        font-size: 9.5pt;
      }
      .contact-block > div {
        margin: 2mm 0;
      }
      .section {
        margin-bottom: 10mm;
      }
      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 5mm;
      }
      .section-title {
        font-size: 12pt;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5pt;
        color: var(--primary);
      }
      .section-divider {
        flex-grow: 1;
        height: 1pt;
        background: var(--light);
        margin-left: 6mm;
      }
      .entry {
        margin-bottom: 5mm;
        page-break-inside: avoid;
      }
      .entry-top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 2mm;
      }
      .entry-position {
        font-weight: 700;
        font-size: 11pt;
      }
      .entry-company {
        font-size: 10.5pt;
        color: var(--primary);
        font-weight: 600;
      }
      .entry-date {
        font-size: 9pt;
        color: #999;
      }
      .entry-description {
        font-size: 9.5pt;
        color: #555;
      }
      .entry-description ul {
        margin: 2mm 0 0 5mm;
        padding-left: 5mm;
      }
      .entry-description li {
        margin-bottom: 1mm;
      }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 3mm;
        margin-top: 3mm;
      }
      .tag {
        background: var(--light);
        color: var(--primary);
        padding: 2mm 5mm;
        border-radius: 2mm;
        font-size: 8.5pt;
        font-weight: 600;
      }
      @media print {
        body { margin: 0; padding: 0; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header-section">
        <div class="name-block">
          <h1>${personalInfo.fullName || 'Name'}</h1>
          <div class="title">${personalInfo.professionalTitle || 'Professional'}</div>
        </div>
        <div class="contact-block">
          ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
        </div>
      </div>

      ${personalInfo.summary ? `
      <div class="section">
        <div style="font-size: 9.5pt; line-height: 1.6; color: #666;">${personalInfo.summary}</div>
      </div>
      ` : ''}

      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Experience</div>
          <div class="section-divider"></div>
        </div>
        ${experience.map(exp => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-position">${exp.position}</div>
              <div class="entry-company">${exp.company}</div>
            </div>
            <div class="entry-date">${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
          </div>
          ${exp.description ? `<div class="entry-description"><ul>${renderBullets(exp.description)}</ul></div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${education.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Education</div>
          <div class="section-divider"></div>
        </div>
        ${education.map(edu => `
        <div class="entry">
          <div class="entry-top">
            <div>
              <div class="entry-position">${edu.degree}</div>
              <div class="entry-company">${edu.institution}</div>
            </div>
            <div class="entry-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Skills</div>
          <div class="section-divider"></div>
        </div>
        <div class="tags">
          ${skills.slice(0, 20).map(skill => `<div class="tag">${skill}</div>`).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  </body>
  </html>
  `;
}

/**
 * Modern Template 7: Two-Column Professional
 * Inspired by: European professional standards
 * Features: Sidebar layout, clear hierarchy, ATS-friendly
 */
function modernTemplate7(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const languages = data.languages || [];

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${personalInfo.fullName || 'CV'}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      :root {
        --primary: ${palette.primary};
        --text: ${palette.text};
        --light: ${palette.light};
      }
      @page { size: A4; margin: 0; }
      body {
        font-family: 'Calibri', 'Arial', sans-serif;
        color: var(--text);
        width: 210mm;
        height: 297mm;
      }
      .container {
        display: flex;
        height: 100%;
      }
      .sidebar {
        width: 30%;
        background: var(--light);
        padding: 15mm;
        font-size: 9pt;
      }
      .main {
        width: 70%;
        padding: 15mm;
      }
      .header {
        margin-bottom: 8mm;
        border-bottom: 2pt solid var(--primary);
        padding-bottom: 5mm;
      }
      .header h1 {
        font-size: 16pt;
        font-weight: bold;
        margin-bottom: 2mm;
      }
      .header .title {
        color: var(--primary);
        font-weight: 600;
        font-size: 10pt;
      }
      .section-title {
        font-size: 11pt;
        font-weight: bold;
        color: var(--primary);
        margin-top: 8mm;
        margin-bottom: 3mm;
        padding-bottom: 2mm;
        border-bottom: 1pt solid var(--primary);
      }
      .sidebar .section-title {
        margin-top: 6mm;
        font-size: 10pt;
      }
      .entry {
        margin-bottom: 4mm;
        page-break-inside: avoid;
      }
      .entry-title {
        font-weight: bold;
        font-size: 10pt;
      }
      .entry-subtitle {
        color: var(--primary);
        font-weight: 600;
        font-size: 9.5pt;
      }
      .entry-date {
        color: #999;
        font-size: 9pt;
      }
      .entry-description {
        font-size: 9pt;
        color: #555;
        margin-top: 1mm;
      }
      .skill-item {
        margin-bottom: 3mm;
        line-height: 1.4;
      }
      .skill-name {
        font-weight: 600;
        color: var(--primary);
      }
      @media print {
        body { margin: 0; }
        .container { height: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="sidebar">
        <div class="header">
          <h1 style="font-size: 14pt; margin-bottom: 1mm;">${personalInfo.fullName || 'Name'}</h1>
        </div>

        <div class="section-title">Contact</div>
        <div style="font-size: 8.5pt; line-height: 1.6;">
          ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
        </div>

        ${skills.length > 0 ? `
        <div class="section-title">Skills</div>
        ${skills.slice(0, 15).map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        ` : ''}

        ${languages.length > 0 ? `
        <div class="section-title">Languages</div>
        ${languages.map(lang => `<div class="skill-item">${lang}</div>`).join('')}
        ` : ''}
      </div>

      <div class="main">
        ${personalInfo.summary ? `
        <div style="font-size: 9.5pt; margin-bottom: 6mm; line-height: 1.5; color: #666;">
          ${personalInfo.summary}
        </div>
        ` : ''}

        ${experience.length > 0 ? `
        <div class="section-title">Professional Experience</div>
        ${experience.map(exp => `
        <div class="entry">
          <div class="entry-title">${exp.position}</div>
          <div class="entry-subtitle">${exp.company}</div>
          <div class="entry-date">${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
          ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
        </div>
        `).join('')}
        ` : ''}

        ${education.length > 0 ? `
        <div class="section-title">Education</div>
        ${education.map(edu => `
        <div class="entry">
          <div class="entry-title">${edu.degree}</div>
          <div class="entry-subtitle">${edu.institution}</div>
          <div class="entry-date">${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}</div>
        </div>
        `).join('')}
        ` : ''}
      </div>
    </div>
  </body>
  </html>
  `;
}

// Helper function (would be imported from main file)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function getAllSkills(skillsObj) {
  if (!skillsObj) return [];
  return [
    ...(skillsObj.technical || []),
    ...(skillsObj.soft || []),
    ...(skillsObj.tools || [])
  ].filter(Boolean);
}

export {
  modernTemplate5,
  modernTemplate6,
  modernTemplate7,
  INDUSTRY_PALETTES,
  formatDate,
  getAllSkills
};
