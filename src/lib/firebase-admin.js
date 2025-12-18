import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. CLEAN THE KEY
const formatPrivateKey = (key) => {
  if (!key) return undefined;
  // This handles the \n characters correctly for Vercel & Local
  return key.replace(/\\n/g, '\n');
};

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
};

// 2. DEBUG LOGGING (Check your terminal when server starts)
if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
  console.error("❌ FIREBASE ERROR: Credentials missing in .env.local");
} else {
  // console.log("✅ Credentials found. Attempting connection...");
}

if (getApps().length === 0) {
  if (serviceAccount.clientEmail && serviceAccount.privateKey) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log("✅ Firebase Admin Connected Successfully");
    } catch (error) {
      console.error("❌ Firebase Admin Connection Failed:", error);
    }
  }
}

const db = getApps().length > 0 ? getFirestore() : null;

export { db };