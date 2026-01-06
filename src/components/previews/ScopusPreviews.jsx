'use client';

const SCOPUS_COUNT = 10;

const scopusTemplateNames = [
  'Academic Classic',
  'Research Modern',
  'Scopus Professional',
  'Scholar Elegant',
  'PhD Format',
  'Professor Style',
  'Research Fellow',
  'Academic Minimal',
  'University Standard',
  'Publication Focus'
];

const ScopusPreviews = ({ selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: SCOPUS_COUNT }, (_, i) => {
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
            {/* Scopus/Academic Preview */}
            <div className="bg-white aspect-[210/297] relative overflow-hidden p-4">
              <div style={{ fontSize: '3.5px', lineHeight: '1.4', fontFamily: 'Georgia, serif' }}>
                {/* Header - Centered Academic Style */}
                <div className="text-center mb-3 pb-2 border-b-2 border-gray-800">
                  <div style={{ fontSize: '7px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Dr. Researcher Name
                  </div>
                  <div style={{ fontSize: '4px', fontStyle: 'italic', marginTop: '1px' }}>
                    Professor of Computer Science
                  </div>
                  <div style={{ fontSize: '3px', marginTop: '1px', color: '#666' }}>
                    email@university.edu | ORCID: 0000-0000-0000-0000
                  </div>
                </div>

                {/* Research Interests */}
                <div className="mb-3">
                  <div style={{ 
                    fontSize: '4.5px', 
                    fontWeight: 'bold', 
                    color: '#1e40af',
                    borderBottom: '1px solid #1e40af',
                    paddingBottom: '1px',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Research Interests
                  </div>
                  <div style={{ fontSize: '3.5px' }}>
                    Artificial Intelligence, Machine Learning, Data Science, Computer Vision
                  </div>
                </div>

                {/* Publications */}
                <div className="mb-3">
                  <div style={{ 
                    fontSize: '4.5px', 
                    fontWeight: 'bold', 
                    color: '#1e40af',
                    borderBottom: '1px solid #1e40af',
                    paddingBottom: '1px',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Selected Publications
                  </div>
                  <div style={{ fontSize: '3px', lineHeight: '1.5', marginBottom: '1.5px' }}>
                    [1] <strong>Author, A.</strong> "Research Paper Title." <em>Journal Name</em>, vol. 10, 2023. DOI: 10.1234/example
                  </div>
                  <div style={{ fontSize: '3px', lineHeight: '1.5', marginBottom: '1.5px' }}>
                    [2] <strong>Author, A.</strong> et al. "Another Research Paper." <em>Conference Proceedings</em>, 2022.
                  </div>
                </div>

                {/* Education */}
                <div className="mb-3">
                  <div style={{ 
                    fontSize: '4.5px', 
                    fontWeight: 'bold', 
                    color: '#1e40af',
                    borderBottom: '1px solid #1e40af',
                    paddingBottom: '1px',
                    marginBottom: '2px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Academic Qualifications
                  </div>
                  <div style={{ fontSize: '3.5px', marginBottom: '1.5px' }}>
                    <div style={{ fontWeight: 'bold' }}>Ph.D. in Computer Science</div>
                    <div style={{ fontStyle: 'italic' }}>University Name, 2019</div>
                  </div>
                </div>

                {/* Research Metrics */}
                <div className="bg-blue-50 p-2 rounded">
                  <div style={{ fontSize: '3.5px', display: 'flex', gap: '4px', justifyContent: 'space-around' }}>
                    <div className="text-center">
                      <div style={{ fontWeight: 'bold', color: '#1e40af' }}>15</div>
                      <div style={{ fontSize: '2.5px' }}>Publications</div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontWeight: 'bold', color: '#1e40af' }}>250+</div>
                      <div style={{ fontSize: '2.5px' }}>Citations</div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontWeight: 'bold', color: '#1e40af' }}>12</div>
                      <div style={{ fontSize: '2.5px' }}>h-index</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Label */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/60 to-transparent p-2">
              <div className="text-white text-xs font-semibold">
                #{templateNum}: {scopusTemplateNames[i]}
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

export default ScopusPreviews;
