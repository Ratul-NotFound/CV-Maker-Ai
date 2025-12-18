'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Cpu, Zap, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="spinner" /></div>;

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-primary/10 border border-ai-primary/20 text-ai-primary text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} /> Powered by Gemini Pro 1.5
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none"
          >
            Your Career, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-primary via-ai-secondary to-ai-accent animate-gradient bg-[length:200%_auto]">
              AI Reimagined.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-12"
          >
            The world's most advanced AI resume engine. Generate high-impact, ATS-optimized CVs in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => router.push('/login')}
              className="group relative px-10 py-5 bg-white text-slate-950 font-black rounded-[2rem] flex items-center gap-3 hover:bg-ai-primary hover:text-white transition-all shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-20" />
              BUILD MY CV NOW <ArrowRight size={20} />
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-950" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
              ))}
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-400">+10k</div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <FeatureCard icon={<Cpu />} title="Neural Analysis" desc="Gemini AI scans your data to highlight high-impact achievements." />
          <FeatureCard icon={<Zap />} title="Instant Export" desc="Download print-ready PDFs optimized for modern hiring systems." />
          <FeatureCard icon={<ShieldCheck />} title="Privacy First" desc="Your data is encrypted and never sold to third parties." />
        </div>

        <Footer />
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 hover:border-ai-primary/20 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-ai-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
}