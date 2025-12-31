'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2, Fingerprint, AlertTriangle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // *** MASTER OVERRIDE: YOUR EMAIL ***
  const MASTER_ADMIN = "m.h.ratul18@gmail.com"; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          // ALLOW IF: Email is Master Admin OR Role is 'admin'
          if (user.email === MASTER_ADMIN || (userSnap.exists() && userSnap.data().role === 'admin')) {
            router.push('/admin'); 
          } else {
            if (!loading) await signOut(auth);
            setCheckingAuth(false);
          }
        } catch (e) {
          console.error("Auth check failed", e);
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router, loading]);

  const handleAdminLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      // SECURITY CHECK
      if (user.email === MASTER_ADMIN || (userSnap.exists() && userSnap.data().role === 'admin')) {
        router.push('/admin');
      } else {
        await signOut(auth);
        throw new Error('Access Denied: Not an Administrator.');
      }
    } catch (err) {
      setError(err.message || 'Security Clearance Failed.');
      setLoading(false);
    }
  };

  if (checkingAuth) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
      
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-[420px]">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-2xl border border-red-500/20 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Command Center</h1>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">Restricted Access Only</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleAdminLogin} disabled={loading} className="group w-full py-4 px-6 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Fingerprint className="w-5 h-5" /> <span>Authenticate</span></>}
          </button>
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}