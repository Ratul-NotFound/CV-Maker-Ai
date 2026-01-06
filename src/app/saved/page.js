'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import { FileText, Download, Eye, Trash2, Calendar, Database, Search, Loader2 } from 'lucide-react';

export default function SavedPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [savedCVs, setSavedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [deletingId, setDeletingId] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [previewHtmls, setPreviewHtmls] = useState({});
  const [previewLoading, setPreviewLoading] = useState({});
  const [previewErrors, setPreviewErrors] = useState({});
  const cardRefs = useRef({});
  const loadPreviewRef = useRef(() => {});

  const fetchCVs = useCallback(async (cursor = null, append = false) => {
    if (!user) return;
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setStatus({ type: '', message: '' });
      const idToken = await user.getIdToken();
      const qs = new URLSearchParams({ userId: user.uid, limit: '10' });
      if (cursor) qs.append('cursor', cursor);
      const response = await fetch(`/api/cv/saved?${qs.toString()}` , {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const cvs = data.cvs || [];
        setSavedCVs(prev => append ? [...prev, ...cvs] : cvs);
        setNextCursor(data.nextCursor || null);
        if (!append) setStatus({ type: 'success', message: data.indexFallback ? 'Loaded without index (create index for faster loads)' : 'Saved CVs loaded' });
      } else {
        if (!append) setSavedCVs([]);
        setStatus({ type: 'error', message: data.error || 'Failed to load CVs' });
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      if (!append) setSavedCVs([]);
      setStatus({ type: 'error', message: 'Network error while loading CVs' });
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  // Load CVs when user is authenticated
  useEffect(() => {
    if (authLoading || userData === null) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Check Pro status
    if (!userData?.isPro) {
      router.push('/pricing');
      return;
    }

    fetchCVs();
  }, [user, userData, authLoading, router, fetchCVs]);

  // Filter CVs based on search and filter
  const filteredCVs = savedCVs.filter(cv => {
    const title = (cv.title || '').toLowerCase();
    const industry = (cv.industry || '').toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase()) ||
                         industry.includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && new Date(cv.createdAt) > sevenDaysAgo;
    }
    return matchesSearch && cv.template === filter;
  });

  // Lazy-load lightweight previews when cards enter the viewport
  const handleLoadPreview = useCallback(async (cvId) => {
    if (!user || !cvId || previewHtmls[cvId] || previewLoading[cvId]) return;

    setPreviewErrors(prev => {
      const next = { ...prev };
      delete next[cvId];
      return next;
    });
    setPreviewLoading(prev => ({ ...prev, [cvId]: true }));

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/cv/view?cvId=${cvId}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await response.json();

      if (data.success && data.cv?.htmlContent) {
        setPreviewHtmls(prev => ({ ...prev, [cvId]: data.cv.htmlContent }));
      } else {
        setPreviewErrors(prev => ({ ...prev, [cvId]: data.error || 'Preview unavailable' }));
      }
    } catch (error) {
      console.error('Error loading preview:', error);
      setPreviewErrors(prev => ({ ...prev, [cvId]: 'Network error loading preview' }));
    } finally {
      setPreviewLoading(prev => {
        const next = { ...prev };
        delete next[cvId];
        return next;
      });
    }
  }, [user, previewHtmls, previewLoading]);

  // Keep ref to latest loader for IntersectionObserver
  useEffect(() => {
    loadPreviewRef.current = handleLoadPreview;
  }, [handleLoadPreview]);

  useEffect(() => {
    if (!savedCVs.length || !user) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cvId = entry.target?.dataset?.cvId;
          if (cvId) {
            loadPreviewRef.current(cvId);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.1 });

    savedCVs.forEach(cv => {
      const node = cardRefs.current[cv.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [savedCVs, user]);

  // Delete CV
  const handleDelete = async (cvId) => {
    if (confirm('Are you sure you want to delete this CV?')) {
      try {
        setDeletingId(cvId);
        const idToken = await user.getIdToken();
        const response = await fetch(`/api/cv/delete?cvId=${cvId}&userId=${user.uid}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${idToken}` }
        });
        
        const data = await response.json();
        if (data.success) {
          setSavedCVs(prev => prev.filter(cv => cv.id !== cvId));
          setStatus({ type: 'success', message: 'CV deleted successfully' });
        } else {
          setStatus({ type: 'error', message: data.error || 'Failed to delete CV' });
        }
      } catch (error) {
        console.error('Error deleting CV:', error);
        setStatus({ type: 'error', message: 'Network error while deleting CV' });
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Download CV (prefer PDF, fallback to HTML)
  const handleDownload = async (cvId, title) => {
    try {
      setStatus({ type: '', message: '' });
      const idToken = await user.getIdToken();
      const safeTitle = (title || 'CV').replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');

      // Try PDF first
      const pdfRes = await fetch(`/api/cv/download?cvId=${cvId}&format=pdf`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      const contentType = pdfRes.headers.get('content-type') || '';

      if (pdfRes.ok && contentType.includes('application/pdf')) {
        const blob = await pdfRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus({ type: 'success', message: 'PDF download started' });
        return;
      }

      // Fallback to HTML
      const htmlRes = await fetch(`/api/cv/download?cvId=${cvId}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const htmlData = await htmlRes.json();

      if (htmlData.success && htmlData.html) {
        const blob = new Blob([htmlData.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${safeTitle}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus({ type: 'success', message: 'PDF not available; downloaded HTML instead' });
      } else {
        setStatus({ type: 'error', message: htmlData.error || 'Error downloading CV' });
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      setStatus({ type: 'error', message: 'Network error while downloading CV' });
    }
  };

  // Show loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <NeuralNetworkBackground />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading your CVs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 md:pt-24 pb-8 px-3 sm:px-4 relative z-0">
      <NeuralNetworkBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            My Saved CVs
          </h1>
          <p className="text-white/60 text-sm font-medium">
            Access, download, and manage all your saved resumes
          </p>
          {status.message && (
            <div className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${status.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'}`}>
              {status.message}
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search CVs by title or industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="all">All CVs</option>
              <option value="recent">Last 7 days</option>
              <option value="modern">Modern</option>
              <option value="executive">Executive</option>
              <option value="creative">Creative</option>
              <option value="europass">Europass</option>
              <option value="scopus">Scopus</option>
            </select>
            
            <button
              onClick={() => router.push('/create-cv')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <FileText size={16} /> New CV
            </button>
          </div>
        </div>

        {/* CVs Grid */}
        {filteredCVs.length === 0 ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            <Database className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white/50 mb-2">No CVs found</h3>
            <p className="text-white/30 mb-6">
              {search || filter !== 'all' 
                ? 'Try changing your search or filter'
                : 'Create your first CV to get started'
              }
            </p>
            <button
              onClick={() => router.push('/create-cv')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold"
            >
              Create New CV
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCVs.map((cv) => (
              <div 
                key={cv.id}
                ref={(el) => {
                  if (el) {
                    cardRefs.current[cv.id] = el;
                  } else {
                    delete cardRefs.current[cv.id];
                  }
                }}
                data-cv-id={cv.id}
                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                      {cv.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : ''}</span>
                      <span className="text-white/20">•</span>
                      <span className="capitalize">{cv.industry}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>

                <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10 bg-black/30 h-44">
                  {previewHtmls[cv.id] ? (
                    <iframe
                      title={`Thumbnail for ${cv.title}`}
                      srcDoc={previewHtmls[cv.id]}
                      sandbox="allow-same-origin"
                      className="pointer-events-none border-0"
                      style={{ width: '900px', height: '1200px', transform: 'scale(0.22)', transformOrigin: 'top left' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {previewLoading[cv.id] ? (
                        <div className="flex items-center gap-2 text-white/70 text-xs font-semibold">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading thumbnail...</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleLoadPreview(cv.id)}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Load thumbnail
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {previewErrors[cv.id] && (
                  <p className="-mt-3 mb-3 text-[11px] text-red-200">{previewErrors[cv.id]}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span className="font-medium text-white">{cv.downloadCount || 0}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-300 capitalize">
                    {cv.template}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(cv.id, cv.title)}
                    className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                  <button 
                    onClick={() => router.push(`/preview/${cv.id}`)}
                    className="flex-1 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      disabled={deletingId === cv.id}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${deletingId === cv.id ? 'bg-red-600/40 text-white/60 cursor-not-allowed' : 'bg-red-600/80 hover:bg-red-600 text-white'}`}
                    >
                      <Trash2 className="w-4 h-4" /> {deletingId === cv.id ? 'Deleting...' : ''}
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {nextCursor && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => fetchCVs(nextCursor, true)}
              disabled={loadingMore}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-60"
            >
              {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{loadingMore ? 'Loading...' : 'Load more'}</span>
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}