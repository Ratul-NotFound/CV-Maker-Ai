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
// ðŸŽ¨ GROQ MODEL CONFIGURATION - UPDATED JAN 2026
// ============================================================
const GROQ_MODELS = [
  "llama-3.3-70b-versatile", // Primary model - best for complex CVs
  "llama-3.1-70b-versatile", // Fallback 1 - excellent quality
  "mixtral-8x7b-32768", // Fallback 2 - good for structured content
  "llama-3.1-8b-instant", // Fallback 3 - fast and reliable
];

// ============================================================
// ðŸŽ¯ CV TYPE SPECIFICATIONS - WORLD-CLASS STANDARDS
// ============================================================
const CV_TYPE_SPECS = {
  modern: {
    description: "World-class modern CV - Ready to apply for top companies globally",
    uniqueness: "âš¡ CRITICALLY IMPORTANT: Each generation MUST be COMPLETELY UNIQUE. NEVER repeat same layout/colors/fonts. Use random seed to select variation. Every CV must look DIFFERENT from previous ones.",
    requirements: [
      "ðŸŽ¨ UNIQUE LAYOUT (Pick ONE based on seed): 1ï¸âƒ£ Sidebar Left: display: grid; grid-template-columns: 280px 1fr; gap: 0; (sidebar bg colored) | 2ï¸âƒ£ Sidebar Right: grid-template-columns: 1fr 280px; | 3ï¸âƒ£ Balanced Two-Column: grid-template-columns: 1fr 1fr; gap: 30px; | 4ï¸âƒ£ Single Centered: max-width: 180mm; margin: 0 auto; | 5ï¸âƒ£ Header-Top + Columns: full-width header, then grid-template-columns: 1fr 1fr; | 6ï¸âƒ£ Asymmetric: grid-template-columns: 2fr 3fr; | 7ï¸âƒ£ Three-section: grid-template-columns: 1fr 1.5fr 1fr;",
      "ðŸ“ A4 PERFECT SCALING (MANDATORY): html { font-size: 100%; } body { width: 210mm; min-height: 297mm; margin: 0 auto; box-sizing: border-box; font-size: 11pt; } | Margins: Use clamp(15mm, 5vw, 25mm) for responsive | Padding: sections 20-30px, items 12-16px | MAX content height: 277mm (297mm - 20mm margins) | Use rem units: 1rem = 16px | Responsive fonts: clamp(min, preferred, max)",
      "âœï¸ TYPOGRAPHY SCALING (Rotate fonts): Pick ONE combination per generation: Inter+Lora | Poppins+Merriweather | Roboto+Playfair | Montserrat+Crimson | WorkSans+PTSerif | DMSans+SourceSerif | Outfit+CrimsonPro. SIZES: Name: 2.25rem-2.5rem (36-40px), weight: 700 | Title: 1.125rem (18px), weight: 500 | Sections: 1.375rem (22px), weight: 600, text-transform: uppercase | Job titles: 1rem (16px), weight: 600 | Body: 0.6875rem (11pt), weight: 400 | line-height: 1.6-1.7 body, 1.2 headers",
      "ðŸŒˆ COLOR SCHEMES (Different each time): Rotate palettes: Modern Blue: #2563eb+#0ea5e9+#64748b | Navy Gold: #1e3a8a+#d97706+#71717a | Teal Orange: #0d9488+#f97316+#737373 | Purple Pink: #7c3aed+#ec4899+#78716c | Indigo Emerald: #4f46e5+#10b981+#52525b | Slate Cyan: #334155+#06b6d4+#a3a3a3. Use 60% neutral + 30% primary + 10% accent",
      "âœï¸ TYPOGRAPHY (WORLD-CLASS): Use Google Fonts combinations - Options: [Inter + Lora | Poppins + Merriweather | Roboto + Playfair Display | Montserrat + Crimson Text | Work Sans + PT Serif | DM Sans + Source Serif Pro]. Font sizes: Name/Title 28-36px (700 weight), Section Headers 18-24px (600 weight), Job Titles 14-16px (500 weight), Body Text 11-13px (400 weight), Line-height: 1.6 for body, 1.3 for headers, Letter-spacing: -0.02em for large text, 0.01em for body",
      "ðŸŽ¨ COLOR SCHEMES (Vary each generation): Professional palettes - [Navy #1e3a8a + Sky #0ea5e9 + Gray #64748b | Slate #334155 + Emerald #10b981 + Stone #78716c | Indigo #4f46e5 + Violet #7c3aed + Zinc #71717a | Teal #0d9488 + Cyan #06b6d4 + Neutral #737373]. Use 60-30-10 rule: 60% neutral, 30% primary, 10% accent",
      "ðŸ“Š VISUAL ELEMENTS (Rotate styles): Skill visualization - [Horizontal bars with gradient fill 0-100% | Circular progress rings with percentage | Dot-based ratings (5 dots) | Pill badges with colored backgrounds | Tag clouds | Star ratings]. Section dividers - [Gradient lines | Solid colored bars 3-5px | Dotted separators | Geometric shapes]. Icons - Use Unicode symbols (ðŸ“§ âœ‰ â˜Ž ðŸ“ ðŸ”— ðŸ’¼ ðŸŽ“ ðŸ› ï¸) styled with CSS",
      "ðŸ—ï¸ HTML STRUCTURE: <html><head><style>ALL CSS HERE</style></head><body><div class='container'><header class='cv-header'>NAME + CONTACT</header><main class='cv-body'><section>SECTIONS</section></main></div></body></html>. Semantic tags: <section>, <article>, <header>, <aside> for sidebar",
      "ðŸ’Ž PREMIUM FEATURES: Box-shadow: 0 4px 20px rgba(0,0,0,0.08) for cards, Border-radius: 8-16px for modern feel, Gradients: linear-gradient(135deg, color1, color2), Hover effects on links, Transitions: all 0.3s ease, Grid/Flexbox for responsive layout",
      "ðŸ“± ATS-OPTIMIZED: Clean HTML hierarchy, No tables for layout, Proper heading tags (h1, h2, h3), Semantic section names, Text-readable (not images for text), Proper contrast ratios (4.5:1 minimum)",
      "âœ¨ FORMATTING: Two-column balance for skills/experience OR single column with clear sections, Contact info: Name (large), Email/Phone/Location/LinkedIn (icons + text), Professional summary: 3-4 lines highlighting key achievements, Experience: Company, Role, Dates, 3-5 bullet achievements with metrics, Skills: Categorized (Technical, Soft, Languages) with visual indicators, Education: Degree, University, Year, GPA if strong",
      "ðŸŒ INSPIRATION: Top templates from Novoresume, Resume.io, Canva Pro, Zety, VisualCV, FlowCV, Reactive Resume. Study: Google Docs modern templates, Microsoft Word professional formats, LinkedIn featured templates"
    ]
  },
  
  europass: {
    description: "Official EU Europass CV - Standard format for European university scholarships and official submissions",
    uniqueness: "STRICT STANDARD - Follow official Europass template exactly as defined by europa.eu while maintaining professional quality",
    requirements: [
      "ðŸ‡ªðŸ‡º OFFICIAL STRUCTURE: MANDATORY sections in exact order - [1. Personal Information | 2. Work Experience | 3. Education and Training | 4. Personal Skills | 5. Additional Information]",
      "ðŸ“ EXACT FORMATTING: A4 size (210mm Ã— 297mm), Margins: 20mm all sides, Font: Arial or Helvetica ONLY, Body text: 11pt, Section headers: 14pt Bold, Subsection headers: 12pt Bold, Line spacing: 1.15-1.3",
      "ðŸŽ¨ OFFICIAL COLORS: Europass Blue #003399 for ALL section headers and divider lines, Black #000000 for body text, Gray #666666 for secondary information (dates, locations), NO other colors allowed",
      "ðŸ‘¤ PERSONAL INFORMATION: Full legal name (16-18pt bold), Full address (Street, City, Postal Code, Country), Telephone (landline if available), Mobile phone, Email address, Nationality, Date of birth (DD/MM/YYYY format), Gender (optional), Photo space (optional, 35mm Ã— 45mm top right)",
      "ðŸ’¼ WORK EXPERIENCE: Format each entry - [Dates (MM/YYYY - MM/YYYY) | Position/Job title | Employer name and full address | Type of business/sector | Main activities and responsibilities (bullet points)]. List in REVERSE chronological order",
      "ðŸŽ“ EDUCATION: Format each entry - [Dates (MM/YYYY - MM/YYYY) | Title of qualification awarded | Institution name and full address | Level in national classification | ISCED level (if known) | Principal subjects/occupational skills]. Include ongoing education with expected completion date",
      "ðŸ—£ï¸ LANGUAGE SKILLS: Mother tongue(s), Other language(s) with detailed CEFR levels - Create table with columns: [Language | Listening | Reading | Spoken Interaction | Spoken Production | Writing]. Use official CEFR levels: A1, A2, B1, B2, C1, C2",
      "ðŸ’» DIGITAL SKILLS: Self-assessment table - [Information processing | Communication | Content creation | Safety | Problem-solving]. Levels: Basic user, Independent user, Proficient user. Specify software/tools known",
      "ðŸŽ¯ ADDITIONAL SECTIONS: Organizational/managerial skills, Job-related skills, Other skills (artistic, musical, sports), Driving license (Category A, B, C, D, etc.), Honours and awards, Publications, Presentations, Projects, Memberships, References",
      "ðŸ“‹ LAYOUT: Use clean table-based structure, 2-column layout (labels left 30%, content right 70%), Horizontal lines (1px, #003399) separating major sections, Consistent indentation for bullet points (5mm), Professional spacing between entries (10-15px)",
      "âœ… OFFICIAL COMPLIANCE: Footer: 'European Union, 2002-2026 | europass.cedefop.europa.eu', Page numbers if multiple pages, Date of creation, Ready for official submission to: EU institutions, European universities, Scholarship programs (Erasmus+), International organizations",
      "ðŸŒ REFERENCE: Based on official Europass template from https://europa.eu/europass, Compliant with EU standards, Accepted by all EU member states, Suitable for: University applications, Job applications in EU, Scholarship applications (Erasmus Mundus, Marie Curie), Visa applications"
    ]
  },
  
  scopus: {
    description: "Academic/Research CV - Official format for Scopus indexing, university admissions, and research scholarships",
    uniqueness: "ACADEMIC STANDARD - Follow scholarly conventions with emphasis on research excellence and publication record",
    requirements: [
      "ðŸŽ“ ACADEMIC STRUCTURE: Essential sections in order - [1. Personal Details & Contact | 2. Research Interests/Summary | 3. Education (reverse chronological) | 4. Publications (peer-reviewed) | 5. Research Experience | 6. Teaching Experience | 7. Awards & Honors | 8. Professional Memberships | 9. References]",
      "ðŸ“ SCHOLARLY FORMATTING: A4 (210mm Ã— 297mm), Conservative margins: 25mm all sides, Font: Serif fonts ONLY - Georgia 11pt, Times New Roman 11pt, OR Garamond 11pt for body, Headers: 14-16pt bold serif, Line spacing: 1.5 for readability, Paragraph spacing: 6pt before sections",
      "ðŸŽ¨ PROFESSIONAL COLORS: Navy Blue #1e3a8a for section headers, Academic Gray #374151 for subheadings, Black #000000 for body text, Scholarly Teal #0d9488 for accents (links, highlights), Minimal color use - emphasis on content over design",
      "ðŸ‘¨â€ðŸ”¬ PERSONAL DETAILS: Full academic name (with middle initials), Current position and institution, Full contact: Email (institutional), Phone, Office address, ORCID iD (if available) - display prominently as 'ORCID: 0000-0000-0000-0000', Google Scholar profile link, ResearchGate/Academia.edu profiles (optional)",
      "ðŸ”¬ RESEARCH PROFILE: Research Summary/Interests (3-5 lines describing research focus), Key metrics IF AVAILABLE: Total publications, h-index, Total citations, i10-index. Academic keywords/specializations",
      "ðŸ“š PUBLICATIONS (CRITICAL): Group by type - [Peer-reviewed Journal Articles | Conference Papers | Book Chapters | Books | Preprints/Under Review]. Format: Author(s) in APA/IEEE style, (Year), 'Title in quotes', Journal/Conference name in italics, Volume(Issue), pages, DOI or URL. Use numbering [1], [2], etc. Highlight own name in BOLD. Include impact factor if high-tier journal (IF: X.XX)",
      "ðŸŽ“ EDUCATION: Format each - [Degree (PhD, MSc, BSc) in Field | Institution name, Location | Year or Years (YYYY-YYYY) | Thesis/Dissertation title in italics | Supervisor: Prof. Name | Grade/Honors if exceptional (Summa Cum Laude, First Class, GPA 4.0/4.0)]",
      "ðŸ”¬ RESEARCH EXPERIENCE: Position title (Research Fellow, Postdoc, Research Assistant), Institution/Lab name, Principal Investigator, Dates (MM/YYYY - MM/YYYY or Present), Key research activities, techniques, outcomes (3-5 bullets), Grants/Funding associated (if applicable)",
      "ðŸ‘¨â€ðŸ« TEACHING EXPERIENCE: Course title, Level (Undergraduate/Graduate), Institution, Role (Instructor, TA, Guest Lecturer), Semester/Year, Student count (if impressive). Include course development, supervision of theses",
      "ðŸ† AWARDS & GRANTS: Award name, Granting organization, Year, Amount (if research grant), Brief description or significance. List in reverse chronological order",
      "ðŸ’¼ PROFESSIONAL ACTIVITIES: Journal reviewer for: [List journals], Conference committees, Professional society memberships (IEEE, ACM, ACS, etc.), Editorial boards, Conference presentations (oral/poster)",
      "ðŸ“– ADDITIONAL SECTIONS: Patents (if applicable), Technical Skills (Lab techniques, Software, Statistical tools, Programming languages), Languages (with proficiency levels), Certifications relevant to research",
      "âœï¸ REFERENCES: Option 1: 'References available upon request' OR Option 2: List 3-4 referees with - [Full name and title | Position | Institution | Email | Phone]. Include PhD supervisor, postdoc mentor, or collaborators",
      "ðŸ“ LAYOUT PRINCIPLES: Single column, left-aligned, Maximum 2-3 pages for early career, 4-6 pages for established researchers, NO photos (unless required by country), NO graphics/charts (content-focused), Clear hierarchical structure with proper indentation, Consistent formatting throughout",
      "âœ… COMPLIANCE: Suitable for: PhD applications worldwide, Postdoc positions, Faculty job applications, Research grant proposals (NSF, NIH, ERC), University scholarship applications (Rhodes, Fulbright, Gates Cambridge), Scopus author profile creation, Academic promotions",
      "ðŸŒ REFERENCE STANDARDS: Harvard University Academic CV guidelines, Oxford University CV format, Nature Careers CV templates, MIT Faculty application standards, European Research Council formats"
    ]
  },
  
  creative: {
    description: "Bold, artistic, portfolio-focused CV - World-class creative design for designers, artists, and creative professionals",
    uniqueness: "MAXIMUM CREATIVITY - Every generation must be radically different, artistically unique, and visually stunning",
    requirements: [
      "ðŸŽ¨ RADICAL UNIQUENESS: Generate COMPLETELY DIFFERENT artistic visions each time - No two CVs should EVER look similar. Vary: [Grid vs Freeform | Symmetrical vs Asymmetric | Minimalist vs Maximalist | Geometric vs Organic | Monochrome vs Colorful | Traditional vs Experimental]",
      "ðŸ—ï¸ EXPERIMENTAL LAYOUTS: Choose one unique structure per generation - [Diagonal split design | Circular/radial layout | Overlapping sections with z-index | Masonry grid (Pinterest-style) | Zigzag sections | Magazine editorial style | Infographic-inspired | Dashboard-style cards | Brutalist design | Memphis style | Swiss/International style | Bauhaus-inspired | Art Deco geometric]",
      "âœï¸ TYPOGRAPHY AS ART: Bold font pairings (Mix serif + sans-serif + display) - Options: [Playfair Display + DM Sans + Bebas Neue | Abril Fatface + Raleway + Oswald | Cormorant Garamond + Work Sans + Archivo Black | Libre Baskerville + Poppins + Righteous | Merriweather + Inter + Fredoka One]. Sizes: Display name 40-72px, Section headers 24-36px (with creative treatments: uppercase, gradient fills, outlined text, shadow effects), Body 11-14px with generous line-height (1.7-2.0)",
      "ðŸŒˆ VIBRANT COLOR SCHEMES: Use bold, artistic palettes (change every generation) - [Electric: #6366f1 Indigo + #ec4899 Pink + #eab308 Yellow | Tropical: #14b8a6 Teal + #f97316 Orange + #a855f7 Purple | Sunset: #dc2626 Red + #f59e0b Amber + #7c3aed Violet | Ocean: #0284c7 Blue + #06b6d4 Cyan + #10b981 Emerald | Modern: #0f172a Slate + #6366f1 Indigo + #f43f5e Rose | Pastel: #818cf8 Soft Indigo + #fb923c Soft Orange + #a78bfa Soft Purple]. Use 40-30-30 split or triadic schemes. Add gradients: linear-gradient(120deg to 160deg, color1, color2)",
      "ðŸ’Ž CREATIVE VISUAL ELEMENTS: Rotate these features - [Geometric shapes: circles, triangles, hexagons as backgrounds or accents | Abstract patterns: dots, lines, waves generated with CSS | Gradient overlays and color blocks | Creative dividers: wavy lines, dotted paths, artistic separators | Icon integration: Large decorative icons, custom styled Unicode | Circular photo frames with colored borders | Skill visualizations: Radial charts, creative bar designs, tag clouds, bubble charts | Timeline graphics with visual flair | Portfolio thumbnails or placeholders]",
      "ðŸŽ¯ PORTFOLIO EMPHASIS: Dedicate 30-40% space to showcasing work - [Featured Projects section with large visual blocks | Client logos or project types | Case study highlights | Awards and recognition prominently displayed | Links to portfolio, Behance, Dribbble | Design tools showcased with styled badges (Adobe Creative Suite, Figma, Sketch, Blender, etc.)]",
      "ðŸ“ STRUCTURE & SCALING: Still maintain A4 (210mm Ã— 297mm) for professional printing, Creative margins: Can go narrow (10-15mm) for full-bleed designs OR wide (30-40mm) for editorial look, Use CSS Grid or Flexbox for creative layouts, Ensure readability despite artistic approach",
      "âœ¨ ARTISTIC TECHNIQUES: Apply creative CSS - [Text gradients: background: linear-gradient(); -webkit-background-clip: text; color: transparent | Drop shadows: box-shadow, text-shadow with multiple layers | Transform rotations: transform: rotate(-2deg) for playful elements | Clip-path: polygon() for unique shapes | Blend modes: mix-blend-mode: multiply/screen/overlay | Border effects: border-image, dashed borders with custom dash arrays | Pseudo-elements ::before ::after for decorative elements]",
      "ðŸŽ­ SECTION VARIATIONS: Creative section treatments - [Cards with shadows and hover effects | Colored background blocks | Ribbon/banner style headers | Bubble/pill shaped containers | Diagonal cut sections | Framed content with artistic borders | Overlapping elements with transparency | Magazine-style columns]",
      "ðŸ“± CREATIVE BUT PROFESSIONAL: Balance artistry with readability - Ensure high contrast for text (minimum 4.5:1 ratio), Keep body text simple and readable even if headers are artistic, Include all essential CV information despite creative layout, Maintain logical flow and hierarchy",
      "ðŸŽ¨ DESIGN STYLES TO ROTATE: [Modern Minimalist (lots of white space, bold typography, minimal color) | Maximalist (rich colors, patterns, abundant visual elements) | Retro/Vintage (70s/80s/90s inspired palettes and shapes) | Neo-brutalism (bold shapes, stark contrast, raw aesthetic) | Glassmorphism (frosted glass effects, transparency, blur) | Neumorphism (soft shadows, subtle depth) | Flat Design 2.0 (simple shapes, bright colors, minimal shadows) | Swiss/International (grid-based, sans-serif, asymmetric balance)]",
      "âœ… SUITABLE FOR: Graphic Designers, UX/UI Designers, Art Directors, Creative Directors, Illustrators, Photographers, Videographers, Animators, Content Creators, Brand Designers, Marketing Creatives, Web Designers, Motion Designers",
      "ðŸŒ INSPIRATION SOURCES: Behance featured projects, Dribbble top shots, Awwwards Site of the Day, Adobe Portfolio showcases, Creative Market premium templates, Canva Pro creative templates, Pinterest design boards, Instagram @design accounts"
    ]
  },
  
  executive: {
    description: "Premium executive CV - Sophisticated design for C-level, senior leadership, and board positions",
    uniqueness: "HIGH SOPHISTICATION - Each generation should present different premium luxury aesthetics and executive styles",
    requirements: [
      "ðŸŽ© EXECUTIVE SOPHISTICATION: Generate DIFFERENT premium styles each time - Vary: [Classic Elegance | Modern Executive | Minimalist Luxury | Traditional Authority | Contemporary Premium | Refined Simplicity]. Each should exude leadership, authority, and professionalism",
      "ðŸ›ï¸ PREMIUM LAYOUTS: Choose executive-appropriate structures - [Single column centered with generous whitespace | Two-column: 35% sidebar for summary/skills, 65% for experience | Header-prominent with executive summary | Three-section: Header + Key Metrics + Experience | Letterhead-style with logo space | Executive dashboard style with metric boxes]",
      "âœï¸ LUXURY TYPOGRAPHY: Premium serif + sans-serif combinations - [Cormorant Garamond + Inter | Playfair Display + Lato | Libre Baskerville + Roboto | Crimson Text + Open Sans | Lora + Work Sans | EB Garamond + DM Sans]. Sizes: Name 30-42px (elegant, not loud), Title 16-20px, Section Headers 18-24px (subtle elegance), Body 11-12pt (professional), Generous line-height: 1.7-1.9 for premium feel, Refined letter-spacing: -0.01em for large text",
      "ðŸŽ¨ SOPHISTICATED COLORS: Executive palettes (rotate each generation) - [Classic: Navy #1e3a8a + Charcoal #1f2937 + Gold #d97706 accents | Premium: Burgundy #7f1d1d + Slate #334155 + Silver #94a3b8 | Authority: Forest Green #064e3b + Dark Gray #18181b + Copper #ea580c | Modern: Deep Blue #1e40af + Gunmetal #27272a + Bronze #b45309 | Refined: Midnight #0f172a + Pewter #52525b + Champagne #fbbf24]. Use 70% neutral (grays/whites) + 20% primary + 10% luxury accent",
      "ðŸ’Ž LUXURY DESIGN ELEMENTS: Premium touches - [Thin elegant divider lines (1-2px, gold/silver/primary color) | Refined borders on sections (1px solid, subtle color) | Subtle embossing effects: box-shadow: inset 0 1px 2px rgba(255,255,255,0.1) | Elegant shadows: box-shadow: 0 2px 12px rgba(0,0,0,0.06) | Executive photo space: 80mm Ã— 100mm with refined frame, top-right or header | Watermark-style background: Company name or initials at 3% opacity | Corner details: Small geometric elements or refined accent shapes]",
      "ðŸ“ GENEROUS SPACING: Premium whitespace - Margins: 25-35mm (executive documents have breathing room), Section spacing: 25-35px between major sections, Item spacing: 15-20px between entries, Padding: 20-30px within sections, Leading: Generous line-height for readability and prestige",
      "ðŸ‘” EXECUTIVE CONTENT STRUCTURE: [HEADER: Name (large, elegant) + Executive Title + Location + Contact (refined icons) | EXECUTIVE SUMMARY: 4-6 lines highlighting leadership philosophy, strategic vision, core competencies (Most important section - place prominently) | KEY METRICS: Years of Experience, Revenue/Budget Managed, Team Size, Geographic Scope (display as elegant stat boxes or inline) | PROFESSIONAL EXPERIENCE: Company + Logo space, Position Title (bold), Dates, Strategic Achievements with METRICS: Revenue growth %, Cost reduction $X, Market share increase, Team built (X people), M&A deals led, Transformational initiatives | LEADERSHIP & GOVERNANCE: Board positions, Advisory roles, Committee memberships | EDUCATION: MBA (prominent), Executive programs, Advanced degrees, Certifications (only impressive ones) | PROFESSIONAL AFFILIATIONS: CEO forums, Industry associations, Speaking engagements]",
      "ðŸ“Š EXECUTIVE METRICS DISPLAY: Visualize leadership impact - [Revenue managed: $XXM-$XXB | P&L Responsibility | Team size: XX-XXX direct/indirect reports | Years of executive experience | Geographic scope: Countries/Regions | Companies led or transformed]. Use elegant number displays, not flashy graphics",
      "ðŸŽ¯ ACHIEVEMENTS FOCUS: Frame experience around executive impact - [Strategic leadership: 'Led $50M digital transformation...', 'Expanded operations to 12 new markets...', 'Restructured division reducing costs 30%...' | P&L ownership: Always include budget/revenue numbers | Talent development: 'Built high-performing team of 80...' | Board-level work: 'Presented quarterly strategy to board...']",
      "âœ¨ PREMIUM FINISHING: Executive polish - [Headshot area: Professional space indicated for executive portrait | Logo placeholder: Company logos can be added | Signature line: Space for digital signature (optional) | LinkedIn premium badge indicator | Professional designations: MBA, CPA, CFA prominently displayed | Confidential watermark (optional): 'Executive Resume - Confidential']",
      "ðŸ“ EXECUTIVE STANDARDS: Length: 2-3 pages (executives can exceed 1 page), Quality over quantity: Each word carries weight, Focus on strategy and leadership: Not tactical tasks, Quantify everything: Numbers speak at executive level, No buzzwords: Authentic leadership language, Professional tone: Authoritative but not arrogant",
      "ðŸŽ­ LAYOUT VARIATIONS: Rotate these premium styles - [Classic Executive: Single column, centered, serif typography, traditional | Modern Executive: Two-column, sans-serif headers, contemporary | Minimalist Premium: Lots of white space, understated elegance, refined | Authoritative: Bold headers, strong structure, commanding | Sophisticated: European style, narrow margins, dense but elegant]",
      "âœ… SUITABLE FOR: Chief Executive Officer (CEO), Chief Financial Officer (CFO), Chief Operating Officer (COO), Chief Technology Officer (CTO), Vice President levels, Senior Director positions, Board Member candidates, Executive search (retained search), Private equity portfolio company leadership, Non-profit executive director, Academic dean/provost positions",
      "ðŸŒ WORLD-CLASS STANDARDS: Based on: Harvard Business School resume guidelines, Wharton Executive MBA formats, McKinsey & Company executive resume standards, Korn Ferry executive search requirements, Spencer Stuart board placement formats, Russell Reynolds executive templates, TopCV executive services, The Muse executive examples"
    ]
  }
};

// ============================================================
// ðŸŒ INDUSTRY-SPECIFIC FOCUS AND ENHANCEMENTS
// ============================================================
const INDUSTRY_FOCUS = {
  technology: "ðŸ’» TECH INDUSTRY FOCUS: Emphasize - Technical Skills: Programming languages (Python, JavaScript, Java, C++, Go, Rust), Frameworks (React, Angular, Vue, Django, Spring, .NET), Cloud platforms (AWS, Azure, GCP), DevOps tools (Docker, Kubernetes, Jenkins, CI/CD), Databases (SQL, NoSQL, MongoDB, PostgreSQL). Projects: GitHub repositories, Open source contributions, System architecture, API development, Microservices. Methodologies: Agile/Scrum, Test-driven development. Certifications: AWS Certified, Google Cloud, Azure. Use: Modern tech colors (blues #0ea5e9, purples #8b5cf6), Code-style monospace fonts for technical sections, Clean modern layouts, Icon badges for technologies.",
  
  finance: "ðŸ’° FINANCE INDUSTRY FOCUS: Highlight - Quantitative Skills: Financial modeling, Risk assessment, Portfolio optimization, Valuation analysis, Derivatives pricing. Tools: Bloomberg Terminal, Excel (VBA, Power Query), SQL, Python (Pandas, NumPy), Tableau, Power BI. Certifications: CFA (all levels), CPA, CFP, FRM, Series 7/63. Experience: P&L management, Investment strategies, M&A analysis, Due diligence, Regulatory compliance (SEC, FINRA, Basel III). Achievements: AUM managed, Returns generated, Cost savings, Deals closed. Use: Professional trustworthy colors (navy #1e40af, charcoal #18181b, gold accents #d97706), Formal conservative design, Clear hierarchical structure, Number-focused layouts.",
  
  healthcare: "âš•ï¸ HEALTHCARE INDUSTRY FOCUS: Showcase - Medical Credentials: MD, DO, RN, NP, PA-C, PharmD, Board certifications (ABIM, ABFM, etc.). Clinical Experience: Patient care stats, Procedures performed, Specializations, Clinical rotations. Healthcare IT: EMR/EHR systems (Epic, Cerner), HIPAA compliance, Telehealth platforms. Research: Clinical trials, Publications in medical journals, IRB experience. Licenses: State medical licenses, DEA number. Skills: Patient assessment, Diagnosis, Treatment planning, Surgical procedures, Evidence-based medicine. Use: Clean medical greens (#10b981, #059669) and blues (#0284c7), Professional trustworthy design, Clear credential emphasis, Patient-outcome focused.",
  
  education: "ðŸ“š EDUCATION INDUSTRY FOCUS: Feature - Teaching Philosophy: Pedagogical approaches, Learning theories, Student-centered methods. Credentials: Teaching license/certification, Degrees (MEd, EdD, PhD in Education), Subject endorsements. Experience: Grade levels taught, Class sizes, Student demographics, Curriculum development, Lesson planning. Achievements: Student test score improvements, Graduation rates, Awards (Teacher of the Year), Grant funding received. Technology: LMS platforms (Canvas, Blackboard, Google Classroom), Educational technology tools, Hybrid/online teaching. Professional Development: Workshops attended, Conferences, Continuing education. Use: Warm academic colors (purples #7c3aed, teals #0d9488), Approachable friendly design, Clear organized structure.",
  
  marketing: "ðŸ“¢ MARKETING INDUSTRY FOCUS: Highlight - Campaign Performance: ROI metrics, Conversion rates, CTR, CPC, ROAS, Lead generation numbers, Revenue attributed. Digital Skills: SEO/SEM, Google Analytics, Google Ads, Facebook Ads Manager, Email marketing (Mailchimp, HubSpot), Marketing automation, A/B testing. Content Creation: Copywriting, Content strategy, Social media management, Video production, Graphic design. Tools: Adobe Creative Suite, Canva, Hootsuite, Buffer, Semrush, Ahrefs. Achievements: Campaign successes with numbers, Brand growth %, Social media follower increase, Website traffic growth. Use: Vibrant engaging colors (pinks #ec4899, oranges #f97316, purples #a855f7), Creative modern layouts, Metric-focused design, Visual emphasis on results.",
  
  engineering: "âš™ï¸ ENGINEERING INDUSTRY FOCUS: Emphasize - Technical Expertise: Engineering discipline (Mechanical, Electrical, Civil, Chemical, etc.), CAD software (AutoCAD, SolidWorks, CATIA, Revit), Simulation tools (ANSYS, MATLAB, Simulink). Projects: Design projects, System optimization, Process improvements, Infrastructure development. Certifications: PE (Professional Engineer), PMP, Six Sigma (Green Belt, Black Belt), LEED AP. Standards: ISO, ASME, IEEE, building codes. Skills: Technical drawings, Project management, System design, Quality control, Safety protocols, Cost estimation. Achievements: Projects delivered (on time, under budget), Efficiency improvements %, Cost savings, Patents filed. Use: Structured professional design, Industrial colors (oranges #ea580c, grays #64748b), Technical precision, Grid-based layouts.",
  
  law: "âš–ï¸ LAW INDUSTRY FOCUS: Showcase - Legal Credentials: JD, LLM, Bar admissions (state-specific), Court admissions (Federal, Supreme Court). Practice Areas: Litigation, Corporate law, Intellectual property, Tax, Real estate, Family law, Criminal defense. Experience: Cases handled, Court appearances, Depositions, Trials won, Settlements negotiated, Legal research. Publications: Law review articles, Legal blogs, Case commentaries. Skills: Legal writing, Contract drafting, Negotiation, Client counseling, Regulatory compliance, Due diligence. Pro Bono: Public interest work, Legal aid. Use: Formal authoritative design, Classical serif fonts (Georgia, Garamond), Dark professional colors (navy #1e3a8a, burgundy #7f1d1d), Hierarchical structure, Traditional elegant layout.",
  
  creative: "ðŸŽ¨ CREATIVE INDUSTRY FOCUS: Portfolio-Centric - Featured Work: Design projects, Creative campaigns, Branding work, Illustration portfolio, Photography series. Tools: Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects, Premiere Pro), Figma, Sketch, Blender, Cinema 4D, Procreate. Awards: Design awards, Competition wins, Featured work (Behance, Dribbble). Clients: Brand names worked with, Agency experience, Freelance projects. Skills: Brand identity, UI/UX design, Motion graphics, Typography, Color theory, Art direction. Online Presence: Portfolio website, Behance, Dribbble, Instagram. Use: BOLD artistic design, Vibrant creative colors (varies wildly), Portfolio-style layout showcasing work, Creative experimental typography, Visual-first approach.",
  
  research: "ðŸ”¬ RESEARCH INDUSTRY FOCUS: Highlight - Publications: Peer-reviewed journal articles (with IF, citations, h-index), Conference papers, Book chapters, Preprints. Research Experience: Lab techniques, Methodologies, Statistical analysis, Data collection, Experimental design. Funding: Research grants (NIH, NSF, ERC), Fellowship funding, Grant writing experience. Collaboration: Multi-institutional projects, International collaborations, Interdisciplinary research. Presentations: Conference talks (oral, poster), Seminars, Invited lectures. Tools: Statistical software (R, SPSS, SAS), Programming (Python, MATLAB), Lab equipment, Data visualization. Use: Scholarly academic design, Academic blues (#1e3a8a) and teals (#0d9488), Clean serif fonts (Georgia, Times New Roman), Publication-focused layout, Citation emphasis.",
  
  consulting: "ðŸ’¼ CONSULTING INDUSTRY FOCUS: Emphasize - Client Impact: Industries served, Project outcomes, Revenue growth delivered, Cost reductions achieved, Strategic recommendations implemented. Frameworks: Problem-solving methodologies, Business analysis frameworks (SWOT, Porter's Five Forces, BCG Matrix), Strategy development. Tools: Excel (advanced modeling), PowerPoint (executive presentations), Tableau, Power BI, SQL, Python for analysis. Project Types: Market entry strategy, Operational efficiency, Digital transformation, M&A due diligence, Organizational restructuring. Deliverables: Client presentations, Strategic reports, Financial models, Implementation roadmaps. Firms: MBB (McKinsey, BCG, Bain), Big 4, Boutique firms. Use: Professional modern design, Consulting firm colors (blues #0ea5e9, cyans #06b6d4), Clean structured layout, Impact-metric focused, Business-polished aesthetic."
};

// ============================================================
// ðŸš€ MAIN CV GENERATION FUNCTION - WORLD-CLASS QUALITY
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
    
    // OPTIMIZED PROMPTS FOR HIGH-QUALITY CV GENERATION
    const systemPrompt = `You are an expert CV designer specializing in ${cvType} CVs for the ${industry} industry.

Your task: Create a complete, professional HTML CV with embedded CSS that is:
- ATS-optimized and recruiter-friendly
- Visually appealing with modern design
- Print-ready (A4 size: 210mm x 297mm)
- Uses industry-appropriate colors and styling

CRITICAL REQUIREMENTS:

1. COMPLETE HTML STRUCTURE:
   - Start with: <!DOCTYPE html>
   - Include: <html>, <head>, <meta charset="UTF-8">, <title>
   - ALL CSS must be embedded in <style> tags (no external files)
   - End with proper closing tags: </body></html>

2. PROFESSIONAL DESIGN:
   - A4 dimensions: width: 210mm; min-height: 297mm
   - Margins: 15-20mm all sides
   - Font: Modern sans-serif (Inter, Roboto, or similar) at 11-12pt
   - Primary color: ${colors.primary}
   - Accent color: ${colors.accent}
   - Line height: 1.6-1.7 for readability

3. CV SECTIONS (in order):
   - Header: Name (large, bold), Professional Title, Contact Info (email, phone, location, LinkedIn)
   - Professional Summary: 3-4 impactful sentences
   - Experience: Job title, Company, Dates, 3-5 achievement bullets with METRICS
   - Education: Degree, Institution, Year, relevant details
   - Skills: Organized by category with visual indicators
   - Additional: Languages, Certifications, Projects (if provided)

4. CONTENT QUALITY:
   - Use STRONG action verbs: Led, Developed, Increased, Managed, Achieved
   - Include METRICS: percentages, dollar amounts, numbers (e.g., "Increased revenue by 45%")
   - Quantify achievements: team sizes, project scopes, impact measures
   - Keep bullet points concise but impactful (1-2 lines each)

5. VISUAL ELEMENTS:
   - Section headers: Bold, colored, with underline or border
   - Proper spacing between sections (20-30px)
   - Use icons for contact info (✉ 📞 📍 🔗 or Unicode equivalents)
   - Skill bars or rating systems for visual appeal
   - Consistent formatting throughout

6. OUTPUT FORMAT:
   - Return ONLY the HTML code
   - NO markdown code blocks (no \`\`\`html)
   - NO explanations before or after
   - Start with <!DOCTYPE html> and end with </html>
   - Ensure valid, well-formed HTML

STYLE GUIDELINES FOR ${cvType.toUpperCase()}:
${specs.requirements.slice(0, 5).map(req => '- ' + req.replace(/^[\s]*[^\s]+[\s]*/, '')).join('\n')}

INDUSTRY-SPECIFIC FOCUS:
${industryFocus.substring(0, 500)}...`;

    const userPrompt = `Create a ${cvType} CV for ${industry} industry.

CANDIDATE INFORMATION:
${candidateProfile}

IMPORTANT:
- Include ALL provided information
- Add realistic metrics and achievements (increase percentages 20-50%, revenue amounts, team sizes, etc.)
- Use professional action verbs (Led, Developed, Managed, Achieved, Implemented)
- Make it compelling and results-oriented
- Ensure perfect HTML structure with embedded CSS
- Output ONLY HTML code, nothing else`;
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
            temperature: 0.7,
            max_tokens: 16000,
            top_p: 0.95,
            frequency_penalty: 0.3,
            presence_penalty: 0.4,
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout after 60 seconds')), 60000)
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
        
        if (cvHtml.length < 2000) {
          throw new Error(`CV too short: ${cvHtml.length} chars (minimum 2000)`);
        }
        
        // Enhanced quality validation
        const qualityChecks = [
          { test: () => cvHtml.includes('.cv-page'), error: 'Missing .cv-page wrapper class' },
          { test: () => cvHtml.includes('.name'), error: 'Missing .name class for candidate name' },
          { test: () => cvHtml.includes('.section-title'), error: 'Missing .section-title for sections' },
          { test: () => cvHtml.includes('.experience-item') || cvHtml.includes('experience'), error: 'Missing experience section' },
          { test: () => cvHtml.includes('font'), error: 'Missing font styling' },
          { test: () => cvHtml.includes(colors.primary), error: 'Missing primary brand color' },
          { test: () => cvHtml.split('<section').length >= 3 || cvHtml.split('class="section"').length >= 3, error: 'Insufficient sections (need at least 3)' },
        ];
        
        for (const check of qualityChecks) {
          if (!check.test()) {
            throw new Error(`Quality check failed: ${check.error}`);
          }
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
          console.log(`[CV Generation] âœ… SUCCESS with ${model}`);
          console.log(`[CV Generation] Length: ${cvHtml.length} characters`);
          console.log(`[CV Generation] Contains name: ${candidateName ? 'Yes âœ“' : 'N/A'}`);
          console.log(`[CV Generation] Has styles: ${cvHtml.includes('<style>') ? 'Yes âœ“' : 'No âœ—'}`);
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
// ðŸ› ï¸ HELPER FUNCTIONS
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
  
  let profile = `===== PERSONAL INFORMATION =====\n`;
  if (personalInfo.fullName) profile += `Name: ${personalInfo.fullName}\n`;
  if (personalInfo.professionalTitle) profile += `Title: ${personalInfo.professionalTitle}\n`;
  if (personalInfo.email) profile += `Email: ${personalInfo.email}\n`;
  if (personalInfo.phone) profile += `Phone: ${personalInfo.phone}\n`;
  if (personalInfo.linkedin) profile += `LinkedIn: ${personalInfo.linkedin}\n`;
  if (personalInfo.website) profile += `Website: ${personalInfo.website}\n`;
  if (personalInfo.github) profile += `GitHub: ${personalInfo.github}\n`;
  if (personalInfo.orcid) profile += `ORCID: ${personalInfo.orcid}\n`;
  if (personalInfo.address || personalInfo.city || personalInfo.country) {
    profile += `Location: ${[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}\n`;
  }
  if (personalInfo.nationality) profile += `Nationality: ${personalInfo.nationality}\n`;
  if (personalInfo.dob) profile += `DOB: ${personalInfo.dob}\n`;
  if (personalInfo.summary) profile += `\nPROFESSIONAL SUMMARY:\n${personalInfo.summary}\n`;
  
  if (experience.length > 0) {
    profile += `\n===== WORK EXPERIENCE (${experience.length} positions) =====\n`;
    experience.forEach((exp, i) => {
      profile += `\n[${i + 1}] ${exp.position || 'Position Not Specified'}\n`;
      profile += `    Company: ${exp.company || 'Company Not Specified'}\n`;
      if (exp.location) profile += `    Location: ${exp.location}\n`;
      const startDate = exp.startDate || 'Start Date';
      const endDate = exp.current ? 'Present' : (exp.endDate || 'End Date');
      profile += `    Period: ${startDate} - ${endDate}\n`;
      if (exp.description) profile += `    Details: ${exp.description}\n`;
    });
  }
  
  if (education.length > 0) {
    profile += `\n===== EDUCATION (${education.length} entries) =====\n`;
    education.forEach((edu, i) => {
      profile += `\n[${i + 1}] ${edu.degree || 'Degree'}`;
      if (edu.field) profile += ` in ${edu.field}`;
      profile += `\n    Institution: ${edu.institution || 'Institution Not Specified'}\n`;
      const year = edu.graduationYear || edu.endDate || edu.startDate || 'Year';
      profile += `    Year: ${year}\n`;
      if (edu.grade) profile += `    Grade/GPA: ${edu.grade}\n`;
      if (edu.thesis) profile += `    Thesis: ${edu.thesis}\n`;
    });
  }
  
  const technicalSkills = skills.technical || [];
  const softSkills = skills.soft || [];
  const toolSkills = skills.tools || [];
  
  if (technicalSkills.length > 0 || softSkills.length > 0 || toolSkills.length > 0) {
    profile += `\n===== SKILLS =====\n`;
    if (technicalSkills.length > 0) {
      profile += `Technical: ${technicalSkills.join(', ')}\n`;
    }
    if (softSkills.length > 0) {
      profile += `Soft Skills: ${softSkills.join(', ')}\n`;
    }
    if (toolSkills.length > 0) {
      profile += `Tools & Technologies: ${toolSkills.join(', ')}\n`;
    }
  }
  
  if (languages.length > 0) {
    profile += `\n===== LANGUAGES =====\n`;
    languages.forEach((lang, i) => {
      const name = lang.name || lang.language || lang;
      const level = lang.level || 'Proficient';
      profile += `${i + 1}. ${name} - ${level}\n`;
    });
  }
  
  if (projects.length > 0) {
    profile += `\n===== PROJECTS (${projects.length} projects) =====\n`;
    projects.forEach((proj, i) => {
      profile += `\n[${i + 1}] ${proj.name || proj.title || 'Project'}\n`;
      if (proj.description) profile += `    Description: ${proj.description}\n`;
      if (proj.link) profile += `    Link: ${proj.link}\n`;
      if (proj.technologies) {
        const tech = Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies;
        profile += `    Technologies: ${tech}\n`;
      }
    });
  }
  
  if (certifications.length > 0) {
    profile += `\n===== CERTIFICATIONS =====\n`;
    certifications.forEach((cert, i) => {
      if (typeof cert === 'string') {
        profile += `${i + 1}. ${cert}\n`;
      } else {
        profile += `${i + 1}. ${cert.title || cert.name || 'Certification'}\n`;
        if (cert.issuer) profile += `    Issuer: ${cert.issuer}\n`;
        if (cert.date) profile += `    Date: ${cert.date}\n`;
        if (cert.credentialId) profile += `    ID: ${cert.credentialId}\n`;
      }
    });
  }
  
  if (publications.length > 0) {
    profile += `\n===== PUBLICATIONS =====\n`;
    publications.forEach((pub, i) => {
      if (typeof pub === 'string') {
        profile += `${i + 1}. ${pub}\n`;
      } else {
        profile += `${i + 1}. ${pub.title || 'Publication'}\n`;
        if (pub.authors) profile += `    Authors: ${pub.authors}\n`;
        if (pub.journal || pub.venue) profile += `    Published in: ${pub.journal || pub.venue}\n`;
        if (pub.year) profile += `    Year: ${pub.year}\n`;
        if (pub.link) profile += `    DOI/Link: ${pub.link}\n`;
      }
    });
  }
  
  return profile;
}

function getTemperatureForCVType(cvType, seed) {
  // Lower temperatures for more consistent, reliable output
  const baseTemperatures = {
    modern: 0.7,       // Balanced - consistent but creative
    europass: 0.2,     // Very low - must follow standard format
    scopus: 0.3,       // Low - academic standards
    creative: 0.85,    // Higher for artistic designs
    executive: 0.75    // Moderate for professional variations
  };
  
  const baseTemp = baseTemperatures[cvType] || 0.65;
  
  // Minimal variation for consistency
  const variation = ((seed % 50) / 2000); // Range: 0 to +0.025
  
  return Math.min(0.95, Math.max(0.1, baseTemp + variation));
}

// ============================================================
// ðŸ”„ GENERATE VARIATIONS
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
          console.log(`[CV Variations] âœ… Variation ${i + 1}/${count} complete (${cv.length} chars)`);
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
      console.log(`[CV Variations] âœ… Generated ${variations.length}/${count} variations successfully`);
    }

    return variations;
    
  } catch (error) {
    console.error("[CV Variations Error]:", error);
    throw error;
  }
}

// ============================================================
// ðŸ“Š UTILITY FUNCTIONS
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

