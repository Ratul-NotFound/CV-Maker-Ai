import Groq from "groq-sdk";
import { INDUSTRY_COLORS } from "./cvTemplates.js";

// Initialize Groq client only if API key is available
let groq = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
} catch (error) {
  console.warn('Groq client initialization failed:', error.message);
}

// ============================================================
// 🎨 GROQ MODEL CONFIGURATION
// ============================================================
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.2-90b-vision-preview",
];

// ============================================================
// 🎯 CV TYPE SPECIFICATIONS - WORLD-CLASS STANDARDS
// ============================================================
const CV_TYPE_SPECS = {
  modern: {
    description: "Modern, contemporary, ATS-optimized professional CV",
    uniqueness: "VERY HIGH - Each generation must produce completely different layouts, color schemes, typography combinations, and visual structures",
    requirements: [
      "Create COMPLETELY UNIQUE designs every time - vary sidebar positions (left/right/top), header layouts (centered/left-aligned/split), section arrangements",
      "Use different modern font combinations: Inter+Sora, Poppins+Montserrat, Roboto+Open Sans, Lato+Raleway",
      "Vary visual elements: skill bars, progress circles, timeline bullets, icon badges, colored blocks",
      "Different color applications: gradients at varying angles (120deg-150deg), shadow depths (10px-40px), border-radius variations (6px-16px)",
      "ATS-friendly HTML structure with semantic tags and clean hierarchy",
      "Modern UI patterns: cards, floating sections, layered elements, glassmorphism effects",
      "Typography scale: 26-36px headers, 12-16px section titles, 10-12px body",
      "Professional spacing with 15-25px margins, 12-20px padding",
      "Inspiration: Canva Modern Templates, Novoresume, Resume.io, Zety, VisualCV"
    ]
  },
  
  europass: {
    description: "Official European Union Europass CV format - International standard",
    uniqueness: "LOW - Maintain strict Europass standards while ensuring professional quality",
    requirements: [
      "Follow OFFICIAL Europass CV structure exactly as per europa.eu standards",
      "Mandatory sections in order: Personal Information, Work Experience, Education and Training, Personal Skills, Additional Information",
      "Use Europass official blue color: #003399 for all headers and accents",
      "Standard fonts only: Arial 11pt for body, Arial Bold 14pt for headers",
      "Detailed Personal Information: Full name, Address, Telephone, Mobile, Email, Nationality, Date of birth, Gender (optional)",
      "Work Experience: Job title, Dates, Employer name and address, Type of business, Main activities and responsibilities",
      "Education: Title of qualification, Dates, Institution, Level in national classification, ISCED level",
      "Language Skills: Mother tongue(s), Other language(s) with CEFR levels (A1-C2) for Listening, Reading, Spoken interaction, Spoken production, Writing",
      "Digital Skills: Information processing, Communication, Content creation, Safety, Problem-solving",
      "Organizational/Managerial Skills, Job-related Skills, Other Skills sections",
      "Driving License category if applicable",
      "Clean table-based layout, formal presentation, ready for EU official submissions"
    ]
  },
  
  scopus: {
    description: "Academic/Research CV for Scopus indexing and university applications",
    uniqueness: "LOW - Maintain scholarly standards with emphasis on research excellence",
    requirements: [
      "Academic-focused design suitable for university admissions, research positions, and Scopus submissions",
      "Scholarly fonts: Georgia 11pt, Times New Roman 11pt, or Merriweather for body; larger sizes for headers",
      "Prominent Research sections: Publications, Research Experience, Academic Projects, Conference Presentations",
      "Publications formatted in academic style (APA/IEEE/MLA) with proper numbering [1], [2], etc.",
      "Include h-index, citation count placeholders if data provided",
      "ORCID ID integration (if provided) - display prominently",
      "Academic credentials emphasized: PhD, Master's, Bachelor's with thesis titles, advisors, honors",
      "Research interests section, Teaching experience section",
      "Professional color scheme: Navy blue #1e3a8a, Academic gray #4b5563, Scholarly teal #0d9488",
      "Clean, paper-like aesthetic with serif typography",
      "References section: 'Available upon request' or list if provided",
      "Suitable for submission to: Universities, Research institutions, Academic journals, Grant applications",
      "Inspiration: Harvard Academic CV, Oxford CV templates, Nature Careers formats, MIT OpenCourseWare"
    ]
  },
  
  creative: {
    description: "Bold, artistic CV for creative professionals and designers",
    uniqueness: "EXTREMELY HIGH - Every generation must be radically different with unique artistic vision",
    requirements: [
      "Generate WILDLY DIFFERENT creative designs - no two should ever look similar",
      "Experimental layouts: diagonal sections, asymmetric grids, overlapping elements, Z-pattern, F-pattern variations",
      "Bold typography: Mix contrasting fonts like Bebas Neue+Roboto, Oswald+Open Sans, Playfair Display+Lato, Space Grotesk+Inter",
      "Vibrant color schemes: Bold gradients, complementary colors, artistic palettes (purples+oranges, teals+corals, bold monochromes)",
      "Unique visual elements: Abstract geometric shapes, SVG patterns, diagonal dividers, circular framing, polygon clip-paths",
      "Creative icons and graphics: Custom styled emojis, geometric icon holders, colorful badges",
      "Portfolio emphasis: Large project showcases, visual skill representations (infographic bars, circular progress)",
      "Artistic touches: Brush strokes (CSS), watercolor effects (gradients), ink splashes (shapes), paper textures",
      "Section variations: Cards, bubbles, ribbons, banners, floating boxes",
      "Typography as art: Large display headers, creative font weights, letter-spacing variations, rotated text accents",
      "Color blocking: Bold colored sections, contrasting backgrounds, gradient overlays",
      "Suitable for: Designers, Artists, Creative Directors, Marketers, Content Creators, UX/UI professionals",
      "Inspiration: Behance portfolios, Dribbble top shots, Adobe Portfolio, Awwwards winners, Creative Market premium templates"
    ]
  },
  
  executive: {
    description: "Premium, sophisticated CV for C-level executives and senior leadership",
    uniqueness: "HIGH - Each generation should present different premium styles and luxury aesthetics",
    requirements: [
      "Generate DIFFERENT sophisticated designs - vary layouts, typography pairings, luxury elements",
      "Premium typography combinations: Cormorant Garamond+Inter, Playfair Display+Lato, Libre Baskerville+Roboto, Crimson Text+Open Sans",
      "Elegant serif headers (18-24pt) with modern sans-serif body (10-11pt)",
      "Refined color palettes: Navy #1e3a8a, Charcoal #1f2937, Burgundy #7f1d1d, Forest #064e3b - with gold #d97706 or silver #64748b accents",
      "Luxury design elements: Thin gold/silver separator lines (1-2px), refined borders, subtle embossing effects, elegant shadows",
      "Generous whitespace (20-30px margins) conveying authority and clarity",
      "Executive Summary section prominently placed at top after header",
      "Leadership achievements highlighted: Board positions, Strategic initiatives, P&L responsibility, Team size, Market expansion",
      "Professional experience with emphasis on impact: Revenue growth %, Cost savings, Team building, Transformational projects",
      "Key metrics visualized: Years of experience, Revenue managed, Team size, Geographic scope",
      "Education: MBA, Executive programs, Board certifications prominently displayed",
      "Professional affiliations, Board memberships, Advisory roles section",
      "Headshot area (placeholder or space indicated)",
      "Subtle premium touches: Watermark-style background elements, refined corner details",
      "Layout variations: Single column minimalist, Two column balanced, Header+body split",
      "Suitable for: CEOs, CFOs, COOs, VPs, Directors, Board positions, Executive search",
      "Inspiration: TopCV Executive, Harvard Business School resume, McKinsey format, Korn Ferry standards, Spencer Stuart guidelines"
    ]
  }
};

// ============================================================
// 🌍 INDUSTRY-SPECIFIC FOCUS AND ENHANCEMENTS
// ============================================================
const INDUSTRY_FOCUS = {
  technology: "Emphasize: Technical skills (programming languages, frameworks, cloud platforms), GitHub projects, software architecture, Agile/Scrum, DevOps, API development. Use: Modern tech colors, code-like monospace accents, tech iconography.",
  
  finance: "Highlight: Financial analysis, Investment management, Risk assessment, Portfolio optimization, Certifications (CFA, CPA, CFP), Quantitative skills, P&L management, Regulatory compliance. Use: Professional blues/grays, trustworthy design, formal structure.",
  
  healthcare: "Showcase: Medical credentials, Board certifications, Clinical experience, Patient care statistics, Medical procedures, Research publications, Healthcare IT systems, HIPAA compliance. Use: Clean medical greens/blues, professional clarity, emphasis on credentials.",
  
  education: "Feature: Teaching philosophy, Curriculum development, Student outcomes and test scores, Educational technology, Classroom management, Published lesson plans, Degrees and teaching certifications. Use: Warm academic purples, approachable design, clear structure.",
  
  marketing: "Highlight: Campaign performance (ROI, CTR, conversion rates), Digital marketing skills (SEO, SEM, social media), Content creation, Brand development, Marketing automation, Analytics tools. Use: Vibrant engaging colors (pinks, oranges), creative layouts, metric emphasis.",
  
  engineering: "Emphasize: Technical expertise, Project management, CAD software, Certifications (PE, PMP, Six Sigma), System design, Process optimization, Technical drawings, Safety protocols. Use: Structured professional design, industrial colors (oranges, grays), technical precision.",
  
  law: "Showcase: Legal expertise, Case experience, Bar admissions, Court appearances, Legal research, Publications, Practice areas, Client representation, Regulatory knowledge. Use: Formal authoritative design, dark blues/purples, classical serif fonts, hierarchical structure.",
  
  creative: "Portfolio focus: Design projects, Creative campaigns, Awards and recognition, Design tools (Adobe Suite, Figma, Sketch), Brand identity work, Client showcases. Use: Bold artistic design, vibrant colors, portfolio-style layout, creative typography.",
  
  research: "Highlight: Publications (with citations, h-index), Research grants and funding, Lab techniques, Conference presentations, Academic collaborations, Research methodology, Data analysis. Use: Scholarly design, academic blues/teals, clean serif fonts, publication focus.",
  
  consulting: "Emphasize: Client projects and industries, Problem-solving frameworks, Business analysis, Strategy development, Deliverables and impact, Case leadership, Analytical tools (Excel, PowerBI, Tableau). Use: Professional modern design, consulting firm colors (cyans, blues), clear structure."
};

// ============================================================
// 🚀 MAIN CV GENERATION FUNCTION - WORLD-CLASS QUALITY
// ============================================================
export async function generateCVHTML(formData, cvType = "modern", industry = "technology") {
  try {
    // Check if Groq is available
    if (!groq) {
      throw new Error('Groq API key is not configured. Please set GROQ_API_KEY environment variable.');
    }
    
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 10000000);
    const uniqueId = `${cvType}_${industry}_${randomSeed}`;
    
    if (process.env.DEBUG) {
      console.log(`[CV Generation] Type: ${cvType} | Industry: ${industry} | Seed: ${randomSeed}`);
    }
    
    const colors = INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.technology;
    const specs = CV_TYPE_SPECS[cvType] || CV_TYPE_SPECS.modern;
    const industryFocus = INDUSTRY_FOCUS[industry] || INDUSTRY_FOCUS.technology;
    
    // Build comprehensive candidate profile
    const candidateProfile = buildCandidateProfile(formData);
    
    const systemPrompt = `You are an expert CV designer. Create professional HTML CVs with embedded CSS.

RULES:
- Return ONLY HTML (no markdown, no code blocks, no text)
- Start with <!DOCTYPE html>, end with </html>
- Embed CSS in <style> tags
- A4 size: 210mm × 297mm
- Include @media print styles
- Use ALL candidate data`;

    const userPrompt = `Create ${cvType.toUpperCase()} CV for ${industry} industry.

**DESIGN:** ${specs.description}
**UNIQUENESS:** ${specs.uniqueness}
**SEED:** ${randomSeed}

**UNIQUENESS REQUIREMENT:** ${specs.uniqueness}

**MANDATORY DESIGN REQUIREMENTS:**
${specs.requirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 INDUSTRY COLOR PALETTE (MUST USE THESE EXACT COLORS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Color: ${colors.primary}
Secondary Color: ${colors.secondary}
Accent Color: ${colors.accent}
Text Color: ${colors.text}
Light Background: ${colors.lightBg}
Highlight Color: ${colors.highlight}

**INDUSTRY-SPECIFIC FOCUS:**
${industryFocus}

**COLORS:** Primary: ${colors.primary}, Secondary: ${colors.secondary}, Accent: ${colors.accent}

**REQUIREMENTS:** ${specs.requirements.slice(0, 3).join('. ')}

**CANDIDATE DATA:**
${candidateProfile}

**OUTPUT:** Return ONLY HTML from <!DOCTYPE html> to </html>. No markdown, no text.`;

    // Try each Groq model with retry logic
    let lastError = null;
    
    for (let attempt = 0; attempt < GROQ_MODELS.length; attempt++) {
      const model = GROQ_MODELS[attempt];
      
      try {
        if (process.env.DEBUG) {
          console.log(`[CV Generation] Attempt ${attempt + 1}/${GROQ_MODELS.length}: ${model}`);
        }
        
        const completion = await Promise.race([
          groq.chat.completions.create({
            model: model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: getTemperatureForCVType(cvType, randomSeed),
            max_tokens: 5000,
            top_p: 0.9,
            frequency_penalty: 0.3,
            presence_penalty: 0.3,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout after 25 seconds')), 25000)
          )
        ]);

        let cvHtml = completion.choices[0]?.message?.content || '';
        
        // Aggressive cleaning to remove markdown artifacts
        cvHtml = cvHtml
          .replace(/^```html\s*/gi, '')
          .replace(/^```\s*/gm, '')
          .replace(/```$/gm, '')
          .replace(/^html\s*/i, '')
          .trim();
        
        // Extract pure HTML if wrapped in text
        const doctypeIndex = cvHtml.indexOf('<!DOCTYPE');
        if (doctypeIndex > 0) {
          cvHtml = cvHtml.substring(doctypeIndex);
        }
        
        const htmlEndIndex = cvHtml.lastIndexOf('</html>');
        if (htmlEndIndex > 0 && htmlEndIndex < cvHtml.length - 10) {
          cvHtml = cvHtml.substring(0, htmlEndIndex + 7);
        }
        
        // Strict validation
        if (!cvHtml.includes('<!DOCTYPE')) {
          throw new Error('Missing DOCTYPE declaration');
        }
        
        if (!cvHtml.includes('</html>')) {
          throw new Error('Missing closing </html> tag');
        }
        
        if (!cvHtml.includes('<style>') && !cvHtml.includes('<style ')) {
          throw new Error('Missing embedded CSS <style> tags');
        }
        
        if (cvHtml.length < 3000) {
          throw new Error(`CV too short: ${cvHtml.length} chars (minimum 3000)`);
        }
        
        // Verify candidate name exists in CV
        const candidateName = formData.personalInfo?.fullName || '';
        if (candidateName) {
          const firstName = candidateName.split(' ')[0].toLowerCase();
          if (!cvHtml.toLowerCase().includes(firstName)) {
            throw new Error('Candidate name not found in generated CV');
          }
        }

        if (process.env.DEBUG) {
          console.log(`[CV Generation] ✅ SUCCESS with ${model}`);
          console.log(`[CV Generation] Length: ${cvHtml.length} characters`);
          console.log(`[CV Generation] Contains name: ${candidateName ? 'Yes ✓' : 'N/A'}`);
          console.log(`[CV Generation] Has styles: ${cvHtml.includes('<style>') ? 'Yes ✓' : 'No ✗'}`);
        }
        
        return cvHtml;
        
      } catch (modelError) {
        lastError = modelError;
        console.error(`[CV Generation] ${model} failed:`, modelError.message);
        
        if (attempt < GROQ_MODELS.length - 1) {
          console.log(`[CV Generation] Retrying with next model...`);
          // Small delay before retry
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    // All models failed
    const errorMsg = `All ${GROQ_MODELS.length} AI models failed. Last error: ${lastError?.message || 'Unknown error'}`;
    console.error(`[CV Generation] FATAL: ${errorMsg}`);
    throw new Error(errorMsg);
    
  } catch (error) {
    console.error("[CV Generation CRITICAL ERROR]:", error);
    throw error;
  }
}

// ============================================================
// 🛠️ HELPER FUNCTIONS
// ============================================================

function buildCandidateProfile(formData) {
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
  
  let profile = `**PERSONAL INFORMATION:**\n`;
  if (personalInfo.fullName) profile += `Full Name: ${personalInfo.fullName}\n`;
  if (personalInfo.professionalTitle) profile += `Professional Title: ${personalInfo.professionalTitle}\n`;
  if (personalInfo.email) profile += `Email: ${personalInfo.email}\n`;
  if (personalInfo.phone) profile += `Phone: ${personalInfo.phone}\n`;
  if (personalInfo.linkedin) profile += `LinkedIn: ${personalInfo.linkedin}\n`;
  if (personalInfo.website) profile += `Website: ${personalInfo.website}\n`;
  if (personalInfo.github) profile += `GitHub: ${personalInfo.github}\n`;
  if (personalInfo.orcid) profile += `ORCID: ${personalInfo.orcid}\n`;
  if (personalInfo.address) profile += `Address: ${personalInfo.address}\n`;
  if (personalInfo.city) profile += `City: ${personalInfo.city}\n`;
  if (personalInfo.country) profile += `Country: ${personalInfo.country}\n`;
  if (personalInfo.postalCode) profile += `Postal Code: ${personalInfo.postalCode}\n`;
  if (personalInfo.nationality) profile += `Nationality: ${personalInfo.nationality}\n`;
  if (personalInfo.dob) profile += `Date of Birth: ${personalInfo.dob}\n`;
  if (personalInfo.summary) profile += `\nProfessional Summary:\n${personalInfo.summary}\n`;
  
  if (experience.length > 0) {
    profile += `\n**WORK EXPERIENCE (${experience.length} entries - MUST INCLUDE ALL):**\n`;
    experience.forEach((exp, i) => {
      profile += `\n${i + 1}. Position: ${exp.position || 'Position Not Specified'}\n`;
      profile += `   Company: ${exp.company || 'Company Not Specified'}\n`;
      if (exp.location) profile += `   Location: ${exp.location}\n`;
      if (exp.startDate || exp.endDate) {
        profile += `   Duration: ${exp.startDate || 'N/A'} to ${exp.current ? 'Present' : (exp.endDate || 'N/A')}\n`;
      }
      if (exp.description) profile += `   Description: ${exp.description}\n`;
    });
  }
  
  if (education.length > 0) {
    profile += `\n**EDUCATION (${education.length} entries - MUST INCLUDE ALL):**\n`;
    education.forEach((edu, i) => {
      profile += `\n${i + 1}. Degree: ${edu.degree || 'Degree Not Specified'}`;
      if (edu.field) profile += ` in ${edu.field}`;
      profile += `\n   Institution: ${edu.institution || 'Institution Not Specified'}\n`;
      if (edu.startDate || edu.endDate || edu.graduationYear) {
        profile += `   Year: ${edu.graduationYear || edu.endDate || edu.startDate || 'N/A'}\n`;
      }
      if (edu.grade) profile += `   Grade/GPA: ${edu.grade}\n`;
      if (edu.thesis) profile += `   Thesis: ${edu.thesis}\n`;
    });
  }
  
  const technicalSkills = skills.technical || [];
  const softSkills = skills.soft || [];
  const toolSkills = skills.tools || [];
  
  if (technicalSkills.length > 0 || softSkills.length > 0 || toolSkills.length > 0) {
    profile += `\n**SKILLS (ORGANIZE BY CATEGORY):**\n`;
    if (technicalSkills.length > 0) {
      profile += `Technical Skills (${technicalSkills.length}): ${technicalSkills.join(', ')}\n`;
    }
    if (softSkills.length > 0) {
      profile += `Soft Skills (${softSkills.length}): ${softSkills.join(', ')}\n`;
    }
    if (toolSkills.length > 0) {
      profile += `Tools & Technologies (${toolSkills.length}): ${toolSkills.join(', ')}\n`;
    }
  }
  
  if (languages.length > 0) {
    profile += `\n**LANGUAGES (${languages.length} - MUST INCLUDE ALL):**\n`;
    languages.forEach((lang, i) => {
      const name = lang.name || lang.language || lang;
      const level = lang.level || 'Proficient';
      profile += `${i + 1}. ${name} - ${level}\n`;
    });
  }
  
  if (projects.length > 0) {
    profile += `\n**PROJECTS (${projects.length} - MUST INCLUDE ALL):**\n`;
    projects.forEach((proj, i) => {
      profile += `\n${i + 1}. ${proj.name || proj.title || 'Project'}\n`;
      if (proj.description) profile += `   Description: ${proj.description}\n`;
      if (proj.link) profile += `   Link: ${proj.link}\n`;
      if (proj.technologies) {
        const tech = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies;
        profile += `   Technologies: ${tech}\n`;
      }
    });
  }
  
  if (certifications.length > 0) {
    profile += `\n**CERTIFICATIONS (${certifications.length} - MUST INCLUDE ALL):**\n`;
    certifications.forEach((cert, i) => {
      if (typeof cert === 'string') {
        profile += `${i + 1}. ${cert}\n`;
      } else {
        profile += `${i + 1}. ${cert.title || cert.name || 'Certification'}\n`;
        if (cert.issuer) profile += `   Issuer: ${cert.issuer}\n`;
        if (cert.date) profile += `   Date: ${cert.date}\n`;
        if (cert.credentialId) profile += `   Credential ID: ${cert.credentialId}\n`;
      }
    });
  }
  
  if (publications.length > 0) {
    profile += `\n**PUBLICATIONS (${publications.length} - MUST INCLUDE ALL WITH PROPER FORMATTING):**\n`;
    publications.forEach((pub, i) => {
      if (typeof pub === 'string') {
        profile += `${i + 1}. ${pub}\n`;
      } else {
        profile += `${i + 1}. ${pub.title || 'Publication Title'}\n`;
        if (pub.authors) profile += `   Authors: ${pub.authors}\n`;
        if (pub.journal || pub.venue) profile += `   Published in: ${pub.journal || pub.venue}\n`;
        if (pub.year) profile += `   Year: ${pub.year}\n`;
        if (pub.link) profile += `   DOI/Link: ${pub.link}\n`;
        if (pub.description) profile += `   Description: ${pub.description}\n`;
      }
    });
  }
  
  return profile;
}

function getTemperatureForCVType(cvType, seed) {
  const baseTemperatures = {
    modern: 0.85,      // High creativity for unique modern designs
    europass: 0.2,     // Low - must follow standard format
    scopus: 0.3,       // Low - academic standards
    creative: 0.95,    // Maximum creativity for artistic designs
    executive: 0.75    // Moderate-high for premium variations
  };
  
  const baseTemp = baseTemperatures[cvType] || 0.7;
  
  // Add slight controlled randomness based on seed
  const variation = ((seed % 100) / 1000) - 0.05; // Range: -0.05 to +0.045
  
  return Math.min(1.0, Math.max(0.1, baseTemp + variation));
}

// ============================================================
// 🔄 GENERATE VARIATIONS
// ============================================================
export async function generateCVVariations(formData, cvType, industry, count = 3) {
  try {
    if (process.env.DEBUG) {
      console.log(`[CV Variations] Generating ${count} unique ${cvType} CVs for ${industry}`);
    }
    
    const variations = [];

    for (let i = 0; i < count; i++) {
      try {
        // Create unique seed for each variation
        const variationFormData = {
          ...formData,
          _generationSeed: Date.now() + (i * 2000) + Math.floor(Math.random() * 1000)
        };
        
        const cv = await generateCVHTML(variationFormData, cvType, industry);
        
        variations.push({
          index: i + 1,
          html: cv,
          type: cvType,
          industry: industry,
          generatedAt: new Date().toISOString(),
          length: cv.length
        });

        if (process.env.DEBUG) {
          console.log(`[CV Variations] ✅ Variation ${i + 1}/${count} complete (${cv.length} chars)`);
        }
        
        // Delay between generations for uniqueness
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (error) {
        console.error(`[CV Variations] Variation ${i + 1} failed:`, error.message);
      }
    }

    if (process.env.DEBUG) {
      console.log(`[CV Variations] ✅ Generated ${variations.length}/${count} variations successfully`);
    }

    return variations;
    
  } catch (error) {
    console.error("[CV Variations Error]:", error);
    throw error;
  }
}

// ============================================================
// 📊 UTILITY FUNCTIONS
// ============================================================
export function getAvailableCVTypes() {
  return ["modern", "europass", "scopus", "creative", "executive"];
}

export function getAvailableIndustries() {
  return Object.keys(INDUSTRY_COLORS);
}

export function getIndustryPalette(industry) {
  return INDUSTRY_COLORS[industry] || INDUSTRY_COLORS.technology;
}

export function getCVTypeDescription(cvType) {
  return CV_TYPE_SPECS[cvType]?.description || "Professional CV";
}

export function getCVTypeRequirements(cvType) {
  return CV_TYPE_SPECS[cvType]?.requirements || [];
}

export default {
  generateCVHTML,
  generateCVVariations,
  getAvailableCVTypes,
  getAvailableIndustries,
  getIndustryPalette,
  getCVTypeDescription,
  getCVTypeRequirements,
};
