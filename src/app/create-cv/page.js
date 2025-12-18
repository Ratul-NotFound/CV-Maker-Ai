'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid SSR issues
const CVFormCompact = dynamic(() => import('@/components/CVForm'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/30 p-8 rounded-2xl border border-white/10">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-ai-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

const CVPreview = dynamic(() => import('@/components/CVPreview'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/30 p-8 rounded-2xl border border-white/10">
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-ai-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

export default function CreateCVPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ tokens: 5, isPro: false });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Replace with actual Firestore call in production
        setUserData({
          tokens: 5,
          isPro: false,
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName
        });
        setLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ai-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading AI CV Generator...</p>
        </div>
      </div>
    );
  }

  return (
    // FIX APPLIED: 
    // 1. Added 'pt-28 md:pt-36' to push content below the Navbar
    // 2. Added 'relative z-0' to ensure this page stays BEHIND the navbar stacking context
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-28 md:pt-36 pb-12 px-4 relative z-0">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/20">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            CV Maker <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Ai</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm font-medium">
            Create professional, industry-tailored CVs with AI. Download as PDF instantly.
          </p>
        </header>

        {!generatedCV ? (
          <CVFormCompact 
            user={user}
            userData={userData}
            onCVGenerated={(html) => setGeneratedCV(html)}
            onUpgradeNeeded={() => {
              if (confirm('Upgrade to Pro for unlimited CV generations! Proceed to pricing?')) {
                router.push('/pricing');
              }
            }}
          />
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  🎉 CV Generated Successfully!
                </h2>
                <p className="text-white/70 text-sm mt-1">Your professional CV is ready to download</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => setGeneratedCV(null)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all flex items-center gap-2 border border-white/10 w-full md:w-auto justify-center"
                >
                  ← Create Another
                </button>
                <div className="hidden md:block text-sm text-white/50 bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                  Tokens: <span className="font-bold text-ai-primary">{userData.tokens}</span>
                </div>
              </div>
            </div>
            <CVPreview cvHtml={generatedCV} />
          </div>
        )}

        {/* Compact Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/30 font-medium uppercase tracking-wider">
            <p>© 2024 CV Maker AI  |  All rights reserved  |  Developed by Mahmud Hasan Ratul</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}