/**
 * 🎨 PROFESSIONAL CV TEMPLATES ENGINE
 * =====================================
 * World-class, professional CV templates for 5 types × 10 industries
 * Each generation produces unique, employer-ready CVs
 */

// ============================================================
// 🌍 INDUSTRY COLOR SCHEMES - WORLD CLASS STANDARDS
// ============================================================
export const INDUSTRY_COLORS = {
  technology: {
    primary: "#1e3a8a",
    secondary: "#3b82f6",
    accent: "#0ea5e9",
    text: "#1f2937",
    lightBg: "#f0f9ff",
    highlight: "#00d9ff"
  },
  finance: {
    primary: "#1e3a8a",
    secondary: "#374151",
    accent: "#6b7280",
    text: "#111827",
    lightBg: "#f9fafb",
    highlight: "#d1d5db"
  },
  healthcare: {
    primary: "#065f46",
    secondary: "#059669",
    accent: "#10b981",
    text: "#064e3b",
    lightBg: "#f0fdf4",
    highlight: "#a7f3d0"
  },
  education: {
    primary: "#5b21b6",
    secondary: "#7c3aed",
    accent: "#c084fc",
    text: "#3f0f5c",
    lightBg: "#faf5ff",
    highlight: "#e9d5ff"
  },
  marketing: {
    primary: "#be185d",
    secondary: "#ec4899",
    accent: "#f472b6",
    text: "#500724",
    lightBg: "#fdf2f8",
    highlight: "#fbcfe8"
  },
  engineering: {
    primary: "#92400e",
    secondary: "#ea580c",
    accent: "#f97316",
    text: "#7c2d12",
    lightBg: "#fff7ed",
    highlight: "#fed7aa"
  },
  law: {
    primary: "#3730a3",
    secondary: "#6366f1",
    accent: "#818cf8",
    text: "#1e1b4b",
    lightBg: "#f8f7ff",
    highlight: "#e0e7ff"
  },
  creative: {
    primary: "#831843",
    secondary: "#db2777",
    accent: "#ec4899",
    text: "#500724",
    lightBg: "#fdf2f8",
    highlight: "#f9a8d4"
  },
  research: {
    primary: "#134e4a",
    secondary: "#0d9488",
    accent: "#14b8a6",
    text: "#0f2f2f",
    lightBg: "#f0fdfa",
    highlight: "#99fce4"
  },
  consulting: {
    primary: "#0c4a6e",
    secondary: "#0284c7",
    accent: "#06b6d4",
    text: "#082f49",
    lightBg: "#f0f9ff",
    highlight: "#a5f3fc"
  }
};

// ============================================================
// 🎨 TYPEFACE & PRESETS (Curated, Seeded for Uniqueness)
// ============================================================
const TYPE_TOKENS = {
    modern: {
        body: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        heading: "'Sora', 'Inter', 'Segoe UI', sans-serif"
    },
    europass: {
        body: "'Source Sans Pro', 'Inter', 'Arial', sans-serif",
        heading: "'Inter', 'Source Sans Pro', 'Arial', sans-serif"
    },
    scopus: {
        body: "'Merriweather', 'Times New Roman', serif",
        heading: "'Source Serif Pro', 'Georgia', serif"
    },
    creative: {
        body: "'Space Grotesk', 'Inter', 'Helvetica Neue', sans-serif",
        heading: "'Sora', 'Space Grotesk', 'Inter', sans-serif"
    },
    executive: {
        body: "'Inter', 'Helvetica Neue', sans-serif",
        heading: "'Cormorant Garamond', 'Libre Baskerville', 'Georgia', serif"
    }
};

const MODERN_PRESETS = [
    { layout: "left-rail", sidebarWidth: 26, headerAngle: 128, card: true },
    { layout: "top-bar", sidebarWidth: 0, headerAngle: 140, card: false },
    { layout: "split", sidebarWidth: 30, headerAngle: 120, card: true }
];

const EUROPASS_PRESETS = [
    { barColor: "#0066cc", barThickness: 4 },
    { barColor: "#0f4fa8", barThickness: 3 },
    { barColor: "#004080", barThickness: 5 }
];

const SCOPUS_PRESETS = [
    { ruleWeight: 1.5, titleSize: 24 },
    { ruleWeight: 2, titleSize: 25 },
    { ruleWeight: 1.25, titleSize: 23 }
];

const CREATIVE_PRESETS = [
    { heroShape: "circle", motifOpacity: 0.16 },
    { heroShape: "diagonal", motifOpacity: 0.22 },
    { heroShape: "wave", motifOpacity: 0.18 }
];

const EXECUTIVE_PRESETS = [
    { lineWeight: 2, serifHeaders: true },
    { lineWeight: 1.5, serifHeaders: true },
    { lineWeight: 2.5, serifHeaders: false }
];

// ============================================================
// 🎯 TEMPLATE VARIATION SYSTEM
// ============================================================
function createSeededRandom(seedValue) {
    let value = typeof seedValue === "number" ? seedValue : Date.now();
    return function next() {
        // LCG parameters
        value = (value * 1664525 + 1013904223) % 4294967296;
        return value / 4294967296;
    };
}

function pickPreset(presets, seed) {
    if (!Array.isArray(presets) || presets.length === 0) return {};
    const rand = createSeededRandom(seed || Date.now());
    const index = Math.floor(rand() * presets.length);
    return presets[index] || presets[0];
}

function getUniqueVariation(seed) {
    const rand = createSeededRandom(seed || Date.now());
    const shadowOptions = [
        "0 12px 32px rgba(0, 0, 0, 0.14)",
        "0 16px 40px rgba(0, 0, 0, 0.16)",
        "0 10px 26px rgba(0, 0, 0, 0.12)"
    ];
    const radiusOptions = ["6px", "8px", "10px"];
    return {
        colorShift: rand() > 0.5,
        layoutVariant: Math.floor(rand() * 3),
        spacingMultiplier: 0.9 + rand() * 0.25,
        borderRadius: radiusOptions[Math.floor(rand() * radiusOptions.length)],
        fontWeight: rand() > 0.5 ? "500" : "600",
        shadow: shadowOptions[Math.floor(rand() * shadowOptions.length)],
        gradientAngle: rand() > 0.5 ? 120 : 135
    };
}

const A4_WIDTH = "210mm";
const A4_HEIGHT = "297mm";

function formatDateRange(startDate, endDate, isCurrent) {
    if (!startDate && !endDate) return "";
    const safeFormat = (dateValue) => {
        if (!dateValue) return "";
        const parsed = new Date(dateValue);
        if (Number.isNaN(parsed.getTime())) return "";
        return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };
    const start = safeFormat(startDate);
    const end = safeFormat(endDate);
    if (start && (end || isCurrent)) return `${start} - ${end || "Present"}`;
    if (start) return start;
    if (end) return end;
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    if (startDate) return startDate;
    if (endDate) return endDate;
    return isCurrent ? "Present" : "";
}

function normalizeSkills(skills = {}) {
    if (Array.isArray(skills)) return skills.filter(Boolean);
    const technical = skills.technical || [];
    const soft = skills.soft || [];
    const tools = skills.tools || [];
    return [...technical, ...soft, ...tools].filter(Boolean);
}

function formatCertification(cert) {
    if (!cert) return "";
    if (typeof cert === "string") return cert;
    const parts = [];
    if (cert.title || cert.name) parts.push(cert.title || cert.name);
    if (cert.issuer) parts.push(cert.issuer);
    if (cert.credentialId) parts.push(`ID: ${cert.credentialId}`);
    if (cert.date) parts.push(cert.date);
    return parts.join(" • ");
}

function formatPublication(pub, index) {
    if (!pub) return "";
    if (typeof pub === "string") return `${typeof index === "number" ? `${index + 1}. ` : ""}${pub}`;
    const parts = [];
    if (pub.title) parts.push(pub.title);
    if (pub.authors) parts.push(pub.authors);
    if (pub.journal || pub.venue) parts.push(pub.journal || pub.venue);
    if (pub.year) parts.push(pub.year);
    if (pub.link) parts.push(pub.link);
    const prefix = typeof index === "number" ? `${index + 1}. ` : "";
    return prefix + parts.filter(Boolean).join(" • ");
}

// ============================================================
// 📄 MODERN CV TEMPLATE (Premium Canva-Style, ATS-Optimized)
// ============================================================
export function generateModernCV(formData, industry = "technology") {
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.technology;
    const seed = formData && formData._seed ? Number(formData._seed) : Date.now();
    const preset = pickPreset(MODERN_PRESETS, seed);
    const variant = getUniqueVariation(seed);
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = {},
    languages = [],
    certifications = [],
    projects = [],
    publications = []
  } = formData;

  const technicalSkills = skills.technical || [];
  const softSkills = skills.soft || [];
  const toolSkills = skills.tools || [];
  const allSkills = [...technicalSkills, ...softSkills, ...toolSkills];
    const sidebarWidth = preset.sidebarWidth || [26, 24, 28][variant.layoutVariant] || 25;
    const shadow = variant.shadow || "0 20px 60px rgba(0, 0, 0, 0.15)";
    const headerAngle = preset.headerAngle || variant.gradientAngle || 135;
    
    // Full address construction
    const addressParts = [
        personalInfo.address,
        personalInfo.city,
        personalInfo.postalCode,
        personalInfo.country
    ].filter(Boolean);
    const fullAddress = addressParts.join(', ');
    
    const fonts = TYPE_TOKENS.modern;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName || 'Professional CV'}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body};
            color: ${colors.text};
            background: #fafafa;
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
            width: ${A4_WIDTH};
            min-height: ${A4_HEIGHT};
            margin: 0 auto;
            background: white;
            box-shadow: ${shadow};
            display: flex;
            overflow: hidden;
        }
        
        .sidebar {
            width: ${sidebarWidth}%;
            background: linear-gradient(${headerAngle}deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 45px 35px;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, ${colors.accent}20 0%, transparent 60%);
            pointer-events: none;
        }
        
        .main {
            flex: 1;
            padding: 45px;
            background: white;
            position: relative;
        }
        
        .main::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, ${colors.lightBg} 0%, transparent 70%);
            border-radius: 50%;
            opacity: 0.5;
            pointer-events: none;
        }
        
        .header-name {
            font-family: ${fonts.heading};
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            line-height: 1.1;
            position: relative;
            z-index: 1;
        }
        
        .header-title {
            font-size: 13px;
            color: ${colors.highlight};
            font-weight: 600;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }
        
        .personal-details {
            background: rgba(255, 255, 255, 0.08);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 1;
        }
        
        .detail-row {
            font-size: 10px;
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
            line-height: 1.5;
        }
        
        .detail-label {
            font-weight: 600;
            opacity: 0.8;
            min-width: 70px;
        }
        
        .detail-value {
            flex: 1;
            word-break: break-word;
        }
        
        .section-title {
            font-family: ${fonts.heading};
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 30px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 3px solid ${colors.accent};
            color: ${colors.primary};
            background: linear-gradient(90deg, ${colors.lightBg} 0%, transparent 100%);
            padding: 8px 12px 10px 12px;
            margin-left: -12px;
            margin-right: -12px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 50px;
            height: 3px;
            background: ${colors.secondary};
        }
        
        .sidebar .section-title {
            border-bottom-color: rgba(255, 255, 255, 0.3);
            color: white;
            background: rgba(255, 255, 255, 0.05);
            margin-left: -35px;
            margin-right: -35px;
            padding-left: 35px;
            padding-right: 35px;
        }
        
        .sidebar .section-title::after {
            background: ${colors.highlight};
        }
        
        .contact-item {
            font-size: 10.5px;
            margin-bottom: 12px;
            word-break: break-word;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }
        
        .contact-icon {
            flex-shrink: 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .skill-category {
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .skill-category-title {
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            color: ${colors.highlight};
        }
        
        .skill-tag {
            display: inline-block;
            background: rgba(255, 255, 255, 0.15);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 9.5px;
            margin: 0 6px 8px 0;
            font-weight: 500;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .experience-item {
            margin-bottom: 24px;
            page-break-inside: avoid;
            position: relative;
            padding-left: 20px;
            border-left: 2px solid ${colors.lightBg};
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 4px;
            width: 10px;
            height: 10px;
            background: ${colors.accent};
            border-radius: 50%;
            border: 2px solid white;
        }
        
        .job-title {
            font-family: ${fonts.heading};
            font-size: 13px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 4px;
            line-height: 1.3;
        }
        
        .company-name {
            font-size: 11.5px;
            font-weight: 600;
            color: ${colors.secondary};
            margin-bottom: 4px;
        }
        
        .job-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 9.5px;
            color: #6b7280;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .job-meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .job-description {
            font-size: 10.5px;
            line-height: 1.7;
            color: ${colors.text};
        }
        
        .education-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
            position: relative;
            padding-left: 20px;
            border-left: 2px solid ${colors.lightBg};
        }
        
        .education-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 4px;
            width: 10px;
            height: 10px;
            background: ${colors.secondary};
            border-radius: 50%;
            border: 2px solid white;
        }
        
        .degree {
            font-family: ${fonts.heading};
            font-size: 12px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 4px;
        }
        
        .institution {
            font-size: 11px;
            font-weight: 600;
            color: ${colors.secondary};
            margin-bottom: 6px;
        }
        
        .edu-meta {
            font-size: 9.5px;
            color: #6b7280;
            margin-bottom: 6px;
        }
        
        .edu-details {
            font-size: 10px;
            color: ${colors.text};
            margin-top: 6px;
        }
        
        .language-item {
            font-size: 10.5px;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1;
        }
        
        .language-item:last-child {
            border-bottom: none;
        }
        
        .language-name {
            font-weight: 600;
        }
        
        .language-level {
            font-size: 9px;
            color: ${colors.highlight};
            font-weight: 600;
            background: rgba(255, 255, 255, 0.1);
            padding: 3px 8px;
            border-radius: 4px;
        }
        
        .project-item {
            margin-bottom: 20px;
            padding: 16px;
            background: ${colors.lightBg};
            border-radius: 10px;
            border-left: 4px solid ${colors.accent};
            page-break-inside: avoid;
        }
        
        .project-title {
            font-family: ${fonts.heading};
            font-size: 12px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 6px;
        }
        
        .project-link {
            font-size: 9.5px;
            color: ${colors.secondary};
            text-decoration: none;
            margin-bottom: 8px;
            display: inline-block;
        }
        
        .project-description {
            font-size: 10px;
            line-height: 1.6;
            color: ${colors.text};
            margin-bottom: 8px;
        }
        
        .project-tech {
            font-size: 9.5px;
            color: #6b7280;
            font-weight: 500;
        }
        
        .certification-item {
            background: rgba(255, 255, 255, 0.08);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-size: 10px;
            line-height: 1.5;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 1;
        }
        
        .publication-item {
            margin-bottom: 18px;
            padding-left: 20px;
            position: relative;
            page-break-inside: avoid;
        }
        
        .publication-item::before {
            content: '📄';
            position: absolute;
            left: 0;
            top: 2px;
            font-size: 12px;
        }
        
        .publication-title {
            font-size: 11px;
            font-weight: 600;
            color: ${colors.primary};
            margin-bottom: 4px;
            line-height: 1.4;
        }
        
        .publication-meta {
            font-size: 9.5px;
            color: #6b7280;
            line-height: 1.5;
        }
        
        @media print {
            @page { size: A4; margin: 10mm; }
            .container {
                box-shadow: none;
                width: ${A4_WIDTH};
                min-height: ${A4_HEIGHT};
            }
            body {
                background: white;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="header-name">${personalInfo.fullName || 'Your Name'}</div>
            <div class="header-title">${personalInfo.professionalTitle || 'Professional'}</div>
            
            ${(personalInfo.email || personalInfo.phone || personalInfo.linkedin || personalInfo.website || personalInfo.github || personalInfo.orcid || fullAddress || personalInfo.nationality || personalInfo.dob) ? `
            <div class="section-title">Contact Information</div>
            ${personalInfo.email ? `<div class="contact-item"><span class="contact-icon">📧</span><span>${personalInfo.email}</span></div>` : ''}
            ${personalInfo.phone ? `<div class="contact-item"><span class="contact-icon">📱</span><span>${personalInfo.phone}</span></div>` : ''}
            ${personalInfo.linkedin ? `<div class="contact-item"><span class="contact-icon">💼</span><span>${personalInfo.linkedin}</span></div>` : ''}
            ${personalInfo.website ? `<div class="contact-item"><span class="contact-icon">🌐</span><span>${personalInfo.website}</span></div>` : ''}
            ${personalInfo.github ? `<div class="contact-item"><span class="contact-icon">💻</span><span>${personalInfo.github}</span></div>` : ''}
            ${personalInfo.orcid ? `<div class="contact-item"><span class="contact-icon">🔬</span><span>ORCID: ${personalInfo.orcid}</span></div>` : ''}
            ${fullAddress ? `<div class="contact-item"><span class="contact-icon">📍</span><span>${fullAddress}</span></div>` : ''}
            ${personalInfo.nationality ? `<div class="contact-item"><span class="contact-icon">🌍</span><span>${personalInfo.nationality}</span></div>` : ''}
            ${personalInfo.dob ? `<div class="contact-item"><span class="contact-icon">🎂</span><span>${personalInfo.dob}</span></div>` : ''}
            ` : ''}
            
            ${languages.length > 0 ? `
            <div class="section-title">Languages</div>
            ${languages.map(lang => `
                <div class="language-item">
                    <span class="language-name">${lang.name || lang.language || lang}</span>
                    <span class="language-level">${lang.level || 'Proficient'}</span>
                </div>
            `).join('')}
            ` : ''}
            
            ${(technicalSkills.length > 0 || softSkills.length > 0 || toolSkills.length > 0) ? `
            <div class="section-title">Skills</div>
            ${technicalSkills.length > 0 ? `
                <div class="skill-category">
                    <div class="skill-category-title">Technical Skills</div>
                    <div style="display: flex; flex-wrap: wrap;">
                        ${technicalSkills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${softSkills.length > 0 ? `
                <div class="skill-category">
                    <div class="skill-category-title">Soft Skills</div>
                    <div style="display: flex; flex-wrap: wrap;">
                        ${softSkills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
            ${toolSkills.length > 0 ? `
                <div class="skill-category">
                    <div class="skill-category-title">Tools & Technologies</div>
                    <div style="display: flex; flex-wrap: wrap;">
                        ${toolSkills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                    </div>
                </div>
            ` : ''}
            ` : ''}
            
            ${certifications.length > 0 ? `
            <div class="section-title">Certifications</div>
            ${certifications.map((cert) => {
                if (typeof cert === 'string') return `<div class="certification-item">✓ ${cert}</div>`;
                const parts = [];
                if (cert.title || cert.name) parts.push(cert.title || cert.name);
                if (cert.issuer) parts.push(`Issuer: ${cert.issuer}`);
                if (cert.date) parts.push(cert.date);
                if (cert.credentialId) parts.push(`ID: ${cert.credentialId}`);
                return `<div class="certification-item">✓ ${parts.join(' • ')}</div>`;
            }).join('')}
            ` : ''}
        </div>
        
        <div class="main">
            ${personalInfo.summary ? `
            <div>
                <div class="section-title">Professional Summary</div>
                <p style="font-size: 11px; line-height: 1.8; color: ${colors.text};">${personalInfo.summary}</p>
            </div>
            ` : ''}
            
            ${experience.length > 0 ? `
            <div>
                <div class="section-title">Professional Experience</div>
                ${experience.map(exp => {
                    const dateStr = formatDateRange(exp.startDate, exp.endDate, exp.current) || exp.duration || '';
                    return `
                    <div class="experience-item">
                        <div class="job-title">${exp.position || 'Position'}</div>
                        <div class="company-name">${exp.company || 'Company'}</div>
                        <div class="job-meta">
                            ${dateStr ? `<span class="job-meta-item">📅 ${dateStr}</span>` : ''}
                            ${exp.location ? `<span class="job-meta-item">📍 ${exp.location}</span>` : ''}
                        </div>
                        ${exp.description ? `<div class="job-description">${exp.description}</div>` : ''}
                    </div>
                  `;
                }).join('')}
            </div>
            ` : ''}
            
            ${education.length > 0 ? `
            <div>
                <div class="section-title">Education</div>
                ${education.map(edu => {
                    const dateStr = formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear || '';
                    return `
                    <div class="education-item">
                        <div class="degree">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
                        <div class="institution">${edu.institution || 'Institution'}</div>
                        ${dateStr ? `<div class="edu-meta">📅 ${dateStr}</div>` : ''}
                        <div class="edu-details">
                            ${edu.grade ? `<div style="margin-bottom: 4px;">🎯 Grade: ${edu.grade}</div>` : ''}
                            ${edu.thesis ? `<div>📝 Thesis: ${edu.thesis}</div>` : ''}
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
            ` : ''}
            
            ${projects.length > 0 ? `
            <div>
                <div class="section-title">Projects</div>
                ${projects.map(proj => `
                    <div class="project-item">
                        <div class="project-title">${proj.name || proj.title || 'Project'}</div>
                        ${proj.link ? `<a href="${proj.link}" class="project-link">🔗 ${proj.link}</a>` : ''}
                        ${proj.description ? `<div class="project-description">${proj.description}</div>` : ''}
                        ${proj.technologies ? `<div class="project-tech">💻 Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${publications.length > 0 ? `
            <div>
                <div class="section-title">Publications</div>
                ${publications.map((pub, i) => {
                    if (typeof pub === 'string') {
                        return `<div class="publication-item"><div class="publication-title">${i + 1}. ${pub}</div></div>`;
                    }
                    return `
                    <div class="publication-item">
                        <div class="publication-title">${i + 1}. ${pub.title || 'Publication'}</div>
                        <div class="publication-meta">
                            ${pub.authors ? `👥 ${pub.authors}<br>` : ''}
                            ${pub.journal || pub.venue ? `📚 ${pub.journal || pub.venue}<br>` : ''}
                            ${pub.year ? `📅 ${pub.year}<br>` : ''}
                            ${pub.link ? `🔗 ${pub.link}<br>` : ''}
                            ${pub.description ? `📝 ${pub.description}` : ''}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>`;

  return html;
}

// ============================================================
// 🇪🇺 EUROPASS CV TEMPLATE (Official EU Standard)
// ============================================================
export function generateEuropassCV(formData, industry = "technology") {
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.technology;
    const seed = formData && formData._seed ? Number(formData._seed) : Date.now();
    const preset = pickPreset(EUROPASS_PRESETS, seed);
    const fonts = TYPE_TOKENS.europass;
  const {
    personalInfo = {},
    experience = [],
    education = [],
        skills = {},
        languages = [],
        certifications = [],
        projects = [],
        publications = []
  } = formData;

    const skillsList = normalizeSkills(skills);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Europass CV - ${personalInfo.fullName || 'Professional'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body};
            color: #333;
            background: white;
            line-height: 1.5;
        }
        
        .container {
            width: ${A4_WIDTH};
            min-height: ${A4_HEIGHT};
            margin: 0 auto;
            background: white;
            padding: 32px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            border-bottom: ${preset.barThickness || 4}px solid ${preset.barColor || "#0066cc"};
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 28px;
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 5px;
        }
        
        .title {
            font-size: 14px;
            color: #333;
            margin-bottom: 15px;
        }
        
        .contact-info {
            font-size: 10px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: flex;
            gap: 5px;
        }
        
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: white;
            background: ${preset.barColor || "#0066cc"};
            padding: 8px 12px;
            margin-bottom: 10px;
            border-left: ${Math.max((preset.barThickness || 4) - 1, 3)}px solid #003d99;
        }
        
        .entry {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        
        .entry-title {
            font-weight: bold;
            font-size: 11px;
        }
        
        .entry-date {
            font-size: 10px;
            color: #666;
            font-style: italic;
        }
        
        .entry-subtitle {
            font-size: 10px;
            color: #0066cc;
            margin-bottom: 3px;
        }
        
        .entry-description {
            font-size: 10px;
            line-height: 1.4;
        }
        
        .skill-category {
            margin-bottom: 8px;
        }
        
        .skill-category-name {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 3px;
        }
        
        .skill-list {
            font-size: 10px;
            line-height: 1.4;
        }
        
        .language-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 10px;
        }
        
        @media print {
            @page { size: A4; margin: 10mm; }
            .container {
                width: ${A4_WIDTH};
                min-height: ${A4_HEIGHT};
                padding: 24px;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">${personalInfo.fullName || 'NAME'}</div>
            <div class="title">${personalInfo.professionalTitle || 'PROFESSIONAL TITLE'}</div>
            <div class="contact-info">
                ${personalInfo.email ? `<div class="contact-item"><span>📧</span><span>${personalInfo.email}</span></div>` : ''}
                ${personalInfo.phone ? `<div class="contact-item"><span>📱</span><span>${personalInfo.phone}</span></div>` : ''}
                ${personalInfo.address ? `<div class="contact-item"><span>📍</span><span>${personalInfo.address}</span></div>` : ''}
                ${personalInfo.linkedin ? `<div class="contact-item"><span>🔗</span><span>${personalInfo.linkedin}</span></div>` : ''}
                ${personalInfo.website ? `<div class="contact-item"><span>🌐</span><span>${personalInfo.website}</span></div>` : ''}
            </div>
        </div>
        
        ${personalInfo.summary ? `
        <div class="section">
            <div class="section-title">PERSONAL STATEMENT</div>
            <div style="font-size: 10px; line-height: 1.5;">${personalInfo.summary}</div>
        </div>
        ` : ''}
        
        ${experience.length > 0 ? `
        <div class="section">
            <div class="section-title">WORK EXPERIENCE</div>
            ${experience.map(exp => `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${exp.position || 'Position'}</div>
                        <div class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.current) || exp.duration || 'Duration'}</div>
                    </div>
                    <div class="entry-subtitle">${exp.company || 'Company'}</div>
                    ${exp.location ? `<div class="entry-description">${exp.location}</div>` : ''}
                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="section">
            <div class="section-title">EDUCATION AND TRAINING</div>
            ${education.map(edu => `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${edu.degree || 'Qualification'}${edu.field ? ' in ' + edu.field : ''}</div>
                        <div class="entry-date">${formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear || 'Year'}</div>
                    </div>
                    <div class="entry-subtitle">${edu.institution || 'Institution'}</div>
                    ${edu.grade ? `<div class="entry-description">Grade: ${edu.grade}</div>` : ''}
                    ${edu.thesis ? `<div class="entry-description">Thesis: ${edu.thesis}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${languages.length > 0 ? `
        <div class="section">
            <div class="section-title">LANGUAGES</div>
            ${languages.map(lang => `
                <div class="language-item">
                    <span>${lang.name || lang}</span>
                    <span>${lang.level || 'Proficient'}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${skillsList.length > 0 ? `
        <div class="section">
            <div class="section-title">SKILLS</div>
            <div class="skill-list">${skillsList.slice(0, 15).join(' • ')}</div>
        </div>
        ` : ''}

        ${certifications.length > 0 ? `
        <div class="section">
            <div class="section-title">CERTIFICATIONS</div>
            ${certifications.map(cert => `<div class="entry-description">${formatCertification(cert)}</div>`).join('')}
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <div class="section">
            <div class="section-title">PROJECTS</div>
            ${projects.map(proj => `
                <div class="entry">
                    <div class="entry-header">
                        <div class="entry-title">${proj.name || proj.title || 'Project'}</div>
                        <div class="entry-date">${formatDateRange(proj.startDate, proj.endDate, proj.current) || ''}</div>
                    </div>
                    ${proj.link ? `<div class="entry-subtitle">${proj.link}</div>` : ''}
                    ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="entry-description">Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${publications.length > 0 ? `
        <div class="section">
            <div class="section-title">PUBLICATIONS</div>
            ${publications.map((pub, i) => `<div class="entry-description">${formatPublication(pub, i)}</div>`).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

  return html;
}

// ============================================================
// 📜 SCOPUS CV TEMPLATE (Academic Research Focus)
// ============================================================
export function generateScopusCV(formData, industry = "technology") {
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.technology;
    const seed = formData && formData._seed ? Number(formData._seed) : Date.now();
    const preset = pickPreset(SCOPUS_PRESETS, seed);
    const fonts = TYPE_TOKENS.scopus;
  const {
    personalInfo = {},
    experience = [],
    education = [],
        skills = {},
        publications = [],
        certifications = [],
        languages = [],
        projects = []
  } = formData;

    const skillsList = normalizeSkills(skills);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academic CV - ${personalInfo.fullName || 'Researcher'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body};
            color: #2c3e50;
            background: white;
            line-height: 1.6;
        }
        
        .container {
            width: ${A4_WIDTH};
            min-height: ${A4_HEIGHT};
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }
        
        .header {
            text-align: center;
            border-bottom: ${preset.ruleWeight || 1.5}px solid ${colors.primary};
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        
        .name {
            font-size: ${preset.titleSize || 24}px;
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 5px;
            font-family: ${fonts.heading};
        }
        
        .affiliation {
            font-size: 11px;
            color: #555;
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .contact {
            font-size: 9px;
            color: #666;
        }
        
        .section {
            margin-bottom: 18px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: ${colors.primary};
            border-bottom: ${(preset.ruleWeight || 1.5)}px solid ${colors.secondary};
            padding-bottom: 4px;
            margin-bottom: 10px;
        }
        
        .entry {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        
        .entry-title {
            font-weight: bold;
            font-size: 11px;
            color: ${colors.primary};
        }
        
        .entry-subtitle {
            font-size: 10px;
            color: #555;
            margin-bottom: 2px;
        }
        
        .entry-date {
            font-size: 9px;
            color: #888;
            font-style: italic;
        }
        
        .entry-description {
            font-size: 10px;
            line-height: 1.5;
            margin-top: 2px;
        }
        
        .publication-item {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 8px;
            padding-left: 15px;
            text-indent: -15px;
        }
        
        .language-item {
            font-size: 10px;
            line-height: 1.4;
            margin-bottom: 6px;
        }
        
        .research-stats {
            display: flex;
            gap: 20px;
            font-size: 10px;
            margin-bottom: 10px;
        }
        
        .stat {
            display: flex;
            flex-direction: column;
        }
        
        .stat-value {
            font-size: 12px;
            font-weight: bold;
            color: ${colors.primary};
        }
        
        .stat-label {
            color: #666;
            font-size: 9px;
        }
        
        @media print {
            @page { size: A4; margin: 10mm; }
            .container {
                width: ${A4_WIDTH};
                min-height: ${A4_HEIGHT};
                padding: 32px;
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="name">${personalInfo.fullName || 'RESEARCHER NAME'}</div>
            ${personalInfo.professionalTitle ? `<div class="affiliation">${personalInfo.professionalTitle}</div>` : ''}
            <div class="contact">
                ${personalInfo.email ? `${personalInfo.email}` : ''}
                ${personalInfo.phone ? ` | ${personalInfo.phone}` : ''}
                ${personalInfo.orcid ? ` | ORCID: ${personalInfo.orcid}` : ''}
            </div>
        </div>
        
        ${personalInfo.summary ? `
        <div class="section">
            <div class="section-title">RESEARCH STATEMENT</div>
            <div style="font-size: 10px; line-height: 1.5;">${personalInfo.summary}</div>
        </div>
        ` : ''}
        
        ${education.length > 0 ? `
        <div class="section">
            <div class="section-title">EDUCATION</div>
            ${education.map(edu => `
                <div class="entry">
                    <div class="entry-title">${edu.degree || 'Degree'}${edu.field ? ' in ' + edu.field : ''}</div>
                    <div class="entry-subtitle">${edu.institution || 'Institution'}</div>
                    ${formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear ? `<div class="entry-date">${formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear}</div>` : ''}
                    ${edu.grade ? `<div class="entry-description">Grade: ${edu.grade}</div>` : ''}
                    ${edu.thesis ? `<div class="entry-description">Thesis: ${edu.thesis}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${experience.length > 0 ? `
        <div class="section">
            <div class="section-title">ACADEMIC POSITIONS</div>
            ${experience.map(exp => `
                <div class="entry">
                    <div class="entry-title">${exp.position || 'Position'}</div>
                    <div class="entry-subtitle">${exp.company || 'Organization'}</div>
                    <div class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.current) || exp.duration || 'Duration'}</div>
                    ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${publications.length > 0 ? `
        <div class="section">
            <div class="section-title">PUBLICATIONS</div>
            ${publications.map((pub, i) => `
                <div class="publication-item">${formatPublication(pub, i)}</div>
            `).join('')}
        </div>
        ` : ''}

        ${projects.length > 0 ? `
        <div class="section">
            <div class="section-title">RESEARCH PROJECTS</div>
            ${projects.map(proj => `
                <div class="entry">
                    <div class="entry-title">${proj.name || proj.title || 'Project'}</div>
                    ${proj.link ? `<div class="entry-subtitle">${proj.link}</div>` : ''}
                    ${formatDateRange(proj.startDate, proj.endDate, proj.current) ? `<div class="entry-date">${formatDateRange(proj.startDate, proj.endDate, proj.current)}</div>` : ''}
                    ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
                    ${proj.technologies ? `<div class="entry-description">Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${skillsList.length > 0 ? `
        <div class="section">
            <div class="section-title">CORE COMPETENCIES</div>
            <div class="entry-description">${skillsList.slice(0, 20).join(' • ')}</div>
        </div>
        ` : ''}

        ${languages.length > 0 ? `
        <div class="section">
            <div class="section-title">LANGUAGES</div>
            ${languages.map(lang => `
                <div class="language-item">${lang.name || lang.language || lang} — ${lang.level || 'Proficient'}</div>
            `).join('')}
        </div>
        ` : ''}
        
        ${certifications.length > 0 ? `
        <div class="section">
            <div class="section-title">HONORS & AWARDS</div>
            ${certifications.map(cert => `
                <div class="entry">
                    <div class="entry-title">✓ ${formatCertification(cert)}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

  return html;
}

// ============================================================
// 🎨 CREATIVE CV TEMPLATE (Artistic, Portfolio-Focused)
// ============================================================
export function generateCreativeCV(formData, industry = "creative") {
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.creative;
    const seed = formData && formData._seed ? Number(formData._seed) : Date.now();
    const preset = pickPreset(CREATIVE_PRESETS, seed);
    const variant = getUniqueVariation(seed);
    const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = {},
        projects = [],
        languages = [],
        certifications = [],
        publications = []
    } = formData;

    const skillsList = normalizeSkills(skills);
    const fonts = TYPE_TOKENS.creative;
    const accentColor = variant.colorShift ? colors.accent : colors.secondary;
    const motifOpacity = preset.motifOpacity || 0.18;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative CV - ${personalInfo.fullName || 'Creative Professional'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body};
            color: ${colors.text};
            background: linear-gradient(145deg, ${colors.lightBg} 0%, #ffffff 60%, ${colors.lightBg} 100%);
            line-height: 1.6;
        }
        
        .container {
            width: ${A4_WIDTH};
            min-height: ${A4_HEIGHT};
            margin: 0 auto;
            background: white;
            box-shadow: ${variant.shadow};
            border-radius: ${variant.borderRadius};
            overflow: hidden;
        }
        
        .header-banner {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header-banner::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 300px;
            height: 300px;
            background: ${accentColor}20;
            border-radius: ${preset.heroShape === 'diagonal' ? '12%' : preset.heroShape === 'wave' ? '28%' : '50%'};
            opacity: ${motifOpacity};
            filter: blur(4px);
        }
        
        .name {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
            letter-spacing: 1px;
            font-family: ${fonts.heading};
        }
        
        .title {
            font-size: 16px;
            color: ${colors.highlight};
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
            font-family: ${fonts.heading};
        }
        
        .content {
            padding: 40px;
        }
        
        .two-column {
            display: flex;
            gap: 40px;
        }
        
        .column {
            flex: 1;
        }
        
        .column-left {
            flex: 0.6;
        }
        
        .column-right {
            flex: 0.4;
            padding-left: 30px;
            border-left: 3px solid ${accentColor};
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: ${colors.primary};
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 3px solid ${accentColor};
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 40px;
            height: 3px;
            background: ${colors.secondary};
        }
        
        .entry {
            margin-bottom: 16px;
            page-break-inside: avoid;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
        }
        
        .entry-title {
            font-size: 12px;
            font-weight: 700;
            color: ${colors.primary};
        }
        
        .entry-subtitle {
            font-size: 11px;
            color: ${colors.secondary};
            font-weight: 600;
        }
        
        .entry-date {
            font-size: 10px;
            color: #888;
            font-style: italic;
        }
        
        .entry-description {
            font-size: 10px;
            line-height: 1.5;
            color: ${colors.text};
            margin-top: 4px;
        }
        
        .skill-badge {
            display: inline-block;
            background: linear-gradient(135deg, ${accentColor} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 9px;
            margin: 5px 5px 5px 0;
            font-weight: 600;
        }
        
        .project-item {
            background: ${colors.lightBg};
            padding: 12px;
            border-left: 4px solid ${accentColor};
            margin-bottom: 12px;
            border-radius: ${variant.borderRadius};
        }
        
        .project-title {
            font-weight: 700;
            font-size: 11px;
            color: ${colors.primary};
            margin-bottom: 4px;
        }
        
        .project-description {
            font-size: 10px;
            line-height: 1.4;
        }
        
        @media print {
            @page { size: A4; margin: 10mm; }
            body {
                background: white;
            }
            .container {
                box-shadow: none;
                width: ${A4_WIDTH};
                min-height: ${A4_HEIGHT};
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-banner">
            <div class="name">${personalInfo.fullName || 'Creative Name'}</div>
            <div class="title">${personalInfo.professionalTitle || 'Creative Professional'}</div>
        </div>
        
        <div class="content">
            <div class="two-column">
                <div class="column-left">
                    ${personalInfo.summary ? `
                    <div class="section">
                        <div class="section-title">About</div>
                        <p style="font-size: 10px; line-height: 1.6;">${personalInfo.summary}</p>
                    </div>
                    ` : ''}
                    
                    ${experience.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Experience</div>
                        ${experience.map(exp => `
                            <div class="entry">
                                <div class="entry-header">
                                    <div>
                                        <div class="entry-title">${exp.position || 'Position'}</div>
                                        <div class="entry-subtitle">${exp.company || 'Company'}</div>
                                    </div>
                                    <div class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.current) || exp.duration || 'Duration'}</div>
                                </div>
                                ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    ${projects.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Featured Projects</div>
                        ${projects.map(project => `
                            <div class="project-item">
                                <div class="project-title">${project.title || project.name || 'Project'}</div>
                                ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
                
                <div class="column-right">
                    ${skillsList.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Skills</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${skillsList.slice(0, 15).map(skill => `
                                <div class="skill-badge">${skill}</div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${education.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Education</div>
                        ${education.map(edu => `
                            <div class="entry">
                                <div class="entry-title">${edu.degree || 'Degree'}</div>
                                <div class="entry-subtitle">${edu.institution || 'School'}</div>
                                ${(formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear) ? `<div class="entry-date">${formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear}</div>` : ''}
                                ${edu.grade ? `<div class="entry-description">Grade: ${edu.grade}</div>` : ''}
                                ${edu.thesis ? `<div class="entry-description">Thesis: ${edu.thesis}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}

                    ${languages.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Languages</div>
                        ${languages.map(lang => `<div class="entry-description">${lang.name || lang.language || lang} — ${lang.level || 'Proficient'}</div>`).join('')}
                    </div>
                    ` : ''}

                    ${certifications.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Certifications</div>
                        ${certifications.map(cert => `<div class="entry-description">${formatCertification(cert)}</div>`).join('')}
                    </div>
                    ` : ''}

                    ${publications.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Press & Publications</div>
                        ${publications.map((pub, i) => `<div class="entry-description">${formatPublication(pub, i)}</div>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

  return html;
}

// ============================================================
// 👔 EXECUTIVE CV TEMPLATE (Premium, Leadership-Focused)
// ============================================================
export function generateExecutiveCV(formData, industry = "consulting") {
  const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.consulting;
    const seed = formData && formData._seed ? Number(formData._seed) : Date.now();
    const preset = pickPreset(EXECUTIVE_PRESETS, seed);
    const variant = getUniqueVariation(seed);
    const fonts = TYPE_TOKENS.executive;
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = {},
        certifications = [],
        languages = [],
        projects = [],
        publications = []
  } = formData;

    const skillsList = normalizeSkills(skills);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executive CV - ${personalInfo.fullName || 'Executive'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${fonts.body};
            color: #1a1a1a;
            background: #fafafa;
            line-height: 1.7;
        }
        
        .container {
            width: ${A4_WIDTH};
            min-height: ${A4_HEIGHT};
            margin: 0 auto;
            background: white;
            box-shadow: ${variant.shadow};
            display: flex;
            flex-direction: column;
            border-radius: ${variant.borderRadius};
            overflow: hidden;
        }
        
        .executive-header {
            background: linear-gradient(to right, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 45px;
            border-bottom: 6px solid ${colors.accent};
        }
        
        .executive-name {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 3px;
            letter-spacing: 1.5px;
            font-family: ${fonts.heading};
        }
        
        .executive-title {
            font-size: 14px;
            font-weight: 300;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: ${colors.accent};
            margin-bottom: 15px;
            font-family: ${fonts.heading};
        }
        
        .executive-contact {
            font-size: 9px;
            display: flex;
            gap: 25px;
            flex-wrap: wrap;
        }
        
        .main-content {
            flex: 1;
            padding: 45px;
            display: flex;
            gap: 40px;
        }
        
        .left-column {
            flex: 1.2;
        }
        
        .right-column {
            flex: 0.8;
            padding-left: 30px;
            border-left: 2px solid ${colors.accent};
        }
        
        .section {
            margin-bottom: 28px;
            page-break-inside: avoid;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 14px;
            gap: 10px;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.8px;
            color: ${colors.primary};
            font-family: ${fonts.heading};
        }
        
        .section-divider {
            flex: 1;
            height: 1px;
            background: ${colors.accent};
        }
        
        .executive-statement {
            font-size: 10px;
            line-height: 1.7;
            color: #2a2a2a;
            font-style: italic;
            padding: 15px;
            background: ${colors.lightBg};
            border-left: 3px solid ${colors.accent};
        }
        
        .position {
            margin-bottom: 18px;
            page-break-inside: avoid;
        }
        
        .position-title {
            font-size: 11px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 2px;
        }
        
        .position-company {
            font-size: 10px;
            font-weight: 600;
            color: ${colors.secondary};
            margin-bottom: 1px;
        }
        
        .position-years {
            font-size: 9px;
            color: #888;
            font-style: italic;
            margin-bottom: 6px;
        }
        
        .position-description {
            font-size: 9.5px;
            line-height: 1.6;
            color: #333;
        }
        
        .competency-badge {
            display: inline-block;
            background: ${colors.primary};
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: 600;
            margin: 4px 4px 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .achievement-item {
            font-size: 9px;
            margin-bottom: 6px;
            padding-left: 12px;
            text-indent: -8px;
        }
        
        .degree-item {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        
        .degree {
            font-size: 10px;
            font-weight: 700;
            color: ${colors.primary};
        }
        
        .institution {
            font-size: 9px;
            color: #666;
        }
        
        @media print {
            @page { size: A4; margin: 10mm; }
            body {
                background: white;
            }
            .container {
                box-shadow: none;
                width: ${A4_WIDTH};
                min-height: ${A4_HEIGHT};
            }
            .main-content {
                display: flex;
                gap: 40px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="executive-header">
            <div class="executive-name">${personalInfo.fullName || 'Executive Name'}</div>
            <div class="executive-title">${personalInfo.professionalTitle || 'Executive Position'}</div>
            <div class="executive-contact">
                ${personalInfo.email ? `<span>${personalInfo.email}</span>` : ''}
                ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
                ${personalInfo.linkedin ? `<span>${personalInfo.linkedin}</span>` : ''}
            </div>
        </div>
        
        <div class="main-content">
            <div class="left-column">
                ${personalInfo.summary ? `
                <div class="section">
                    <div class="executive-statement">${personalInfo.summary}</div>
                </div>
                ` : ''}
                
                ${experience.length > 0 ? `
                <div class="section">
                    <div class="section-header">
                        <div class="section-title">Executive Experience</div>
                        <div class="section-divider"></div>
                    </div>
                    ${experience.map(exp => `
                        <div class="position">
                            <div class="position-title">${exp.position || 'Position'}</div>
                            <div class="position-company">${exp.company || 'Organization'}</div>
                            <div class="position-years">${formatDateRange(exp.startDate, exp.endDate, exp.current) || exp.duration || 'Duration'}</div>
                            ${exp.description ? `<div class="position-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <div class="right-column">
                ${skillsList.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Core Competencies</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${skillsList.slice(0, 12).map(skill => `
                            <div class="competency-badge">${skill}</div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${education.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Education</div>
                    ${education.map(edu => `
                        <div class="degree-item">
                            <div class="degree">${edu.degree || 'Degree'}</div>
                            <div class="institution">${edu.institution || 'University'}</div>
                            ${(formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear) ? `<div class="institution">${formatDateRange(edu.startDate, edu.endDate, false) || edu.graduationYear}</div>` : ''}
                            ${edu.grade ? `<div class="institution">Grade: ${edu.grade}</div>` : ''}
                            ${edu.thesis ? `<div class="institution">Thesis: ${edu.thesis}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${certifications.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Certifications</div>
                    ${certifications.map(cert => `
                        <div class="achievement-item">✓ ${formatCertification(cert)}</div>
                    `).join('')}
                </div>
                ` : ''}

                ${languages.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Languages</div>
                    ${languages.map(lang => `<div class="achievement-item">${lang.name || lang.language || lang} — ${lang.level || 'Proficient'}</div>`).join('')}
                </div>
                ` : ''}

                ${projects.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Strategic Projects</div>
                    ${projects.map(proj => `
                        <div class="achievement-item">
                            ${proj.name || proj.title || 'Project'}${proj.link ? ` (${proj.link})` : ''}
                            ${formatDateRange(proj.startDate, proj.endDate, proj.current) ? ` — ${formatDateRange(proj.startDate, proj.endDate, proj.current)}` : ''}
                            ${proj.description ? ` — ${proj.description}` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${publications.length > 0 ? `
                <div class="section">
                    <div class="section-title" style="margin-bottom: 10px;">Thought Leadership</div>
                    ${publications.map((pub, i) => `<div class="achievement-item">${formatPublication(pub, i)}</div>`).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</body>
</html>`;

  return html;
}

// ============================================================
// 🎯 MAIN EXPORT - CV GENERATOR BY TYPE
// ============================================================
export function generateCVByType(formData, cvType = "modern", industry = "technology") {
  try {
    switch (cvType.toLowerCase()) {
      case "modern":
        return generateModernCV(formData, industry);
      case "europass":
        return generateEuropassCV(formData, industry);
      case "scopus":
        return generateScopusCV(formData, industry);
      case "creative":
        return generateCreativeCV(formData, industry);
      case "executive":
        return generateExecutiveCV(formData, industry);
      default:
        return generateModernCV(formData, industry);
    }
  } catch (error) {
    console.error(`[CV Template Error] Failed to generate ${cvType} CV:`, error);
    throw error;
  }
}

// ============================================================
// 📋 GET TEMPLATE INFO
// ============================================================
export const CV_TYPES_INFO = {
  modern: {
    name: "Modern",
    description: "Contemporary, ATS-optimized, ready for job applications",
    bestFor: "All professionals"
  },
  europass: {
    name: "Europass",
    description: "Official EU standard, perfect for European opportunities",
    bestFor: "European job market, scholarships"
  },
  scopus: {
    name: "Scopus",
    description: "Academic research focus, publication-centered",
    bestFor: "Researchers, academics, PhD candidates"
  },
  creative: {
    name: "Creative",
    description: "Artistic design, portfolio-focused, visually stunning",
    bestFor: "Designers, marketers, creative professionals"
  },
  executive: {
    name: "Executive",
    description: "Premium design, leadership-focused, C-level/VP level",
    bestFor: "Executives, senior management, C-suite"
  }
};

export default {
  generateCVByType,
  generateModernCV,
  generateEuropassCV,
  generateScopusCV,
  generateCreativeCV,
  generateExecutiveCV,
  INDUSTRY_COLORS,
  CV_TYPES_INFO
};
