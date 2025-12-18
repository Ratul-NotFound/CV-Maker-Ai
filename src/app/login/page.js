'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Use central context
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, userData, login, loading: authLoading } = useAuth(); // Get auth state
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  // 1. Smart Redirect based on Role (Runs when user/userData changes)
  useEffect(() => {
    if (!authLoading && user && userData) {
      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/create-cv');
      }
    }
  }, [user, userData, authLoading, router]);

  // 2. Handle Login Action
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    
    try {
      await login();
      // The useEffect above will handle the redirect once state updates
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  // Show loading spinner while checking initial auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Animated Border Glow Wrapper */}
        <div className="p-[1px] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20">
          <div className="bg-slate-950/90 backdrop-blur-2xl rounded-[2.45rem] p-10 md:p-12 border border-white/5">
            
            {/* Header Section */}
            <div className="text-center mb-10">
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  filter: ["drop-shadow(0 0 0px #3b82f6)", "drop-shadow(0 0 20px #3b82f6)", "drop-shadow(0 0 0px #3b82f6)"] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="w-10 h-10 text-blue-500" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Initialize Access</h1>
              <p className="text-slate-400 font-light text-lg">Sign in to sync with the AI Engine.</p>
            </div>

            {/* Error Message Section */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-4 rounded-2xl mb-8 text-center flex items-center justify-center gap-2"
                >
                  <Lock size={14} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="group relative w-full overflow-hidden bg-white text-slate-950 font-bold py-4 px-6 rounded-2xl transition-all hover:bg-blue-600 hover:text-white flex items-center justify-center space-x-3 shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-semibold">AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-semibold">Continue with Google</span>
                </>
              )}
            </button>

            {/* Badges Section */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/5 pt-10">
              <LoginBadge icon={<Zap size={18}/>} label="Instant" />
              <LoginBadge icon={<ShieldCheck size={18}/>} label="Secure" />
              <LoginBadge icon={<Globe size={18}/>} label="ATS Ready" />
            </div>

            <p className="text-center text-slate-600 text-[10px] mt-10 uppercase tracking-[0.2em] font-bold">
              Neural Encryption v1.5 Active
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function LoginBadge({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all duration-500 border border-transparent group-hover:border-blue-500/20">
        {icon}
      </div>
      <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter group-hover:text-slate-300 transition-colors">{label}</span>
    </div>
  );
}