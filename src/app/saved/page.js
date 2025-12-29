'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { FileText, Download, Eye, Trash2, Calendar, Database, Search, Filter, ExternalLink, Clock } from 'lucide-react';

export default function SavedPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [savedCVs, setSavedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!userData?.isPro) {
      router.push('/dashboard');
      return;
    }

    loadSavedCVs();
  }, [user, userData]);

  const loadSavedCVs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cv/saved?userId=${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setSavedCVs(data.cvs || []);
      } else {
        console.error('Failed to load CVs:', data.error);
        setSavedCVs([]);
      }
    } catch (error) {
      console.error('Error loading saved CVs:', error);
      setSavedCVs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCVs = savedCVs.filter(cv => {
    const matchesSearch = cv.title.toLowerCase().includes(search.toLowerCase()) ||
                         cv.industry.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return matchesSearch && new Date(cv.createdAt) > sevenDaysAgo;
    }
    return matchesSearch && cv.template === filter;
  });

  const handleDelete = async (cvId) => {
    if (confirm('Are you sure you want to delete this CV?')) {
      try {
        const response = await fetch(`/api/cv/delete?cvId=${cvId}&userId=${user.uid}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Delete failed with status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setSavedCVs(prev => prev.filter(cv => cv.id !== cvId));
          alert('CV deleted successfully');
        } else {
          throw new Error(data.error || 'Failed to delete CV');
        }
      } catch (error) {
        console.error('Error deleting CV:', error);
        alert('Error deleting CV: ' + error.message);
      }
    }
  };

  const handleDownload = async (cvId, title) => {
    try {
      const response = await fetch(`/api/cv/download?cvId=${cvId}`);
      
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.html) {
        const blob = new Blob([data.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}_CV.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(data.error || 'No HTML content available');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Error downloading CV: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-mono text-sm tracking-wider">LOADING SAVED CVs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 pb-12 px-4 relative z-0">
      <NeuralNetworkBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            My Saved CVs
          </h1>
          <p className="text-white/60 text-sm font-medium">
            Access, download, and manage all your saved resumes
          </p>
        </div>

        {/* SEARCH AND FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">{savedCVs.length}</div>
            <div className="text-xs text-white/50">Total Saved</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {savedCVs.reduce((sum, cv) => sum + (cv.downloadCount || 0), 0)}
            </div>
            <div className="text-xs text-white/50">Total Downloads</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {savedCVs.length > 0 
                ? new Date(Math.max(...savedCVs.map(cv => new Date(cv.createdAt))))?.toLocaleDateString()
                : 'N/A'
              }
            </div>
            <div className="text-xs text-white/50">Last Created</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-white mb-1">
              {savedCVs.reduce((sum, cv) => sum + (cv.compressedSize || 0), 0) / 1024 > 1024
                ? `${(savedCVs.reduce((sum, cv) => sum + (cv.compressedSize || 0), 0) / 1024 / 1024).toFixed(2)} MB`
                : `${(savedCVs.reduce((sum, cv) => sum + (cv.compressedSize || 0), 0) / 1024).toFixed(1)} KB`
              }
            </div>
            <div className="text-xs text-white/50">Storage Used</div>
          </div>
        </div>

        {/* CVs LIST */}
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
                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                      {cv.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(cv.createdAt).toLocaleDateString()}</span>
                      <span className="text-white/20">•</span>
                      <span className="capitalize">{cv.industry}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-white/50 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span className="font-medium text-white">{cv.downloadCount || 0}</span>
                    </div>
                    <div className="text-xs text-white/40">
                      {cv.compressedSize && cv.originalSize 
                        ? `${Math.round((cv.compressedSize / cv.originalSize) * 100)}% smaller`
                        : 'Saved'
                      }
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
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-white/30 text-sm">
          <p>All CVs are stored securely in the cloud • Auto-sync enabled</p>
          <p className="mt-2">Need help? Contact support@cvmaker.com</p>
        </div>
      </div>
    </div>
  );
}