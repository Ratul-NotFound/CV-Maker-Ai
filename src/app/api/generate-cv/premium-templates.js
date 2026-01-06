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
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

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
          ${personalInfo.email ? `<span>✉ ${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>☎ ${personalInfo.phone}</span>` : ''}
          ${personalInfo.city && personalInfo.country ? `<span>📍 ${personalInfo.city}, ${personalInfo.country}</span>` : personalInfo.address ? `<span>📍 ${personalInfo.address}</span>` : ''}
          ${personalInfo.linkedin ? `<span>🔗 ${personalInfo.linkedin}</span>` : ''}
          ${personalInfo.website ? `<span>🌐 ${personalInfo.website}</span>` : ''}
          ${personalInfo.github ? `<span>💻 GitHub: ${personalInfo.github}</span>` : ''}
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
          ${languages.map(lang => `<div style="margin-bottom: 1.5mm;"><strong>${lang.language || lang}</strong>${lang.proficiency ? ` - ${lang.proficiency}` : ''}</div>`).join('')}
        </div>
      </div>
      ` : ''}

      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(proj => `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${proj.name || proj.title || ''}</div>
              ${proj.technologies ? `<div class="entry-subtitle">${proj.technologies}</div>` : ''}
            </div>
            ${proj.year ? `<div class="entry-date">${proj.year}</div>` : ''}
          </div>
          ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
          ${proj.link ? `<div style="font-size: 9pt; color: var(--primary); margin-top: 1mm;">🔗 ${proj.link}</div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-title">${cert.name || cert.title || ''}</div>
            ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
          </div>
          ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
          ${cert.credentialId ? `<div style="font-size: 8.5pt; color: #666; margin-top: 1mm;">ID: ${cert.credentialId}</div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${publications.length > 0 ? `
      <div class="section">
        <div class="section-title">Publications</div>
        ${publications.map((pub, idx) => `
        <div class="entry">
          <div style="font-size: 9.5pt; margin-bottom: 2mm;">
            <strong>${idx + 1}. ${pub.title || ''}</strong>
          </div>
          ${pub.authors ? `<div style="font-size: 9pt; color: #666; margin-bottom: 1mm;">${pub.authors}</div>` : ''}
          ${pub.journal ? `<div style="font-size: 9pt; font-style: italic;">${pub.journal}${pub.year ? `, ${pub.year}` : ''}</div>` : ''}
          ${pub.doi ? `<div style="font-size: 8.5pt; color: var(--primary); margin-top: 1mm;">DOI: ${pub.doi}</div>` : ''}
        </div>
        `).join('')}
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
  const languages = data.languages || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

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

      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Projects</div>
          <div class="section-divider"></div>
        </div>
        ${projects.map(proj => `
        <div class="entry">
          <div class="entry-position">${proj.name || proj.title}</div>
          ${proj.technologies ? `<div class="entry-company">${proj.technologies}</div>` : ''}
          ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
          ${proj.link ? `<div style="color: var(--primary); font-size: 9pt; margin-top: 2mm;">${proj.link}</div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${certifications.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Certifications</div>
          <div class="section-divider"></div>
        </div>
        ${certifications.map(cert => `
        <div class="entry">
          <div class="entry-top">
            <div class="entry-position">${cert.name || cert.title}</div>
            ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
          </div>
          ${cert.issuer ? `<div class="entry-company">${cert.issuer}</div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${publications.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Publications</div>
          <div class="section-divider"></div>
        </div>
        ${publications.map((pub, idx) => `
        <div class="entry">
          <div class="entry-position">${idx + 1}. ${pub.title}</div>
          ${pub.authors ? `<div class="entry-company">${pub.authors}</div>` : ''}
          ${pub.journal ? `<div style="font-size: 9pt; font-style: italic; color: #666;">${pub.journal}${pub.year ? `, ${pub.year}` : ''}</div>` : ''}
          ${pub.doi ? `<div style="font-size: 8.5pt; color: var(--primary); margin-top: 1mm;">DOI: ${pub.doi}</div>` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${languages.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">Languages</div>
          <div class="section-divider"></div>
        </div>
        <div class="tags">
          ${languages.map(lang => `<div class="tag">${typeof lang === 'object' ? `${lang.language || ''} - ${lang.proficiency || ''}` : lang}</div>`).join('')}
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
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

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
          ${personalInfo.email ? `<div>📧 ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>📞 ${personalInfo.phone}</div>` : ''}
          ${personalInfo.city && personalInfo.country ? `<div>📍 ${personalInfo.city}, ${personalInfo.country}</div>` : personalInfo.address ? `<div>📍 ${personalInfo.address}</div>` : ''}
          ${personalInfo.linkedin ? `<div>🔗 ${personalInfo.linkedin}</div>` : ''}
          ${personalInfo.website ? `<div>🌐 ${personalInfo.website}</div>` : ''}
          ${personalInfo.github ? `<div>💻 ${personalInfo.github}</div>` : ''}
          ${personalInfo.orcid ? `<div>🔬 ORCID: ${personalInfo.orcid}</div>` : ''}
        </div>

        ${skills.length > 0 ? `
        <div class="section-title">Skills</div>
        ${skills.slice(0, 15).map(skill => `<div class="skill-item">${skill}</div>`).join('')}
        ` : ''}

        ${languages.length > 0 ? `
        <div class="section-title">Languages</div>
        ${languages.map(lang => `<div class="skill-item">${typeof lang === 'object' ? `${lang.language || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}` : lang}</div>`).join('')}
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

        ${projects.length > 0 ? `
        <div class="section-title">Projects</div>
        ${projects.map(proj => `
        <div class="entry">
          <div class="entry-title">${proj.name || proj.title}</div>
          ${proj.technologies ? `<div class="entry-subtitle">${proj.technologies}</div>` : ''}
          ${proj.year ? `<div class="entry-date">${proj.year}</div>` : ''}
          ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
          ${proj.link ? `<div style="color: var(--primary); font-size: 8.5pt; margin-top: 1mm;">${proj.link}</div>` : ''}
        </div>
        `).join('')}
        ` : ''}

        ${certifications.length > 0 ? `
        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
        <div class="entry">
          <div class="entry-title">${cert.name || cert.title}</div>
          ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
          ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
          ${cert.credentialId ? `<div style="font-size: 8pt; color: #888;">ID: ${cert.credentialId}</div>` : ''}
        </div>
        `).join('')}
        ` : ''}

        ${publications.length > 0 ? `
        <div class="section-title">Publications</div>
        ${publications.map((pub, idx) => `
        <div class="entry">
          <div class="entry-title">${idx + 1}. ${pub.title}</div>
          ${pub.authors ? `<div style="font-size: 9pt; color: #666;">${pub.authors}</div>` : ''}
          ${pub.journal ? `<div class="entry-subtitle">${pub.journal}${pub.year ? `, ${pub.year}` : ''}</div>` : ''}
          ${pub.doi ? `<div style="font-size: 8.5pt; color: var(--primary);">DOI: ${pub.doi}</div>` : ''}
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

/**
 * PREMIUM Template 8: Two-Column Sidebar
 * Inspired by: Resume.io, Novoresume
 * Features: Left sidebar, modern icons, visual skills
 */
function premiumTemplate8(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const languages = data.languages || [];
  const certifications = data.certifications || [];
  const projects = data.projects || [];
  const publications = data.publications || [];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${personalInfo.fullName || 'CV'}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font:11pt/1.7 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2d3748;width:210mm;min-height:297mm}
.container{display:grid;grid-template-columns:75mm 1fr;min-height:297mm}
.sidebar{background:linear-gradient(135deg,${palette.primary},${palette.secondary});color:#fff;padding:20mm 6mm}
.main{padding:15mm 12mm 15mm 10mm;background:#fff}
.photo-placeholder{width:60mm;height:60mm;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto 8mm;display:flex;align-items:center;justify-content:center;font-size:36pt;font-weight:700}
.sidebar h1{font-size:18pt;font-weight:700;margin-bottom:3mm;text-align:center;line-height:1.3}
.sidebar .title{font-size:11pt;opacity:0.95;text-align:center;margin-bottom:8mm;font-weight:400}
.sidebar-section{margin-bottom:8mm}
.sidebar-section h3{font-size:10pt;font-weight:700;margin-bottom:3mm;text-transform:uppercase;letter-spacing:1pt;border-bottom:1pt solid rgba(255,255,255,0.3);padding-bottom:2mm}
.contact-item{margin-bottom:2.5mm;display:flex;align-items:center;font-size:9pt;line-height:1.4}
.contact-item::before{content:'■';margin-right:2mm;opacity:0.7}
.skill-item{margin-bottom:3mm}
.skill-name{font-size:9pt;margin-bottom:1.5mm;font-weight:500}
.skill-bar{height:6pt;background:rgba(255,255,255,0.25);border-radius:3pt;overflow:hidden}
.skill-progress{height:100%;background:#fff;border-radius:3pt}
.main h2{font-size:13pt;font-weight:700;color:${palette.primary};margin-bottom:5mm;text-transform:uppercase;letter-spacing:0.5pt;border-bottom:2pt solid ${palette.primary};padding-bottom:2mm}
.experience-item,.education-item{margin-bottom:6mm;padding-left:4mm;border-left:2pt solid ${palette.accent};padding-bottom:4mm}
.job-title{font-size:11pt;font-weight:700;color:#1a202c;margin-bottom:1mm}
.company{font-size:10pt;font-weight:600;color:${palette.primary};margin-bottom:1mm}
.date{font-size:9pt;color:#718096;margin-bottom:2mm;font-style:italic}
.job-desc{font-size:10pt;line-height:1.6;color:#4a5568}
ul{margin-left:5mm;margin-top:2mm}
li{margin-bottom:1.5mm;color:#4a5568}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body>
<div class="container">
<div class="sidebar">
<div class="photo-placeholder">${(personalInfo.fullName || 'CV')[0].toUpperCase()}</div>
<h1>${personalInfo.fullName || 'Your Name'}</h1>
<div class="title">${personalInfo.professionalTitle || 'Professional Title'}</div>

<div class="sidebar-section">
<h3>Contact</h3>
${personalInfo.email ? `<div class="contact-item">${personalInfo.email}</div>` : ''}
${personalInfo.phone ? `<div class="contact-item">${personalInfo.phone}</div>` : ''}
${personalInfo.city ? `<div class="contact-item">${personalInfo.city}${personalInfo.country ? ', ' + personalInfo.country : ''}</div>` : ''}
${personalInfo.linkedin ? `<div class="contact-item">LinkedIn</div>` : ''}
</div>

${skills.length > 0 ? `
<div class="sidebar-section">
<h3>Skills</h3>
${skills.slice(0, 8).map(skill => `
<div class="skill-item">
<div class="skill-name">${skill}</div>
<div class="skill-bar"><div class="skill-progress" style="width:${75 + Math.random() * 25}%"></div></div>
</div>`).join('')}
</div>` : ''}

${languages.length > 0 ? `
<div class="sidebar-section">
<h3>Languages</h3>
${languages.map(lang => `<div class="contact-item">${typeof lang === 'string' ? lang : lang.language || ''} - ${lang.proficiency || 'Proficient'}</div>`).join('')}
</div>` : ''}
</div>

<div class="main">
${personalInfo.summary ? `
<h2>Profile</h2>
<p style="margin-bottom:8mm;line-height:1.7;color:#4a5568">${personalInfo.summary}</p>` : ''}

${experience.length > 0 ? `
<h2>Experience</h2>
${experience.map(exp => `
<div class="experience-item">
<div class="job-title">${exp.position || 'Position'}</div>
<div class="company">${exp.company || 'Company'}</div>
<div class="date">${exp.startDate || 'Start'} - ${exp.current ? 'Present' : exp.endDate || 'End'}</div>
${exp.description ? `<div class="job-desc">${exp.description}</div>` : ''}
</div>`).join('')}` : ''}

${education.length > 0 ? `
<h2>Education</h2>
${education.map(edu => `
<div class="education-item">
<div class="job-title">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
<div class="company">${edu.institution || 'Institution'}</div>
<div class="date">${edu.graduationYear || edu.endDate || edu.startDate || 'Year'}</div>
${edu.grade ? `<div class="job-desc">Grade: ${edu.grade}</div>` : ''}
</div>`).join('')}` : ''}

${certifications.length > 0 ? `
<h2>Certifications</h2>
<ul>
${certifications.map(cert => `<li>${typeof cert === 'string' ? cert : `${cert.name || cert.title}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}`}</li>`).join('')}
</ul>` : ''}

${projects.length > 0 ? `
<h2>Projects</h2>
${projects.map(proj => `
<div class="experience-item">
<div class="job-title">${proj.name || proj.title}</div>
${proj.technologies ? `<div class="company">${proj.technologies}</div>` : ''}
${proj.description ? `<div class="job-desc">${proj.description}</div>` : ''}
${proj.link ? `<div class="date">${proj.link}</div>` : ''}
</div>`).join('')}` : ''}

${publications.length > 0 ? `
<h2>Publications</h2>
<ul>
${publications.map(pub => `<li>${pub.title}${pub.authors ? ` - ${pub.authors}` : ''}${pub.journal ? `. ${pub.journal}` : ''}${pub.year ? `, ${pub.year}` : ''}${pub.doi ? `. DOI: ${pub.doi}` : ''}</li>`).join('')}
</ul>` : ''}
</div>
</div>
</body></html>`;
}

/**
 * PREMIUM Template 9: Elegant Executive
 * Inspired by: Harvard Business School, Executive search firms
 * Features: Sophisticated, minimal, high-end
 */
function premiumTemplate9(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const languages = data.languages || [];
  const certifications = data.certifications || [];
  const projects = data.projects || [];
  const publications = data.publications || [];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${personalInfo.fullName || 'Executive CV'}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font:11pt/1.8 'Inter',sans-serif;color:#1a1a1a;width:210mm;min-height:297mm;background:#fff;padding:20mm}
.header{text-align:center;margin-bottom:12mm;padding-bottom:8mm;border-bottom:1pt solid ${palette.primary}}
h1{font:700 32pt/1.2 'Playfair Display',serif;color:${palette.primary};margin-bottom:3mm;letter-spacing:-0.5pt}
.subtitle{font-size:13pt;color:#4a5568;font-weight:500;margin-bottom:4mm}
.contact{display:flex;justify-content:center;gap:6mm;flex-wrap:wrap;font-size:9.5pt;color:#6b7280}
.contact span{padding:0 2mm}
.section{margin-bottom:10mm}
.section-title{font:600 14pt/1.3 'Playfair Display',serif;color:${palette.primary};margin-bottom:5mm;text-transform:uppercase;letter-spacing:1pt}
.executive-summary{font-size:10.5pt;line-height:1.9;color:#374151;text-align:justify;background:#f9fafb;padding:6mm;border-left:3pt solid ${palette.primary};margin-bottom:10mm}
.experience-item{margin-bottom:7mm;page-break-inside:avoid}
.exp-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2mm}
.position{font-size:12pt;font-weight:700;color:#111827}
.company{font-size:10.5pt;font-weight:600;color:${palette.primary};margin-bottom:1mm}
.dates{font-size:9.5pt;color:#6b7280;font-style:italic}
.achievements{margin-top:2mm}
.achievements li{margin-bottom:2mm;line-height:1.7;color:#4a5568}
.education-grid{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.edu-item{background:#f9fafb;padding:5mm;border-top:2pt solid ${palette.primary}}
.degree{font-weight:700;font-size:10.5pt;margin-bottom:1mm;color:#111827}
.school{font-size:10pt;color:${palette.primary};margin-bottom:1mm}
.skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.skill-tag{background:${palette.light};color:${palette.primary};padding:2mm 4mm;border-radius:4pt;font-size:9.5pt;font-weight:500;text-align:center}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body>
<div class="header">
<h1>${personalInfo.fullName || 'Executive Name'}</h1>
<div class="subtitle">${personalInfo.professionalTitle || 'Chief Executive Officer'}</div>
<div class="contact">
${personalInfo.email ? `<span>✉ ${personalInfo.email}</span>` : ''}
${personalInfo.phone ? `<span>☎ ${personalInfo.phone}</span>` : ''}
${personalInfo.city ? `<span>📍 ${personalInfo.city}${personalInfo.country ? ', ' + personalInfo.country : ''}</span>` : ''}
</div>
</div>

${personalInfo.summary ? `
<div class="executive-summary">${personalInfo.summary}</div>` : ''}

${experience.length > 0 ? `
<div class="section">
<div class="section-title">Professional Experience</div>
${experience.map(exp => `
<div class="experience-item">
<div class="position">${exp.position || 'Executive Position'}</div>
<div class="company">${exp.company || 'Company Name'}</div>
<div class="dates">${exp.startDate || 'Start'} – ${exp.current ? 'Present' : exp.endDate || 'End'}</div>
${exp.description ? `<div class="achievements"><p style="margin-top:2mm;color:#4a5568;line-height:1.7">${exp.description}</p></div>` : ''}
</div>`).join('')}
</div>` : ''}

${education.length > 0 ? `
<div class="section">
<div class="section-title">Education</div>
<div class="education-grid">
${education.map(edu => `
<div class="edu-item">
<div class="degree">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
<div class="school">${edu.institution || 'Institution'}</div>
<div class="dates">${edu.graduationYear || edu.endDate || ''}</div>
${edu.grade ? `<div style="margin-top:2mm;font-size:9.5pt;color:#6b7280">${edu.grade}</div>` : ''}
</div>`).join('')}
</div>
</div>` : ''}

${skills.length > 0 ? `
<div class="section">
<div class="section-title">Core Competencies</div>
<div class="skills-grid">
${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
</div>
</div>` : ''}

${languages.length > 0 ? `
<div class="section">
<div class="section-title">Languages</div>
<div class="skills-grid">
${languages.map(lang => `<div class="skill-tag">${typeof lang === 'object' ? `${lang.language || ''} (${lang.proficiency || ''})` : lang}</div>`).join('')}
</div>
</div>` : ''}

${certifications.length > 0 ? `
<div class="section">
<div class="section-title">Certifications</div>
${certifications.map(cert => `<div class="experience-item"><div class="position">${typeof cert === 'object' ? cert.name || cert.title : cert}</div>${typeof cert === 'object' && cert.issuer ? `<div class="company">${cert.issuer}</div>` : ''}${typeof cert === 'object' && cert.date ? `<div class="dates">${cert.date}</div>` : ''}</div>`).join('')}
</div>` : ''}

${projects.length > 0 ? `
<div class="section">
<div class="section-title">Key Projects</div>
${projects.map(proj => `<div class="experience-item"><div class="position">${proj.name || proj.title}</div>${proj.technologies ? `<div class="company">${proj.technologies}</div>` : ''}${proj.description ? `<p style="margin-top:2mm;color:#4a5568;line-height:1.7">${proj.description}</p>` : ''}</div>`).join('')}
</div>` : ''}

${publications.length > 0 ? `
<div class="section">
<div class="section-title">Publications</div>
${publications.map((pub, idx) => `<div class="experience-item"><div class="position">${idx + 1}. ${pub.title}</div>${pub.authors ? `<div class="company">${pub.authors}</div>` : ''}${pub.journal ? `<div style="font-style:italic;margin-top:1mm;color:#6b7280">${pub.journal}${pub.year ? `, ${pub.year}` : ''}</div>` : ''}${pub.doi ? `<div class="dates">DOI: ${pub.doi}</div>` : ''}</div>`).join('')}
</div>` : ''}
</body></html>`;
}

/**
 * PREMIUM Template 10: Creative Bold
 * Inspired by: Behance, Dribbble top designers
 * Features: Vibrant, artistic, portfolio-ready
 */
function premiumTemplate10(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.creative;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const projects = data.projects || [];
  const languages = data.languages || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${personalInfo.fullName || 'Creative CV'}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font:11pt/1.6 'Poppins',sans-serif;color:#1a1a1a;width:210mm;min-height:297mm;background:#fff}
.banner{background:linear-gradient(135deg,${palette.primary},${palette.accent});color:#fff;padding:15mm 12mm;position:relative;overflow:hidden}
.banner::before{content:'';position:absolute;top:-50mm;right:-50mm;width:150mm;height:150mm;background:radial-gradient(circle,rgba(255,255,255,0.15),transparent);border-radius:50%}
h1{font-size:28pt;font-weight:800;margin-bottom:2mm;position:relative;letter-spacing:-1pt}
.tagline{font-size:13pt;font-weight:400;opacity:0.95;position:relative}
.contact-bar{background:#2d3748;color:#fff;padding:4mm 12mm;display:flex;gap:8mm;flex-wrap:wrap;font-size:9.5pt}
.contact-bar span{display:flex;align-items:center;gap:2mm}
.content{padding:10mm 12mm}
.section{margin-bottom:10mm}
.section-header{display:flex;align-items:center;gap:4mm;margin-bottom:5mm}
.section-number{width:10mm;height:10mm;background:${palette.primary};color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11pt}
.section-title{font-size:15pt;font-weight:700;color:${palette.primary}}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.card{background:#f7fafc;padding:5mm;border-radius:6pt;border-left:4pt solid ${palette.accent}}
.card-title{font-weight:700;font-size:11pt;color:#1a202c;margin-bottom:1mm}
.card-subtitle{font-size:10pt;color:${palette.primary};margin-bottom:2mm;font-weight:600}
.card-meta{font-size:9pt;color:#718096;margin-bottom:2mm}
.card-desc{font-size:10pt;color:#4a5568;line-height:1.6}
.skill-cloud{display:flex;flex-wrap:wrap;gap:3mm}
.skill-bubble{background:linear-gradient(135deg,${palette.primary},${palette.accent});color:#fff;padding:2.5mm 5mm;border-radius:20pt;font-size:10pt;font-weight:600;box-shadow:0 2pt 8pt rgba(0,0,0,0.1)}
.project-item{background:linear-gradient(to right,${palette.light},#fff);padding:5mm;border-radius:6pt;margin-bottom:4mm;border:1pt solid #e2e8f0}
.project-title{font-weight:700;font-size:11pt;color:${palette.primary};margin-bottom:2mm}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body>
<div class="banner">
<h1>${personalInfo.fullName || 'Creative Professional'}</h1>
<div class="tagline">${personalInfo.professionalTitle || 'Designer • Developer • Creator'}</div>
</div>
<div class="contact-bar">
<span>✉ ${personalInfo.email || 'email@example.com'}</span>
<span>☎ ${personalInfo.phone || '+1234567890'}</span>
<span>📍 ${personalInfo.city || 'Location'}${personalInfo.country ? ', ' + personalInfo.country : ''}</span>
${personalInfo.linkedin ? '<span>🔗 ' + personalInfo.linkedin + '</span>' : ''}
${personalInfo.website ? '<span>🌐 ' + personalInfo.website + '</span>' : ''}
${personalInfo.github ? '<span>💻 ' + personalInfo.github + '</span>' : ''}
${personalInfo.orcid ? '<span>🔬 ORCID: ' + personalInfo.orcid + '</span>' : ''}
</div>
<div class="content">
${personalInfo.summary ? `
<div class="section">
<div class="section-header">
<div class="section-number">1</div>
<div class="section-title">About Me</div>
</div>
<p style="font-size:10.5pt;line-height:1.8;color:#4a5568">${personalInfo.summary}</p>
</div>` : ''}

${experience.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">2</div>
<div class="section-title">Experience</div>
</div>
<div class="grid-2">
${experience.map(exp => `
<div class="card">
<div class="card-title">${exp.position || 'Position'}</div>
<div class="card-subtitle">${exp.company || 'Company'}</div>
<div class="card-meta">${exp.startDate || 'Start'} - ${exp.current ? 'Now' : exp.endDate || 'End'}</div>
${exp.description ? `<div class="card-desc">${exp.description}</div>` : ''}
</div>`).join('')}
</div>
</div>` : ''}

${skills.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">3</div>
<div class="section-title">Skills</div>
</div>
<div class="skill-cloud">
${skills.map(skill => `<div class="skill-bubble">${skill}</div>`).join('')}
</div>
</div>` : ''}

${projects.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">4</div>
<div class="section-title">Projects</div>
</div>
${projects.map(proj => `
<div class="project-item">
<div class="project-title">${proj.name || proj.title}</div>
${proj.description ? `<p style="color:#4a5568;font-size:10pt;line-height:1.6">${proj.description}</p>` : ''}
</div>`).join('')}
</div>` : ''}

${education.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">5</div>
<div class="section-title">Education</div>
</div>
<div class="grid-2">
${education.map(edu => `
<div class="card">
<div class="card-title">${edu.degree || 'Degree'}${edu.field ? ' - ' + edu.field : ''}</div>
<div class="card-subtitle">${edu.institution || 'Institution'}</div>
<div class="card-meta">${edu.graduationYear || edu.endDate || 'Year'}</div>
</div>`).join('')}
</div>
</div>` : ''}

${languages.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">6</div>
<div class="section-title">Languages</div>
</div>
<div class="grid-2">
${languages.map(lang => `
<div class="card">
<div class="card-title">${lang.language || lang}</div>
<div class="card-subtitle">${lang.proficiency || 'Proficient'}</div>
</div>`).join('')}
</div>
</div>` : ''}

${certifications.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">7</div>
<div class="section-title">Certifications</div>
</div>
<div class="grid-2">
${certifications.map(cert => `
<div class="card">
<div class="card-title">${cert.title || cert.name}</div>
${cert.issuer ? `<div class="card-subtitle">${cert.issuer}</div>` : ''}
${cert.date ? `<div class="card-meta">${cert.date}</div>` : ''}
</div>`).join('')}
</div>
</div>` : ''}

${publications.length > 0 ? `
<div class="section">
<div class="section-header">
<div class="section-number">8</div>
<div class="section-title">Publications</div>
</div>
${publications.map(pub => `
<div class="project-item">
<div class="project-title">${pub.title}</div>
${pub.authors ? `<p style="color:#4a5568;font-size:9.5pt;margin-bottom:1mm">${pub.authors}</p>` : ''}
${pub.journal ? `<p style="color:#718096;font-size:9pt;font-style:italic">${pub.journal}${pub.year ? ', ' + pub.year : ''}</p>` : ''}
</div>`).join('')}
</div>` : ''}
</div>
</body></html>`;
}

/**
 * PREMIUM Template 11: Academic Professional (Europass/Scopus)
 * Inspired by: Official EU Europass, Academic institutions
 * Features: Formal, structured, publication-ready
 */
function premiumTemplate11(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.research;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const projects = data.projects || [];
  const publications = data.publications || [];
  const certifications = data.certifications || [];
  const languages = data.languages || [];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${personalInfo.fullName || 'Academic CV'}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font:11pt/1.7 Georgia,'Times New Roman',serif;color:#1a1a1a;width:210mm;min-height:297mm;padding:20mm;background:#fff}
.header{border-bottom:3pt double ${palette.primary};padding-bottom:5mm;margin-bottom:8mm}
h1{font-size:20pt;font-weight:700;color:${palette.primary};margin-bottom:2mm}
.title{font-size:12pt;color:#4a5568;margin-bottom:3mm;font-style:italic}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:2mm;font-size:10pt;color:#374151}
.section{margin-bottom:8mm;page-break-inside:avoid}
.section-title{font-size:13pt;font-weight:700;color:${palette.primary};text-transform:uppercase;border-bottom:1.5pt solid ${palette.primary};padding-bottom:2mm;margin-bottom:4mm;letter-spacing:0.5pt}
.entry{margin-bottom:5mm;padding-left:8mm;position:relative}
.entry::before{content:'▪';position:absolute;left:0;color:${palette.primary};font-size:14pt}
.entry-title{font-weight:700;font-size:11pt;margin-bottom:1mm}
.entry-org{font-size:10.5pt;color:${palette.primary};margin-bottom:1mm;font-weight:600}
.entry-date{font-size:9.5pt;color:#6b7280;margin-bottom:2mm;font-style:italic}
.entry-desc{font-size:10pt;line-height:1.7;color:#4a5568}
.publication{margin-bottom:4mm;padding-left:6mm;text-indent:-6mm;font-size:10pt;line-height:1.6;color:#374151}
.lang-table{width:100%;border-collapse:collapse;font-size:10pt}
.lang-table th{background:${palette.light};padding:2mm;text-align:left;font-weight:700;border:1pt solid #e2e8f0}
.lang-table td{padding:2mm;border:1pt solid #e2e8f0}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body>
<div class="header">
<h1>${personalInfo.fullName || 'Academic Name'}</h1>
<div class="title">${personalInfo.professionalTitle || 'Researcher | PhD Candidate'}</div>
<div class="contact-grid">
<div>Email: ${personalInfo.email || 'email@university.edu'}</div>
<div>Phone: ${personalInfo.phone || '+00 000 000 000'}</div>
<div>Location: ${personalInfo.city || 'City'}${personalInfo.country ? ', ' + personalInfo.country : ''}</div>
${personalInfo.orcid ? `<div>ORCID: ${personalInfo.orcid}</div>` : '<div></div>'}
</div>
</div>

${personalInfo.summary ? `
<div class="section">
<div class="section-title">Research Interests</div>
<p style="text-align:justify">${personalInfo.summary}</p>
</div>` : ''}

${education.length > 0 ? `
<div class="section">
<div class="section-title">Education</div>
${education.map(edu => `
<div class="entry">
<div class="entry-title">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
<div class="entry-org">${edu.institution || 'University'}</div>
<div class="entry-date">${edu.graduationYear || edu.endDate || edu.startDate || 'Year'}</div>
${edu.thesis ? `<div class="entry-desc">Thesis: ${edu.thesis}</div>` : ''}
${edu.grade ? `<div class="entry-desc">Grade: ${edu.grade}</div>` : ''}
</div>`).join('')}
</div>` : ''}

${experience.length > 0 ? `
<div class="section">
<div class="section-title">Professional Experience</div>
${experience.map(exp => `
<div class="entry">
<div class="entry-title">${exp.position || 'Position'}</div>
<div class="entry-org">${exp.company || 'Institution'}</div>
<div class="entry-date">${exp.startDate || 'Start'} – ${exp.current ? 'Present' : exp.endDate || 'End'}</div>
${exp.description ? `<div class="entry-desc">${exp.description}</div>` : ''}
</div>`).join('')}
</div>` : ''}

${publications.length > 0 ? `
<div class="section">
<div class="section-title">Publications</div>
${publications.map((pub, i) => `
<div class="publication">[${i + 1}] ${typeof pub === 'string' ? pub : `${pub.title || 'Title'}${pub.authors ? '. ' + pub.authors : ''}${pub.journal ? '. <i>' + pub.journal + '</i>' : ''}${pub.year ? '. (' + pub.year + ')' : ''}`}</div>`).join('')}
</div>` : ''}

${certifications.length > 0 ? `
<div class="section">
<div class="section-title">Certifications & Awards</div>
${certifications.map(cert => `
<div class="entry">
<div class="entry-title">${typeof cert === 'string' ? cert : cert.title || cert.name}</div>
${cert.issuer ? `<div class="entry-org">${cert.issuer}</div>` : ''}
${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
</div>`).join('')}
</div>` : ''}

${projects.length > 0 ? `
<div class="section">
<div class="section-title">Research Projects</div>
${projects.map(proj => `
<div class="entry">
<div class="entry-title">${proj.name || proj.title}</div>
${proj.description ? `<div class="entry-desc">${proj.description}</div>` : ''}
${proj.year ? `<div class="entry-date">${proj.year}</div>` : ''}
${proj.technologies ? `<div class="entry-desc" style="font-style:italic">Technologies: ${proj.technologies}</div>` : ''}
</div>`).join('')}
</div>` : ''}

${skills.length > 0 ? `
<div class="section">
<div class="section-title">Skills & Competencies</div>
<div style="display:flex;flex-wrap:wrap;gap:3mm">
${skills.map(skill => `<span style="background:#f3f4f6;padding:2mm 4mm;border-radius:3pt;font-size:10pt">${skill}</span>`).join('')}
</div>
</div>` : ''}

${languages.length > 0 ? `
<div class="section">
<div class="section-title">Languages</div>
<table class="lang-table">
<tr><th>Language</th><th>Proficiency</th></tr>
${languages.map(lang => `<tr><td>${typeof lang === 'string' ? lang : lang.language || ''}</td><td>${lang.proficiency || 'Proficient'}</td></tr>`).join('')}
</table>
</div>` : ''}

<div style="margin-top:15mm;font-size:9pt;color:#6b7280;text-align:center">
References available upon request
</div>
</body></html>`;
}

/**
 * PREMIUM Template 12: Minimalist Clean
 * Inspired by: Apple, Google, Modern startups
 * Features: Ultra-clean, whitespace, typography-focused
 */
function premiumTemplate12(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.technology;
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const projects = data.projects || [];
  const languages = data.languages || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${personalInfo.fullName || 'CV'}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font:11pt/1.9 'Inter',sans-serif;color:#18181b;width:210mm;min-height:297mm;padding:25mm;background:#fff}
h1{font-size:36pt;font-weight:700;margin-bottom:2mm;letter-spacing:-1.5pt;color:#09090b}
.subtitle{font-size:14pt;color:#71717a;font-weight:400;margin-bottom:10mm}
.contact{display:flex;gap:6mm;margin-bottom:15mm;font-size:10pt;color:#52525b}
.divider{height:1pt;background:linear-gradient(to right,${palette.primary},transparent);margin:10mm 0}
.section-title{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:2pt;color:${palette.primary};margin-bottom:6mm}
.timeline-item{margin-bottom:8mm;padding-left:15mm;position:relative}
.timeline-item::before{content:'';position:absolute;left:0;top:2mm;width:8mm;height:2pt;background:${palette.primary}}
.item-title{font-size:13pt;font-weight:700;margin-bottom:1mm;color:#09090b}
.item-org{font-size:11pt;color:#52525b;margin-bottom:1mm;font-weight:600}
.item-period{font-size:10pt;color:#a1a1aa;margin-bottom:3mm}
.item-desc{font-size:10pt;line-height:1.8;color:#3f3f46}
.skills-list{display:flex;flex-wrap:wrap;gap:2mm}
.skill{font-size:10pt;padding:2mm 4mm;background:#fafafa;border:1pt solid #e4e4e7;border-radius:3pt;color:#52525b;font-weight:500}
@media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}}
</style></head><body>
<h1>${personalInfo.fullName || 'Your Name'}</h1>
<div class="subtitle">${personalInfo.professionalTitle || 'Professional Title'}</div>
<div class="contact">
${personalInfo.email || 'email@example.com'} ${personalInfo.phone ? '• ' + personalInfo.phone : ''} ${personalInfo.city ? '• ' + personalInfo.city : ''}${personalInfo.country ? ', ' + personalInfo.country : ''}
</div>
${personalInfo.linkedin || personalInfo.website || personalInfo.github || personalInfo.orcid ? `
<div class="contact" style="margin-top:2mm;font-size:9.5pt">
${personalInfo.linkedin ? '🔗 ' + personalInfo.linkedin : ''} ${personalInfo.website ? '🌐 ' + personalInfo.website : ''} ${personalInfo.github ? '💻 ' + personalInfo.github : ''} ${personalInfo.orcid ? '🔬 ORCID: ' + personalInfo.orcid : ''}
</div>` : ''}

${personalInfo.summary ? `
<p style="font-size:11pt;line-height:1.9;color:#3f3f46;margin-bottom:12mm">${personalInfo.summary}</p>` : ''}

${experience.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Experience</div>
${experience.map(exp => `
<div class="timeline-item">
<div class="item-title">${exp.position || 'Position'}</div>
<div class="item-org">${exp.company || 'Company'}</div>
<div class="item-period">${exp.startDate || 'Start'} – ${exp.current ? 'Present' : exp.endDate || 'End'}</div>
${exp.description ? `<div class="item-desc">${exp.description}</div>` : ''}
</div>`).join('')}` : ''}

${education.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Education</div>
${education.map(edu => `
<div class="timeline-item">
<div class="item-title">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
<div class="item-org">${edu.institution || 'Institution'}</div>
<div class="item-period">${edu.graduationYear || edu.endDate || 'Year'}</div>
${edu.grade ? `<div class="item-desc">Grade: ${edu.grade}</div>` : ''}
</div>`).join('')}` : ''}

${skills.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Skills</div>
<div class="skills-list">
${skills.map(skill => `<div class="skill">${skill}</div>`).join('')}
</div>` : ''}

${projects.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Projects</div>
${projects.map(proj => `
<div class="timeline-item">
<div class="item-title">${proj.name || proj.title}</div>
${proj.technologies ? `<div class="item-org">${proj.technologies}</div>` : ''}
${proj.year ? `<div class="item-period">${proj.year}</div>` : ''}
${proj.description ? `<div class="item-desc">${proj.description}</div>` : ''}
${proj.link ? `<div style="margin-top:2mm;font-size:9.5pt;color:${palette.primary}">🔗 ${proj.link}</div>` : ''}
</div>`).join('')}` : ''}

${languages.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Languages</div>
<div class="skills-list">
${languages.map(lang => `<div class="skill">${lang.language || lang}${lang.proficiency ? ' - ' + lang.proficiency : ''}</div>`).join('')}
</div>` : ''}

${certifications.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Certifications</div>
${certifications.map(cert => `
<div class="timeline-item">
<div class="item-title">${cert.title || cert.name}</div>
${cert.issuer ? `<div class="item-org">${cert.issuer}</div>` : ''}
${cert.date ? `<div class="item-period">${cert.date}</div>` : ''}
${cert.credentialId ? `<div class="item-desc">ID: ${cert.credentialId}</div>` : ''}
</div>`).join('')}` : ''}

${publications.length > 0 ? `
<div class="divider"></div>
<div class="section-title">Publications</div>
${publications.map(pub => `
<div class="timeline-item">
<div class="item-title">${pub.title}</div>
${pub.authors ? `<div class="item-org">${pub.authors}</div>` : ''}
${pub.journal ? `<div class="item-period">${pub.journal}${pub.year ? ', ' + pub.year : ''}</div>` : ''}
${pub.doi ? `<div class="item-desc">DOI: ${pub.doi}</div>` : ''}
</div>`).join('')}` : ''}
</body></html>`;
}

// ============================================================
// 🚀 MAIN GENERATION FUNCTION - PREMIUM TEMPLATES ONLY
// ============================================================
export function generatePremiumCV(formData, cvType = 'modern', industry = 'technology') {
  console.log(`[Premium Templates] Generating ${cvType} CV for ${industry} industry`);
  
  try {
    let html;
    
    // Select template based on CV type - NOW WITH 8 PREMIUM TEMPLATES!
    switch(cvType.toLowerCase()) {
      case 'modern':
        // Rotate between 6 modern templates for variety
        const modernTemplates = [
          modernTemplate5, modernTemplate6, modernTemplate7,
          premiumTemplate8, premiumTemplate12
        ];
        const randomIndex = Math.floor(Math.random() * modernTemplates.length);
        html = modernTemplates[randomIndex](formData, industry);
        break;
        
      case 'executive':
        // Executive uses premium elegant template
        html = premiumTemplate9(formData, industry);
        break;
        
      case 'creative':
        // Creative uses bold, vibrant template
        html = premiumTemplate10(formData, industry);
        break;
        
      case 'europass':
      case 'scopus':
        // Academic formats use formal template
        html = premiumTemplate11(formData, industry);
        break;
        
      default:
        // Default to premium template 8 (two-column)
        html = premiumTemplate8(formData, industry);
    }
    
    if (!html || html.length < 500) {
      throw new Error('Template generation failed - output too short');
    }
    
    // Validate HTML structure
    if (!html.includes('<!DOCTYPE') || !html.includes('</html>')) {
      throw new Error('Template generation failed - invalid HTML structure');
    }
    
    console.log(`[Premium Templates] ✅ Successfully generated ${cvType} CV (${html.length} chars)`);
    return html;
    
  } catch (error) {
    console.error('[Premium Templates] ❌ Generation error:', error);
    throw new Error(`Premium template generation failed: ${error.message}`);
  }
}
