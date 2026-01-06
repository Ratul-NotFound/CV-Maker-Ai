'use client';

const EXECUTIVE_COUNT = 10;

const executiveTemplateNames = [
  'C-Suite Professional',
  'Executive Prestige',
  'VP Leadership',
  'Director Elite',
  'Executive Classic',
  'Premium Executive',
  'Corporate Leader',
  'Executive Modern',
  'Senior Executive',
  'CEO Excellence'
];

const ExecutivePreviews = ({ selectedTemplate, onSelectTemplate }) => {
  const executiveColors = [
    { primary: '#1a1a1a', secondary: '#b8860b', accent: '#f5f5f5' }, // Gold
    { primary: '#0f3e2c', secondary: '#7c5a2f', accent: '#ffffff' }, // Forest/Bronze
    { primary: '#1c2e4a', secondary: '#8c6d1f', accent: '#f7f6f3' }, // Navy/Brass
    { primary: '#2c3e50', secondary: '#c0a062', accent: '#ecf0f1' }, // Slate/Gold
    { primary: '#0b0d10', secondary: '#b45309', accent: '#ffffff' }, // Black/Amber
    { primary: '#1e3a5f', secondary: '#2C5F8D', accent: '#f8fafb' }, // Deep Blue
    { primary: '#1a202c', secondary: '#d97706', accent: '#ffffff' }, // Charcoal/Gold
    { primary: '#003366', secondary: '#b8860b', accent: '#fafafa' }, // Corporate Navy
    { primary: '#1f2937', secondary: '#8b5e34', accent: '#f5f5f5' }, // Gray/Brown
    { primary: '#0f172a', secondary: '#b45309', accent: '#ffffff' }  // Midnight/Amber
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: EXECUTIVE_COUNT }, (_, i) => {
        const templateNum = i + 1;
        const isSelected = selectedTemplate === templateNum;
        const colors = executiveColors[i % executiveColors.length];

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
            {/* Executive Preview */}
            <div className="bg-white aspect-[210/297] relative overflow-hidden">
              <div style={{ fontSize: '3.5px', lineHeight: '1.5', fontFamily: 'Georgia, serif' }}>
                {/* Premium Header with Gold Accent */}
                <div 
                  style={{ 
                    background: colors.primary,
                    color: '#ffffff',
                    padding: '6px 8px',
                    borderBottom: `2px solid ${colors.secondary}`
                  }}
                >
                  <div style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '2px' }}>
                    EXECUTIVE NAME
                  </div>
                  <div style={{ fontSize: '4px', color: colors.secondary, fontWeight: '600', marginBottom: '2px' }}>
                    Chief Executive Officer
                  </div>
                  <div style={{ fontSize: '3px', opacity: 0.9 }}>
                    executive@company.com | +1-555-0100 | LinkedIn: /in/executive
                  </div>
                </div>

                {/* Two Column Layout */}
                <div style={{ display: 'flex' }}>
                  {/* Sidebar - 30% */}
                  <div 
                    style={{ 
                      width: '30%',
                      background: colors.accent,
                      padding: '5px',
                      borderRight: `2px solid ${colors.secondary}`
                    }}
                  >
                    {/* Core Competencies */}
                    <div className="mb-3">
                      <div 
                        style={{ 
                          fontSize: '3.5px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          borderBottom: `1px solid ${colors.secondary}`,
                          paddingBottom: '1px',
                          marginBottom: '1.5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Expertise
                      </div>
                      <div style={{ fontSize: '2.5px', lineHeight: '1.6' }}>
                        • Strategic Leadership<br/>
                        • P&L Management<br/>
                        • M&A Integration<br/>
                        • Board Relations<br/>
                        • Global Operations<br/>
                        • Change Management
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mb-3">
                      <div 
                        style={{ 
                          fontSize: '3.5px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          borderBottom: `1px solid ${colors.secondary}`,
                          paddingBottom: '1px',
                          marginBottom: '1.5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Education
                      </div>
                      <div style={{ fontSize: '2.5px', lineHeight: '1.5' }}>
                        <div style={{ fontWeight: 'bold' }}>MBA</div>
                        <div>Harvard Business School</div>
                        <div style={{ marginTop: '1px', fontWeight: 'bold' }}>BA Economics</div>
                        <div>Yale University</div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div 
                        style={{ 
                          fontSize: '3.5px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          borderBottom: `1px solid ${colors.secondary}`,
                          paddingBottom: '1px',
                          marginBottom: '1.5px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Board Seats
                      </div>
                      <div style={{ fontSize: '2.5px' }}>
                        • Fortune 500 Board<br/>
                        • Advisory Board Member
                      </div>
                    </div>
                  </div>

                  {/* Main Content - 70% */}
                  <div style={{ flex: 1, padding: '5px 6px' }}>
                    {/* Executive Summary */}
                    <div className="mb-3">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          borderLeft: `3px solid ${colors.secondary}`,
                          paddingLeft: '3px',
                          marginBottom: '2px'
                        }}
                      >
                        EXECUTIVE PROFILE
                      </div>
                      <div style={{ fontSize: '2.8px', lineHeight: '1.5', textAlign: 'justify' }}>
                        Results-driven C-level executive with 20+ years transforming organizations through strategic vision and operational excellence. Proven track record of driving $500M+ revenue growth and leading successful M&A transactions.
                      </div>
                    </div>

                    {/* Professional Experience */}
                    <div className="mb-3">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          borderLeft: `3px solid ${colors.secondary}`,
                          paddingLeft: '3px',
                          marginBottom: '2px'
                        }}
                      >
                        EXECUTIVE LEADERSHIP
                      </div>
                      
                      {/* Position 1 */}
                      <div style={{ marginBottom: '2.5px', paddingBottom: '2px', borderBottom: '0.5px solid #e5e5e5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5px' }}>
                          <div style={{ fontSize: '3.5px', fontWeight: 'bold', color: colors.primary }}>
                            Chief Executive Officer
                          </div>
                          <div style={{ fontSize: '2.5px', color: '#666' }}>2018 - Present</div>
                        </div>
                        <div style={{ fontSize: '3px', fontStyle: 'italic', color: colors.secondary, marginBottom: '1px' }}>
                          Global Technology Corporation
                        </div>
                        <div style={{ fontSize: '2.5px', lineHeight: '1.5' }}>
                          • Led company transformation resulting in 300% revenue growth<br/>
                          • Spearheaded $2B acquisition strategy and integration<br/>
                          • Expanded global operations to 25 countries
                        </div>
                      </div>

                      {/* Position 2 */}
                      <div style={{ marginBottom: '2px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5px' }}>
                          <div style={{ fontSize: '3.5px', fontWeight: 'bold', color: colors.primary }}>
                            Chief Operating Officer
                          </div>
                          <div style={{ fontSize: '2.5px', color: '#666' }}>2012 - 2018</div>
                        </div>
                        <div style={{ fontSize: '3px', fontStyle: 'italic', color: colors.secondary, marginBottom: '1px' }}>
                          Fortune 500 Enterprise
                        </div>
                        <div style={{ fontSize: '2.5px', lineHeight: '1.5' }}>
                          • Optimized operations reducing costs by $100M annually<br/>
                          • Built high-performance teams across 5 continents
                        </div>
                      </div>
                    </div>

                    {/* Key Achievements Box */}
                    <div 
                      style={{ 
                        background: colors.accent,
                        border: `1px solid ${colors.secondary}`,
                        padding: '3px',
                        borderRadius: '1px'
                      }}
                    >
                      <div style={{ fontSize: '3px', fontWeight: 'bold', color: colors.primary, marginBottom: '1px' }}>
                        MEASURABLE IMPACT
                      </div>
                      <div style={{ fontSize: '2.5px', display: 'flex', gap: '3px', justifyContent: 'space-around' }}>
                        <div className="text-center">
                          <div style={{ fontSize: '4px', fontWeight: 'bold', color: colors.secondary }}>$500M+</div>
                          <div>Revenue Growth</div>
                        </div>
                        <div className="text-center">
                          <div style={{ fontSize: '4px', fontWeight: 'bold', color: colors.secondary }}>20+</div>
                          <div>Years Leadership</div>
                        </div>
                        <div className="text-center">
                          <div style={{ fontSize: '4px', fontWeight: 'bold', color: colors.secondary }}>5000+</div>
                          <div>Team Members</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Label */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-2"
              style={{ 
                background: `linear-gradient(to top, ${colors.primary}DD, ${colors.primary}99, transparent)`
              }}
            >
              <div className="text-white text-xs font-semibold">
                #{templateNum}: {executiveTemplateNames[i]}
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

export default ExecutivePreviews;
