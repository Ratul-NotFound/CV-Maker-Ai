'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Crown, Zap, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { upgradeUserToPro } from '@/lib/firestore';

export default function PricingModal({ onClose, currentUser }) {
  const [processing, setProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!currentUser?.uid) return;
    setProcessing(true);
    
    try {
      // Simulation for payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      await upgradeUserToPro(currentUser.uid);
      
      // Real-time listener in AuthProvider will handle the state update automatically
      onClose();
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to process upgrade. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop blur with deep overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Main Container with AI Glow Border */}
        <div className="ai-border-glow p-[1px] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="bg-slate-950/90 backdrop-blur-2xl rounded-[2.45rem] overflow-hidden border border-white/5">
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* Header Section */}
            <div className="relative p-10 text-center border-b border-white/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-ai-primary/10 blur-[60px] pointer-events-none" />
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <Crown size={48} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Unlock Pro Intelligence</h2>
              <p className="text-slate-400 font-light max-w-md mx-auto">Elevate your career with unlimited AI generations and premium ATS-optimized templates.</p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8">
              
              {/* Free Plan (Current) */}
              <div className="glass-card p-8 rounded-[2rem] border-white/5 flex flex-col opacity-60 grayscale-[0.5]">
                <div className="mb-6">
                  <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-1">Standard</h3>
                  <div className="text-3xl font-black text-white">$0</div>
                </div>
                <ul className="space-y-4 flex-grow mb-8 text-sm">
                  <Feature text="10 CV Credits" active />
                  <Feature text="Basic AI Logic" active />
                  <Feature text="Standard Styles" active />
                  <Feature text="No Priority Support" active={false} />
                </ul>
                <div className="text-center py-3 rounded-xl border border-white/10 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  Current Engine
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-ai-primary to-ai-secondary rounded-[2.1rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-slate-900/60 p-8 rounded-[2rem] border border-ai-primary/20 flex flex-col h-full shadow-xl">
                  <div className="absolute -top-3 right-8 px-4 py-1 bg-ai-primary text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-lg shadow-ai-primary/20">
                    Recommended
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-ai-primary font-bold uppercase tracking-[0.2em] text-xs mb-1">Elite Access</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">$9.99</span>
                      <span className="text-slate-500 text-sm">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 flex-grow mb-8 text-sm">
                    <Feature text="Unlimited AI Generations" active pro />
                    <Feature text="Gemini Pro 1.5 Analysis" active pro />
                    <Feature text="Premium Creative Styles" active pro />
                    <Feature text="High-Res PDF & Word Export" active pro />
                    <Feature text="24/7 Priority Support" active pro />
                  </ul>

                  <button
                    onClick={handleUpgrade}
                    disabled={processing}
                    className="group relative w-full overflow-hidden bg-white text-slate-950 font-black py-4 px-6 rounded-2xl transition-all hover:bg-ai-primary hover:text-white flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50"
                  >
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-20 transition-opacity" />
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span className="tracking-widest uppercase text-xs">Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} fill="currentColor" />
                        <span>UPGRADE TO PRO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Section */}
            <div className="px-10 pb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge icon={<ShieldCheck size={14}/>} label="Secure Checkout" />
              <Badge icon={<Sparkles size={14}/>} label="AI Ready" />
              <Badge icon={<Zap size={14}/>} label="Instant Delivery" />
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <span className="text-[10px] font-bold uppercase">v1.5 API</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ text, active, pro }) {
  return (
    <li className={`flex items-center gap-3 ${active ? 'text-slate-200' : 'text-slate-600'}`}>
      <div className={`p-1 rounded-full ${active ? (pro ? 'bg-ai-primary/20 text-ai-primary' : 'bg-emerald-500/20 text-emerald-400') : 'bg-slate-800 text-slate-700'}`}>
        {active ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </div>
      <span className="font-medium tracking-tight">{text}</span>
    </li>
  );
}

function Badge({ icon, label }) {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-500">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </div>
  );
}