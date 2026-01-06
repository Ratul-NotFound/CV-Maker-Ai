'use client';

const EUROPASS_COUNT = 10;

const europassTemplateNames = [
  'Classic Europass Blue',
  'Modern Europass',
  'Europass Professional',
  'Europass Academic',
  'Europass Minimal',
  'Europass Elegant',
  'Europass Corporate',
  'Europass Creative',
  'Europass Executive',
  'Europass Standard'
];

const EuropassPreviews = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: EUROPASS_COUNT }, (_, i) => {
        const templateNum = i + 1;
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
            {/* Europass Preview */}
            <div className="bg-white aspect-[210/297] relative overflow-hidden p-4">
              <div style={{ fontSize: '4px', lineHeight: '1.3' }}>
                {/* EU Flag Colors Header */}
                <div className="flex items-center gap-2 mb-2 pb-1 border-b-2 border-blue-600">
                  <div className="w-6 h-4 bg-blue-600 flex items-center justify-center">
                    <div className="text-yellow-400 text-xs">★</div>
                  </div>
                  <div style={{ fontSize: '5px', fontWeight: 'bold', color: '#003399' }}>
                    Europass CV
                  </div>
                </div>

                {/* Personal Info */}
                <div className="mb-3">
                  <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#000' }}>
                    Name Surname
                  </div>
                  <div style={{ fontSize: '3.5px', color: '#666', marginTop: '1px' }}>
                    Address | Phone | Email
                  </div>
                </div>

                {/* Work Experience */}
                <div className="mb-3">
                  <div style={{ 
                    fontSize: '4px', 
                    fontWeight: 'bold', 
                    color: '#003399',
                    borderBottom: '1px solid #003399',
                    paddingBottom: '1px',
                    marginBottom: '2px'
                  }}>
                    WORK EXPERIENCE
                  </div>
                  <div style={{ fontSize: '3px', marginBottom: '2px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <div style={{ width: '20%', color: '#666' }}>2020-Present</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>Job Title</div>
                        <div style={{ fontStyle: 'italic' }}>Company Name</div>
                        <div>Main activities and responsibilities</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-3">
                  <div style={{ 
                    fontSize: '4px', 
                    fontWeight: 'bold', 
                    color: '#003399',
                    borderBottom: '1px solid #003399',
                    paddingBottom: '1px',
                    marginBottom: '2px'
                  }}>
                    EDUCATION AND TRAINING
                  </div>
                  <div style={{ fontSize: '3px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <div style={{ width: '20%', color: '#666' }}>2015-2019</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>Qualification</div>
                        <div style={{ fontStyle: 'italic' }}>Institution</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div style={{ 
                    fontSize: '4px', 
                    fontWeight: 'bold', 
                    color: '#003399',
                    borderBottom: '1px solid #003399',
                    paddingBottom: '1px',
                    marginBottom: '2px'
                  }}>
                    PERSONAL SKILLS
                  </div>
                  <div style={{ fontSize: '3px' }}>
                    <div><strong>Mother tongue:</strong> English</div>
                    <div><strong>Other languages:</strong> Spanish, French</div>
                    <div><strong>Digital skills:</strong> MS Office, Programming</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 via-blue-900/60 to-transparent p-2">
              <div className="text-white text-xs font-semibold">
                #{templateNum}: {europassTemplateNames[i]}
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

export default EuropassPreviews;
