import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; 
import { FieldValue } from 'firebase-admin/firestore';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

// ============================================================
// 🎨 COLOR & DESIGN SYSTEM
// ============================================================
const INDUSTRY_PALETTES = {
  technology: {
    primary: '#2563eb',
    secondary: '#0f172a',
    accent: '#3b82f6',
    background: '#f8fafc',
    text: '#1e293b'
  },
  finance: {
    primary: '#1e40af',
    secondary: '#0f172a',
    accent: '#374151',
    background: '#ffffff',
    text: '#111827'
  },
  healthcare: {
    primary: '#059669',
    secondary: '#065f46',
    accent: '#10b981',
    background: '#f0fdf4',
    text: '#064e3b'
  },
  education: {
    primary: '#7c3aed',
    secondary: '#5b21b6',
    accent: '#8b5cf6',
    background: '#faf5ff',
    text: '#3b0764'
  },
  marketing: {
    primary: '#ec4899',
    secondary: '#be185d',
    accent: '#f472b6',
    background: '#fdf2f8',
    text: '#831843'
  },
  engineering: {
    primary: '#ea580c',
    secondary: '#9a3412',
    accent: '#f97316',
    background: '#fff7ed',
    text: '#7c2d12'
  },
  law: {
    primary: '#6d28d9',
    secondary: '#4c1d95',
    accent: '#8b5cf6',
    background: '#faf5ff',
    text: '#3b0764'
  },
  creative: {
    primary: '#db2777',
    secondary: '#9d174d',
    accent: '#ec4899',
    background: '#fdf2f8',
    text: '#831843'
  },
  research: {
    primary: '#0d9488',
    secondary: '#115e59',
    accent: '#14b8a6',
    background: '#f0fdfa',
    text: '#134e4a'
  },
  consulting: {
    primary: '#0e7490',
    secondary: '#155e75',
    accent: '#06b6d4',
    background: '#ecfeff',
    text: '#164e63'
  }
};

// Template variation counts
const TEMPLATE_VARIATIONS = {
  modern: 4,
  creative: 3,
  executive: 3,
  europass: 1,
  scopus: 1
};

// ============================================================
// 🔧 HELPER FUNCTIONS
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function getAllSkills(skillsData) {
  if (!skillsData) return [];
  return [
    ...(skillsData.technical || []),
    ...(skillsData.soft || []),
    ...(skillsData.tools || [])
  ];
}

function renderIfExists(value, renderFn) {
  return value ? renderFn(value) : '';
}

// Compress HTML for storage
function compressCV(html) {
  // Simple compression - remove extra whitespace and newlines
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

// ============================================================
// 🚀 MODERN ARCHITECTURE TEMPLATES (4 Variations)
// ============================================================

// Modern Template 1: Minimalist Geometric
function modernTemplate1(data, industry) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'} - Professional Resume</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --bg: ${palette.background};
        --text: ${palette.text};
      }
      body {
        font-family: 'Inter', 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }
      .cv-wrapper {
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px;
        position: relative;
      }
      .header {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 40px;
        margin-bottom: 50px;
        border-bottom: 3px solid var(--primary);
        padding-bottom: 30px;
      }
      .name-title {
        position: relative;
        padding-left: 20px;
      }
      .name-title::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: var(--primary);
      }
      .name-title h1 {
        font-size: 42px;
        font-weight: 800;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: -1px;
      }
      .name-title h2 {
        font-size: 20px;
        font-weight: 400;
        margin: 0;
        color: var(--primary);
      }
      .contact-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 20px;
      }
      .contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
      }
      .section {
        margin-bottom: 40px;
      }
      .section-title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--secondary);
        position: relative;
      }
      .timeline-item {
        position: relative;
        padding-left: 30px;
        margin-bottom: 25px;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary);
      }
      .timeline-item::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 20px;
        width: 2px;
        height: calc(100% + 10px);
        background: var(--primary);
        opacity: 0.3;
      }
      .skill-tag {
        display: inline-block;
        padding: 6px 15px;
        margin: 0 8px 8px 0;
        background: rgba(var(--primary-rgb), 0.1);
        border-radius: 20px;
        font-size: 14px;
        border: 1px solid rgba(var(--primary-rgb), 0.2);
      }
      .project-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        border-left: 3px solid var(--primary);
      }
      .cert-item {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      .publication-item {
        font-size: 14px;
        margin-bottom: 10px;
        padding-left: 10px;
        border-left: 2px solid #ddd;
      }
    </style>
  </head>
  <body>
    <div class="cv-wrapper">
      <div class="header">
        <div class="name-title">
          <h1>${personalInfo.fullName}</h1>
          <h2>${personalInfo.professionalTitle}</h2>
          <div class="contact-grid">
            ${personalInfo.email ? `<div class="contact-item">📧 ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="contact-item">📱 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.city ? `<div class="contact-item">📍 ${personalInfo.city}${personalInfo.country ? `, ${personalInfo.country}` : ''}</div>` : ''}
            ${personalInfo.linkedin ? `<div class="contact-item">🔗 ${personalInfo.linkedin}</div>` : ''}
            ${personalInfo.github ? `<div class="contact-item">💻 ${personalInfo.github}</div>` : ''}
            ${personalInfo.website ? `<div class="contact-item">🌐 ${personalInfo.website}</div>` : ''}
          </div>
        </div>
        <div class="summary">
          ${personalInfo.summary ? `<p style="font-size: 16px; line-height: 1.8;">${personalInfo.summary}</p>` : ''}
        </div>
      </div>
      
      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Professional Experience</div>
        ${experience.map((exp, i) => `
          <div class="timeline-item">
            <div style="font-weight: 700; font-size: 18px;">${exp.position}</div>
            <div style="color: var(--primary); font-weight: 600;">${exp.company}${exp.location ? ` | ${exp.location}` : ''} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            ${exp.description ? `<div style="margin-top: 8px;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
        ${education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map((edu) => `
            <div class="timeline-item">
              <div style="font-weight: 700;">${edu.degree}</div>
              <div style="color: var(--primary);">${edu.institution}</div>
              <div style="font-size: 14px;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.grade ? `<div style="font-size: 13px;">Grade: ${edu.grade}</div>` : ''}
              ${edu.field ? `<div style="font-size: 13px;">${edu.field}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px;">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      
      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(project => `
          <div class="project-card">
            <div style="font-weight: 600; font-size: 16px; color: var(--primary);">${project.name}</div>
            ${project.link ? `<div style="font-size: 14px; margin-top: 5px;">🔗 ${project.link}</div>` : ''}
            ${project.description ? `<div style="font-size: 14px; margin-top: 8px; line-height: 1.6;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
          <div class="cert-item">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="font-size: 14px; color: var(--primary);">${cert.issuer}</div>` : ''}
            ${cert.date ? `<div style="font-size: 13px;">${cert.date}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${publications.length > 0 ? `
      <div class="section">
        <div class="section-title">Publications</div>
        ${publications.map(pub => `
          <div class="publication-item">
            <div>"${pub.title}"</div>
            ${pub.journal ? `<div style="font-style: italic;">${pub.journal}</div>` : ''}
            ${pub.year ? `<div>${pub.year}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Languages</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          ${languages.map(lang => `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
              <strong>${lang.language}</strong>
              <span>${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// Modern Template 2: Card-based Modern
function modernTemplate2(data, industry) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'} - Professional Resume</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --bg: ${palette.background};
        --text: ${palette.text};
      }
      body {
        font-family: 'Segoe UI', system-ui, sans-serif;
        margin: 0;
        padding: 0;
        background: var(--bg);
        color: var(--text);
      }
      .cv-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 30px;
      }
      .hero-section {
        background: linear-gradient(135deg, var(--primary) 0%, ${palette.accent} 100%);
        color: white;
        padding: 40px;
        border-radius: 15px;
        margin-bottom: 30px;
      }
      .hero-text h1 {
        margin: 0;
        font-size: 36px;
        font-weight: 700;
      }
      .hero-text p {
        margin: 10px 0 0 0;
        font-size: 18px;
        opacity: 0.9;
      }
      .contact-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
      }
      .chip {
        background: rgba(255,255,255,0.15);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 14px;
        border: 1px solid rgba(255,255,255,0.2);
      }
      .card {
        background: white;
        border-radius: 10px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        border-left: 4px solid var(--primary);
      }
      .card-title {
        color: var(--primary);
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .skill-tag {
        display: inline-block;
        padding: 6px 12px;
        margin: 0 8px 8px 0;
        background: rgba(var(--primary-rgb), 0.1);
        border-radius: 15px;
        font-size: 14px;
      }
      .project-highlight {
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
      }
      @media (max-width: 768px) {
        .grid-2 { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="cv-container">
      <div class="hero-section">
        <div class="hero-text">
          <h1>${personalInfo.fullName}</h1>
          <p>${personalInfo.professionalTitle}</p>
        </div>
        
        <div class="contact-chips">
          ${personalInfo.email ? `<div class="chip">📧 ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div class="chip">📱 ${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div class="chip">📍 ${personalInfo.city}</div>` : ''}
          ${personalInfo.linkedin ? `<div class="chip">🔗 LinkedIn</div>` : ''}
        </div>
      </div>
      
      ${personalInfo.summary ? `
      <div class="card">
        <div class="card-title">📋 Profile Summary</div>
        <p>${personalInfo.summary}</p>
      </div>
      ` : ''}
      
      ${experience.length > 0 ? `
      <div class="card">
        <div class="card-title">💼 Work Experience</div>
        ${experience.slice(0, 3).map((exp) => `
          <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-weight: 600; color: var(--text);">${exp.position}</div>
            <div style="color: var(--primary); font-size: 14px; margin: 5px 0;">${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            ${exp.description ? `<div style="font-size: 14px; color: #6b7280;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <div class="grid-2">
        ${education.length > 0 ? `
        <div class="card">
          <div class="card-title">🎓 Education</div>
          ${education.map((edu) => `
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600;">${edu.degree}</div>
              <div style="color: var(--primary); font-size: 14px;">${edu.institution}</div>
              <div style="font-size: 13px; color: #6b7280;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.grade ? `<div style="font-size: 12px;">Grade: ${edu.grade}</div>` : ''}
              ${edu.field ? `<div style="font-size: 12px;">${edu.field}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="card">
          <div class="card-title">🛠️ Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      
      ${projects.length > 0 ? `
      <div class="card">
        <div class="card-title">🚀 Projects</div>
        ${projects.map(project => `
          <div class="project-highlight">
            <div style="font-weight: 600; color: var(--primary); margin-bottom: 8px;">${project.name}</div>
            ${project.description ? `<div style="font-size: 14px; color: #4b5563;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="card">
        <div class="card-title">🏅 Certifications</div>
        ${certifications.map(cert => `
          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="font-size: 14px; color: var(--primary);">${cert.issuer}</div>` : ''}
            ${cert.date ? `<div style="font-size: 13px; color: #6b7280;">${cert.date}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${languages.length > 0 ? `
      <div class="card">
        <div class="card-title">🌐 Languages</div>
        <div style="display: grid; gap: 10px;">
          ${languages.map(lang => `
            <div style="display: flex; justify-content: space-between; padding: 5px 0;">
              <span>${lang.language}</span>
              <span style="color: var(--primary); font-weight: 500;">${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${publications.length > 0 ? `
      <div class="card">
        <div class="card-title">📚 Publications</div>
        ${publications.map(pub => `
          <div style="margin-bottom: 12px;">
            <div style="font-weight: 600; font-size: 14px;">"${pub.title}"</div>
            ${pub.journal ? `<div style="font-style: italic; font-size: 13px;">${pub.journal}</div>` : ''}
            ${pub.year ? `<div style="font-size: 13px; color: #6b7280;">${pub.year}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// Modern Template 3: Split-screen Modern
function modernTemplate3(data, industry) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'} - Professional Resume</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --bg: ${palette.background};
        --text: ${palette.text};
      }
      body {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        min-height: 100vh;
      }
      .sidebar {
        width: 35%;
        background: var(--secondary);
        color: white;
        padding: 40px 30px;
      }
      .main-content {
        width: 65%;
        padding: 40px;
        background: var(--bg);
      }
      .profile-circle {
        width: 150px;
        height: 150px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        margin: 0 auto 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
      }
      .sidebar-section {
        margin-bottom: 30px;
      }
      .sidebar-title {
        font-size: 18px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 15px;
        color: var(--primary);
        opacity: 0.9;
      }
      .skill-tag {
        display: inline-block;
        padding: 5px 12px;
        margin: 2px 4px 2px 0;
        background: rgba(255,255,255,0.15);
        border-radius: 15px;
        font-size: 13px;
      }
      .main-header h1 {
        font-size: 42px;
        margin: 0 0 5px 0;
        color: var(--secondary);
        font-weight: 800;
      }
      .main-header h2 {
        font-size: 20px;
        margin: 0 0 30px 0;
        color: var(--primary);
        font-weight: 400;
      }
      .section {
        margin-bottom: 35px;
      }
      .section-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--secondary);
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid var(--primary);
      }
      .job-item {
        margin-bottom: 25px;
      }
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 8px;
      }
      .job-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text);
      }
      .job-period {
        color: var(--primary);
        font-weight: 600;
        font-size: 14px;
      }
      .job-company {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 5px;
      }
      .project-item {
        background: white;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      }
      @media (max-width: 900px) {
        body { flex-direction: column; }
        .sidebar, .main-content { width: 100%; }
      }
    </style>
  </head>
  <body>
    <div class="sidebar">
      <div class="profile-circle">👤</div>
      
      ${personalInfo.email || personalInfo.phone || personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
      <div class="sidebar-section">
        <div class="sidebar-title">Contact</div>
        <div style="font-size: 14px; line-height: 1.8;">
          ${personalInfo.email ? `<div>📧 ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>📱 ${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>📍 ${personalInfo.city}</div>` : ''}
          ${personalInfo.linkedin ? `<div>🔗 ${personalInfo.linkedin}</div>` : ''}
          ${personalInfo.github ? `<div>💻 ${personalInfo.github}</div>` : ''}
          ${personalInfo.website ? `<div>🌐 ${personalInfo.website}</div>` : ''}
        </div>
      </div>
      ` : ''}
      
      ${skills.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">Skills</div>
        <div>
          ${skills.slice(0, 8).map((skill) => `
            <span class="skill-tag">${skill}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${languages.length > 0 ? `
      <div class="sidebar-section">
        <div class="sidebar-title">Languages</div>
        ${languages.map((lang) => `
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span>${lang.language}</span>
              <span style="color: var(--primary);">${lang.proficiency}</span>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
    
    <div class="main-content">
      <div class="main-header">
        <h1>${personalInfo.fullName}</h1>
        <h2>${personalInfo.professionalTitle}</h2>
      </div>
      
      ${personalInfo.summary ? `
      <div class="section">
        <div class="section-title">Profile</div>
        <p style="font-size: 16px; line-height: 1.7;">${personalInfo.summary}</p>
      </div>
      ` : ''}
      
      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((exp) => `
          <div class="job-item">
            <div class="job-header">
              <div class="job-title">${exp.position}</div>
              <div class="job-period">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            </div>
            <div class="job-company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
            ${exp.description ? `<div style="font-size: 14px; line-height: 1.6;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map((edu) => `
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 16px;">${edu.degree}</div>
            <div style="color: var(--primary); font-weight: 600;">${edu.institution}</div>
            <div style="font-size: 14px;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)} ${edu.grade ? `| Grade: ${edu.grade}` : ''}</div>
            ${edu.field ? `<div style="font-size: 14px; color: #666;">${edu.field}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map(project => `
          <div class="project-item">
            <div style="font-weight: 600; color: var(--primary);">${project.name}</div>
            ${project.description ? `<div style="font-size: 14px; margin-top: 5px;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">Certifications</div>
        ${certifications.map(cert => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="font-size: 14px; color: var(--primary);">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// Modern Template 4: Minimalist with accent blocks
function modernTemplate4(data, industry) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'CV'} - Professional Resume</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --bg: ${palette.background};
        --text: ${palette.text};
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        background: white;
        color: var(--text);
        line-height: 1.6;
      }
      .cv-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 60px 40px;
      }
      .header-section {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
        border-bottom: 3px solid var(--primary);
        padding-bottom: 30px;
      }
      .name-title h1 {
        font-size: 36px;
        font-weight: 300;
        margin: 0 0 5px 0;
        text-transform: uppercase;
        letter-spacing: 3px;
      }
      .name-title h2 {
        font-size: 18px;
        font-weight: 400;
        margin: 0;
        color: var(--primary);
      }
      .contact-info {
        text-align: right;
        font-size: 14px;
      }
      ${personalInfo.summary ? `
      .accent-block {
        background: var(--primary);
        color: white;
        padding: 20px;
        margin: 30px 0;
        border-radius: 5px;
      }
      ` : ''}
      .section {
        margin-bottom: 35px;
      }
      .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      .section-icon {
        width: 40px;
        height: 40px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 18px;
      }
      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--secondary);
        margin: 0;
      }
      .timeline {
        position: relative;
        padding-left: 30px;
      }
      .timeline::before {
        content: '';
        position: absolute;
        left: 7px;
        top: 0;
        height: 100%;
        width: 2px;
        background: var(--primary);
        opacity: 0.2;
      }
      .timeline-item {
        position: relative;
        margin-bottom: 25px;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: -23px;
        top: 5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary);
      }
      .item-title {
        font-weight: 600;
        font-size: 16px;
        margin: 0 0 5px 0;
      }
      .item-meta {
        color: var(--primary);
        font-size: 14px;
        margin: 0 0 8px 0;
      }
      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
      }
      .skill-card {
        padding: 15px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #f9fafb;
      }
      .skill-name {
        font-weight: 600;
        margin-bottom: 5px;
      }
      .project-card {
        border-left: 3px solid var(--primary);
        padding-left: 15px;
        margin-bottom: 15px;
      }
    </style>
  </head>
  <body>
    <div class="cv-container">
      <div class="header-section">
        <div class="name-title">
          <h1>${personalInfo.fullName}</h1>
          <h2>${personalInfo.professionalTitle}</h2>
        </div>
        <div class="contact-info">
          ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
        </div>
      </div>
      
      ${personalInfo.summary ? `
      <div class="accent-block">
        <p style="margin: 0; font-size: 16px;">${personalInfo.summary}</p>
      </div>
      ` : ''}
      
      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">💼</div>
          <h3 class="section-title">Experience</h3>
        </div>
        <div class="timeline">
          ${experience.map((exp) => `
            <div class="timeline-item">
              <div class="item-title">${exp.position}</div>
              <div class="item-meta">${exp.company} • ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
              ${exp.description ? `<div style="font-size: 14px;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${education.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🎓</div>
          <h3 class="section-title">Education</h3>
        </div>
        <div class="timeline">
          ${education.map((edu) => `
            <div class="timeline-item">
              <div class="item-title">${edu.degree}</div>
              <div class="item-meta">${edu.institution} • ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.field ? `<div style="font-size: 14px; color: #666;">${edu.field}</div>` : ''}
              ${edu.grade ? `<div style="font-size: 14px;">Grade: ${edu.grade}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🛠️</div>
          <h3 class="section-title">Skills</h3>
        </div>
        <div class="skills-grid">
          ${skills.slice(0, 6).map((skill) => `
            <div class="skill-card">
              <div class="skill-name">${skill}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🚀</div>
          <h3 class="section-title">Projects</h3>
        </div>
        ${projects.map(project => `
          <div class="project-card">
            <div style="font-weight: 600;">${project.name}</div>
            ${project.description ? `<div style="font-size: 14px; margin-top: 5px;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">🏆</div>
          <h3 class="section-title">Certifications</h3>
        </div>
        ${certifications.map(cert => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="font-size: 14px; color: var(--primary);">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${publications.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <div class="section-icon">📚</div>
          <h3 class="section-title">Publications</h3>
        </div>
        ${publications.map(pub => `
          <div style="margin-bottom: 15px; font-size: 14px;">
            <div style="font-weight: 600;">"${pub.title}"</div>
            ${pub.journal ? `<div style="font-style: italic;">${pub.journal}</div>` : ''}
            ${pub.year ? `<div>${pub.year}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// ============================================================
// 🇪🇺 EUROPASS ARCHITECTURE
// ============================================================
function generateEuropassTemplate(data) {
  const personalInfo = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = getAllSkills(data.skills);
  const languages = data.languages || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const publications = data.publications || [];

  const addressParts = [];
  if (personalInfo.address) addressParts.push(personalInfo.address);
  if (personalInfo.city) addressParts.push(personalInfo.city);
  if (personalInfo.country) addressParts.push(personalInfo.country);
  if (personalInfo.postalCode) addressParts.push(personalInfo.postalCode);
  const formattedAddress = addressParts.join(', ');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Europass CV'}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      body {
        font-family: 'Roboto', Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #f5f5f5;
      }
      .europass-container {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: flex;
      }
      .europass-sidebar {
        width: 35%;
        background: linear-gradient(135deg, #0E4194 0%, #2D6CC0 100%);
        color: white;
        padding: 40px 30px;
        box-sizing: border-box;
      }
      .europass-main {
        width: 65%;
        padding: 40px;
        box-sizing: border-box;
      }
      .eu-logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .eu-section-title {
        font-size: 16px;
        font-weight: 700;
        text-transform: uppercase;
        margin: 30px 0 15px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.3);
        letter-spacing: 1px;
      }
      .eu-personal-info {
        margin: 30px 0;
      }
      .eu-info-row {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
      }
      .eu-info-icon {
        margin-right: 12px;
        font-size: 16px;
        width: 20px;
        text-align: center;
      }
      .eu-language-level {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .eu-language-name {
        font-weight: 500;
      }
      .eu-skill-tag {
        display: inline-block;
        padding: 4px 12px;
        margin: 2px 4px 2px 0;
        background: rgba(255,255,255,0.15);
        border-radius: 4px;
        font-size: 13px;
      }
      .eu-main-title {
        color: #0E4194;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 5px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .eu-subtitle {
        color: #666;
        font-size: 18px;
        margin: 0 0 25px 0;
        font-weight: 400;
      }
      .eu-main-section {
        margin-bottom: 30px;
      }
      .eu-main-section-title {
        color: #0E4194;
        font-size: 18px;
        font-weight: 700;
        text-transform: uppercase;
        margin: 0 0 15px 0;
        padding-bottom: 5px;
        border-bottom: 2px solid #0E4194;
      }
      .eu-timeline-item {
        margin-bottom: 20px;
        position: relative;
        padding-left: 20px;
      }
      .eu-timeline-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 8px;
        height: 8px;
        background: #0E4194;
        border-radius: 50%;
      }
      .eu-job-title {
        font-weight: 700;
        font-size: 16px;
        margin: 0 0 5px 0;
      }
      .eu-job-meta {
        color: #0E4194;
        font-weight: 600;
        font-size: 14px;
        margin: 0 0 8px 0;
      }
      .eu-job-description {
        font-size: 14px;
        line-height: 1.6;
      }
      .eu-project-item {
        margin-bottom: 15px;
        padding-left: 10px;
      }
      .eu-cert-item {
        margin-bottom: 10px;
      }
      @media print {
        body {
          background: white;
        }
        .europass-container {
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="europass-container">
      <!-- Left Sidebar -->
      <div class="europass-sidebar">
        <div class="eu-logo">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">EUROPASS</div>
          <div style="font-size: 12px; opacity: 0.9;">European Curriculum Vitae</div>
        </div>
        
        ${personalInfo.dob || personalInfo.nationality || formattedAddress ? `
        <div class="eu-section-title">Personal Information</div>
        <div class="eu-personal-info">
          ${personalInfo.dob ? `<div class="eu-info-row"><span class="eu-info-icon">📅</span> ${personalInfo.dob}</div>` : ''}
          ${personalInfo.nationality ? `<div class="eu-info-row"><span class="eu-info-icon">🌍</span> ${personalInfo.nationality}</div>` : ''}
          ${formattedAddress ? `<div class="eu-info-row"><span class="eu-info-icon">📍</span> ${formattedAddress}</div>` : ''}
        </div>
        ` : ''}
        
        ${personalInfo.email || personalInfo.phone || personalInfo.linkedin || personalInfo.website || personalInfo.github ? `
        <div class="eu-section-title">Contact</div>
        <div class="eu-personal-info">
          ${personalInfo.email ? `<div class="eu-info-row"><span class="eu-info-icon">📧</span> ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div class="eu-info-row"><span class="eu-info-icon">📱</span> ${personalInfo.phone}</div>` : ''}
          ${personalInfo.linkedin ? `<div class="eu-info-row"><span class="eu-info-icon">💼</span> ${personalInfo.linkedin}</div>` : ''}
          ${personalInfo.website ? `<div class="eu-info-row"><span class="eu-info-icon">🌐</span> ${personalInfo.website}</div>` : ''}
          ${personalInfo.github ? `<div class="eu-info-row"><span class="eu-info-icon">💻</span> ${personalInfo.github}</div>` : ''}
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="eu-section-title">Skills & Competences</div>
        <div style="margin-top: 15px;">
          ${skills.map((skill) => `<span class="eu-skill-tag">${skill}</span>`).join('')}
        </div>
        ` : ''}
        
        ${languages.length > 0 ? `
        <div class="eu-section-title">Languages</div>
        <div style="margin-top: 15px;">
          ${languages.map((lang) => `
            <div class="eu-language-level">
              <span class="eu-language-name">${lang.language}</span>
              <span>${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      
      <!-- Main Content -->
      <div class="europass-main">
        <h1 class="eu-main-title">${personalInfo.fullName}</h1>
        <div class="eu-subtitle">${personalInfo.professionalTitle}</div>
        
        ${personalInfo.summary ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Profile Summary</div>
          <p style="line-height: 1.8; font-size: 15px;">${personalInfo.summary}</p>
        </div>
        ` : ''}
        
        ${experience.length > 0 ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Work Experience</div>
          ${experience.map((exp) => `
            <div class="eu-timeline-item">
              <div class="eu-job-title">${exp.position}</div>
              <div class="eu-job-meta">${exp.company}${exp.location ? ` | ${exp.location}` : ''} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
              ${exp.description ? `<div class="eu-job-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Education & Training</div>
          ${education.map((edu) => `
            <div class="eu-timeline-item">
              <div class="eu-job-title">${edu.degree}</div>
              <div class="eu-job-meta">${edu.institution} | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.field ? `<div style="font-style: italic; margin-top: 5px;">Field of study: ${edu.field}</div>` : ''}
              ${edu.grade ? `<div style="margin-top: 5px;">Grade: ${edu.grade}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${projects.length > 0 ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Projects</div>
          ${projects.map(project => `
            <div class="eu-project-item">
              <div style="font-weight: 600;">${project.name}</div>
              ${project.description ? `<div style="font-size: 14px; margin-top: 5px;">${project.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Certifications</div>
          ${certifications.map(cert => `
            <div class="eu-cert-item">
              <div style="font-weight: 600;">${cert.title}</div>
              ${cert.issuer ? `<div style="font-size: 14px;">${cert.issuer}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${publications.length > 0 ? `
        <div class="eu-main-section">
          <div class="eu-main-section-title">Publications</div>
          ${publications.map(pub => `
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600;">"${pub.title}"</div>
              ${pub.journal ? `<div style="font-style: italic;">${pub.journal}</div>` : ''}
              ${pub.year ? `<div>${pub.year}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  </body>
  </html>`;
}

// ============================================================
// 📜 SCOPUS ARCHITECTURE
// ============================================================
function generateScopusTemplate(data) {
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Academic CV'}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&family=Garamond&display=swap');
      body {
        font-family: 'Garamond', 'Times New Roman', serif;
        margin: 0;
        padding: 0;
        background: white;
        color: #000;
        font-size: 12pt;
        line-height: 1.5;
      }
      .scopus-container {
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 40px;
        box-sizing: border-box;
        background: white;
      }
      .scopus-header {
        text-align: center;
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .scopus-name {
        font-size: 24pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin: 0;
      }
      .scopus-title {
        font-size: 14pt;
        font-style: italic;
        margin: 10px 0;
      }
      .scopus-contacts {
        font-size: 11pt;
        margin-top: 15px;
      }
      .scopus-contacts span {
        margin: 0 15px;
      }
      .scopus-section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      .scopus-section-title {
        font-size: 14pt;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 1px solid #000;
        padding-bottom: 5px;
        margin-bottom: 15px;
      }
      .scopus-entry {
        margin-bottom: 12px;
      }
      .scopus-entry-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
      }
      .scopus-entry-sub {
        font-style: italic;
        margin-top: 3px;
      }
      .scopus-publication {
        margin-left: 20px;
        text-indent: -20px;
        margin-bottom: 8px;
        font-size: 11pt;
      }
      .scopus-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 10px;
      }
      .scopus-skill {
        padding: 2px 8px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 10pt;
      }
      .scopus-project {
        margin-bottom: 10px;
        padding-left: 10px;
      }
      @media print {
        .scopus-container {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="scopus-container">
      <div class="scopus-header">
        <h1 class="scopus-name">${personalInfo.fullName}</h1>
        <div class="scopus-title">${personalInfo.professionalTitle}</div>
        <div class="scopus-contacts">
          ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
          ${personalInfo.orcid ? `<span>ORCID: ${personalInfo.orcid}</span>` : ''}
          ${personalInfo.city ? `<span>${personalInfo.city}${personalInfo.country ? `, ${personalInfo.country}` : ''}</span>` : ''}
        </div>
      </div>
      
      ${personalInfo.summary ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Research Profile</div>
        <p style="text-align: justify;">${personalInfo.summary}</p>
      </div>
      ` : ''}
      
      ${experience.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Research Experience</div>
        ${experience.map((exp) => `
          <div class="scopus-entry">
            <div class="scopus-entry-header">
              <span>${exp.position}</span>
              <span>${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
            </div>
            <div class="scopus-entry-sub">${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
            ${exp.description ? `<div style="margin-top: 5px;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${education.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Education</div>
        ${education.map((edu) => `
          <div class="scopus-entry">
            <div class="scopus-entry-header">
              <span>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</span>
              <span>${formatDate(edu.endDate)}</span>
            </div>
            <div class="scopus-entry-sub">${edu.institution}</div>
            ${edu.thesis ? `<div style="margin-top: 5px; font-size: 11pt;"><strong>Dissertation:</strong> "${edu.thesis}"</div>` : ''}
            ${edu.grade ? `<div style="font-size: 11pt;"><strong>Grade:</strong> ${edu.grade}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${publications.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Selected Publications</div>
        ${publications.slice(0, 10).map((pub) => `
          <div class="scopus-publication">
            "${pub.title}"${pub.journal ? `, <i>${pub.journal}</i>` : ''}${pub.year ? `, ${pub.year}` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${projects.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Research Projects</div>
        ${projects.map(project => `
          <div class="scopus-project">
            <strong>${project.name}</strong>
            ${project.description ? `<div style="margin-top: 3px;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Certifications & Training</div>
        ${certifications.map(cert => `
          <div style="margin-bottom: 8px;">
            <strong>${cert.title}</strong>${cert.issuer ? `, ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${skills.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Technical Skills</div>
        <div class="scopus-skills">
          ${skills.map((skill) => `<span class="scopus-skill">${skill}</span>`).join('')}
        </div>
      </div>
      ` : ''}
      
      ${languages.length > 0 ? `
      <div class="scopus-section">
        <div class="scopus-section-title">Languages</div>
        ${languages.map(lang => `
          <div style="margin-bottom: 5px;">
            <strong>${lang.language}:</strong> ${lang.proficiency}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// ============================================================
// 🎨 CREATIVE ARCHITECTURE TEMPLATES (3 Variations)
// ============================================================

// Creative Template 1: Asymmetrical Creative
function creativeTemplate1(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.creative;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Creative Portfolio'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --accent: ${palette.accent};
      }
      body {
        font-family: 'Montserrat', 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background: #f8f9fa;
      }
      .creative-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 40px;
      }
      .creative-sidebar {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 40px;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
      }
      .creative-sidebar::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        opacity: 0.3;
      }
      .profile-circle {
        width: 150px;
        height: 150px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        margin: 0 auto 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 50px;
        border: 3px solid white;
      }
      .creative-name {
        font-size: 32px;
        font-weight: 800;
        margin: 0 0 10px 0;
        text-align: center;
      }
      .creative-title {
        font-size: 18px;
        text-align: center;
        opacity: 0.9;
        margin-bottom: 30px;
      }
      .creative-section {
        margin: 30px 0;
      }
      .section-heading {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .main-content {
        padding-top: 40px;
      }
      .creative-block {
        background: white;
        padding: 30px;
        border-radius: 15px;
        margin-bottom: 30px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        border-left: 5px solid var(--primary);
      }
      .block-title {
        color: var(--secondary);
        font-size: 22px;
        font-weight: 700;
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .experience-item {
        margin-bottom: 25px;
        padding-left: 20px;
        border-left: 2px solid var(--accent);
      }
      .company {
        color: var(--primary);
        font-weight: 600;
        font-size: 18px;
      }
      .period {
        background: var(--accent);
        color: white;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 12px;
        display: inline-block;
        margin: 5px 0;
      }
      .project-card {
        background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 15px;
      }
      @media (max-width: 900px) {
        .creative-container { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="creative-container">
      <div class="creative-sidebar">
        <div class="profile-circle">🎨</div>
        <h1 class="creative-name">${personalInfo.fullName}</h1>
        <div class="creative-title">${personalInfo.professionalTitle}</div>
        
        ${personalInfo.email || personalInfo.phone || personalInfo.city ? `
        <div class="creative-section">
          <div class="section-heading">📍 Contact</div>
          <div style="font-size: 14px; line-height: 1.8;">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
          </div>
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="creative-section">
          <div class="section-heading">🛠️ Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.slice(0, 8).map((skill) => `
              <span style="background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 15px; font-size: 14px;">${skill}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      
      <div class="main-content">
        ${personalInfo.summary ? `
        <div class="creative-block">
          <h2 class="block-title">✨ About Me</h2>
          <p style="font-size: 16px; line-height: 1.8;">${personalInfo.summary}</p>
        </div>
        ` : ''}
        
        ${experience.length > 0 ? `
        <div class="creative-block">
          <h2 class="block-title">💼 Experience</h2>
          ${experience.map((exp) => `
            <div class="experience-item">
              <div class="company">${exp.company}</div>
              <div class="period">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
              <div style="font-weight: 600; margin: 5px 0;">${exp.position}</div>
              ${exp.description ? `<div style="font-size: 14px;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="creative-block">
          <h2 class="block-title">🎓 Education</h2>
          ${education.map((edu) => `
            <div style="margin-bottom: 20px;">
              <div style="font-weight: 700; font-size: 18px;">${edu.degree}</div>
              <div style="color: var(--primary); font-weight: 600;">${edu.institution}</div>
              <div style="font-size: 14px;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${projects.length > 0 ? `
        <div class="creative-block">
          <h2 class="block-title">🚀 Projects</h2>
          ${projects.map(project => `
            <div class="project-card">
              <div style="font-weight: 700; font-size: 18px;">${project.name}</div>
              ${project.description ? `<div style="font-size: 14px; margin-top: 8px;">${project.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
        <div class="creative-block">
          <h2 class="block-title">🏆 Certifications</h2>
          ${certifications.map(cert => `
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600;">${cert.title}</div>
              ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  </body>
  </html>`;
}

// Creative Template 2: Magazine Style
function creativeTemplate2(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.creative;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Creative CV'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
      }
      body {
        font-family: 'Playfair Display', serif;
        margin: 0;
        padding: 0;
        background: #fefefe;
      }
      .magazine-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 60px 40px;
        column-count: 2;
        column-gap: 60px;
      }
      .magazine-header {
        column-span: all;
        text-align: center;
        margin-bottom: 50px;
      }
      .magazine-name {
        font-size: 48px;
        font-weight: 700;
        margin: 0;
        color: var(--secondary);
        letter-spacing: 2px;
      }
      .magazine-title {
        font-size: 24px;
        font-style: italic;
        margin: 10px 0 30px 0;
        color: var(--primary);
      }
      .decorative-line {
        height: 3px;
        background: linear-gradient(90deg, transparent, var(--primary), transparent);
        width: 200px;
        margin: 20px auto;
      }
      .magazine-section {
        break-inside: avoid;
        margin-bottom: 40px;
      }
      .section-head {
        font-size: 28px;
        font-weight: 700;
        color: var(--secondary);
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--primary);
      }
      .highlight-box {
        background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), transparent);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        border-left: 4px solid var(--primary);
      }
      .experience-card {
        margin-bottom: 30px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      }
      .card-title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 0 8px 0;
      }
      .card-subtitle {
        color: var(--primary);
        font-style: italic;
        margin-bottom: 10px;
      }
      .skill-badge {
        display: inline-block;
        padding: 5px 15px;
        margin: 5px 8px 5px 0;
        background: rgba(var(--primary-rgb), 0.1);
        border-radius: 20px;
        font-size: 14px;
        color: var(--secondary);
      }
      .project-spotlight {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
      }
      @media (max-width: 768px) {
        .magazine-container { column-count: 1; }
      }
    </style>
  </head>
  <body>
    <div class="magazine-container">
      <div class="magazine-header">
        <h1 class="magazine-name">${personalInfo.fullName}</h1>
        <div class="magazine-title">${personalInfo.professionalTitle}</div>
        <div class="decorative-line"></div>
      </div>
      
      ${personalInfo.summary ? `
      <div class="magazine-section">
        <h2 class="section-head">Profile</h2>
        <div class="highlight-box">
          <p style="font-size: 16px; line-height: 1.8; margin: 0;">${personalInfo.summary}</p>
        </div>
      </div>
      ` : ''}
      
      ${experience.length > 0 ? `
      <div class="magazine-section">
        <h2 class="section-head">Experience</h2>
        ${experience.map((exp) => `
          <div class="experience-card">
            <div class="card-title">${exp.position}</div>
            <div class="card-subtitle">${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            ${exp.description ? `<p style="font-size: 15px; line-height: 1.6;">${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${education.length > 0 ? `
      <div class="magazine-section">
        <h2 class="section-head">Education</h2>
        ${education.map((edu) => `
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; font-size: 18px;">${edu.degree}</div>
            <div style="color: var(--primary);">${edu.institution}</div>
            <div style="font-size: 14px;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
            ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${skills.length > 0 ? `
      <div class="magazine-section">
        <h2 class="section-head">Skills</h2>
        <div>
          ${skills.map((skill) => `
            <span class="skill-badge">${skill}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${projects.length > 0 ? `
      <div class="magazine-section">
        <h2 class="section-head">Projects</h2>
        ${projects.map(project => `
          <div class="project-spotlight">
            <div style="font-weight: 700; font-size: 16px;">${project.name}</div>
            ${project.description ? `<div style="font-size: 14px; margin-top: 8px;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="magazine-section">
        <h2 class="section-head">Certifications</h2>
        ${certifications.map(cert => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
      <div class="magazine-section">
        <h2 class="section-head">Contact</h2>
        <div style="font-size: 16px; line-height: 1.8;">
          ${personalInfo.email ? `<div>📧 ${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>📱 ${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>📍 ${personalInfo.city}</div>` : ''}
          ${personalInfo.linkedin ? `<div>🔗 ${personalInfo.linkedin}</div>` : ''}
          ${personalInfo.github ? `<div>💻 ${personalInfo.github}</div>` : ''}
          ${personalInfo.website ? `<div>🌐 ${personalInfo.website}</div>` : ''}
        </div>
        </div>
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// Creative Template 3: Infographic Style
function creativeTemplate3(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.creative;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Infographic CV'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
      }
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .infographic-card {
        width: 900px;
        background: white;
        border-radius: 30px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      .infographic-left {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        padding: 50px;
        position: relative;
      }
      .infographic-right {
        padding: 50px;
        background: white;
      }
      .avatar-container {
        width: 180px;
        height: 180px;
        background: rgba(255,255,255,0.15);
        border-radius: 50%;
        margin: 0 auto 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 60px;
        border: 5px solid white;
      }
      .infographic-name {
        font-size: 36px;
        font-weight: 800;
        margin: 0 0 10px 0;
        text-align: center;
      }
      .infographic-title {
        font-size: 20px;
        text-align: center;
        opacity: 0.9;
        margin-bottom: 40px;
      }
      .infographic-section {
        margin-bottom: 30px;
      }
      .section-label {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .timeline {
        position: relative;
        padding-left: 25px;
      }
      .timeline::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 0;
        height: 100%;
        width: 3px;
        background: var(--primary);
      }
      .timeline-item {
        position: relative;
        margin-bottom: 25px;
      }
      .timeline-item::before {
        content: '';
        position: absolute;
        left: -17px;
        top: 5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--primary);
      }
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 5px;
      }
      .item-title {
        font-weight: 700;
        font-size: 18px;
        color: var(--secondary);
      }
      .item-date {
        color: var(--primary);
        font-weight: 600;
        font-size: 14px;
      }
      .skill-tag {
        display: inline-block;
        padding: 6px 12px;
        margin: 0 8px 8px 0;
        background: rgba(var(--primary-rgb), 0.1);
        border-radius: 15px;
        font-size: 14px;
      }
      .project-bubble {
        background: linear-gradient(135deg, #e0f2fe, #bae6fd);
        padding: 15px;
        border-radius: 15px;
        margin-bottom: 15px;
      }
      @media (max-width: 950px) {
        .infographic-card { grid-template-columns: 1fr; width: 95%; }
      }
    </style>
  </head>
  <body>
    <div class="infographic-card">
      <div class="infographic-left">
        <div class="avatar-container">🚀</div>
        <h1 class="infographic-name">${personalInfo.fullName}</h1>
        <div class="infographic-title">${personalInfo.professionalTitle}</div>
        
        ${personalInfo.email || personalInfo.phone || personalInfo.city ? `
        <div class="infographic-section">
          <div class="section-label">📞 Contact</div>
          <div style="font-size: 15px; line-height: 1.8;">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
          </div>
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label">🛠️ Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${skills.slice(0, 8).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        
        ${languages.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label">🌐 Languages</div>
          ${languages.map(lang => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>${lang.language}</span>
              <span style="font-weight: 600;">${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      
      <div class="infographic-right">
        ${personalInfo.summary ? `
        <div class="infographic-section">
          <div class="section-label" style="color: var(--secondary);">✨ Profile</div>
          <p style="font-size: 16px; line-height: 1.7; color: #555;">${personalInfo.summary}</p>
        </div>
        ` : ''}
        
        ${experience.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label" style="color: var(--secondary);">💼 Experience</div>
          <div class="timeline">
            ${experience.map((exp) => `
              <div class="timeline-item">
                <div class="item-header">
                  <div class="item-title">${exp.position}</div>
                  <div class="item-date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                </div>
                <div style="color: var(--primary); font-weight: 600; font-size: 15px;">${exp.company}</div>
                ${exp.description ? `<div style="font-size: 14px; margin-top: 5px; color: #666;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label" style="color: var(--secondary);">🎓 Education</div>
          ${education.map((edu) => `
            <div style="margin-bottom: 20px;">
              <div style="font-weight: 700; font-size: 17px; color: var(--secondary);">${edu.degree}</div>
              <div style="color: var(--primary); font-weight: 600;">${edu.institution}</div>
              <div style="font-size: 14px; color: #777;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
              ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${projects.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label" style="color: var(--secondary);">🚀 Projects</div>
          ${projects.map(project => `
            <div class="project-bubble">
              <div style="font-weight: 700; font-size: 16px;">${project.name}</div>
              ${project.description ? `<div style="font-size: 14px; margin-top: 8px;">${project.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
        <div class="infographic-section">
          <div class="section-label" style="color: var(--secondary);">🏆 Certifications</div>
          ${certifications.map(cert => `
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 600;">${cert.title}</div>
              ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  </body>
  </html>`;
}

// ============================================================
// 👔 EXECUTIVE ARCHITECTURE TEMPLATES (3 Variations)
// ============================================================

// Executive Template 1: Corporate Executive
function executiveTemplate1(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.finance;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Executive CV'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
        --bg: ${palette.background};
      }
      body {
        font-family: 'Georgia', serif;
        margin: 0;
        padding: 0;
        background: var(--bg);
        color: #222;
      }
      .executive-container {
        max-width: 850px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 5px 30px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
      }
      .executive-header {
        background: var(--secondary);
        color: white;
        padding: 60px 50px;
        position: relative;
        overflow: hidden;
      }
      .executive-header::before {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        width: 300px;
        height: 100%;
        background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      }
      .header-content {
        max-width: 600px;
        position: relative;
        z-index: 2;
      }
      .executive-name {
        font-size: 42px;
        font-weight: 700;
        margin: 0 0 10px 0;
        letter-spacing: 1px;
      }
      .executive-title {
        font-size: 24px;
        font-weight: 300;
        margin: 0 0 30px 0;
        opacity: 0.9;
      }
      .header-stats {
        display: flex;
        gap: 30px;
        margin-top: 20px;
      }
      .stat-item {
        text-align: center;
      }
      .stat-number {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary);
      }
      .stat-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.8;
      }
      .executive-body {
        padding: 50px;
      }
      .executive-section {
        margin-bottom: 40px;
      }
      .section-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--secondary);
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid var(--primary);
        position: relative;
      }
      .section-title::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 80px;
        height: 2px;
        background: var(--primary);
      }
      .leadership-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
      }
      .leadership-card {
        padding: 25px;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 4px solid var(--primary);
      }
      .card-role {
        font-size: 18px;
        font-weight: 700;
        margin: 0 0 5px 0;
        color: var(--secondary);
      }
      .card-company {
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 10px;
      }
      .competency-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }
      .competency-item {
        padding: 15px;
        background: #f5f5f5;
        border-radius: 5px;
        text-align: center;
      }
      .contact-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-top: 10px;
      }
      .contact-line {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
      }
    </style>
  </head>
  <body>
    <div class="executive-container">
      <div class="executive-header">
        <div class="header-content">
          <h1 class="executive-name">${personalInfo.fullName}</h1>
          <div class="executive-title">${personalInfo.professionalTitle}</div>
          
          ${personalInfo.summary ? `
          <div style="max-width: 500px; line-height: 1.7; font-size: 17px;">
            ${personalInfo.summary}
          </div>
          ` : ''}
          
          ${experience.length > 0 ? `
          <div class="header-stats">
            <div class="stat-item">
              <div class="stat-number">${experience.length}</div>
              <div class="stat-label">Positions</div>
            </div>
            ${projects.length > 0 ? `
            <div class="stat-item">
              <div class="stat-number">${projects.length}</div>
              <div class="stat-label">Projects</div>
            </div>
            ` : ''}
            ${certifications.length > 0 ? `
            <div class="stat-item">
              <div class="stat-number">${certifications.length}</div>
              <div class="stat-label">Certifications</div>
            </div>
            ` : ''}
          </div>
          ` : ''}
        </div>
      </div>
      
      <div class="executive-body">
        ${experience.length > 0 ? `
        <div class="executive-section">
          <h2 class="section-title">Leadership Experience</h2>
          <div class="leadership-grid">
            ${experience.map((exp) => `
              <div class="leadership-card">
                <div class="card-role">${exp.position}</div>
                <div class="card-company">${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                <div style="font-size: 15px; line-height: 1.6;">${exp.description ? exp.description.replace(/\n/g, '<br>') : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
          ${skills.length > 0 ? `
          <div class="executive-section">
            <h2 class="section-title">Core Competencies</h2>
            <div class="competency-grid">
              ${skills.slice(0, 8).map((skill) => `
                <div class="competency-item">
                  <div style="font-weight: 600;">${skill}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${education.length > 0 ? `
          <div class="executive-section">
            <h2 class="section-title">Education</h2>
            ${education.map((edu) => `
              <div style="margin-bottom: 25px;">
                <div style="font-weight: 700; font-size: 18px;">${edu.degree}</div>
                <div style="color: var(--primary); font-weight: 600;">${edu.institution}</div>
                <div style="font-size: 14px;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        
        ${projects.length > 0 ? `
        <div class="executive-section">
          <h2 class="section-title">Key Projects</h2>
          ${projects.map(project => `
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <div style="font-weight: 700; font-size: 18px; color: var(--secondary);">${project.name}</div>
              ${project.description ? `<div style="font-size: 15px; margin-top: 8px;">${project.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
        <div class="executive-section">
          <h2 class="section-title">Certifications</h2>
          ${certifications.map(cert => `
            <div style="margin-bottom: 15px;">
              <div style="font-weight: 700;">${cert.title}</div>
              ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
        <div class="executive-section">
          <h2 class="section-title">Contact Information</h2>
          <div class="contact-info">
            ${personalInfo.email ? `<div class="contact-line">📧 ${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="contact-line">📱 ${personalInfo.phone}</div>` : ''}
            ${personalInfo.city ? `<div class="contact-line">📍 ${personalInfo.city}</div>` : ''}
            ${personalInfo.linkedin ? `<div class="contact-line">🔗 ${personalInfo.linkedin}</div>` : ''}
            ${personalInfo.github ? `<div class="contact-line">💻 ${personalInfo.github}</div>` : ''}
            ${personalInfo.website ? `<div class="contact-line">🌐 ${personalInfo.website}</div>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  </body>
  </html>`;
}

// Executive Template 2: Boardroom Style
function executiveTemplate2(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.finance;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Boardroom CV'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
      }
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
      body {
        font-family: 'Lora', serif;
        margin: 0;
        padding: 40px;
        background: #f5f3f0;
        color: #333;
      }
      .boardroom-card {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 60px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        position: relative;
        border: 1px solid #e8e4dc;
      }
      .boardroom-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
      }
      .boardroom-header {
        text-align: center;
        margin-bottom: 50px;
        padding-bottom: 40px;
        border-bottom: 2px solid #e8e4dc;
      }
      .boardroom-name {
        font-size: 36px;
        font-weight: 700;
        margin: 0 0 10px 0;
        letter-spacing: 1px;
        color: var(--secondary);
      }
      .boardroom-title {
        font-size: 20px;
        font-style: italic;
        color: var(--primary);
        margin: 0 0 30px 0;
      }
      .boardroom-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
      }
      .boardroom-section {
        margin-bottom: 35px;
      }
      .section-header {
        font-size: 20px;
        font-weight: 700;
        color: var(--secondary);
        margin: 0 0 20px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #e8e4dc;
        position: relative;
      }
      .section-header::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 60px;
        height: 1px;
        background: var(--primary);
      }
      .experience-entry {
        margin-bottom: 25px;
      }
      .entry-title {
        font-weight: 700;
        font-size: 18px;
        margin: 0 0 5px 0;
        color: var(--secondary);
      }
      .entry-meta {
        color: var(--primary);
        font-size: 15px;
        margin-bottom: 8px;
      }
      .competency-tag {
        display: inline-block;
        padding: 6px 12px;
        margin: 0 8px 8px 0;
        background: #f0f4f8;
        border-radius: 4px;
        font-size: 14px;
        color: var(--secondary);
      }
      .contact-details {
        background: #f9f7f3;
        padding: 25px;
        border-radius: 5px;
        margin-top: 40px;
      }
      .contact-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        font-size: 15px;
      }
      .contact-icon {
        width: 30px;
        color: var(--primary);
      }
      @media (max-width: 768px) {
        .boardroom-columns { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="boardroom-card">
      <div class="boardroom-header">
        <h1 class="boardroom-name">${personalInfo.fullName}</h1>
        <div class="boardroom-title">${personalInfo.professionalTitle}</div>
        ${personalInfo.summary ? `
        <div class="boardroom-summary" style="max-width: 600px; margin: 0 auto; font-size: 17px; line-height: 1.8; color: #555;">
          ${personalInfo.summary}
        </div>
        ` : ''}
      </div>
      
      <div class="boardroom-columns">
        ${experience.length > 0 ? `
        <div>
          <div class="boardroom-section">
            <h2 class="section-header">Executive Experience</h2>
            ${experience.map((exp) => `
              <div class="experience-entry">
                <div class="entry-title">${exp.position}</div>
                <div class="entry-meta">${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
                ${exp.description ? `<div style="font-size: 15px; line-height: 1.6; color: #555;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div>
          ${skills.length > 0 ? `
          <div class="boardroom-section">
            <h2 class="section-header">Core Competencies</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${skills.slice(0, 6).map((skill) => `
                <span class="competency-tag">${skill}</span>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          ${education.length > 0 ? `
          <div class="boardroom-section">
            <h2 class="section-header">Education</h2>
            ${education.map((edu) => `
              <div style="margin-bottom: 20px;">
                <div style="font-weight: 700; color: var(--secondary);">${edu.degree}</div>
                <div style="color: var(--primary);">${edu.institution}</div>
                <div style="font-size: 14px; color: #777;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${projects.length > 0 ? `
          <div class="boardroom-section">
            <h2 class="section-header">Key Projects</h2>
            ${projects.map(project => `
              <div style="margin-bottom: 20px;">
                <div style="font-weight: 600;">${project.name}</div>
                ${project.description ? `<div style="font-size: 14px; margin-top: 5px;">${project.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
      
      ${certifications.length > 0 ? `
      <div class="boardroom-section">
        <h2 class="section-header">Certifications</h2>
        ${certifications.map(cert => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
      <div class="contact-details">
        <h2 class="section-header" style="border: none; padding: 0; margin: 0 0 20px 0;">Contact</h2>
        ${personalInfo.email ? `
        <div class="contact-row">
          <span class="contact-icon">📧</span>
          <span>${personalInfo.email}</span>
        </div>
        ` : ''}
        ${personalInfo.phone ? `
        <div class="contact-row">
          <span class="contact-icon">📱</span>
          <span>${personalInfo.phone}</span>
        </div>
        ` : ''}
        ${personalInfo.city ? `
        <div class="contact-row">
          <span class="contact-icon">📍</span>
          <span>${personalInfo.city}</span>
        </div>
        ` : ''}
        ${personalInfo.linkedin ? `
        <div class="contact-row">
          <span class="contact-icon">🔗</span>
          <span>${personalInfo.linkedin}</span>
        </div>
        ` : ''}
        ${personalInfo.github ? `
        <div class="contact-row">
          <span class="contact-icon">💻</span>
          <span>${personalInfo.github}</span>
        </div>
        ` : ''}
        ${personalInfo.website ? `
        <div class="contact-row">
          <span class="contact-icon">🌐</span>
          <span>${personalInfo.website}</span>
        </div>
        ` : ''}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// Executive Template 3: C-Level Minimalist
function executiveTemplate3(data, industry) {
  const palette = INDUSTRY_PALETTES[industry] || INDUSTRY_PALETTES.finance;
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Executive CV'}</title>
    <style>
      :root {
        --primary: ${palette.primary};
        --secondary: ${palette.secondary};
      }
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        margin: 0;
        padding: 60px 40px;
        background: white;
        color: #111;
      }
      .clevel-container {
        max-width: 700px;
        margin: 0 auto;
      }
      .clevel-header {
        margin-bottom: 60px;
        border-bottom: 3px solid var(--primary);
        padding-bottom: 40px;
      }
      .clevel-name {
        font-size: 48px;
        font-weight: 300;
        margin: 0 0 10px 0;
        letter-spacing: 2px;
        color: var(--secondary);
      }
      .clevel-title {
        font-size: 20px;
        font-weight: 400;
        margin: 0 0 30px 0;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 3px;
      }
      .clevel-contact {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 20px;
        font-size: 15px;
        color: #555;
      }
      .clevel-section {
        margin-bottom: 50px;
      }
      .section-heading {
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: var(--primary);
        margin: 0 0 20px 0;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      .experience-item {
        margin-bottom: 30px;
        position: relative;
        padding-left: 30px;
      }
      .experience-item::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--primary);
        font-weight: bold;
      }
      .item-position {
        font-weight: 600;
        font-size: 18px;
        margin: 0 0 5px 0;
        color: var(--secondary);
      }
      .item-details {
        color: var(--primary);
        font-size: 15px;
        margin-bottom: 8px;
      }
      .education-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }
      .education-card {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 5px;
      }
      .education-degree {
        font-weight: 600;
        font-size: 16px;
        margin: 0 0 8px 0;
      }
      .education-school {
        color: var(--primary);
        font-size: 15px;
        margin-bottom: 5px;
      }
      .skill-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
      }
      .skill-tag {
        padding: 6px 12px;
        background: #f5f5f5;
        border-radius: 3px;
        font-size: 13px;
        color: #555;
      }
      .project-highlight {
        border-left: 3px solid var(--primary);
        padding-left: 15px;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="clevel-container">
      <div class="clevel-header">
        <h1 class="clevel-name">${personalInfo.fullName}</h1>
        <div class="clevel-title">${personalInfo.professionalTitle}</div>
        
        ${personalInfo.summary ? `
        <div style="max-width: 500px; line-height: 1.8; font-size: 16px; color: #444;">
          ${personalInfo.summary}
        </div>
        ` : ''}
        
        ${personalInfo.email || personalInfo.phone || personalInfo.city || personalInfo.linkedin || personalInfo.github || personalInfo.website ? `
        <div class="clevel-contact">
          ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
          ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
          ${personalInfo.city ? `<div>${personalInfo.city}</div>` : ''}
          ${personalInfo.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
          ${personalInfo.github ? `<div>${personalInfo.github}</div>` : ''}
          ${personalInfo.website ? `<div>${personalInfo.website}</div>` : ''}
        </div>
        ` : ''}
      </div>
      
      ${experience.length > 0 ? `
      <div class="clevel-section">
        <h2 class="section-heading">Professional Experience</h2>
        ${experience.map((exp) => `
          <div class="experience-item">
            <div class="item-position">${exp.position}</div>
            <div class="item-details">${exp.company} | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            ${exp.description ? `<div style="font-size: 15px; color: #555; line-height: 1.6;">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 40px;">
        ${education.length > 0 ? `
        <div class="clevel-section">
          <h2 class="section-heading">Education</h2>
          <div class="education-grid">
            ${education.map((edu) => `
              <div class="education-card">
                <div class="education-degree">${edu.degree}</div>
                <div class="education-school">${edu.institution}</div>
                <div style="font-size: 14px; color: #777;">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
                ${edu.field ? `<div style="font-size: 14px;">${edu.field}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${skills.length > 0 ? `
        <div class="clevel-section">
          <h2 class="section-heading">Expertise</h2>
          <div class="skill-tags">
            ${skills.slice(0, 8).map((skill) => `
              <span class="skill-tag">${skill}</span>
            `).join('')}
        </div>
        ` : ''}
      </div>
      
      ${projects.length > 0 ? `
      <div class="clevel-section">
        <h2 class="section-heading">Key Projects</h2>
        ${projects.map(project => `
          <div class="project-highlight">
            <div style="font-weight: 600; font-size: 16px;">${project.name}</div>
            ${project.description ? `<div style="font-size: 14px; margin-top: 8px;">${project.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications.length > 0 ? `
      <div class="clevel-section">
        <h2 class="section-heading">Certifications</h2>
        ${certifications.map(cert => `
          <div style="margin-bottom: 15px;">
            <div style="font-weight: 600;">${cert.title}</div>
            ${cert.issuer ? `<div style="color: var(--primary);">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </body>
  </html>`;
}

// ============================================================
// 🚀 MAIN TEMPLATE GENERATOR FUNCTIONS
// ============================================================

function generateModernTemplate(data, industry) {
  const variations = [
    modernTemplate1,
    modernTemplate2,
    modernTemplate3,
    modernTemplate4
  ];
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex](data, industry);
}

function generateCreativeTemplate(data, industry) {
  const variations = [
    creativeTemplate1,
    creativeTemplate2,
    creativeTemplate3
  ];
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex](data, industry);
}

function generateExecutiveTemplate(data, industry) {
  const variations = [
    executiveTemplate1,
    executiveTemplate2,
    executiveTemplate3
  ];
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex](data, industry);
}

// ============================================================
// 🚀 MAIN API FUNCTION
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, cvType, userId, industry, save = false, cvTitle = 'My CV' } = body;

    // 1. VALIDATION
    const API_KEY = process.env.GEMINI_API_KEY || "";
    if (!db) throw new Error("Database connection failed");
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }
    
    const userData = userDoc.data();
    
    // Check if user has tokens
    if (!userData?.isPro && (userData?.tokens || 0) <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No tokens remaining. Please upgrade to Pro.',
        code: 'NO_TOKENS'
      }, { status: 403 });
    }

    // 2. GENERATE CV BASED ON ARCHITECTURE
    let cvHtml = '';
    
    switch (cvType.toLowerCase()) {
      case 'modern':
        cvHtml = generateModernTemplate(formData, industry);
        break;
      case 'europass':
        cvHtml = generateEuropassTemplate(formData);
        break;
      case 'scopus':
        cvHtml = generateScopusTemplate(formData);
        break;
      case 'creative':
        cvHtml = generateCreativeTemplate(formData, industry);
        break;
      case 'executive':
        cvHtml = generateExecutiveTemplate(formData, industry);
        break;
      default:
        cvHtml = generateModernTemplate(formData, industry);
    }

    // 3. OPTIONAL: AI ENHANCEMENT
    if (API_KEY.startsWith("AIza") && cvHtml.length < 1000) {
      try {
        const prompt = `
          Enhance this CV HTML to make it more professional for ${industry} industry.
          Keep the structure but improve design, spacing, and typography.
          Return only HTML with inline CSS.
          Current HTML: ${cvHtml.substring(0, 3000)}
        `;
        
        const model = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        const res = await fetch(model, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        if (res.ok) {
          const data = await res.json();
          const aiHtml = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiHtml && aiHtml.length > 500) {
            cvHtml = aiHtml.replace(/```(?:html)?/g, '').replace(/```/g, '').trim();
          }
        }
      } catch (error) {
        console.log("AI enhancement failed, using base template");
      }
    }

    // 4. SAVE CV IF REQUESTED AND USER IS PRO
    let cvId = null;
    if (userData?.isPro && save) {
      try {
        const cvRef = db.collection('cvStorage').doc();
        cvId = cvRef.id;
        
        const compressedHtml = compressCV(cvHtml);
        
        await cvRef.set({
          id: cvRef.id,
          userId,
          title: cvTitle || 'My CV',
          compressedHtml,
          originalSize: cvHtml.length,
          compressedSize: compressedHtml.length,
          industry: industry || 'general',
          template: cvType,
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          downloadCount: 0,
          isPublic: false,
          formData: formData // Store the original form data for editing
        });
        
        // Update user's saved CV count
        await userRef.update({
          savedCVs: FieldValue.increment(1),
          lastSavedCV: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error saving CV:", error);
        // Don't fail the whole request if saving fails
      }
    }

    // 5. DEDUCT TOKEN FOR NON-PRO USERS
    if (!userData.isPro) {
      await userRef.update({ 
        tokens: FieldValue.increment(-1),
        lastGenerated: new Date().toISOString()
      });
    }

    // 6. LOG GENERATION
    await db.collection('generations').add({
      userId,
      cvType,
      industry,
      timestamp: new Date().toISOString(),
      tokensUsed: userData.isPro ? 0 : 1,
      saved: save && userData?.isPro,
      cvId: cvId || null
    });

    return NextResponse.json({ 
      success: true, 
      cvHtml,
      cvId,
      architecture: cvType,
      industry,
      saved: save && userData?.isPro,
      tokensRemaining: userData.isPro ? 'unlimited' : (userData.tokens - 1)
    });

  } catch (error) {
    console.error('CV Generation Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `System Error: ${error.message}` 
    }, { status: 500 });
  }
}