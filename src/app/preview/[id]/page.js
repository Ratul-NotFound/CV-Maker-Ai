'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { Download, Edit, ArrowLeft, Loader2 } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 pb-12 px-4 relative z-0">
      <NeuralNetworkBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/saved')}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Saved CVs
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              {cvData.title}
            </h1>
            <p className="text-white/60 text-sm">
              {cvData.template.charAt(0).toUpperCase() + cvData.template.slice(1)} Template • {cvData.industry.charAt(0).toUpperCase() + cvData.industry.slice(1)}
            </p>
          </div>

          <div className="flex gap-3">
            {cvData.formData && (
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Preview */}
        <CVPreview cvHtml={cvData.htmlContent} />
      </div>
    </div>
  );
}
