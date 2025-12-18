'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Plus, History, FileText, User } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground'; // Ensure this exists

export default function Dashboard() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ai-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Syncing Neural Core...</p>
        </div>
      </div>
    );
  }
  
  if (!user) { router.push('/login'); return null; }

  return (
    // 2. Dark Premium Background
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 pb-12 px-4 relative z-0">
      
      {/* 3. Neural Animation (Optional - remove if you want static) */}
      <NeuralNetworkBackground />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{user.displayName?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/60 text-sm font-medium">
              Your Professional CV Command Center
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm shadow-lg">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-bold text-white/50 uppercase tracking-widest">System Online</span>
          </div>
        </header>

        {/* ACTION GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          {/* CREATE CARD */}
          <div 
            onClick={() => router.push('/create-cv')}
            className="group relative bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 shadow-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            
            <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Create New CV</h3>
              <p className="text-white/50 mb-6 leading-relaxed text-sm">
                Generate a world-class, ATS-friendly resume tailored to your industry using Gemini AI.
              </p>
              
              <span className="text-xs font-bold text-white/90 flex items-center gap-2 border-b border-white/20 pb-1 group-hover:border-blue-500 transition-colors uppercase tracking-widest">
                Start Engine →
              </span>
            </div>
          </div>

          {/* HISTORY CARD */}
          <div 
            className="group relative bg-black/40 hover:bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-white/20 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <History className="w-8 h-8 text-white/70 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">History</h3>
              <p className="text-white/50 mb-6 leading-relaxed text-sm">
                Access your previously generated documents and manage your career data.
              </p>
              
              <span className="text-xs font-bold text-white/50 flex items-center gap-2 group-hover:text-white transition-colors uppercase tracking-widest">
                Coming Soon
              </span>
            </div>
          </div>

        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard label="Total CVs" value="0" icon={<FileText size={16} />} />
            <StatsCard label="Plan" value={userData?.isPro ? "PRO" : "Starter"} icon={<User size={16} />} />
            <StatsCard label="Credits" value={userData?.tokens || 0} icon={<div className="w-2 h-2 bg-blue-500 rounded-full"/>} />
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/30 font-medium uppercase tracking-wider">
            <p>© 2024 AI CV Studio. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

function StatsCard({ label, value, icon }) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="p-2 bg-white/5 rounded-lg text-white/50">{icon}</div>
            <div>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
            </div>
        </div>
    )
}