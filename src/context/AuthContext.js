"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createUser } from "@/lib/firestore"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubDoc;
    let unsubscribeAuth;
    let timeoutId;

    const setupAuthListener = () => {
      unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        try {
          if (currentUser) {
            setUser(currentUser);
            setLoading(false); // Show UI immediately
            
            // 1. Ensure User Document Exists
            await createUser(currentUser.uid, currentUser.email, currentUser.displayName);

            // 2. REAL-TIME LISTENER
            const userRef = doc(db, "users", currentUser.uid);
            unsubDoc = onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                setUserData(docSnap.data());
              } else {
                setUserData({ tokens: 5, isPro: false });
              }
            }, (error) => {
              console.error('Firestore listener error:', error);
              setUserData({ tokens: 5, isPro: false });
            });
          } else {
            setUser(null);
            setUserData(null);
            setLoading(false); // Show UI immediately for unauthenticated users
            if (unsubDoc) unsubDoc();
          }
        } catch (error) {
          console.error('Auth error:', error.message);
          setError(error.message);
          setUser(null);
          setUserData(null);
          setLoading(false); // Always show UI, even on error
        }
      });
    };

    setupAuthListener();

    // Fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.warn('Auth context timeout - setting loading to false');
      }
    }, 10000); // 10 second timeout

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubDoc) unsubDoc();
      clearTimeout(timeoutId);
    };
  }, []);

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const value = useMemo(() => ({
    user, 
    userData, 
    login, 
    logout, 
    loading,
    error
  }), [user, userData, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);