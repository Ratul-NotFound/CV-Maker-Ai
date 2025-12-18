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

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // 1. Ensure User Document Exists in DB
        await createUser(currentUser.uid, currentUser.email, currentUser.displayName);

        // 2. REAL-TIME LISTENER (Fixes the Sync Issue)
        const userRef = doc(db, "users", currentUser.uid);
        unsubDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        });
      } else {
        setUser(null);
        setUserData(null);
        if (unsubDoc) unsubDoc();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubDoc) unsubDoc();
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