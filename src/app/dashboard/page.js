'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, FileText, User, Crown, Sparkles, Eye, Download, Calendar, Trash2, ExternalLink, BarChart3, Database, Shield, RefreshCw, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import PricingModal from '@/components/PricingModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { deleteSavedCV, getCVById } from '@/lib/firestore';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

function DashboardContent() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [savedCVs, setSavedCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [actualCVCount, setActualCVCount] = useState(0);
  const [publicStats, setPublicStats] = useState({
    totalUsers: 0,
    proUsers: 0,
    totalGenerations: 0
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [previewHtmls, setPreviewHtmls] = useState({});
  const [previewLoading, setPreviewLoading] = useState({});
  const [previewErrors, setPreviewErrors] = useState({});

  // Cache duration: 10 minutes
  const CACHE_DURATION = 10 * 60 * 1000;

  // Load cached data on mount
  useEffect(() => {
    try {
      const cachedCVs = localStorage.getItem('dashboard_cvs');
          const cachedStats = localStorage.getItem('dashboard_stats');
          const cachedTime = localStorage.getItem('dashboard_cache_time');
          const cachedCount = localStorage.getItem('dashboard_cvs_count');
      
      if (cachedCVs && cachedStats && cachedTime) {
        const cacheAge = Date.now() - parseInt(cachedTime);
          if (cacheAge < CACHE_DURATION) {
          // Use cached data if still valid
          const cvs = JSON.parse(cachedCVs);
          const stats = JSON.parse(cachedStats);
          setSavedCVs(cvs);
            setActualCVCount(cachedCount ? parseInt(cachedCount) : cvs.length);
          setPublicStats(stats);
          setLastFetchTime(parseInt(cachedTime));
          console.log('💾 Loaded from cache (age:', Math.round(cacheAge / 1000), 'seconds)');
        }
      }
    } catch (error) {
      console.error('Cache load error:', error);
    }
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || loading || userData === null) return;

    // Only fetch CVs once auth + userData are ready
    loadSavedCVs();

    // Stats can still respect cache
    const cacheAge = Date.now() - lastFetchTime;
    const shouldFetchStats = cacheAge > CACHE_DURATION || lastFetchTime === 0;
    if (shouldFetchStats) {
      console.log('🔄 Fetching fresh public stats...');
      loadPublicStats();
    } else {
      console.log('✅ Using cached stats (age:', Math.round(cacheAge / 1000), 'seconds)');
      setStatsLoading(false);
    }
  }, [user, userData, loading]);

  const loadSavedCVs = async (retryCount = 0) => {
    if (!user) return;
    
    setLoadingCVs(true);
    try {
      // Use API endpoint instead of client-side query for better performance
      if (userData?.isPro === true) {
        // Fetch the CVs (no sync to reduce reads)
        const idToken = await user.getIdToken();
        const response = await fetch(`/api/cv/saved?userId=${user.uid}&limit=10&includeCount=1`, {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${idToken}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Saved CVs API response:', data);
          
          if (data.success) {
            const cvList = data.cvs || [];
            let count = typeof data.totalCount === 'number' ? data.totalCount : cvList.length;

            // If count wasn't provided, do a follow-up count sync to ensure accuracy
            if (typeof data.totalCount !== 'number') {
              try {
                const countRes = await fetch(`/api/cv/saved?userId=${user.uid}`, {
                  method: 'PUT',
                  headers: { Authorization: `Bearer ${idToken}` }
                });
                if (countRes.ok) {
                  const countData = await countRes.json();
                  if (countData.success && typeof countData.count === 'number') {
                    count = countData.count;
                  }
                }
              } catch (countErr) {
                console.warn('Count sync failed, using page length:', countErr);
              }
            }

            setSavedCVs(cvList);
            setActualCVCount(count);
            
            // Cache the data in localStorage
            try {
              localStorage.setItem('dashboard_cvs', JSON.stringify(cvList));
              const now = Date.now();
              setLastFetchTime(now);
              localStorage.setItem('dashboard_cache_time', now.toString());
              localStorage.setItem('dashboard_cvs_count', count.toString());
            } catch (cacheError) {
              console.warn('Failed to cache CVs:', cacheError);
            }
            
            console.log(`✅ Loaded ${cvList.length} saved CVs`);
            return;
          } else {
            console.error('API returned success=false:', data.error);
          }
        } else {
          console.error('API request failed:', response.status, response.statusText);
        }
      } else {
        console.log('User is not Pro, skipping CV load');
      }
      
      // Fallback to empty if not pro or request failed
      if (userData && userData.isPro === false) {
        setSavedCVs([]);
        setActualCVCount(0);
      }
    } catch (error) {
      console.error('Error loading saved CVs:', error);
      
      // Retry once on failure
      if (retryCount < 1) {
        console.log('Retrying loadSavedCVs...');
        setTimeout(() => loadSavedCVs(retryCount + 1), 1000);
        return;
      }
      
      setSavedCVs([]);
      setActualCVCount(0);
    } finally {
      setLoadingCVs(false);
    }
  };

  const loadPublicStats = async (forceFresh = false) => {
    setStatsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch(`/api/stats/public${forceFresh ? '?fresh=1' : ''}`, {
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        const stats = {
          totalUsers: data.totalUsers || 0,
          proUsers: data.proUsers || 0,
          totalGenerations: data.totalGenerations || 0
        };
        
        setPublicStats(stats);
        
        // Cache stats in localStorage
        try {
          localStorage.setItem('dashboard_stats', JSON.stringify(stats));
        } catch (cacheError) {
          console.warn('Failed to cache stats:', cacheError);
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading public stats:', error);
      }
      // Keep existing stats on error
    } finally {
      setStatsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  // Force refresh - clears cache and refetches
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing data...');
    localStorage.removeItem('dashboard_cvs');
    localStorage.removeItem('dashboard_stats');
    localStorage.removeItem('dashboard_cache_time');
    localStorage.removeItem('dashboard_cvs_count');
    setLastFetchTime(0);
    await Promise.all([
      loadSavedCVs(),
      loadPublicStats(true)
    ]);
  };

  const loadPreview = async (cvId) => {
    if (!user || !userData?.isPro || !cvId || previewHtmls[cvId] || previewLoading[cvId]) return;

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
      console.error('Preview load failed:', error);
      setPreviewErrors(prev => ({ ...prev, [cvId]: 'Network error while loading preview' }));
    } finally {
      setPreviewLoading(prev => {
        const next = { ...prev };
        delete next[cvId];
        return next;
      });
    }
  };

  // Auto-load small previews for the first three saved CVs
  useEffect(() => {
    const topThree = savedCVs.slice(0, 3);
    topThree.forEach(cv => loadPreview(cv.id));
  }, [savedCVs]);

  const handleDeleteCV = async (cvId) => {
    if (confirm('Are you sure you want to delete this saved CV?')) {
      try {
        const result = await deleteSavedCV(cvId, user.uid);
        if (result.success) {
          setSavedCVs(prev => {
            const updated = prev.filter(cv => cv.id !== cvId);
            // Update localStorage cache with latest state
            localStorage.setItem('dashboard_cvs', JSON.stringify(updated));
            return updated;
          });
          setActualCVCount(prev => Math.max(0, prev - 1));
          
          alert('CV deleted successfully');
        } else {
          alert('Error deleting CV: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting CV: ' + error.message);
      }
    }
  };

  const handleDownloadCV = async (cvId) => {
    try {
      const cv = await getCVById(cvId);
      if (!cv) {
        alert('CV not found');
        return;
      }

      // Always download as PDF
      if (cv.pdfBase64) {
        const byteCharacters = atob(cv.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanTitle = (cv.title || 'CV').replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_');
        a.download = `${cleanTitle}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('PDF not available for this CV. Please regenerate it.');
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
          <p className="text-white/70 font-mono text-sm tracking-wider">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }
  
  if (!user) { 
    router.push('/login'); 
    return null; 
  }

  const stats = {
    totalCVs: actualCVCount,
    totalViews: savedCVs.reduce((sum, cv) => sum + (cv.downloadCount || 0), 0),
    totalDownloads: savedCVs.reduce((sum, cv) => sum + (cv.downloadCount || 0), 0),
    savedSize: savedCVs.reduce((sum, cv) => sum + (cv.originalSize || 0), 0),
    compressedSize: savedCVs.reduce((sum, cv) => sum + (cv.compressedSize || 0), 0)
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 md:pt-24 pb-12 px-3 sm:px-4 relative z-0">
        <NeuralNetworkBackground />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* HEADER WITH USER INFO - Mobile Optimized */}
          <header className="mb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white truncate">
                    Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{user.displayName?.split(' ')[0] || 'User'}</span>
                  </h1>
                  {userData?.isPro && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shrink-0">
                      <Crown size={10} /> PRO
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-xs md:text-sm">
                  Professional CV Management
                </p>
              </div>
              
              <button 
                onClick={forceRefresh}
                disabled={statsLoading}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full border border-white/5 backdrop-blur-sm transition-all disabled:opacity-50 w-full md:w-auto justify-center md:justify-start"
              >
                <RefreshCw size={12} className={statsLoading ? 'animate-spin' : ''} />
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  {statsLoading ? 'Refreshing...' : 'Refresh Stats'}
                </span>
              </button>
            </div>

            {/* QUICK STATS BAR - Mobile Optimized (2x2 grid) */}
            <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4 md:gap-4">
              <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <span className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold">Personal</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-white">{actualCVCount}</div>
                <div className="text-[10px] md:text-xs text-white/50">Saved CVs</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                  <span className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold">Public</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-white">
                  {statsLoading ? (
                    <div className="w-4 h-4 md:w-6 md:h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    publicStats.totalGenerations.toLocaleString()
                  )}
                </div>
                <div className="text-[10px] md:text-xs text-white/50">CVs Generated</div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-green-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Database className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <span className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold">Storage</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-white">
                  {actualCVCount}
                </div>
                <div className="text-[10px] md:text-xs text-white/50">Total Saved</div>
              </div>
              
              <div 
                onClick={() => !userData?.isPro && setShowPricingModal(true)}
                className={`bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border ${userData?.isPro ? 'border-yellow-500/30' : 'border-white/10 hover:border-green-500/30'} transition-all cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Crown className={`w-4 h-4 md:w-5 md:h-5 ${userData?.isPro ? 'text-yellow-400' : 'text-white/40'}`} />
                  <span className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold">Plan</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-white">{userData?.isPro ? 'PRO' : 'FREE'}</div>
                <div className="text-[10px] md:text-xs text-white/50 flex items-center justify-between">
                  <span className="truncate">{userData?.isPro ? 'Unlimited' : 'Limited'}</span>
                  {!userData?.isPro && (
                    <span className="text-green-400 font-bold text-[9px] md:text-[10px] ml-1">↑</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* MAIN ACTION GRID - Mobile Optimized (stacked on mobile) */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4 mb-4">
            
            {/* CREATE NEW CV CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-blue-500/20 hover:border-blue-500/50 shadow-xl md:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                if (!userData?.isPro && (userData?.tokens || 0) <= 0) {
                  if (confirm('No tokens remaining. Upgrade to Pro for unlimited CV generation?')) {
                    setShowPricingModal(true);
                  }
                  return;
                }
                router.push('/create-cv');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl" />
              
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Create New CV</h3>
                <p className="text-white/50 mb-4 md:mb-6 leading-relaxed text-xs md:text-sm">
                  Generate a professional, ATS-friendly resume with Groq AI.
                </p>
                
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs md:text-sm font-bold text-white/90 flex items-center gap-1 md:gap-2 border-b border-white/20 pb-1 group-hover:border-blue-500 transition-colors uppercase tracking-wider">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      <Sparkles size={14} className="text-blue-400" />
                    </motion.div>
                    Start Creating 
                    <ChevronRight size={12} className="hidden md:inline" />
                  </span>
                  <div className={`text-[10px] md:text-xs ${userData?.isPro ? 'text-green-400' : userData?.tokens > 0 ? 'text-yellow-400' : 'text-red-400'} bg-black/30 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/5`}>
                    {userData?.isPro ? '∞ Tokens' : `${userData?.tokens || 0} left`}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UPGRADE / HISTORY CARD */}
            {userData?.isPro ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                onClick={() => router.push('/saved')}
              >
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
                        <Database className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Saved CVs</h3>
                      <p className="text-white/50 leading-relaxed text-xs md:text-sm mb-4">
                        Access and manage all your saved CVs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-white/50 flex items-center gap-2 group-hover:text-white transition-colors uppercase tracking-widest">
                      <Database size={10} className="md:hidden" /> <span className="hidden md:inline"><Database size={12} /> </span>{actualCVCount} Saved
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/saved');
                      }}
                      className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                    >
                      View All <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl border border-yellow-500/20 hover:border-yellow-500/50 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                onClick={() => setShowPricingModal(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-3xl" />
                
                <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Crown className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">Upgrade to Pro</h3>
                  <p className="text-white/50 mb-4 md:mb-6 leading-relaxed text-xs md:text-sm">
                    Unlimited CVs, priority support, advanced features.
                  </p>
                  
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs md:text-sm font-bold text-white/90 flex items-center gap-1 md:gap-2 border-b border-yellow-500/30 pb-1 group-hover:border-yellow-500 transition-colors uppercase tracking-wider">
                      Unlock Features <ChevronRight size={12} className="hidden md:inline" />
                    </span>
                    <div className="text-[10px] md:text-xs text-white bg-yellow-600 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-bold">
                      50 BDT
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* SAVED CVS SECTION - FOR PRO USERS */}
          {userData?.isPro && savedCVs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  Recent CVs
                </h2>
                <button 
                  onClick={() => router.push('/saved')}
                  className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                >
                  View All <ChevronRight size={12} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {savedCVs.slice(0, 3).map((cv) => (
                  <div 
                    key={cv.id}
                    className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-green-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm md:text-base group-hover:text-green-400 transition-colors mb-1 md:mb-2 truncate">{cv.title}</h3>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-white/40 mb-2 md:mb-3">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">{new Date(cv.createdAt).toLocaleDateString()}</span>
                          <span className="text-white/20">•</span>
                          <span className="truncate">{cv.industry}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                      </div>
                    </div>

                    <div className="relative mb-3 rounded-lg overflow-hidden border border-white/10 bg-black/30 h-32">
                      {previewHtmls[cv.id] ? (
                        <iframe
                          title={`Preview of ${cv.title}`}
                          srcDoc={previewHtmls[cv.id]}
                          sandbox="allow-same-origin"
                          className="pointer-events-none border-0"
                          style={{ width: '900px', height: '1200px', transform: 'scale(0.18)', transformOrigin: 'top left' }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {previewLoading[cv.id] ? (
                            <div className="flex items-center gap-2 text-white/70 text-[11px] font-semibold">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Loading preview...</span>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                loadPreview(cv.id);
                              }}
                              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                              Load preview
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {previewErrors[cv.id] && (
                      <p className="-mt-2 mb-2 text-[11px] text-red-200">{previewErrors[cv.id]}</p>
                    )}
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-white/50 mb-3 md:mb-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span className="font-medium text-white text-xs">{cv.downloadCount || 0}</span>
                        </div>
                        <div className="text-xs text-white/40 hidden sm:inline">
                          {cv.compressedSize && cv.originalSize ? 
                            `${Math.round((cv.compressedSize / cv.originalSize) * 100)}% comp` : 
                            'Saved'
                          }
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs bg-green-500/20 text-green-300 truncate max-w-[80px]">
                        {cv.template}
                      </span>
                    </div>
                    
                    {/* Action Buttons - Stacked on mobile */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 md:gap-2 border-t border-white/10 pt-3 md:pt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCV(cv.id);
                        }}
                        className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" /> <span className="hidden sm:inline">Download</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/cv/${cv.id}`);
                        }}
                        className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> <span className="hidden sm:inline">View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCV(cv.id);
                        }}
                        className="px-2 py-1.5 md:px-3 md:py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {userData?.isPro && loadingCVs && (
            <div className="text-center py-6">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white/50 text-xs md:text-sm">Loading saved CVs...</p>
            </div>
          )}

          {/* PUBLIC STATS SECTION - Mobile Optimized */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-3 md:p-4 mb-4"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                Community Stats
                {statsLoading && (
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin ml-1 md:ml-2"></div>
                )}
              </h2>
              <div className="text-xs text-white/30">
                {lastUpdated ? `Updated: ${lastUpdated.split(':')[0]}:${lastUpdated.split(':')[1]}` : 'Just now'}
              </div>
            </div>
            
            {statsLoading ? (
              <div className="text-center py-4 md:py-8">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-white/50 text-xs md:text-sm">Loading stats...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-2 md:mb-4">
                  <div className="p-3 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-1 md:mb-2">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-white">
                        {publicStats.totalUsers.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs text-white/50">Users</div>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-1 md:mb-2">
                        <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-white">
                        {publicStats.proUsers.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs text-white/50">Pro Users</div>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-1 md:mb-2">
                        <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-white">
                        {publicStats.totalGenerations.toLocaleString()}
                      </div>
                      <div className="text-[10px] md:text-xs text-white/50">CVs Made</div>
                    </div>
                  </div>
                </div>
                
                {publicStats.totalUsers === 0 && publicStats.totalGenerations === 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-2 md:mt-4">
                    <p className="text-yellow-400 text-xs md:text-sm text-center">
                      No data found. Create your first CV!
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>

          {/* QUICK ACTIONS - Mobile Optimized (horizontal scroll on mobile) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-3 md:p-4 mb-4"
          >
            <h2 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">Quick Actions</h2>
            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-2 md:gap-3 pb-2 md:pb-0 scrollbar-hide">
              <button 
                onClick={() => {
                  if (!userData?.isPro && (userData?.tokens || 0) <= 0) {
                    if (confirm('No tokens remaining. Upgrade to Pro for unlimited CV generation?')) {
                      setShowPricingModal(true);
                    }
                    return;
                  }
                  router.push('/create-cv');
                }}
                className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Plus size={14} className="md:w-4 md:h-4" /> New CV
              </button>
              
              {userData?.isPro && (
                <button 
                  onClick={() => router.push('/saved')}
                  className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Database size={14} className="md:w-4 md:h-4" /> My CVs
                </button>
              )}
              
              {!userData?.isPro && (
                <button 
                  onClick={() => setShowPricingModal(true)}
                  className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Crown size={14} className="md:w-4 md:h-4" /> Upgrade
                </button>
              )}
              
              <button 
                onClick={() => router.push('/stats')}
                className="px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
              >
                <BarChart3 size={14} className="md:w-4 md:h-4" /> Stats
              </button>
            </div>
          </motion.div>
        </div>
        <div className="mt-10">
          <Footer />
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}