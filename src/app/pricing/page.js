'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PricingModal from '@/components/PricingModal';
import Navbar from '@/components/Navbar';

export default function PricingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      {showModal && (
        <PricingModal 
          onClose={handleClose} 
          currentUser={user}
        />
      )}
    </div>
  );
}
