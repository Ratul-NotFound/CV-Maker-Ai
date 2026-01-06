/**
 * Universal Content Scaler for CV Templates
 * Ensures all data fits within A4 size (210mm × 297mm)
 * Automatically adjusts fonts, spacing, and layout based on content density
 */

export function calculateContentDensity(data) {
  const experienceCount = data.experience?.length || 0;
  const educationCount = data.education?.length || 0;
  const projectsCount = data.projects?.length || 0;
  const publicationsCount = data.publications?.length || 0;
  const certificationsCount = data.certifications?.length || 0;
  const skillsCount = (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.other?.length || 0);
  const languagesCount = data.languages?.length || 0;
  
  const totalEntries = experienceCount + educationCount + projectsCount + publicationsCount + certificationsCount;
  
  // Calculate total description length
  const totalDescriptionLength = [
    ...(data.experience || []),
    ...(data.projects || []),
    ...(data.publications || [])
  ].reduce((sum, item) => sum + ((item.description || item.abstract || '')?.length || 0), 0);
  
  // Content complexity score
  const contentScore = totalEntries + (skillsCount * 0.2) + (languagesCount * 0.3) + (totalDescriptionLength / 200);
  
  return {
    experienceCount,
    educationCount,
    projectsCount,
    publicationsCount,
    certificationsCount,
    skillsCount,
    languagesCount,
    totalEntries,
    totalDescriptionLength,
    contentScore,
    isHighDensity: contentScore > 6 || totalEntries > 4,
    isVeryHighDensity: contentScore > 10 || totalEntries > 6,
    isUltraHighDensity: contentScore > 14 || totalEntries > 8
  };
}

export function getScaledValues(density, baseValues = {}) {
  const {
    isHighDensity,
    isVeryHighDensity,
    isUltraHighDensity
  } = density;
  
  // Default base values - optimized for A4
  const defaults = {
    baseFontSize: '10pt',
    titleSize: '18pt',
    sectionTitleSize: '13pt',
    entryTitleSize: '11.5pt',
    lineHeight: '1.45',
    sectionSpacing: '16px',
    entrySpacing: '12px',
    headerPadding: '22px',
    mainPadding: '18px',
    sidebarPadding: '18px',
    photoSize: '130px',
    ...baseValues
  };
  
  // Aggressive scaling for different density levels
  if (isUltraHighDensity) {
    return {
      baseFontSize: '8pt',
      titleSize: '14pt',
      sectionTitleSize: '10pt',
      entryTitleSize: '9pt',
      lineHeight: '1.25',
      sectionSpacing: '5px',
      entrySpacing: '3px',
      headerPadding: '8px',
      mainPadding: '8px',
      sidebarPadding: '8px',
      photoSize: '100px',
      sectionTitleMargin: '4px',
      entryMarginTop: '2px',
      descriptionMaxLines: 3
    };
  }
  
  if (isVeryHighDensity) {
    return {
      baseFontSize: '8.5pt',
      titleSize: '15pt',
      sectionTitleSize: '10.5pt',
      entryTitleSize: '9.5pt',
      lineHeight: '1.3',
      sectionSpacing: '6px',
      entrySpacing: '4px',
      headerPadding: '10px',
      mainPadding: '10px',
      sidebarPadding: '10px',
      photoSize: '110px',
      sectionTitleMargin: '5px',
      entryMarginTop: '2px',
      descriptionMaxLines: 4
    };
  }
  
  if (isHighDensity) {
    return {
      baseFontSize: '9pt',
      titleSize: '16pt',
      sectionTitleSize: '11pt',
      entryTitleSize: '10pt',
      lineHeight: '1.35',
      sectionSpacing: '8px',
      entrySpacing: '6px',
      headerPadding: '12px',
      mainPadding: '12px',
      sidebarPadding: '12px',
      photoSize: '120px',
      sectionTitleMargin: '6px',
      entryMarginTop: '3px',
      descriptionMaxLines: 5
    };
  }
  
  // Normal density - use defaults - optimized for professional A4 fit
  return {
    baseFontSize: defaults.baseFontSize,
    titleSize: defaults.titleSize,
    sectionTitleSize: defaults.sectionTitleSize,
    entryTitleSize: defaults.entryTitleSize,
    lineHeight: defaults.lineHeight,
    sectionSpacing: defaults.sectionSpacing,
    entrySpacing: defaults.entrySpacing,
    headerPadding: defaults.headerPadding,
    mainPadding: defaults.mainPadding,
    sidebarPadding: defaults.sidebarPadding,
    photoSize: defaults.photoSize,
    sectionTitleMargin: '10px',
    entryMarginTop: '5px',
    descriptionMaxLines: 0 // No limit
  };
}

export function getA4PageStyle(density) {
  const { isUltraHighDensity, isVeryHighDensity, isHighDensity } = density;
  
  return `
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      page-break-after: always;
      position: relative;
    }
    
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      .page {
        width: 210mm !important;
        height: 297mm !important;
        overflow: hidden !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }
  `;
}
