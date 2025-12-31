'use client';
import { useState, useRef } from 'react';
import { Download, Printer, Copy, Check, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CVPreview({ cvHtml }) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = contentRef.current;
      
      // Use requestIdleCallback for non-blocking operation
      if ('requestIdleCallback' in window) {
        await new Promise(resolve => requestIdleCallback(resolve));
      }
      
      const canvas = await html2canvas(element, {
        scale: 1, // Further reduced for speed
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
        allowTaint: true, // Allow tainted canvas
        proxy: null // Disable proxy
      });

      // Use lower quality JPEG for faster compression
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Reduced from 0.85
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV-${Date.now()}.pdf`);
    } catch (e) { 
      console.error('Download failed:', e);
      alert('Download failed'); 
    } 
    finally { setDownloading(false); }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>CV</title></head>
      <body style="margin:0;padding:0;">${cvHtml}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 mt-4 sm:mt-6">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Your CV Preview</h2>
          <div className="flex gap-2 w-full sm:w-auto">
             <button 
               onClick={handlePrint} 
               className="flex-1 sm:flex-none px-4 py-2.5 text-sm bg-blue-500/20 text-blue-300 rounded-lg flex gap-2 items-center justify-center hover:bg-blue-500/30 transition-colors active:scale-95 touch-manipulation"
             >
               <Printer size={18}/>
               <span>Print</span>
             </button>
             <button 
               onClick={handleDownloadPDF} 
               disabled={downloading} 
               className="flex-1 sm:flex-none px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex gap-2 items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 active:scale-95 shadow-lg touch-manipulation"
             >
                {downloading ? <Loader2 size={18} className="animate-spin"/> : <Download size={18}/>}
                <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
             </button>
          </div>
        </div>

        {/* PREVIEW CONTAINER - Mobile Optimized */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 sm:p-6 rounded-lg sm:rounded-xl overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-180px)] custom-scrollbar">
            <div className="min-w-[280px] w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ aspectRatio: '210/297' }} ref={contentRef}>
                {/* Render HTML safely */}
                <div className="w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: cvHtml }} />
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