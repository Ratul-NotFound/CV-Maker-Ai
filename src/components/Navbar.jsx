'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext'; // IMPORT CONTEXT
import { Sparkles, LogOut, Menu, X, LayoutDashboard, FileText, Shield } from 'lucide-react';
import TokenCounter from '@/components/TokenCounter';
import PricingModal from '@/components/PricingModal';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // GET LIVE DATA
  const { user, userData, loading } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const isAdmin = userData?.role === 'admin';
  if (pathname === '/login') return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
      router.push('/');
    } catch (error) { console.error('Logout error:', error); }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: !!user },
    { name: 'Create CV', path: '/create-cv', icon: FileText, show: !!user },
    { name: 'Admin', path: '/admin', icon: Shield, show: isAdmin },
  ];

  return (
    <>
      <nav className="bg-slate-950/80 backdrop-blur-md border-b border-white/10 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => router.push(user ? '/dashboard' : '/')} className="flex items-center space-x-2 group shrink-0">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 group-hover:rotate-12 transition-transform" />
              <span className="text-lg md:text-2xl font-bold text-white tracking-tight">CV Maker AI</span>
            </button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-4">
                {!loading && navItems.map((item) => item.show && (
                  <button key={item.name} onClick={() => router.push(item.path)} className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${pathname === item.path ? 'bg-white/20 text-white font-medium' : 'text-slate-300 hover:bg-white/10'}`}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              {user && (
                <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
                  {/* LIVE TOKEN COUNTER */}
                  <TokenCounter tokens={userData?.tokens} isPro={userData?.isPro} onUpgrade={() => setShowPricing(true)} />
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-500/50" />
                  <button onClick={handleLogout} className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"><LogOut className="w-5 h-5" /></button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {user && <TokenCounter tokens={userData?.tokens} isPro={userData?.isPro} onUpgrade={() => setShowPricing(true)} />}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white hover:bg-white/10 rounded-lg">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-slate-900 border-t border-white/10 overflow-hidden">
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => item.show && (
                  <button key={item.name} onClick={() => { router.push(item.path); setMobileMenuOpen(false); }} className="w-full flex items-center space-x-4 px-4 py-4 text-slate-300 hover:bg-white/10 rounded-2xl">
                    <item.icon className="w-6 h-6" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </button>
                ))}
                {user && <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl"><LogOut className="w-6 h-6" /><span className="text-lg font-medium">Logout</span></button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <AnimatePresence>
        {showPricing && <PricingModal onClose={() => setShowPricing(false)} currentUser={user} />}
      </AnimatePresence>
    </>
  );
}