'use client';

// Modern template configuration - matches actual templates from modern.js
const MODERN_COUNT = 30;

const modernTemplateNames = [
  'Executive Diamond', 'Teal Wave', 'Purple Fusion', 'Burgundy Classic', 'Royal Impact',
  'Violet Cosmos', 'Corporate Split', 'Banner Executive', 'Tech Terminal', 'Swiss Minimal',
  'Photo Luxury', 'Gradient Hero', 'Swiss Pure', 'Scandi Light', 'Modern Grid',
  'Academic Formal', 'Timeline Progress', 'Centered Elegance', 'Bold Creative', 'Marketing Orange',
  'Design Portfolio', 'Startup Energy', 'Agency Bold', 'Freelance Pro', 'Corporate Navy',
  'Finance Professional', 'Healthcare Modern', 'Legal Traditional', 'Consulting Clean', 'Data Science'
];

// Actual color schemes from modern.js
const templateColors = {
  1: { header: '#0f172a', sidebar: '#1e293b', accent: '#3b82f6', text: '#f8fafc' }, // Executive
  2: { header: '#134e4a', sidebar: '#ccfbf1', accent: '#14b8a6', text: '#134e4a' }, // Slate-Teal
  3: { header: '#0c4a6e', sidebar: '#bfdbfe', accent: '#0ea5e9', text: '#0c4a6e' }, // Modern-Gradient
  4: { header: '#7f1d1d', sidebar: '#fee2e2', accent: '#dc2626', text: '#7f1d1d' }, // Burgundy
  5: { header: '#1e3a8a', sidebar: '#bfdbfe', accent: '#2563eb', text: '#1e3a8a' }, // Royal-Blue
  6: { header: '#5b21b6', sidebar: '#ddd6fe', accent: '#8b5cf6', text: '#5b21b6' }, // Charcoal-Violet
  7: { header: '#0f172a', sidebar: '#334155', accent: '#60a5fa', text: '#f1f5f9' }, // Modern-Split
  8: { header: '#1e293b', sidebar: '#f1f5f9', accent: '#3b82f6', text: '#0f172a' }, // Executive-Banner
  9: { header: '#083344', sidebar: '#155e75', accent: '#06b6d4', text: '#67e8f9' }, // Tech-Modern
  10: { header: '#fafafa', sidebar: '#ffffff', accent: '#1e293b', text: '#0f172a' }, // Minimalist
  11: { header: '#1e293b', sidebar: '#e2e8f0', accent: '#3b82f6', text: '#0f172a' }, // Photo-Accent
  12: { header: '#1e40af', sidebar: '#bfdbfe', accent: '#3b82f6', text: '#1e40af' }, // Gradient-Modern
  13: { header: '#fafafa', sidebar: '#ffffff', accent: '#1e293b', text: '#0f172a' }, // Swiss-Clean
  14: { header: '#f8fafc', sidebar: '#e2e8f0', accent: '#3b82f6', text: '#0f172a' }, // Scandi-Minimal
  15: { header: '#1e40af', sidebar: '#bfdbfe', accent: '#3b82f6', text: '#1e40af' }, // Modern-Clean
  16: { header: '#fafafa', sidebar: '#f8fafc', accent: '#1e293b', text: '#0f172a' }, // Traditional
  17: { header: '#312e81', sidebar: '#c7d2fe', accent: '#6366f1', text: '#312e81' }, // Timeline-Blue
  18: { header: '#f8fafc', sidebar: '#ffffff', accent: '#3b82f6', text: '#0f172a' }, // Ultra-Minimal
  19: { header: '#581c87', sidebar: '#e9d5ff', accent: '#a855f7', text: '#581c87' }, // Bold-Creative
  20: { header: '#065f46', sidebar: '#a7f3d0', accent: '#10b981', text: '#065f46' }, // Marketing-Orange
  21: { header: '#18181b', sidebar: '#f5f5f5', accent: '#71717a', text: '#18181b' }, // Design-Aesthetic
  22: { header: '#9f1239', sidebar: '#fecdd3', accent: '#f43f5e', text: '#9f1239' }, // Startup-Vibrant
  23: { header: '#9a3412', sidebar: '#fed7aa', accent: '#f97316', text: '#9a3412' }, // Agency-Bold
  24: { header: '#78350f', sidebar: '#fde68a', accent: '#f59e0b', text: '#78350f' }, // Freelance-Pro
  25: { header: '#1e3a8a', sidebar: '#93c5fd', accent: '#2563eb', text: '#1e3a8a' }, // Corp-Navy
  26: { header: '#1e40af', sidebar: '#93c5fd', accent: '#3b82f6', text: '#1e40af' }, // Finance-Blue
  27: { header: '#155e75', sidebar: '#a5f3fc', accent: '#06b6d4', text: '#155e75' }, // Healthcare-Blue
  28: { header: '#1c1917', sidebar: '#f5f5f4', accent: '#78716c', text: '#1c1917' }, // Legal-Formal
  29: { header: '#0f172a', sidebar: '#e2e8f0', accent: '#475569', text: '#0f172a' }, // Consulting-Clean
  30: { header: '#0c4a6e', sidebar: '#164e63', accent: '#0ea5e9', text: '#67e8f9' }  // Tech-Data
};

const getModernDesign = (index) => {
  const colors = templateColors[index + 1] || templateColors[1];
  return {
    name: modernTemplateNames[index] || `Modern ${index + 1}`,
    id: index + 1,
    ...colors
  };
};

// Demo data pool for Modern previews with realistic professional profiles
const demoPool = [
  {
    name: 'Sarah Chen',
    title: 'Senior Full-Stack Developer',
    company: 'TechCorp Solutions',
    degree: 'B.S. Computer Science',
    university: 'Stanford University',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    includePhoto: true,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Python'],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Mandarin', proficiency: 'Fluent' }],
    experience: [
      { position: 'Senior Developer', company: 'TechCorp Solutions', location: 'San Francisco, CA', startDate: '2020-01', endDate: 'Present', description: '• Led team of 5 developers building enterprise SaaS platform\n• Improved system performance by 40% through optimization\n• Implemented CI/CD pipeline reducing deployment time by 60%' },
      { position: 'Software Engineer', company: 'StartupHub Inc', location: 'Palo Alto, CA', startDate: '2017-06', endDate: '2019-12', description: '• Developed RESTful APIs serving 100K+ daily users\n• Built real-time chat feature using WebSockets\n• Mentored 3 junior developers' }
    ]
  },
  {
    name: 'Michael Rodriguez',
    title: 'Product Manager',
    company: 'InnovateTech',
    degree: 'MBA',
    university: 'Harvard Business School',
    email: 'm.rodriguez@email.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    summary: 'Strategic product leader with proven track record of launching successful products. Skilled in agile methodologies, user research, and cross-functional team leadership.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    includePhoto: true,
    skills: ['Product Strategy', 'Agile/Scrum', 'SQL', 'A/B Testing', 'Roadmapping', 'Stakeholder Management'],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Spanish', proficiency: 'Native' }],
    experience: [
      { position: 'Senior Product Manager', company: 'InnovateTech', location: 'New York, NY', startDate: '2019-03', endDate: 'Present', description: '• Launched 3 major features increasing user engagement by 35%\n• Managed product roadmap for $10M revenue product line\n• Led cross-functional team of 12 people' }
    ]
  },
  {
    name: 'Priya Sharma',
    title: 'UX/UI Designer',
    company: 'DesignStudio Pro',
    degree: 'B.F.A. Graphic Design',
    university: 'Rhode Island School of Design',
    email: 'priya.sharma@email.com',
    phone: '+1 (555) 246-8135',
    location: 'Austin, TX',
    summary: 'Creative designer passionate about crafting intuitive user experiences. Expertise in user research, wireframing, prototyping, and visual design.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    includePhoto: true,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS'],
    languages: [{ language: 'English', proficiency: 'Fluent' }, { language: 'Hindi', proficiency: 'Native' }],
    experience: [
      { position: 'Senior UX Designer', company: 'DesignStudio Pro', location: 'Austin, TX', startDate: '2018-08', endDate: 'Present', description: '• Redesigned mobile app increasing user satisfaction by 45%\n• Conducted user research with 200+ participants\n• Created comprehensive design system used across 5 products' }
    ]
  },
  {
    name: 'James Wilson',
    title: 'Data Scientist',
    company: 'Analytics Corp',
    degree: 'Ph.D. Machine Learning',
    university: 'MIT',
    email: 'j.wilson@email.com',
    phone: '+1 (555) 369-2580',
    location: 'Boston, MA',
    summary: 'Data scientist specializing in machine learning and predictive analytics. Published researcher with expertise in NLP and computer vision.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    includePhoto: false,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Machine Learning', 'Deep Learning', 'Statistics'],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'French', proficiency: 'Intermediate' }],
    experience: [
      { position: 'Lead Data Scientist', company: 'Analytics Corp', location: 'Boston, MA', startDate: '2020-02', endDate: 'Present', description: '• Built ML models improving prediction accuracy by 28%\n• Led data science team of 4 researchers\n• Published 5 papers in top-tier conferences' }
    ]
  },
  {
    name: 'Emily Thompson',
    title: 'Marketing Director',
    company: 'BrandBoost Agency',
    degree: 'M.S. Marketing',
    university: 'Northwestern University',
    email: 'e.thompson@email.com',
    phone: '+1 (555) 741-9630',
    location: 'Chicago, IL',
    summary: 'Strategic marketing leader with 10+ years driving brand growth. Expert in digital marketing, content strategy, and campaign management.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    includePhoto: true,
    skills: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Analytics', 'Social Media', 'Brand Management'],
    languages: [{ language: 'English', proficiency: 'Native' }],
    experience: [
      { position: 'Marketing Director', company: 'BrandBoost Agency', location: 'Chicago, IL', startDate: '2019-01', endDate: 'Present', description: '• Increased client revenue by average of 45% year-over-year\n• Managed $2M annual marketing budget\n• Led team of 8 marketing specialists' }
    ]
  },
  {
    name: 'David Kim',
    title: 'DevOps Engineer',
    company: 'CloudTech Systems',
    degree: 'B.S. Information Systems',
    university: 'UC Berkeley',
    email: 'd.kim@email.com',
    phone: '+1 (555) 852-7410',
    location: 'Seattle, WA',
    summary: 'DevOps engineer specialized in cloud infrastructure and automation. Expert in Kubernetes, Docker, and CI/CD pipelines.',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    includePhoto: false,
    skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python', 'Bash'],
    languages: [{ language: 'English', proficiency: 'Native' }, { language: 'Korean', proficiency: 'Fluent' }],
    experience: [
      { position: 'Senior DevOps Engineer', company: 'CloudTech Systems', location: 'Seattle, WA', startDate: '2018-05', endDate: 'Present', description: '• Reduced infrastructure costs by 35% through optimization\n• Automated deployment pipeline cutting release time by 70%\n• Managed Kubernetes clusters serving 5M+ requests/day' }
    ]
  }
];

const ModernPreviews = ({ selectedTemplate, onSelectTemplate, industry = 'technology' }) => {
  // Generate palette based on industry
  const getPalette = (ind) => {
    const palettes = {
      technology: { primary: '#1d4ed8', secondary: '#0f172a' },
      finance: { primary: '#0f3e2c', secondary: '#7c5a2f' },
      healthcare: { primary: '#0f4c81', secondary: '#0b7285' },
      education: { primary: '#1d4ed8', secondary: '#4338ca' },
      marketing: { primary: '#b4233b', secondary: '#9a3412' },
      engineering: { primary: '#0f172a', secondary: '#1e3a8a' },
      law: { primary: '#1c2e4a', secondary: '#735026' },
      creative: { primary: '#5b21b6', secondary: '#1e3a8a' },
      research: { primary: '#0f4c81', secondary: '#1e3a8a' },
      consulting: { primary: '#1d3557', secondary: '#8c5a2e' }
    };
    return palettes[ind] || palettes.technology;
  };

  const palette = getPalette(industry);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: MODERN_COUNT }, (_, i) => {
        const templateNum = i + 1;
        const demo = demoPool[i % demoPool.length];
        const design = getModernDesign(i, palette);
        const isSelected = selectedTemplate === templateNum;

        return (
          <div
            key={templateNum}
            onClick={() => onSelectTemplate(templateNum)}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
              isSelected 
                ? 'ring-4 ring-blue-500 shadow-2xl' 
                : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-400 shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Template Preview */}
            <div className="bg-white aspect-[210/297] relative overflow-hidden">
              {/* Miniature CV Preview */}
              <div 
                style={{ 
                  fontSize: '2.8px',
                  lineHeight: '1.3',
                  fontFamily: design.font,
                  transform: 'scale(0.98)',
                  transformOrigin: 'top left',
                  height: '100%'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: design.header,
                    color: design.text,
                    padding: '8px 6px',
                    textAlign: 'center',
                    borderBottom: `1px solid ${design.accent}`
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '4px', marginBottom: '1px' }}>
                    {demo.name}
                  </div>
                  <div style={{ fontSize: '2.5px', opacity: 0.9 }}>
                    {demo.title}
                  </div>
                </div>

                {/* Body with sidebar */}
                <div style={{ display: 'flex', height: 'calc(100% - 20px)' }}>
                  {/* Sidebar */}
                  <div
                    style={{
                      width: '35%',
                      background: design.sidebar,
                      padding: '4px 3px',
                      fontSize: '2.2px'
                    }}
                  >
                    {/* Skills */}
                    <div style={{ marginBottom: '3px' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '2.8px', 
                        color: design.accent,
                        marginBottom: '1.5px',
                        borderBottom: `0.5px solid ${design.accent}`,
                        paddingBottom: '0.5px'
                      }}>
                        SKILLS
                      </div>
                      {demo.skills.slice(0, 4).map((skill, idx) => (
                        <div key={idx} style={{ 
                          marginBottom: '0.8px',
                          paddingLeft: '2px',
                          fontSize: '2px'
                        }}>
                          • {skill}
                        </div>
                      ))}
                    </div>

                    {/* Contact */}
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '2.8px', 
                        color: design.accent,
                        marginBottom: '1.5px',
                        borderBottom: `0.5px solid ${design.accent}`,
                        paddingBottom: '0.5px'
                      }}>
                        CONTACT
                      </div>
                      <div style={{ fontSize: '2px', lineHeight: '1.4' }}>
                        <div>{demo.location}</div>
                        <div>{demo.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div style={{ flex: 1, padding: '4px 3px', fontSize: '2.2px' }}>
                    {/* Summary */}
                    <div style={{ marginBottom: '3px' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '2.8px', 
                        color: design.accent,
                        marginBottom: '1.5px',
                        borderBottom: `0.5px solid ${design.accent}`,
                        paddingBottom: '0.5px'
                      }}>
                        PROFILE
                      </div>
                      <div style={{ fontSize: '2px', lineHeight: '1.3', opacity: 0.85 }}>
                        {demo.summary.substring(0, 80)}...
                      </div>
                    </div>

                    {/* Experience */}
                    <div style={{ marginBottom: '3px' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '2.8px', 
                        color: design.accent,
                        marginBottom: '1.5px',
                        borderBottom: `0.5px solid ${design.accent}`,
                        paddingBottom: '0.5px'
                      }}>
                        EXPERIENCE
                      </div>
                      <div style={{ fontSize: '2.2px', marginBottom: '2px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '2.5px' }}>
                          {demo.experience[0].position}
                        </div>
                        <div style={{ fontSize: '2px', opacity: 0.7 }}>
                          {demo.company} • {demo.experience[0].startDate}
                        </div>
                        <div style={{ fontSize: '1.8px', marginTop: '1px', opacity: 0.6 }}>
                          Led development team • Increased efficiency
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '2.8px', 
                        color: design.accent,
                        marginBottom: '1.5px',
                        borderBottom: `0.5px solid ${design.accent}`,
                        paddingBottom: '0.5px'
                      }}>
                        EDUCATION
                      </div>
                      <div style={{ fontSize: '2.2px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '2.5px' }}>
                          {demo.degree}
                        </div>
                        <div style={{ fontSize: '2px', opacity: 0.7 }}>
                          {demo.university}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Header Section */}
                <div style={{ 
                  backgroundColor: design.header,
                  color: design.text,
                  padding: '4px 5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  minHeight: '18px'
                }}>
                  {demo.includePhoto && demo.photo && (
                    <div style={{ 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: `1px solid ${design.text}40`
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${demo.photo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}></div>
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '6.5px', fontWeight: 'bold', marginBottom: '1.5px', letterSpacing: '0.2px' }}>
                      {demo.name}
                    </div>
                    <div style={{ fontSize: '4px', opacity: 0.9, marginBottom: '1.5px' }}>
                      {demo.title}
                    </div>
                    <div style={{ fontSize: '2.5px', marginTop: '1px', opacity: 0.75, display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: design.headerStyle === 'centered' ? 'center' : 'flex-start' }}>
                      <span>✉ {demo.email}</span>
                      <span>📱 {demo.phone}</span>
                      <span>📍 {demo.location}</span>
                    </div>
                  </div>
                </div>

                {/* Body with Sidebar Layout */}
                <div style={{ display: 'flex', minHeight: '85px' }}>
                  {/* Sidebar (if present) */}
                  {design.sidebarWidth !== '0%' && (
                    <div
                      style={{
                        width: design.sidebarWidth,
                        background: design.sidebarBg,
                        color: design.sidebarText,
                        padding: '6px 4px',
                        fontSize: '2.5px'
                      }}
                    >
                      {/* Skills Section */}
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ 
                          fontSize: '3px', 
                          fontWeight: 'bold', 
                          marginBottom: '2px',
                          color: design.sidebarText,
                          borderBottom: `0.3px solid ${design.sidebarText}`,
                          paddingBottom: '1px',
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase'
                        }}>
                          SKILLS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          {demo.skills.slice(0, 6).map((skill, idx) => (
                            <div key={idx} style={{ 
                              fontSize: '2.2px', 
                              marginBottom: '1px',
                              paddingLeft: '3px',
                              position: 'relative'
                            }}>
                              <span style={{ position: 'absolute', left: '0', color: design.accentColor, fontWeight: 'bold' }}>•</span>
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div style={{ marginBottom: '4px' }}>
                        <div style={{ 
                          fontSize: '3px', 
                          fontWeight: 'bold', 
                          marginBottom: '2px',
                          color: design.sidebarText,
                          borderBottom: `0.3px solid ${design.sidebarText}`,
                          paddingBottom: '1px',
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase'
                        }}>
                          LANGUAGES
                        </div>
                        {demo.languages.map((lang, idx) => (
                          <div key={idx} style={{ fontSize: '2.3px', marginBottom: '1.5px' }}>
                            <div style={{ fontWeight: 'bold' }}>{lang.language}</div>
                            <div style={{ fontSize: '2px', opacity: 0.8 }}>{lang.proficiency}</div>
                            <div style={{ 
                              width: '100%', 
                              height: '0.8px', 
                              background: 'rgba(0,0,0,0.1)', 
                              borderRadius: '0.5px',
                              overflow: 'hidden',
                              marginTop: '0.5px'
                            }}>
                              <div style={{ 
                                width: lang.proficiency === 'Native' ? '100%' : lang.proficiency === 'Fluent' ? '95%' : lang.proficiency === 'Intermediate' ? '70%' : '50%',
                                height: '100%',
                                background: design.accentColor
                              }}></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Certifications */}
                      <div>
                        <div style={{ 
                          fontSize: '3px', 
                          fontWeight: 'bold', 
                          marginBottom: '2px',
                          color: design.sidebarText,
                          borderBottom: `0.3px solid ${design.sidebarText}`,
                          paddingBottom: '1px',
                          letterSpacing: '0.3px',
                          textTransform: 'uppercase'
                        }}>
                          CERTIFICATIONS
                        </div>
                        <div style={{ fontSize: '2.3px', marginBottom: '1.5px', fontWeight: 'bold' }}>AWS Certified Solutions Architect</div>
                        <div style={{ fontSize: '2px', opacity: 0.8, marginBottom: '2px' }}>Amazon Web Services</div>
                        <div style={{ fontSize: '2.3px', marginBottom: '1px', fontWeight: 'bold' }}>Professional Scrum Master</div>
                        <div style={{ fontSize: '2px', opacity: 0.8 }}>Scrum.org</div>
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div style={{ flex: 1, padding: '6px 7px' }}>
                    {/* Summary */}
                    <div style={{ marginBottom: '4px' }}>
                      <div style={{ 
                        fontSize: '3.5px', 
                        fontWeight: 'bold', 
                        color: design.accentColor,
                        marginBottom: '1.5px',
                        borderBottom: `0.3px solid ${design.accentColor}`,
                        paddingBottom: '1px',
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase'
                      }}>
                        PROFESSIONAL SUMMARY
                      </div>
                      <div style={{ fontSize: '2.3px', lineHeight: '1.5', color: '#333' }}>
                        {demo.summary.slice(0, 120)}...
                      </div>
                    </div>

                    {/* Experience */}
                    <div style={{ marginBottom: '4px' }}>
                      <div style={{ 
                        fontSize: '3.5px', 
                        fontWeight: 'bold', 
                        color: design.accentColor,
                        marginBottom: '1.5px',
                        borderBottom: `0.3px solid ${design.accentColor}`,
                        paddingBottom: '1px',
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase'
                      }}>
                        WORK EXPERIENCE
                      </div>
                      {demo.experience.slice(0, 2).map((exp, idx) => (
                        <div key={idx} style={{ marginBottom: '3px', paddingBottom: '2px', borderBottom: idx === 0 ? '0.3px solid #e0e0e0' : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5px' }}>
                            <div style={{ fontSize: '3px', fontWeight: 'bold', color: '#000' }}>{exp.position}</div>
                            <div style={{ fontSize: '2px', color: '#666', whiteSpace: 'nowrap' }}>{exp.startDate} - {exp.endDate}</div>
                          </div>
                          <div style={{ fontSize: '2.5px', fontStyle: 'italic', color: design.accentColor, marginBottom: '1px' }}>
                            {exp.company} • {exp.location}
                          </div>
                          <div style={{ fontSize: '2.2px', marginTop: '1px', lineHeight: '1.4', color: '#444' }}>
                            {exp.description.split('\n').slice(0, 3).map((line, i) => (
                              <div key={i} style={{ marginBottom: '0.5px' }}>{line}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div>
                      <div style={{ 
                        fontSize: '3.5px', 
                        fontWeight: 'bold', 
                        color: design.accentColor,
                        marginBottom: '1.5px',
                        borderBottom: `0.3px solid ${design.accentColor}`,
                        paddingBottom: '1px',
                        letterSpacing: '0.3px',
                        textTransform: 'uppercase'
                      }}>
                        EDUCATION
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <div style={{ fontSize: '3px', fontWeight: 'bold', color: '#000' }}>{demo.degree}</div>
                          <div style={{ fontSize: '2px', color: '#666' }}>2015 - 2019</div>
                        </div>
                        <div style={{ fontSize: '2.5px', fontStyle: 'italic', color: design.accentColor }}>
                          {demo.university}
                        </div>
                        <div style={{ fontSize: '2.2px', marginTop: '0.5px', color: '#666' }}>
                          GPA: 3.8/4.0 • Dean's List
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-2">
              <div className="text-white text-xs font-semibold">
                #{templateNum}: {modernTemplateNames[i]}
              </div>
            </div>

            {/* Selected Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ModernPreviews;
