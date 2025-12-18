'use client';
import { Zap, Crown, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TokenCounter({ tokens, isPro, onUpgrade }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-slate-900/80 p-1.5 pr-4 rounded-full border border-white/10 shadow-lg shadow-blue-900/10"
    >
      <div className={`p-2 rounded-full ${isPro ? 'bg-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-blue-600 shadow-lg shadow-blue-600/20'}`}>
        {isPro ? <Crown size={16} className="text-black" /> : <Zap size={16} className="text-white" />}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Status</span>
        <span className="text-xs font-black uppercase tracking-wider leading-none">
          {isPro ? <span className="text-yellow-400 animate-pulse">Pro Access</span> : `${tokens ?? 0} Credits`}
        </span>
      </div>

      {!isPro && (
        <PlusCircle 
          size={18} 
          className="ml-2 text-slate-500 hover:text-white cursor-pointer transition-all hover:rotate-90" 
          onClick={onUpgrade} 
        />
      )}
    </motion.div>
  );
}