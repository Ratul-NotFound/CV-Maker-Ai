"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createUser } from "@/lib/firestore"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Holds live tokens & role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc;
    let timeoutId;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          
          // 1. Ensure User Document Exists in DB
          await createUser(currentUser.uid, currentUser.email, currentUser.displayName);

          // 2. REAL-TIME LISTENER (Fixes the Sync Issue)
          const userRef = doc(db, "users", currentUser.uid);
          unsubDoc = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            } else {
              // Default user data if document doesn't exist
              setUserData({ tokens: 5, isPro: false });
            }
          }, (error) => {
            console.error('Firestore listener error:', error);
            setUserData({ tokens: 5, isPro: false });
          });
        } else {
          setUser(null);
          setUserData(null);
          if (unsubDoc) unsubDoc();
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    });

    // Fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        console.warn('Auth context timeout - setting loading to false');
      }
    }, 10000); // 10 second timeout

    return () => {
      unsubscribeAuth();
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
    loading
  }), [user, userData, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);