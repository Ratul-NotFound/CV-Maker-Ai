'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Users, Crown, TrendingUp, Globe, Clock, BarChart3, Download, Activity, Zap, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';

export default function PublicStatsPage() {
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalUsers: 0,
    proUsers: 0,
    activeToday: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState([]);
  const [isSampleData, setIsSampleData] = useState(false);
  const [apiError, setApiError] = useState('');
  const [chartStartIndex, setChartStartIndex] = useState(0);

  const loadAllStats = useCallback(async (forceFresh = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      setLoading(true);
      setApiError('');
      setIsSampleData(false);

      const [statsRes, dailyRes] = await Promise.all([
        fetch(`/api/stats/public${forceFresh ? '?fresh=1' : ''}`, { cache: 'no-store', signal: controller.signal }),
        fetch('/api/stats/daily', { cache: 'no-store', signal: controller.signal })
      ]);

      if (!statsRes.ok) {
        throw new Error(`Stats API error ${statsRes.status}`);
      }

      const statsData = await statsRes.json();
      setStats({
        totalGenerations: statsData.totalGenerations || 0,
        totalUsers: statsData.totalUsers || 0,
        proUsers: statsData.proUsers || 0,
        activeToday: statsData.activeToday || 0,
        lastUpdated: statsData.lastUpdated || new Date().toISOString()
      });
      if (statsData.error) setIsSampleData(true);

      if (dailyRes.ok) {
        const dailyData = await dailyRes.json();
        setDailyStats(dailyData.dailyStats || []);
        if (dailyData.isSample) setIsSampleData(true);
      } else {
        throw new Error(`Daily stats error ${dailyRes.status}`);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setApiError(error.message);
      setStats({
        totalGenerations: 5890,
        totalUsers: 1250,
        proUsers: 342,
        activeToday: 45,
        lastUpdated: new Date().toISOString()
      });
      setDailyStats(generateSampleDailyStats());
      setIsSampleData(true);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllStats(false);
  }, [loadAllStats]);

  useEffect(() => {
    if (!dailyStats.length) {
      setChartStartIndex(0);
      return;
    }
    const maxStart = Math.max(dailyStats.length - 7, 0);
    setChartStartIndex(prev => Math.min(prev, maxStart));
  }, [dailyStats]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const generateSampleDailyStats = () => {
    const sampleStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      sampleStats.push({
        date: dateStr,
        generations: Math.floor(Math.random() * 50) + 20
      });
    }
    return sampleStats;
  };

  const handleChartScroll = (direction) => {
    if (direction === 'left' && chartStartIndex > 0) {
      setChartStartIndex(chartStartIndex - 1);
    } else if (direction === 'right' && chartStartIndex < dailyStats.length - 7) {
      setChartStartIndex(chartStartIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-white/70 text-sm md:text-base">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 md:pt-24 pb-8 px-3 sm:px-4 relative z-0">
      <NeuralNetworkBackground />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER - Mobile Optimized */}
        <header className="text-center mb-6 md:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl md:rounded-2xl mb-4 md:mb-6 shadow-lg shadow-purple-500/20">
            <BarChart3 className="w-7 h-7 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4">
            CV Maker AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Stats</span>
          </h1>
          <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto px-2">
            Real-time statistics of CVs generated by our growing community
          </p>
          <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2 md:gap-4">
            <button 
              onClick={() => loadAllStats(true)}
              disabled={loading}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {isSampleData && (
              <span className="px-2 py-1 md:px-3 md:py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                Sample Data
              </span>
            )}
            {apiError && (
              <span className="px-2 py-1 md:px-3 md:py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                API Error
              </span>
            )}
          </div>
        </header>

        {/* Main Stats Grid - 2x2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-12">
          <div className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg md:rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              </div>
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
            </div>
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
              {formatNumber(stats.totalGenerations)}
            </div>
            <div className="text-white/50 text-xs md:text-sm">CVs Generated</div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-blue-400">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                <span>Growing daily</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-green-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-lg md:rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              </div>
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
            </div>
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
              {formatNumber(stats.totalUsers)}
            </div>
            <div className="text-white/50 text-xs md:text-sm">Total Users</div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-green-400">
                <Activity className="w-3 h-3 md:w-4 md:h-4" />
                <span>{stats.activeToday} active today</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg md:rounded-xl flex items-center justify-center">
                <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              </div>
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
            </div>
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
              {formatNumber(stats.proUsers)}
            </div>
            <div className="text-white/50 text-xs md:text-sm">Pro Users</div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-yellow-400">
                <Crown className="w-3 h-3 md:w-4 md:h-4" />
                <span>Premium</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg md:rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              </div>
              <Download className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
            </div>
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
              {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
            </div>
            <div className="text-white/50 text-xs md:text-sm">Last Updated</div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10">
              <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-purple-400">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Stats Chart - Mobile Optimized */}
        {dailyStats.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/10 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                Daily Trend
              </h2>
              <div className="flex items-center gap-2">
                {isSampleData && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                    Sample
                  </span>
                )}
                <div className="flex items-center gap-1 md:hidden">
                  <button 
                    onClick={() => handleChartScroll('left')}
                    disabled={chartStartIndex === 0}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleChartScroll('right')}
                    disabled={chartStartIndex >= dailyStats.length - 7}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-end h-40 md:h-48 gap-1.5 md:gap-2 min-w-[400px] md:min-w-0">
                  {dailyStats.slice(chartStartIndex, chartStartIndex + 7).map((day, index) => {
                    const maxGenerations = Math.max(...dailyStats.slice(chartStartIndex, chartStartIndex + 7).map(d => d.generations));
                    const height = maxGenerations > 0 ? (day.generations / maxGenerations) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all hover:opacity-90"
                          style={{ height: `${height}%` }}
                          title={`${day.generations} CVs on ${day.date}`}
                        ></div>
                        <div className="text-xs text-white/50 mt-2 truncate w-full text-center">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                        </div>
                        <div className="text-xs text-white/30 mt-1">{day.generations}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500"></div>
                  <span className="text-white/70 text-xs md:text-sm">CV Generations</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
              <div className="text-white/50 text-xs md:text-sm mb-2 md:mb-0">
                Showing 7 days of activity
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs">Swipe →</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Section - Stack on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-blue-500/20">
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              Why Numbers Matter
            </h3>
            <ul className="space-y-2 md:space-y-3 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Each CV = career opportunity</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 mt-1.5"></div>
                <span>Pro users save time</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-400 mt-1.5"></div>
                <span>Stand out in job markets</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-400 mt-1.5"></div>
                <span>Transparency & trust</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-green-500/20">
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              Join Community
            </h3>
            <p className="text-white/70 mb-4 md:mb-6 text-sm">
              Be part of professionals who transformed careers with AI-powered CV builder.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-xs text-white/50">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-white mb-1">4.8★</div>
                <div className="text-xs text-white/50">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}