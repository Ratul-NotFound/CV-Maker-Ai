import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy, deleteDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import LZString from 'lz-string';

// Create User Document
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
        tokens: isAdmin ? 999999 : 5,
        isPro: isAdmin,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        savedCVs: 0,
        totalGenerations: 0
      });
      return true;
    } else {
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });
    }
    return false;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}

// CV Storage Functions
export const compressCV = (htmlContent) => {
  try {
    return LZString.compressToUTF16(htmlContent);
  } catch (error) {
    console.error('Compression error:', error);
    return htmlContent;
  }
};

export const decompressCV = (compressedContent) => {
  try {
    if (compressedContent.startsWith('<!DOCTYPE') || compressedContent.includes('<html')) {
      return compressedContent;
    }
    return LZString.decompressFromUTF16(compressedContent);
  } catch (error) {
    console.error('Decompression error:', error);
    return compressedContent;
  }
};

// Save CV for Pro users
export const saveCVForProUser = async (userId, cvData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists() || !userDoc.data().isPro) {
      throw new Error('Only Pro users can save CVs');
    }

    const cvRef = doc(collection(db, 'cvStorage'));
    const compressedHtml = compressCV(cvData.htmlContent);
    
    const cvToSave = {
      id: cvRef.id,
      userId,
      title: cvData.title || 'My CV',
      compressedHtml,
      originalSize: cvData.htmlContent.length,
      compressedSize: compressedHtml.length,
      industry: cvData.industry || 'general',
      template: cvData.template || 'modern',
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      downloadCount: 0,
      isPublic: false
    };

    await setDoc(cvRef, cvToSave);

    await updateDoc(userRef, {
      savedCVs: increment(1),
      lastSavedCV: new Date().toISOString()
    });

    return { success: true, cvId: cvRef.id };
  } catch (error) {
    console.error('Error saving CV:', error);
    return { success: false, error: error.message };
  }
};

// Get user's saved CVs
export const getUserSavedCVs = async (userId) => {
  try {
    const q = query(
      collection(db, 'cvStorage'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      compressedHtml: undefined
    }));
  } catch (error) {
    console.error('Error fetching saved CVs:', error);
    return [];
  }
};

// Get single CV by ID
export const getCVById = async (cvId) => {
  try {
    const cvRef = doc(db, 'cvStorage', cvId);
    const cvDoc = await getDoc(cvRef);
    
    if (!cvDoc.exists()) {
      throw new Error('CV not found');
    }

    const cvData = cvDoc.data();
    const decompressedHtml = decompressCV(cvData.compressedHtml);

    await updateDoc(cvRef, {
      lastAccessed: new Date().toISOString(),
      downloadCount: increment(1)
    });

    return {
      id: cvDoc.id,
      ...cvData,
      htmlContent: decompressedHtml
    };
  } catch (error) {
    console.error('Error fetching CV:', error);
    return null;
  }
};

// Delete saved CV
export const deleteSavedCV = async (cvId, userId) => {
  try {
    const cvRef = doc(db, 'cvStorage', cvId);
    const cvDoc = await getDoc(cvRef);
    
    if (!cvDoc.exists() || cvDoc.data().userId !== userId) {
      throw new Error('Unauthorized or CV not found');
    }

    await deleteDoc(cvRef);
    
    // Update user's CV count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      savedCVs: increment(-1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting CV:', error);
    return { success: false, error: error.message };
  }
};

// Get total CV generation count
export const getTotalCVCount = async () => {
  try {
    const response = await fetch('/api/stats/cv-count');
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error getting CV count:', error);
    return 0;
  }
};

// Other existing functions remain the same...
export async function upgradeUserToPro(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { 
      isPro: true,
      tokens: 999999,
      proSince: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error upgrading user:", error);
    throw error;
  }
}

export async function saveCVForm(uid, formData, cvType, industry) {
  try {
    const formRef = doc(db, 'cvForms', uid);
    await setDoc(formRef, {
      uid,
      formData,
      cvType,
      industry,
      updatedAt: new Date().toISOString(),
      version: '1.0'
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving CV form:", error);
    return false;
  }
}

export async function loadCVForm(uid) {
  try {
    const formRef = doc(db, 'cvForms', uid);
    const formSnap = await getDoc(formRef);
    if (formSnap.exists()) {
      return formSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error loading CV form:", error);
    return null;
  }
}
// Get public statistics
export const getPublicStats = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const cvStorageSnapshot = await getDocs(collection(db, 'cvStorage'));
    
    const users = [];
    usersSnapshot.forEach(doc => users.push(doc.data()));
    
    const proUsers = users.filter(user => user.isPro).length;
    const activeToday = users.filter(user => {
      const lastLogin = new Date(user.lastLogin || 0);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
    }).length;
    
    const totalGenerations = users.reduce((sum, user) => sum + (user.totalGenerations || 0), 0);

    return {
      totalUsers: users.length,
      proUsers,
      totalGenerations,
      activeToday,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting public stats:', error);
    return {
      totalUsers: 1250,
      proUsers: 342,
      totalGenerations: 5890,
      activeToday: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};


export async function submitUpgradeRequest(requestData) {
  try {
    const requestsRef = collection(db, 'upgradeRequests');
    const docRef = await addDoc(requestsRef, {
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      notes: ''
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting upgrade request:", error);
    throw error;
  }
}