import { getPalette } from './palette';

const FONT_STACKS = [
  { heading: '"Calibri", "Helvetica Neue", Arial, sans-serif', body: '"Calibri", "Helvetica Neue", Arial, sans-serif' },
  { heading: '"Lato", "Segoe UI", Tahoma, sans-serif', body: '"Lato", "Segoe UI", Tahoma, sans-serif' },
  { heading: '"Roboto", "Helvetica Neue", Arial, sans-serif', body: '"Roboto", "Helvetica Neue", Arial, sans-serif' },
  { heading: '"Open Sans", "Segoe UI", sans-serif', body: '"Open Sans", "Segoe UI", sans-serif' },
  { heading: '"Raleway", "Segoe UI", sans-serif', body: '"Raleway", "Segoe UI", sans-serif' },
  { heading: '"Montserrat", "Segoe UI", sans-serif', body: '"Montserrat", "Segoe UI", sans-serif' },
  { heading: '"Nunito", "Segoe UI", sans-serif', body: '"Nunito", "Segoe UI", sans-serif' },
  { heading: '"PT Sans", "Segoe UI", sans-serif', body: '"PT Sans", "Segoe UI", sans-serif' },
];

const LAYOUTS = [
  { spacing: 'compact', borderWeight: 2, showSidebar: false },
  { spacing: 'comfortable', borderWeight: 3, showSidebar: true },
  { spacing: 'wide', borderWeight: 4, showSidebar: false },
  { spacing: 'comfortable', borderWeight: 2, showSidebar: true },
];

function getSkillName(skill) {
  if (typeof skill === 'string') return skill;
  if (!skill) return '';
  return skill.name || skill.skill || skill.title || '';
}

function formatSkillsArray(skills) {
  if (!skills) return [];
  if (!Array.isArray(skills)) return [];
  return skills.map(getSkillName).filter(Boolean);
}

// Professional multi-color style presets matching industry standards
const STYLE_PRESETS = [
  // Modern Professional - Two-column color split
  (p) => ({
    headerBg: p.primary,
    headerText: '#ffffff',
    pageBg: '#ffffff',
    sidebarBg: `${p.primary}08`,
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: 'none',
    shadow: 'none',
    pillVariant: 'solid',
    useSidebarColor: true
  }),
  // Executive Classic - Accent header with clean body
  (p) => ({
    headerBg: `linear-gradient(135deg, ${p.primary} 0%, ${p.accent} 100%)`,
    headerText: '#ffffff',
    pageBg: '#ffffff',
    sidebarBg: '#f8f9fa',
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: 'none',
    shadow: 'none',
    pillVariant: 'outline',
    useSidebarColor: true
  }),
  // Contemporary - Left accent bar with subtle backgrounds
  (p) => ({
    headerBg: '#ffffff',
    headerText: p.secondary,
    pageBg: '#ffffff',
    sidebarBg: `${p.primary}06`,
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: 'none',
    shadow: 'none',
    pillVariant: 'chip',
    useSidebarColor: true
  }),
  // Bold Corporate - Strong header with structured sections
  (p) => ({
    headerBg: p.secondary,
    headerText: '#ffffff',
    pageBg: '#ffffff',
    sidebarBg: '#fafafa',
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: 'none',
    shadow: 'none',
    pillVariant: 'solid',
    useSidebarColor: true
  }),
  // Minimalist Professional - Clean with accent touches
  (p) => ({
    headerBg: '#ffffff',
    headerText: p.primary,
    pageBg: '#ffffff',
    sidebarBg: '#ffffff',
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: `1px solid ${p.primary}15`,
    shadow: 'none',
    pillVariant: 'outline',
    useSidebarColor: false
  }),
  // Premium Modern - Gradient header with professional layout
  (p) => ({
    headerBg: `linear-gradient(to right, ${p.primary} 0%, ${p.accent} 100%)`,
    headerText: '#ffffff',
    pageBg: '#fafafa',
    sidebarBg: '#ffffff',
    sectionBg: '#ffffff',
    sectionTitleColor: p.primary,
    accentColor: p.accent,
    sectionBorder: 'none',
    shadow: '0 1px 2px rgba(0,0,0,0.03)',
    pillVariant: 'solid',
    useSidebarColor: false
  })
];

// Structural presets based on world-class CV layouts
const STRUCTURE_PRESETS = [
  {
    headerJustify: 'space-between',
    headerAlign: 'flex-start',
    sectionAccentTop: false,
    itemBorderLeft: true,
    sectionBorder: 'none',
    sectionShadow: 'none'
  },
  {
    headerJustify: 'center',
    headerAlign: 'center',
    sectionAccentTop: false,
    itemBorderLeft: false,
    sectionBorder: '1px solid VAR',
    sectionShadow: 'none'
  },
  {
    headerJustify: 'space-between',
    headerAlign: 'flex-start',
    sectionAccentTop: false,
    itemBorderLeft: false,
    sectionBorder: 'none',
    sectionShadow: 'none'
  },
  {
    headerJustify: 'flex-start',
    headerAlign: 'flex-start',
    sectionAccentTop: false,
    itemBorderLeft: true,
    sectionBorder: 'none',
    sectionShadow: 'none'
  }
];

function pick(array, index) {
  return array[index % array.length];
}

export function renderTemplate(data, industry, templateIndex, archetype, totalVariants) {
  const palette = getPalette(industry);
  const fonts = pick(FONT_STACKS, templateIndex);
  const layout = pick(LAYOUTS, templateIndex);
  const stylePreset = pick(STYLE_PRESETS, templateIndex)(palette);
  const structurePreset = pick(STRUCTURE_PRESETS, templateIndex);

  const { personalInfo = {}, experience = [], education = [], skills = {}, languages = [], projects = [], certifications = [], publications = [], metrics = [], awards = [], references = [] } = data || {};

  const spacing = layout.spacing === 'wide' ? '32px' : layout.spacing === 'comfortable' ? '24px' : '18px';
  const sectionGap = layout.spacing === 'wide' ? '28px' : '20px';
  const border = `${layout.borderWeight}px solid ${palette.primary}`;
  const sidebar = layout.showSidebar;
  const sectionBorderResolved = (structurePreset.sectionBorder || stylePreset.sectionBorder || '1px solid transparent').replace('VAR', palette.primary);
  const sectionShadowResolved = structurePreset.sectionShadow || stylePreset.shadow || '0 6px 16px rgba(0,0,0,0.05)';
  const itemBorderLeftResolved = structurePreset.itemBorderLeft ? `3px solid ${palette.primary}` : '0';
  const sectionAccentTopBg = structurePreset.sectionAccentTop ? `linear-gradient(90deg, ${palette.primary}, ${palette.accent})` : 'none';
  const sectionAccentTopSize = structurePreset.sectionAccentTop ? '100% 5px' : 'auto';
  const sectionAccentTopRepeat = structurePreset.sectionAccentTop ? 'no-repeat' : 'repeat';
  const sectionAccentTopPos = structurePreset.sectionAccentTop ? 'top left' : 'left top';
  const headerJustify = structurePreset.headerJustify || 'space-between';
  const headerAlign = structurePreset.headerAlign || 'flex-start';

  const skillList = formatSkillsArray([...(skills.technical || []), ...(skills.soft || []), ...(skills.tools || [])]);

  const headerBlock = `
    <div class="header">
      <div>
        <div class="name">${personalInfo.fullName || 'Your Name'}</div>
        <div class="title">${personalInfo.professionalTitle || 'Professional Title'}</div>
      </div>
      <div class="meta">
        ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
        ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
        ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
        ${personalInfo.website ? `<span>${personalInfo.website}</span>` : ''}
        ${personalInfo.city || personalInfo.country ? `<span>${personalInfo.city || ''}${personalInfo.country ? ', ' + personalInfo.country : ''}</span>` : ''}
      </div>
    </div>`;

  const summaryBlock = personalInfo.summary ? `
    <section class="section">
      <h2>Summary</h2>
      <p>${personalInfo.summary}</p>
    </section>` : '';

  const metricsBlock = metrics.length ? `
    <section class="section">
      <h2>Key Metrics</h2>
      ${metrics.map(metric => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${metric.label || 'Metric'}</div>
            <div class="item-date">${metric.value || ''}</div>
          </div>
          ${metric.description ? `<div class="item-body">${metric.description}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const expBlock = experience.length ? `
    <section class="section">
      <h2>Experience</h2>
      ${experience.map(exp => `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${exp.position || 'Position'}</div>
              <div class="item-sub">${exp.company || 'Company'}${exp.location ? ' • ' + exp.location : ''}</div>
            </div>
            <div class="item-date">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</div>
          </div>
          ${exp.description ? `<div class="item-body">${exp.description}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const eduBlock = education.length ? `
    <section class="section">
      <h2>Education</h2>
      ${education.map(edu => `
        <div class="item">
          <div class="item-head">
            <div>
              <div class="item-title">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
              <div class="item-sub">${edu.institution || 'Institution'}</div>
            </div>
            <div class="item-date">${edu.startDate || ''} - ${edu.endDate || ''}</div>
          </div>
          ${edu.grade ? `<div class="item-body">Grade: ${edu.grade}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const skillsBlock = skillList.length ? `
    <section class="section">
      <h2>Skills</h2>
      <div class="pill-grid">
        ${skillList.map(s => `<span class="pill">${s}</span>`).join('')}
      </div>
    </section>` : '';

  const projectsBlock = projects.length ? `
    <section class="section">
      <h2>Projects</h2>
      ${projects.map(p => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${p.name || p.title || 'Project'}</div>
            ${p.year ? `<div class="item-date">${p.year}</div>` : ''}
          </div>
          ${p.description ? `<div class="item-body">${p.description}</div>` : ''}
          ${p.technologies ? `<div class="item-foot">${p.technologies}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const awardsBlock = awards.length ? `
    <section class="section">
      <h2>Achievements</h2>
      ${awards.map(a => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${a.title || 'Award'}</div>
            <div class="item-date">${a.year || ''}</div>
          </div>
          ${a.issuer ? `<div class="item-sub">${a.issuer}</div>` : ''}
          ${a.description ? `<div class="item-body">${a.description}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const certsBlock = certifications.length ? `
    <section class="section">
      <h2>Certifications</h2>
      ${certifications.map(c => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${c.title || c.name || 'Certification'}</div>
            ${c.issuer ? `<div class="item-sub">${c.issuer}</div>` : ''}
          </div>
          ${c.date ? `<div class="item-date">${c.date}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const pubsBlock = publications.length ? `
    <section class="section">
      <h2>Publications</h2>
      ${publications.map(pub => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${pub.title || 'Publication'}</div>
            ${pub.journal ? `<div class="item-sub">${pub.journal}${pub.year ? ', ' + pub.year : ''}</div>` : ''}
          </div>
          ${pub.doi ? `<div class="item-foot">DOI: ${pub.doi}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const referencesBlock = references.length ? `
    <section class="section">
      <h2>References</h2>
      ${references.map(ref => `
        <div class="item">
          <div class="item-head">
            <div class="item-title">${ref.name || 'Reference'}</div>
            ${ref.contact ? `<div class="item-date">${ref.contact}</div>` : ''}
          </div>
          ${ref.position ? `<div class="item-sub">${ref.position}</div>` : ''}
          ${ref.company ? `<div class="item-body">${ref.company}</div>` : ''}
        </div>`).join('')}
    </section>` : '';

  const langBlock = languages.length ? `
    <section class="section">
      <h2>Languages</h2>
      <div class="pill-grid">
        ${languages.map(l => {
          const name = l.language || l.name || l.lang || l;
          const prof = l.proficiency || l.level || '';
          return `<span class="pill">${name}${prof ? ' — ' + prof : ''}</span>`;
        }).join('')}
      </div>
    </section>` : '';

  const sidebarBlock = sidebar ? `
    <aside class="sidebar">
      ${skillsBlock || ''}
      ${langBlock || ''}
      ${certsBlock || ''}
    </aside>` : '';

  const mainBlock = `
    <main class="main">
      ${summaryBlock}
      ${metricsBlock}
      ${expBlock}
      ${projectsBlock}
      ${education.length ? eduBlock : ''}
      ${!sidebar ? skillsBlock : ''}
      ${awardsBlock}
      ${certifications.length && !sidebar ? certsBlock : ''}
      ${publications.length ? pubsBlock : ''}
      ${languages.length && !sidebar ? langBlock : ''}
      ${referencesBlock}
    </main>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personalInfo.fullName || 'CV'} - ${archetype} template</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ${fonts.body};
      color: ${palette.text};
      background: ${stylePreset.pageBg || '#f6f8fb'};
      width: 210mm;
      min-height: 297mm;
      font-size: 12px;
      line-height: 1.7;
      letter-spacing: 0.01em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .page {
      display: flex;
      flex-direction: column;
      padding: 0;
      width: 210mm;
      min-height: 297mm;
      background: ${stylePreset.pageBg || '#ffffff'};
      box-shadow: none;
      border-radius: 0;
    }

    .content {
      display: flex;
      gap: 0;
      align-items: stretch;
      min-height: 297mm;
    }
    .sidebar {
      width: 38%;
      background: ${stylePreset.useSidebarColor ? stylePreset.sidebarBg : '#fafafa'};
      padding: 28px 22px;
      align-self: stretch;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 22px;
      padding: 28px 24px;
      min-width: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 32px 28px;
      margin: 0;
      background: ${stylePreset.headerBg};
      color: ${stylePreset.headerText};
      align-items: center;
    }
    .name {
      font-family: ${fonts.heading};
      font-size: 38px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: ${stylePreset.headerText};
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .title { 
      font-size: 17px; 
      font-weight: 400; 
      color: ${stylePreset.headerText}; 
      opacity: 0.95; 
      line-height: 1.3;
    }
    .meta { 
      display: flex; 
      flex-direction: column; 
      gap: 6px; 
      font-size: 12px; 
      color: ${stylePreset.headerText}; 
      align-items: flex-end; 
      opacity: 0.95;
    }
    .meta span { 
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 400; 
      line-height: 1.4;
    }
    .section { 
      margin-bottom: 24px; 
      padding: 0; 
      border-radius: 0; 
      background: transparent; 
      border: none; 
      box-shadow: none; 
    }
    .section h2 {
      font-family: ${fonts.heading};
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${stylePreset.sectionTitleColor};
      margin-bottom: 14px;
      border-bottom: 2.5px solid ${stylePreset.sectionTitleColor};
      padding-bottom: 6px;
      font-weight: 700;
    }
    .item { 
      margin-bottom: 18px; 
      background: transparent; 
      padding: 0; 
      padding-bottom: 14px;
      border-radius: 0; 
      border: none; 
      border-bottom: 1px solid #e5e7eb;
      box-shadow: none; 
      border-left: ${itemBorderLeftResolved}; 
      padding-left: ${itemBorderLeftResolved !== '0' ? '14px' : '0'}; 
    }
    .item:last-child { border-bottom: none; padding-bottom: 0; }
    .item-head { 
      display: flex; 
      justify-content: space-between; 
      gap: 16px; 
      align-items: baseline; 
      margin-bottom: 6px; 
    }
    .item-title { 
      font-weight: 700; 
      font-size: 15px; 
      color: ${palette.secondary}; 
      letter-spacing: -0.01em; 
      line-height: 1.3; 
    }
    .item-sub { 
      font-size: 13px; 
      color: ${stylePreset.accentColor}; 
      font-weight: 500;
      margin-top: 3px; 
      line-height: 1.4;
    }
    .item-date { 
      font-size: 11.5px; 
      color: #64748b; 
      white-space: nowrap; 
      font-weight: 500; 
      font-style: italic;
    }
    .item-body { 
      font-size: 12.5px; 
      color: #374151; 
      margin-top: 8px; 
      line-height: 1.65; 
      white-space: pre-line; 
    }
    .item-body ul { margin-left: 20px; margin-top: 6px; }
    .item-body li { margin-bottom: 4px; line-height: 1.6; }
    .item-foot { 
      font-size: 11.5px; 
      color: #6b7280; 
      margin-top: 6px; 
      font-style: italic; 
    }
    .pill-grid { 
      display: flex; 
      flex-wrap: wrap; 
      gap: 8px; 
      margin-top: 4px;
    }
    .pill {
      display: inline-flex;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1.5px solid ${stylePreset.sectionTitleColor};
      background: ${stylePreset.pillVariant === 'solid' ? stylePreset.sectionTitleColor : 'transparent'};
      color: ${stylePreset.pillVariant === 'solid' ? '#ffffff' : palette.secondary};
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      box-shadow: none;
      line-height: 1.2;
    }
    p { 
      font-size: 13px; 
      color: #374151; 
      line-height: 1.7; 
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="page">
    ${headerBlock}
    <div class="content">
      ${sidebar ? sidebarBlock : ''}
      ${mainBlock}
    </div>
  </div>
</body>
</html>`;
}

export function variationIndex(templateId, total) {
  const idNum = Number(templateId);
  if (Number.isFinite(idNum) && idNum >= 1) {
    // Align user-facing template #1 to index 0
    return (idNum - 1) % total;
  }
  // Use crypto-strength randomness for better spread when templateId is not supplied
  const rand = typeof crypto !== 'undefined' && crypto.getRandomValues
    ? crypto.getRandomValues(new Uint32Array(1))[0]
    : Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  return rand % total;
}
