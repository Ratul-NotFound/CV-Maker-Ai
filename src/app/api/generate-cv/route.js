import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; 
import * as admin from 'firebase-admin';
import { generateCVByType } from '@/lib/cvTemplates';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// ============================================================
// 🎨 INDUSTRY COLOR PALETTES FOR DYNAMIC GENERATION
// ============================================================
const INDUSTRY_PALETTES = {
  technology: { primary: '#2563eb', secondary: '#0f172a', accent: '#3b82f6', bg: '#f8fafc' },
  finance: { primary: '#1e40af', secondary: '#0f172a', accent: '#374151', bg: '#ffffff' },
  healthcare: { primary: '#059669', secondary: '#065f46', accent: '#10b981', bg: '#f0fdf4' },
  education: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#8b5cf6', bg: '#faf5ff' },
  marketing: { primary: '#ec4899', secondary: '#be185d', accent: '#f472b6', bg: '#fdf2f8' },
  engineering: { primary: '#ea580c', secondary: '#9a3412', accent: '#f97316', bg: '#fff7ed' },
  law: { primary: '#6d28d9', secondary: '#4c1d95', accent: '#8b5cf6', bg: '#faf5ff' },
  creative: { primary: '#db2777', secondary: '#9d174d', accent: '#ec4899', bg: '#fdf2f8' },
  research: { primary: '#0d9488', secondary: '#115e59', accent: '#14b8a6', bg: '#f0fdfa' },
  consulting: { primary: '#0e7490', secondary: '#155e75', accent: '#06b6d4', bg: '#ecfeff' }
};

// ============================================================
// 📊 DATA VALIDATION & PROCESSING
// ============================================================
function validateFormData(formData) {
  if (!formData) throw new Error('Form data is required');
  if (!formData.personalInfo) throw new Error('Personal information is required');
  
  // Add size validation
  const formDataStr = JSON.stringify(formData);
  const formDataSize = new Blob([formDataStr]).size;
  
  if (formDataSize > 1048576) { // 1MB limit
    throw new Error('Form data exceeds maximum size (1MB)');
  }
  
  return true;
}

function compressCV(html) {
  // Validate HTML size before compression
  const htmlSize = new Blob([html]).size;
  if (htmlSize > 5242880) { // 5MB limit
    throw new Error('Generated CV exceeds maximum size limit');
  }
  
  return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

// ============================================================
// 🔐 AUTHENTICATION & DATABASE
// ============================================================
async function getUserData(userId) {
  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();
  
  if (!doc.exists) {
    throw new Error('User not found');
  }
  
  return { ref: userRef, data: doc.data() };
}

// ============================================================
// 📮 MAIN POST HANDLER
// ============================================================
export async function POST(request) {
  try {
    const { formData, cvType = 'modern', industry = 'technology', userId, save = false, cvTitle } = await request.json();

    // 1. VALIDATE INPUTS
    validateFormData(formData);
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
    }

    // 2. GET USER DATA
    const { ref: userRef, data: userData } = await getUserData(userId);

    // 3. CHECK TOKENS (Free users only)
    if (!userData.isPro && userData.tokens < 1) {
      return NextResponse.json({ 
        success: false, 
        message: 'Insufficient tokens. Upgrade to Pro or purchase tokens.',
        tokensRemaining: 0
      }, { status: 402 });
    }

    // 4. GENERATE CV WITH TEMPLATE SYSTEM
    if (process.env.DEBUG) console.log(`[API] Generating ${cvType} CV for industry: ${industry}`);
    const cvHtml = await generateCVByType(formData, cvType, industry);

    if (!cvHtml || cvHtml.length < 500) {
      throw new Error('CV generation produced invalid output');
    }

    // 5. SAVE CV TO FIRESTORE (Pro users)
    let cvId = null;
    if (userData.isPro && save) {
      try {
        const cvRef = db.collection('cvStorage').doc();
        cvId = cvRef.id;
        
        await cvRef.set({
          id: cvRef.id,
          userId,
          title: cvTitle || `${cvType.charAt(0).toUpperCase() + cvType.slice(1)} CV`,
          compressedHtml: compressCV(cvHtml),
          originalSize: cvHtml.length,
          industry: industry || 'technology',
          template: cvType,
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          downloadCount: 0,
          isPublic: false,
          formData: formData
        });

        await userRef.update({
          savedCVs: admin.firestore.FieldValue.increment(1),
          lastSavedCV: new Date().toISOString()
        });

        console.log(`[SaveCV]: CV saved successfully with ID: ${cvId}`);
      } catch (error) {
        console.error('Error saving CV:', error);
      }
    }

    // 6. DEDUCT TOKENS (Free users)
    if (!userData.isPro) {
      await userRef.update({ 
        tokens: admin.firestore.FieldValue.increment(-1),
        lastGenerated: new Date().toISOString()
      });
    }

    // 7. LOG GENERATION
    try {
      await db.collection('generations').add({
        userId,
        cvType,
        industry,
        timestamp: new Date().toISOString(),
        tokensUsed: userData.isPro ? 0 : 1,
        saved: save && userData.isPro,
        cvId: cvId || null,
        method: 'template-based'
      });
    } catch (logError) {
      console.error('Logging error:', logError);
    }

    // 8. RETURN RESPONSE
    return NextResponse.json({ 
      success: true,
      cvHtml,
      cvId,
      cvType,
      industry,
      saved: save && userData.isPro,
      tokensRemaining: userData.isPro ? 'unlimited' : Math.max(0, userData.tokens - 1),
      message: 'Professional CV generated successfully'
    });

  } catch (error) {
    console.error('[API Error]', error);    
    // Return appropriate status codes based on error type
    if (error.message.includes('not found')) {
      return NextResponse.json({ 
        success: false, 
        message: 'User or resource not found' 
      }, { status: 404 });
    }
    
    if (error.message.includes('Insufficient tokens')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Insufficient tokens' 
      }, { status: 402 });
    }
    
    if (error.message.includes('exceeds maximum')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Data exceeds maximum size limit' 
      }, { status: 413 });
    }
        return NextResponse.json({ 
      success: false, 
      message: error.message || 'CV generation failed',
      error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    }, { status: 500 });
  }
}

// ============================================================
// 🔄 GET HANDLER - RETRIEVE SAVED CV
// ============================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');
    const userId = searchParams.get('userId');

    if (!cvId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const cvDoc = await db.collection('cvStorage').doc(cvId).get();
    
    if (!cvDoc.exists) {
      return NextResponse.json({ success: false, message: 'CV not found' }, { status: 404 });
    }

    const cvData = cvDoc.data();
    
    if (cvData.userId !== userId && !cvData.isPublic) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Decompress HTML
    let cvHtml = cvData.compressedHtml;
    
    // Update last accessed
    await db.collection('cvStorage').doc(cvId).update({
      lastAccessed: new Date().toISOString()
    });

    return NextResponse.json({ success: true, cvHtml, cvData });

  } catch (error) {
    console.error('CV Retrieval Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve CV' }, { status: 500 });
  }
}
