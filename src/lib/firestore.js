import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Client SDK

// Create User Document (Called on Login)
export async function createUser(uid, email, displayName) {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const isAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      
      await setDoc(userRef, {
        uid,
        email,
        displayName: displayName || 'User',
        tokens: isAdmin ? 999999 : 5, // Give Admin unlimited, Users 5
        isPro: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

// Upgrade User to Pro (Client Request)
export async function upgradeUserToPro(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      isPro: true,
      tokens: 999999 // Unlimited visual representation
    });
    return true;
  } catch (error) {
    console.error("Error upgrading user:", error);
    throw error;
  }
}