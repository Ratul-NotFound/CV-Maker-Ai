'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { Sparkles, Download, Save, RotateCcw, Crown, ChevronLeft } from 'lucide-react';
import PricingModal from '@/components/PricingModal';
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

// Dynamically import components
const CVFormCompact = dynamic(() => import('@/components/CVForm'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/30 p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/10">
      <div className="flex items-center justify-center h-40 md:h-64">
        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-ai-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

const CVPreview = dynamic(() => import('@/components/CVPreview'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/30 p-4 md:p-8 rounded-xl md:rounded-2xl border border-white/10">
      <div className="flex items-center justify-center h-60 md:h-96">
        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-ai-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
});

export default function CreateCVPage() {
  return (
    <ErrorBoundary>
      <CreateCVContent />
    </ErrorBoundary>
  );
}

function CreateCVContent() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [generatedCV, setGeneratedCV] = useState(null);
  const [generatedPDF, setGeneratedPDF] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [cvTitle, setCvTitle] = useState('My Professional CV');
  const [cvMetadata, setCvMetadata] = useState({ cvType: 'modern', industry: 'technology', formData: null, templateId: 1 });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading CV Creator...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  if (!user) {
    return null;
  }

  const handleTokenCheck = () => {
    if (!userData?.isPro && (userData?.tokens || 0) <= 0) {
      if (confirm('No tokens remaining. Upgrade to Pro for unlimited CV generation?')) {
        router.push('/pricing');
      }
      return false;
    }
    return true;
  };

  const handleSaveCV = async (cvHtml, title) => {
    if (!userData?.isPro) {
      alert('Only Pro users can save CVs. Please upgrade to Pro.');
      setShowPricingModal(true);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/save-cv', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({
          userId: user.uid,
          htmlContent: cvHtml,
          pdfBase64: generatedPDF,
          title: title || cvTitle,
          industry: cvMetadata.industry,
          template: cvMetadata.cvType,
          templateId: cvMetadata.templateId,
          formData: cvMetadata.formData
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ CV saved successfully! You can access it from your dashboard.');
      } else {
        alert('Failed to save CV: ' + data.error);
      }
    } catch (error) {
      alert('Error saving CV: ' + error.message);
    }
  };

  // Download is now handled by CVPreview component

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-ai-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
          <p className="text-white/70 text-sm md:text-base">Loading AI CV Generator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 pt-20 md:pt-24 pb-8 px-3 sm:px-4 relative z-0">
      <div className="max-w-6xl mx-auto">
        {/* Compact Header */}
        <header className="mb-4 text-center">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={() => router.back()}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-ai-primary to-purple-600 rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/20">
              <span className="text-2xl md:text-3xl">📄</span>
            </div>
            <div className="w-10"></div> {/* Spacer for symmetry */}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1 md:mb-2 tracking-tight">
            CV Maker <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI</span>
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto font-medium">
            Create professional, industry-tailored CVs with AI
          </p>
          
          {/* Token Display - Compact for mobile */}
          <div className="mt-3 flex items-center justify-between bg-black/40 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-white/10">
            <div className="text-left">
              <div className="text-[10px] md:text-xs text-white/50">Plan</div>
              <div className={`text-sm md:text-base font-bold flex items-center gap-1 ${userData?.isPro ? 'text-yellow-400' : 'text-white'}`}>
                {userData?.isPro && <Crown className="w-3 h-3" />}
                {userData?.isPro ? 'PRO' : 'FREE'}
              </div>
            </div>
            
            <div className="h-6 md:h-8 w-px bg-white/20"></div>
            
            <div className="text-center">
              <div className="text-[10px] md:text-xs text-white/50">Tokens</div>
              <div className={`text-sm md:text-base font-bold ${userData?.isPro ? 'text-green-400' : userData?.tokens > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                {userData?.isPro ? '∞' : userData?.tokens || 0}
              </div>
            </div>
            
            <div className="h-6 md:h-8 w-px bg-white/20"></div>
            
            <div className="text-right">
              {!userData?.isPro && (
                <button 
                  onClick={() => setShowPricingModal(true)}
                  className="text-[10px] md:text-xs bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-2 md:px-3 py-1 rounded-full font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  + Tokens
                </button>
              )}
            </div>
          </div>
        </header>

        {!generatedCV ? (
          <CVFormCompact 
            user={user}
            userData={userData}
            onCVGenerated={(html, pdfBase64, title, metadata) => {
              if (handleTokenCheck()) {
                setGeneratedCV(html);
                setGeneratedPDF(pdfBase64);
                if (title) setCvTitle(title);
                if (metadata) setCvMetadata(metadata);
              }
            }}
            onUpgradeNeeded={() => {
              setShowPricingModal(true);
            }}
            onSaveCV={handleSaveCV}
            cvTitle={cvTitle}
            onTitleChange={setCvTitle}
          />
        ) : (
          <div className="space-y-4 md:space-y-6 animate-fadeIn">
            {/* Success Header - Mobile Optimized */}
            <div className="flex flex-col gap-3 md:gap-4 bg-slate-900/50 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 shadow-xl">
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  CV Ready!
                </h2>
                <p className="text-white/70 text-xs md:text-sm mt-1">Your professional CV is ready</p>
              </div>
              
              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <button
                    onClick={() => {
                      setGeneratedCV(null);
                      setGeneratedPDF(null);
                    }}
                    className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-1 border border-white/10 text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New</span>
                  </button>
                </div>
                
                {userData?.isPro && (
                  <button
                    onClick={() => handleSaveCV(generatedCV, cvTitle)}
                    className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-1 hover:opacity-90 text-sm order-1 sm:order-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save CV</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* CV Title Input - Stack on mobile */}
            {userData?.isPro && (
              <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-lg md:rounded-xl border border-white/10">
                <label className="block text-white/70 text-xs md:text-sm mb-2">CV Title (for saving)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 text-white text-sm"
                    placeholder="Enter a title for your CV"
                  />
                  <button
                    onClick={() => handleSaveCV(generatedCV, cvTitle)}
                    className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                  >
                    Save with Title
                  </button>
                </div>
              </div>
            )}
            
            {/* Token Display - Compact */}
            <div className="text-center text-white/50 bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-sm">
              Tokens left: <span className={`font-bold ${userData?.isPro ? 'text-green-400' : 'text-yellow-400'}`}>
                {userData?.isPro ? '∞ Unlimited' : `${userData?.tokens || 0} remaining`}
              </span>
            </div>
            
            {/* CV Preview */}
            <CVPreview cvHtml={generatedCV} cvTitle={cvTitle} />
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal 
          onClose={() => setShowPricingModal(false)} 
          currentUser={user}
        />
      )}
    </div>
  );
}