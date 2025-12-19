'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getCVById, deleteSavedCV } from '@/lib/firestore';
import { Download, Printer, ArrowLeft, Crown, Calendar, FileText, Database, Trash2, Eye, Share2, Copy, Check } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';

export default function CVViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userData } = useAuth();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadCV(params.id);
    }
  }, [params.id]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading CV...</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 pb-12 px-4 relative z-0">
      <NeuralNetworkBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex-1">
            <button
              onClick={() => router.push('/saved')}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Saved CVs
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">{cv.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(cv.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Template: {cv.template}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Industry: {cv.industry}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {userData?.isPro && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold">PRO SAVED</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-500/20 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
              
              <button
                onClick={handleDownloadHTML}
                className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-500/20 transition-colors"
              >
                <Download className="w-4 h-4" />
                HTML
              </button>
              
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                {downloading ? 'Generating...' : 'Print/PDF'}
              </button>
              
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="mb-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              CV Preview
            </h2>
            <div className="text-sm text-white/50">
              Scroll to view full CV
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl min-h-[800px] overflow-auto max-h-[800px]">
            <div dangerouslySetInnerHTML={{ __html: cv.htmlContent }} />
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
        <footer className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/30 font-medium">
            <div className="flex items-center gap-6 mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>CV ID: <span className="font-mono text-white/70">{cv.id.substring(0, 8)}...</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Space Saved: <span className="text-green-400">
                  {((cv.originalSize - cv.compressedSize) / 1024).toFixed(2)} KB
                </span></span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p>© 2025 CV Maker AI  |  All rights reserved  |  Developed by Mahmud Hasan Ratul</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}