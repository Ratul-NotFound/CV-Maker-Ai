'use client';
import { useState, useRef, useEffect } from 'react';
import { Download, Printer, Copy, Check, Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CVPreview({ cvHtml, cvTitle }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [autoScale, setAutoScale] = useState(true);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scale based on screen size
  useEffect(() => {
    if (!autoScale || !containerRef.current) return;

    const updateScale = () => {
      const containerWidth = containerRef.current?.offsetWidth || 800;
      const a4WidthMm = 210;
      const mmToPx = 3.7795275591; // 1mm = 3.78px at 96 DPI
      const a4WidthPx = a4WidthMm * mmToPx;
      
      // Calculate scale to fit container
      const calculatedScale = Math.min((containerWidth - 48) / a4WidthPx, 1);
      setZoom(calculatedScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [autoScale]);

  const handleZoomIn = () => {
    setAutoScale(false);
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setAutoScale(false);
    setZoom(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleFitToScreen = () => {
    setAutoScale(true);
  };

  const handleDownloadPDF = async (cvTitle = 'CV') => {
    setDownloading(true);
    try {
      // Get the iframe element
      const iframe = iframeRef.current;
      if (!iframe) {
        throw new Error('CV content not available');
      }

      // Wait for iframe to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the body element from iframe
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Cannot access iframe content');
      }

      const element = iframeDoc.body;
      if (!element) {
        throw new Error('CV body not found');
      }
      
      console.log('Generating PDF from element:', element);
      
      // A4 dimensions: 210mm × 297mm at 96 DPI = 794 × 1123 pixels
      const canvas = await html2canvas(element, {
        scale: 2, // High quality for professional output
        width: 794, // A4 width in pixels (210mm at 96 DPI)
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
        imageTimeout: 0,
        removeContainer: true,
        allowTaint: true,
        windowWidth: 794
      });

      console.log('Canvas created, size:', canvas.width, 'x', canvas.height);

      // Use high quality PNG for professional CVs
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      // Add image to fit exactly on A4 page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // Clean filename from CV title
      const cleanTitle = cvTitle.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
      pdf.save(`${cleanTitle || 'CV'}.pdf`);
      
      console.log('PDF saved successfully');
    } catch (e) { 
      console.error('Download failed:', e);
      alert('Download failed: ' + e.message); 
    } 
    finally { setDownloading(false); }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - Print</title>
        <style>
          @page { size: A4; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
          }
          @media print {
            html, body { width: 210mm; height: 297mm; }
          }
        </style>
      </head>
      <body>${cvHtml}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { 
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
    }, 500);
  };

  return (
    <div className="w-full mx-auto px-0 sm:px-2 lg:px-4 mt-4 sm:mt-6">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-none sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border-0 sm:border border-white/10 shadow-2xl">
        
        {/* Header with controls */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Your CV Preview</h2>
            <div className="flex gap-2 w-full sm:w-auto">
               <button 
                 onClick={handlePrint} 
                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-500/20 text-blue-300 rounded-lg flex gap-2 items-center justify-center hover:bg-blue-500/30 transition-colors active:scale-95 touch-manipulation"
               >
                 <Printer size={16} className="sm:w-[18px] sm:h-[18px]"/>
                 <span className="hidden sm:inline">Print</span>
               </button>
               <button 
                 onClick={() => handleDownloadPDF(cvTitle)} 
                 disabled={downloading} 
                 className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex gap-2 items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 active:scale-95 shadow-lg touch-manipulation"
               >
                  {downloading ? <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin"/> : <Download size={16} className="sm:w-[18px] sm:h-[18px]"/>}
                  <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
               </button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
            <span className="text-xs text-white/60 mr-2">Zoom:</span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} className="text-white" />
            </button>
            <span className="text-sm text-white font-mono min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} className="text-white" />
            </button>
            <button
              onClick={handleFitToScreen}
              className={`p-1.5 rounded transition-colors ml-2 ${
                autoScale ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Fit to Screen"
            >
              <Maximize2 size={16} />
            </button>
            <span className="text-xs text-white/40 ml-auto hidden sm:inline">
              {autoScale ? 'Auto-fit enabled' : 'Manual zoom'}
            </span>
          </div>
        </div>

        {/* PREVIEW CONTAINER - Responsive with zoom */}
        <div 
          ref={containerRef}
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 sm:p-4 lg:p-6 rounded-lg overflow-auto max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-240px)] custom-scrollbar"
        >
            <div 
              className="mx-auto bg-white shadow-2xl transition-transform duration-300 ease-out" 
              style={{ 
                width: '210mm',
                minHeight: '297mm',
                margin: '0 auto',
                transform: `scale(${zoom})`,
                transformOrigin: 'top center'
              }} 
            >
                {/* Render HTML safely - A4 dimensions enforced with proper scaling */}
                <iframe
                  ref={iframeRef}
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        html, body {
                          width: 210mm;
                          min-height: 297mm;
                          margin: 0;
                          padding: 0;
                          background: white;
                          overflow-x: hidden;
                        }
                        @media print {
                          @page { size: A4; margin: 0; }
                          html, body { width: 210mm; height: 297mm; }
                        }
                      </style>
                    </head>
                    <body>${cvHtml}</body>
                    </html>
                  `}
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    border: 'none',
                    display: 'block',
                    backgroundColor: 'white'
                  }}
                  title="CV Preview"
                />
            </div>
        </div>

      </div>
      <style jsx global>{`
        .custom-scrollbar {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .custom-scrollbar::-webkit-scrollbar { 
          width: 10px; 
          height: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: rgba(15,23,42,0.5); 
          border-radius: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(180deg, rgba(59,130,246,0.6), rgba(37,99,235,0.6)); 
          border-radius: 5px;
          border: 2px solid rgba(15,23,42,0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(180deg, rgba(59,130,246,0.8), rgba(37,99,235,0.8)); 
        }
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}