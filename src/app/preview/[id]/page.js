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
      const response = await fetch(`/api/cv/view?cvId=${cvId}`);
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

  const handleDownload = () => {
    if (!cvData) return;

    const blob = new Blob([cvData.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvData.title.replace(/\s+/g, '_')}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-16 sm:pt-20 pb-6 sm:pb-8 px-2 sm:px-4 relative z-0">
      <NeuralNetworkBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex-1">
            <button
              onClick={() => router.push('/saved')}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-3 transition-colors active:scale-95 touch-manipulation"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back to Saved CVs</span>
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1.5 leading-tight">
              {cvData.title}
            </h1>
            <p className="text-white/60 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/20 rounded text-blue-300 text-xs font-medium">
                  {cvData.template.charAt(0).toUpperCase() + cvData.template.slice(1)}
                </span>
                <span className="px-2 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs font-medium">
                  {cvData.industry.charAt(0).toUpperCase() + cvData.industry.slice(1)}
                </span>
              </span>
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto md:flex-shrink-0">
            {cvData.formData && (
              <button
                onClick={handleEdit}
                className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg text-sm touch-manipulation"
              >
                <Edit size={18} />
                <span>Edit CV</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg text-sm touch-manipulation"
            >
              <Download size={18} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Preview */}
        <CVPreview cvHtml={cvData.htmlContent} />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
