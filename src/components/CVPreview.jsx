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
      await document.fonts.ready;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV-${Date.now()}.pdf`);
    } catch (e) { alert('Download failed'); } 
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
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Your CV Preview</h2>
          <div className="flex gap-2">
             <button onClick={handlePrint} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg flex gap-2 items-center hover:bg-blue-500/30 transition-colors"><Printer size={16}/> Print</button>
             <button onClick={handleDownloadPDF} disabled={downloading} className="px-4 py-2 bg-white text-black rounded-lg flex gap-2 items-center hover:bg-gray-200 transition-colors">
                {downloading ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>} PDF
             </button>
          </div>
        </div>

        {/* PREVIEW CONTAINER */}
        <div className="bg-slate-800 p-4 rounded-xl overflow-auto custom-scrollbar">
            <div className="min-w-[210mm] w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl text-slate-900" ref={contentRef}>
                {/* Render HTML safely. 
                   The styling is now inside .cv-document class in the HTML string 
                   so it won't break when embedded here.
                */}
                <div dangerouslySetInnerHTML={{ __html: cvHtml }} />
            </div>
        </div>

      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `}</style>
    </div>
  );
}