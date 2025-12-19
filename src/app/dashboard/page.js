'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, FileText, User, Crown, Sparkles, Eye, Download, Calendar, Trash2, ExternalLink, BarChart3, Database, Shield, RefreshCw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import PricingModal from '@/components/PricingModal';
import { getUserSavedCVs, getCVById, deleteSavedCV } from '@/lib/firestore';

export default function Dashboard() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [savedCVs, setSavedCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [publicStats, setPublicStats] = useState({
    totalUsers: 0,
    proUsers: 0,
    totalGenerations: 0
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    if (user) {
      if (userData?.isPro) {
        loadSavedCVs();
      }
      loadPublicStats();
    }
  }, [user, userData]);

  const loadSavedCVs = async () => {
    if (!user) return;
    
    setLoadingCVs(true);
    try {
      const cvs = await getUserSavedCVs(user.uid);
      setSavedCVs(cvs);
    } catch (error) {
      console.error('Error loading saved CVs:', error);
    } finally {
      setLoadingCVs(false);
    }
  };

  const loadPublicStats = async () => {
    setStatsLoading(true);
    try {
      console.log('Fetching public stats...');
      const response = await fetch('/api/stats/public');
      if (response.ok) {
        const data = await response.json();
        console.log('Public stats data:', data);
        
        if (data.success) {
          setPublicStats({
            totalUsers: data.totalUsers || 0,
            proUsers: data.proUsers || 0,
            totalGenerations: data.totalGenerations || 0
          });
        } else {
          setPublicStats({
            totalUsers: data.totalUsers || 0,
            proUsers: data.proUsers || 0,
            totalGenerations: data.totalGenerations || 0
          });
        }
      } else {
        console.error('Failed to fetch stats:', response.status);
      }
    } catch (error) {
      console.error('Error loading public stats:', error);
    } finally {
      setStatsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

  const handleDeleteCV = async (cvId) => {
    if (confirm('Are you sure you want to delete this saved CV?')) {
      try {
        const result = await deleteSavedCV(cvId, user.uid);
        if (result.success) {
          setSavedCVs(prev => prev.filter(cv => cv.id !== cvId));
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
      if (cv && cv.htmlContent) {
        const blob = new Blob([cv.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cv.title.replace(/\s+/g, '_')}_CV.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
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
    totalCVs: savedCVs.length,
    totalViews: savedCVs.reduce((sum, cv) => sum + (cv.downloadCount || 0), 0),
    totalDownloads: savedCVs.reduce((sum, cv) => sum + (cv.downloadCount || 0), 0),
    savedSize: savedCVs.reduce((sum, cv) => sum + (cv.originalSize || 0), 0),
    compressedSize: savedCVs.reduce((sum, cv) => sum + (cv.compressedSize || 0), 0)
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-24 md:pt-32 pb-8 px-3 sm:px-4 relative z-0">
        <NeuralNetworkBackground />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* HEADER WITH USER INFO - Mobile Optimized */}
          <header className="mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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
                onClick={loadPublicStats}
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
            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4 md:gap-4">
              <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  <span className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold">Personal</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-white">{stats.totalCVs}</div>
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
                  {stats.compressedSize > 0 ? `${(stats.compressedSize / 1024).toFixed(1)}KB` : '0KB'}
                </div>
                <div className="text-[10px] md:text-xs text-white/50">Compressed Size</div>
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
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 mb-8">
            
            {/* CREATE NEW CV CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-3xl border border-blue-500/20 hover:border-blue-500/50 shadow-xl md:shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
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
                  Generate a professional, ATS-friendly resume with Gemini AI.
                </p>
                
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs md:text-sm font-bold text-white/90 flex items-center gap-1 md:gap-2 border-b border-white/20 pb-1 group-hover:border-blue-500 transition-colors uppercase tracking-wider">
                    <Sparkles size={10} className="md:hidden" /> <span className="hidden md:inline"><Sparkles size={12} /> </span>Start Creating <ChevronRight size={12} className="hidden md:inline" />
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
                className="group relative bg-black/40 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 hover:border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
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
                      <Database size={10} className="md:hidden" /> <span className="hidden md:inline"><Database size={12} /> </span>{savedCVs.length} Saved
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
                className="group relative bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-md p-5 md:p-8 rounded-2xl md:rounded-3xl border border-yellow-500/20 hover:border-yellow-500/50 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
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
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
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
            className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-4 md:p-6 mb-6"
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
            className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-4 md:p-6 mb-6"
          >
            <h2 className="text-base md:text-xl font-bold text-white mb-3 md:mb-4">Quick Actions</h2>
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

          {/* FOOTER */}
          <footer className="mt-8 pt-6 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-white/30 font-medium">
              <div className="flex items-center gap-4 mb-3 md:mb-0 flex-wrap justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Status: <span className="text-green-400">Online</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Storage: <span className="text-blue-400">Secure</span></span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-center md:text-left">
                <p className="text-xs md:text-sm">© 2024 CV Maker AI</p>
                <div className="flex items-center gap-3 md:gap-4">
                  <a href="#" className="hover:text-white transition-colors text-xs">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors text-xs">Terms</a>
                  <a href="#" className="hover:text-white transition-colors text-xs">Support</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}
    </>
  );
}