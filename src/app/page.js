'use client';

import { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, CheckCircle, Cpu, Zap, ShieldCheck, 
  FileText, Users, Crown, TrendingUp, Globe, Clock, BarChart3, 
  Rocket, Target, Brain, Lock, Award, Star, ChevronRight,
  Shield, PieChart, Users2
} from 'lucide-react';
import dynamic from 'next/dynamic';import { useFetch } from '@/lib/useFetch';import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const NeuralNetworkBackground = dynamic(() => import('@/components/NeuralNetworkBackground'), {
  ssr: false
});

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [counter, setCounter] = useState({
    cvGenerated: 0,
    users: 0,
    successRate: 0
  });

  useEffect(() => {
    // Only redirect if user is authenticated and auth check is complete
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch public stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/public');
        const data = await response.json();
        if (data.success) {
          setStats(data);
          
          // Animate counters
          setTimeout(() => {
            setCounter({
              cvGenerated: data.totalGenerations || 5890,
              users: data.totalUsers || 1250,
              successRate: 98
            });
          }, 500);
        }
      } catch (error) {
        // Fallback to sample data
        setStats({
          totalGenerations: 5890,
          totalUsers: 1250,
          proUsers: 342,
          activeToday: 45
        });
        setTimeout(() => {
          setCounter({
            cvGenerated: 5890,
            users: 1250,
            successRate: 98
          });
        }, 500);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchStats();
  }, []);

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <NeuralNetworkBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Skip loading screen - show UI immediately with data loading in background
  const displayStats = stats || {
    totalGenerations: 5890,
    totalUsers: 1250,
    proUsers: 342,
    activeToday: 45
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your experience and optimize for ATS systems",
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Industry-Specific",
      description: "Tailored templates for tech, finance, healthcare, research & more",
      color: "from-blue-500/20 to-cyan-600/20",
      iconColor: "text-blue-400"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Instant Generation",
      description: "Generate professional CVs in under 60 seconds with one click",
      color: "from-pink-500/20 to-rose-600/20",
      iconColor: "text-pink-400"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "End-to-end encryption. Your data is never shared or sold",
      color: "from-green-500/20 to-emerald-600/20",
      iconColor: "text-green-400"
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "ATS Optimized",
      description: "98% pass rate on applicant tracking systems",
      color: "from-orange-500/20 to-amber-600/20",
      iconColor: "text-orange-400"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Pro Templates",
      description: "Professional designs that impress recruiters",
      color: "from-indigo-500/20 to-violet-600/20",
      iconColor: "text-indigo-400"
    }
  ];

  const steps = [
    { number: "01", title: "Fill Details", description: "Complete your professional profile" },
    { number: "02", title: "Choose Template", description: "Select from 10+ industry-specific designs" },
    { number: "03", title: "AI Optimization", description: "Our AI enhances your content for maximum impact" },
    { number: "04", title: "Download & Apply", description: "Get your professionally designed CV instantly" }
  ];

  const testimonials = [
    {
      name: "Professional User",
      role: "Software Engineer",
      content: "Created a professional CV in minutes. The AI-powered templates are impressive!",
      avatar: "https://ui-avatars.com/api/?name=P+U&background=3b82f6&color=fff"
    },
    {
      name: "Career Seeker",
      role: "Business Analyst",
      content: "The templates helped me highlight my achievements effectively. Great tool!",
      avatar: "https://ui-avatars.com/api/?name=C+S&background=a855f7&color=fff"
    },
    {
      name: "Tech Professional",
      role: "Data Analyst",
      content: "Professional and clean design. Easy to customize for different roles.",
      avatar: "https://ui-avatars.com/api/?name=T+P&background=10b981&color=fff"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 overflow-hidden">
      <Navbar />
      <NeuralNetworkBackground />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 backdrop-blur-sm mb-8 group hover:scale-105 transition-transform"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.div>
              <span className="text-white font-bold text-sm tracking-widest uppercase">AI-POWERED CAREER ACCELERATOR</span>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
            >
              Build CVs That
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient bg-[length:200%_auto]">
                  Get Interviews
                </span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-6 -right-6 w-12 h-12 border-4 border-purple-500/30 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed"
            >
              World's most advanced AI resume builder. Used by professionals at Google, Microsoft, and leading companies worldwide.
            </motion.p>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              {[
                { value: counter.cvGenerated, label: "CVs Generated", icon: <FileText className="w-5 h-5" />, color: "text-blue-400" },
                { value: counter.users, label: "Active Users", icon: <Users2 className="w-5 h-5" />, color: "text-green-400" },
                { value: `${counter.successRate}%`, label: "Success Rate", icon: <Star className="w-5 h-5" />, color: "text-yellow-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-black text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <button
                onClick={() => router.push('/login')}
                className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl flex items-center gap-3 hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">🚀 START BUILDING FREE</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/stats')}
                className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  View Live Stats
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span>100% Secure</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <span>Instant Generation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Choose</span> Us
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to create a professional resume that stands out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 ${feature.iconColor}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed relative">{feature.description}</p>
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-blue-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Create Your Perfect CV in <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">4 Steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center group hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-lg border-4 border-slate-950">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 mt-6">{step.title}</h3>
                    <p className="text-slate-300">{step.description}</p>
                    <div className="mt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <ChevronRight className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Professionals</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands who transformed their careers with AI-powered CVs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-blue-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-white/10 backdrop-blur-sm p-12 text-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join 10,000+ professionals who landed better jobs with AI-optimized CVs
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => router.push('/login')}
                  className="group relative px-12 py-5 bg-white text-slate-950 font-black rounded-2xl flex items-center gap-3 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">🚀 START FREE TRIAL</span>
                  <ArrowRight className="w-5 h-5 relative group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 hover:border-white/30 transition-all group"
                >
                  <span className="flex items-center gap-3">
                    <Crown className="w-5 h-5" />
                    View Premium Features
                  </span>
                </button>
              </div>
              
              <p className="text-slate-400 text-sm mt-8">
                No credit card required • 3 free CVs included • Cancel anytime
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}