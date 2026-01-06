'use client';

const CREATIVE_COUNT = 10;

const creativeTemplateNames = [
  'Bold & Vibrant',
  'Designer Portfolio',
  'Creative Minimal',
  'Artistic Expression',
  'Modern Creative',
  'Colorful Impact',
  'Creative Professional',
  'Design Studio',
  'Creative Genius',
  'Portfolio Showcase'
];

const CreativePreviews = ({ selectedTemplate, onSelectTemplate }) => {
  const creativeColors = [
    { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' },
    { primary: '#A8E6CF', secondary: '#FFD3B6', accent: '#FFAAA5' },
    { primary: '#667EEA', secondary: '#764BA2', accent: '#F093FB' },
    { primary: '#FA8BFF', secondary: '#2BD2FF', accent: '#2BFF88' },
    { primary: '#FF6B9D', secondary: '#C44569', accent: '#FFC312' },
    { primary: '#00D2FF', secondary: '#3A7BD5', accent: '#00F260' },
    { primary: '#F2994A', secondary: '#F2C94C', accent: '#56CCF2' },
    { primary: '#B721FF', secondary: '#21D4FD', accent: '#FD1D1D' },
    { primary: '#FF0099', secondary: '#493240', accent: '#00DBDE' },
    { primary: '#FC466B', secondary: '#3F5EFB', accent: '#6DD5FA' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: CREATIVE_COUNT }, (_, i) => {
        const templateNum = i + 1;
        const isSelected = selectedTemplate === templateNum;
        const colors = creativeColors[i % creativeColors.length];

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
            {/* Creative Preview */}
            <div className="bg-white aspect-[210/297] relative overflow-hidden">
              <div style={{ fontSize: '3.5px', lineHeight: '1.3' }}>
                {/* Gradient Header */}
                <div 
                  className="p-4"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative circles */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      top: '-10px',
                      right: '-5px'
                    }}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.15)',
                      bottom: '-5px',
                      left: '10px'
                    }}
                  />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>
                      Creative Name
                    </div>
                    <div style={{ fontSize: '4.5px', color: 'rgba(255,255,255,0.95)' }}>
                      Designer & Artist
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div style={{ display: 'flex', gap: '3px', padding: '4px' }}>
                  {/* Left Column - Sidebar */}
                  <div style={{ width: '35%' }}>
                    {/* Contact */}
                    <div className="mb-2">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          marginBottom: '1.5px',
                          paddingBottom: '1px',
                          borderBottom: `1.5px solid ${colors.primary}`
                        }}
                      >
                        CONTACT
                      </div>
                      <div style={{ fontSize: '2.5px', marginBottom: '0.5px' }}>
                        📧 hello@creative.com
                      </div>
                      <div style={{ fontSize: '2.5px', marginBottom: '0.5px' }}>
                        📱 +123-456-7890
                      </div>
                      <div style={{ fontSize: '2.5px' }}>
                        🌐 portfolio.com
                      </div>
                    </div>

                    {/* Skills with Progress Bars */}
                    <div className="mb-2">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.primary,
                          marginBottom: '1.5px',
                          paddingBottom: '1px',
                          borderBottom: `1.5px solid ${colors.primary}`
                        }}
                      >
                        SKILLS
                      </div>
                      {['Photoshop', 'Illustrator', 'Figma', 'Sketch'].map((skill, idx) => (
                        <div key={idx} style={{ marginBottom: '1.5px' }}>
                          <div style={{ fontSize: '2.5px', marginBottom: '0.5px' }}>{skill}</div>
                          <div style={{ height: '1.5px', background: '#e5e5e5', borderRadius: '1px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                height: '100%', 
                                width: `${90 - idx * 10}%`,
                                background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
                                borderRadius: '1px'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Main Content */}
                  <div style={{ flex: 1 }}>
                    {/* About */}
                    <div className="mb-2">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.secondary,
                          marginBottom: '1.5px'
                        }}
                      >
                        ABOUT ME
                      </div>
                      <div style={{ fontSize: '2.5px', lineHeight: '1.4' }}>
                        Passionate creative professional with expertise in design and visual communication.
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-2">
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.secondary,
                          marginBottom: '1.5px'
                        }}
                      >
                        EXPERIENCE
                      </div>
                      <div style={{ marginBottom: '2px' }}>
                        <div style={{ fontSize: '3px', fontWeight: 'bold', color: colors.primary }}>
                          Senior Designer
                        </div>
                        <div style={{ fontSize: '2.5px', fontStyle: 'italic' }}>
                          Creative Agency • 2020-Present
                        </div>
                        <div style={{ fontSize: '2.5px', marginTop: '0.5px' }}>
                          • Leading creative projects<br/>
                          • Brand identity development
                        </div>
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <div 
                        style={{ 
                          fontSize: '4px', 
                          fontWeight: 'bold',
                          color: colors.secondary,
                          marginBottom: '1.5px'
                        }}
                      >
                        FEATURED WORK
                      </div>
                      <div style={{ display: 'flex', gap: '1px' }}>
                        {[colors.primary, colors.secondary, colors.accent].map((color, idx) => (
                          <div 
                            key={idx}
                            style={{ 
                              width: '12px',
                              height: '12px',
                              background: color,
                              borderRadius: '1px'
                            }}
                          />
                        ))}
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
                #{templateNum}: {creativeTemplateNames[i]}
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

export default CreativePreviews;
