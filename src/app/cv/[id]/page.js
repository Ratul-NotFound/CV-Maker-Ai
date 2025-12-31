'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCVById, deleteSavedCV } from '@/lib/firestore';
import { Download, Printer, ArrowLeft, Crown, Calendar, FileText, Database, Trash2, Eye, Share2, Copy, Check } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';

export default function CVViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    if (params.id) {
      loadCV(params.id);
    }
  }, [params.id, user, authLoading, router]);

  const loadCV = async (cvId) => {
    setLoading(true);
    setError('');
    try {
      const cvData = await getCVById(cvId);
      
      if (!cvData) {
        setError('CV not found');
        return;
      }

      // Check ownership
      if (cvData.userId !== user?.uid) {
        setError('You do not have permission to view this CV');
        return;
      }

      setCV(cvData);
    } catch (error) {
      console.error('Error loading CV:', error);
      setError(error.message || 'Failed to load CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!cv || !cv.htmlContent) return;
    
    const blob = new Blob([cv.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cv.title.replace(/\s+/g, '_')}_CV.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    if (!cv || !cv.htmlContent) return;

    setDownloading(true);
    try {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${cv.title || 'CV'} - Download</title>
          <style>
            body { margin: 0; padding: 20px; background: white; }
            @media print {
              body { padding: 0; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>${cv.htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setDownloading(false);
      }, 500);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate PDF');
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      try {
        const { success } = await deleteSavedCV(cv.id, user.uid);
        if (success) {
          alert('CV deleted successfully');
          router.push('/saved');
        }
      } catch (error) {
        alert('Error deleting CV: ' + error.message);
      }
    }
  };

  const copyToClipboard = () => {
    if (!cv || !cv.htmlContent) return;
    
    navigator.clipboard.writeText(cv.htmlContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Copy failed:', err);
      });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">{authLoading ? 'Checking Access...' : 'Loading CV...'}</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!user) {
    return null;
  }

  if (error || !cv) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-red-900/20 rounded-2xl border border-red-500/30">
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-white/70 mb-6">{error || 'CV not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-ai-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-3 sm:px-4 relative z-0">
      <NeuralNetworkBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => router.push('/saved')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors active:scale-95 touch-manipulation w-fit"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Saved CVs</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">{cv.title}</h1>
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg text-white/60">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(cv.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="capitalize">{cv.template}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                  <Database className="w-3.5 h-3.5" />
                  <span className="capitalize">{cv.industry}</span>
                </div>
                {userData?.isPro && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Crown className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">PRO</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-all active:scale-95 touch-manipulation"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              
              <button
                onClick={handleDownloadHTML}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-green-500/10 text-green-400 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all active:scale-95 touch-manipulation"
              >
                <Download className="w-4 h-4" />
                <span>HTML</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 active:scale-95 touch-manipulation shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>{downloading ? 'Generating...' : 'PDF'}</span>
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95 touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span>CV Preview</span>
            </h2>
            <div className="text-xs sm:text-sm text-white/50">
              Scroll to view
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 sm:p-6 rounded-lg overflow-auto max-h-[calc(100vh-300px)] sm:max-h-[800px] custom-scrollbar">
            <div className="min-w-[280px] w-full max-w-[210mm] mx-auto bg-white shadow-2xl" style={{ aspectRatio: '210/297' }}>
              <div className="w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: cv.htmlContent }} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-white/50 mb-1">Original Size</div>
                <div className="text-2xl font-bold text-white">
                  {(cv.originalSize / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-white/50 mb-1">Compressed Size</div>
                <div className="text-2xl font-bold text-white">
                  {(cv.compressedSize / 1024).toFixed(2)} KB
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-white/50 mb-1">Compression Ratio</div>
                <div className="text-2xl font-bold text-white">
                  {cv.compressedSize && cv.originalSize ? 
                    `${Math.round((cv.compressedSize / cv.originalSize) * 100)}%` : 
                    'N/A'
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm text-white/50 mb-1">Downloads</div>
                <div className="text-2xl font-bold text-white">
                  {cv.downloadCount || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/create-cv')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            >
              Create New CV
            </button>
            <button
              onClick={() => router.push('/saved')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            >
              View All Saved CVs
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
            >
              Delete This CV
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col gap-4 text-xs sm:text-sm text-white/30 font-medium">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>ID: <span className="font-mono text-white/70">{cv.id.substring(0, 8)}...</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5" />
                <span>Saved: <span className="text-green-400">
                  {((cv.originalSize - cv.compressedSize) / 1024).toFixed(2)} KB
                </span></span>
              </div>
            </div>
            <p className="text-center sm:text-left">© 2025 CV Maker AI | All rights reserved</p>
          </div>
        </footer>
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}