'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Loader2, ShieldCheck, Zap, Globe, Lock, 
  LogIn, User, Key, Brain, Rocket, Shield,
  Target, BarChart3, Cpu, Server, Fingerprint,
  ArrowRight, CheckCircle, CpuIcon, Database
} from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { user, userData, login, loading: authLoading } = useAuth();
  
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => 
    `USER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  );
  const [showFeatures, setShowFeatures] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    successRate: 98,
    cvGenerated: 5890
  });

  // Smart Redirect based on Role
  useEffect(() => {
    if (!authLoading && user && userData) {
      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, userData, authLoading, router]);

  // Fetch quick stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/public');
        const data = await response.json();
        if (data.success) {
          setStats({
            totalUsers: data.totalUsers || 1250,
            successRate: 98,
            cvGenerated: data.totalGenerations || 5890
          });
        }
      } catch (error) {
        console.log('Using default stats');
      }
    };
    fetchStats();
  }, []);

  // Handle Login Action
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    
    try {
      await login();
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please check your credentials and try again.');
      setIsLoggingIn(false);
    }
  };

  // Show loading spinner while checking initial auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <NeuralNetworkBackground />
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animation-delay-200"></div>
          </div>
          <p className="mt-6 text-white font-bold">Initializing AI Engine...</p>
          <p className="text-slate-400 text-sm mt-2">Session: {sessionId}</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: <Brain className="w-4 h-4" />, text: "AI-Powered Optimization" },
    { icon: <Target className="w-4 h-4" />, text: "ATS Friendly" },
    { icon: <Rocket className="w-4 h-4" />, text: "Instant Generation" },
    { icon: <Shield className="w-4 h-4" />, text: "100% Secure" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 relative overflow-hidden">
      <Navbar />
      <NeuralNetworkBackground />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        
        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-20 px-4">
        <div className="w-full max-w-lg">
          {/* Session Info */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/60 font-mono">SESSION: {sessionId}</span>
            </div>
          </div>

          {/* Main Login Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Animated Border Glow */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Scanner Effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-10">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-8 relative"
                >
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
                    </div>
                    <div className="absolute inset-0 border-2 border-blue-500/30 rounded-3xl animate-ping opacity-20"></div>
                  </div>
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CV AI</span>
                </h1>
                <p className="text-slate-300 text-base md:text-lg font-light mb-2">
                  Professional Resume Builder Powered by AI
                </p>
                <p className="text-slate-500 text-xs md:text-sm font-mono uppercase tracking-widest">
                  ENTER THE FUTURE OF CAREER DEVELOPMENT
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                {[
                  { value: stats.cvGenerated, label: "CVs Generated", color: "text-blue-400" },
                  { value: stats.totalUsers, label: "Users", color: "text-green-400" },
                  { value: `${stats.successRate}%`, label: "Success", color: "text-yellow-400" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl md:text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-200 text-sm font-medium">Authentication Error</p>
                        <p className="text-red-300/80 text-sm">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white font-black py-4 md:py-5 px-6 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin relative" />
                    <span className="relative">CONNECTING...</span>
                  </>
                ) : (
                  <>
                    <div className="relative p-2 bg-white/20 rounded-lg">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <span className="relative">CONTINUE WITH GOOGLE</span>
                    <ArrowRight className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </motion.button>

              {/* Features Toggle */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="w-full flex items-center justify-between text-white/50 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CpuIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">AI-Powered Features</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${showFeatures ? 'rotate-90' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showFeatures && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 grid grid-cols-2 gap-3 overflow-hidden"
                    >
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-white/60 p-2 bg-white/5 rounded-lg">
                          <div className="text-blue-400">{feature.icon}</div>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Security Badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
                {[
                  { text: "AES-256", icon: <Lock className="w-3 h-3" /> },
                  { text: "2FA", icon: <Key className="w-3 h-3" /> },
                  { text: "GDPR", icon: <ShieldCheck className="w-3 h-3" /> },
                  { text: "SSL", icon: <Database className="w-3 h-3" /> }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-blue-400">{badge.icon}</div>
                    <span className="text-xs text-white/50 font-mono">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <TrustIndicator icon={<User className="w-4 h-4" />} text="No Registration" />
            <TrustIndicator icon={<Zap className="w-4 h-4" />} text="Instant Access" />
            <TrustIndicator icon={<ShieldCheck className="w-4 h-4" />} text="Secure Login" />
            <TrustIndicator icon={<Rocket className="w-4 h-4" />} text="Free Trial" />
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto z-20">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
          <p className="text-xs text-white/50 font-mono">
            LIVE • {stats.cvGenerated.toLocaleString()} CVs Generated • {stats.totalUsers.toLocaleString()} Users
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function TrustIndicator({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-default">
      <div className="text-blue-400">{icon}</div>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}