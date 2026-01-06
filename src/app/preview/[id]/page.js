'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { Download, Edit, ArrowLeft, Loader2 } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';

const CVPreview = dynamic(() => import('@/components/CVPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
    </div>
  ),
});

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cvId = params.id;

  const loadCV = async () => {
    try {
      setLoading(true);
      const idToken = user ? await user.getIdToken() : null;
      const response = await fetch(`/api/cv/view?cvId=${cvId}`, {
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {}
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to load CV');
        return;
      }

      setCvData(data.cv);
    } catch (err) {
      console.error('Error loading CV:', err);
      setError('Failed to load CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cvData) {
      alert('No CV data available');
      return;
    }

    // Download PDF if available
    if (cvData.pdfBase64) {
      try {
        const byteCharacters = atob(cvData.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanTitle = (cvData.title || 'CV').replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
        a.download = `${cleanTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('PDF download error:', error);
        alert('Failed to download PDF. Please try again.');
      }
    } else {
      alert('PDF not available in storage. Please use the "Download PDF" button in the preview below to generate a fresh PDF.');
    }
  };

  const handleEdit = async () => {
    if (!cvData || !cvData.formData) {
      alert('Cannot edit CV - form data not available');
      return;
    }

    // Store the CV data in sessionStorage so the form can load it
    sessionStorage.setItem(`editCV_${cvId}`, JSON.stringify({
      formData: cvData.formData,
      cvType: cvData.template,
      industry: cvData.industry,
      cvTitle: cvData.title,
      cvId: cvData.id
    }));

    // Navigate to create-cv with edit flag
    router.push(`/create-cv?edit=${cvId}`);
  };

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    loadCV();
  }, [user, authLoading, cvId, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <NeuralNetworkBackground />
        <div className="relative z-10 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70">Checking Access...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (error || !cvData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'CV not found'}</p>
          <button
            onClick={() => router.push('/saved')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold"
          >
            Back to Saved CVs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 md:pt-24 pb-8 px-3 sm:px-4 relative z-0">
      <NeuralNetworkBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex-1">
            <button
              onClick={() => router.push('/saved')}
              className="flex items-center gap-1.5 text-white/60 hover:text-white mb-2 transition-colors active:scale-95 touch-manipulation"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm">Back</span>
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1.5 leading-tight break-words">
              {cvData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 bg-blue-500/20 rounded text-blue-300 text-[10px] sm:text-xs font-medium">
                {cvData.template.charAt(0).toUpperCase() + cvData.template.slice(1)}
              </span>
              <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 text-[10px] sm:text-xs font-medium">
                {cvData.industry.charAt(0).toUpperCase() + cvData.industry.slice(1)}
              </span>
              <span className="px-2 py-0.5 bg-green-500/20 rounded text-green-300 text-[10px] sm:text-xs font-medium">
                📄 A4 Standard
              </span>
            </div>
          </div>

          {/* Action Buttons - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
            {cvData.formData && (
              <button
                onClick={handleEdit}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 shadow-lg text-xs sm:text-sm touch-manipulation"
              >
                <Edit size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                <span className="hidden xs:inline">Edit</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 shadow-lg text-xs sm:text-sm touch-manipulation"
              title="Download as PDF"
            >
              <Download size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
              <span className="hidden xs:inline sm:inline">Download PDF</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-4 p-2 sm:p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-[11px] sm:text-xs md:text-sm flex items-start sm:items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="leading-tight sm:leading-normal">CV displayed at A4 size (210mm × 297mm). Use zoom controls below to adjust view.</span>
          </p>
        </div>

        {/* Preview */}
        <CVPreview cvHtml={cvData.htmlContent} cvTitle={cvData.title} />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
