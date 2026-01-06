import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; 
import * as admin from 'firebase-admin';
import { generatePDF, compressPDF } from '@/lib/pdf-generator';
import { generatePremiumCV } from './premium-templates';
import { getTemplate, getMeta, listArchetypes } from './templates/registry';
import { INDUSTRY_PALETTES } from './templates/palette';
import { requireAuth, assertSameUserOrAdmin } from '@/lib/auth';

// ✅ Template-based CV generation (No AI dependency)
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

// Industry palettes now imported from templates/palette for consistency

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
// � DATA TRANSFORMATION
// ============================================================
function transformFormDataForTemplates(formData) {
  // Flatten nested structure and combine skills
  const personalInfo = formData.personalInfo || {};
  const skills = formData.skills || {};
  
  // Keep skills separated by category for proper display
  const skillsData = {
    technical: skills.technical || [],
    soft: skills.soft || [],
    tools: skills.tools || []
  };
  
  // Also provide flat array for compatibility
  const allSkills = [
    ...(skills.technical || []),
    ...(skills.soft || []),
    ...(skills.tools || [])
  ];
  
  return {
    // Personal info (flatten from nested object)
    name: personalInfo.fullName || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    professionalTitle: personalInfo.professionalTitle || '',
    linkedin: personalInfo.linkedin || '',
    website: personalInfo.website || '',
    portfolio: personalInfo.website || '',
    github: personalInfo.github || '',
    orcid: personalInfo.orcid || '',
    location: personalInfo.city && personalInfo.country ? `${personalInfo.city}, ${personalInfo.country}` : (personalInfo.city || personalInfo.country || ''),
    address: personalInfo.address || '',
    city: personalInfo.city || '',
    country: personalInfo.country || '',
    postalCode: personalInfo.postalCode || '',
    nationality: personalInfo.nationality || '',
    dob: personalInfo.dob || '',
    summary: personalInfo.summary || '',
    photoUrl: personalInfo.photoUrl || '',
    includePhoto: personalInfo.includePhoto || false,
    
    // Arrays (pass through)
    experience: formData.experience || [],
    education: formData.education || [],
    projects: formData.projects || [],
    certifications: formData.certifications || [],
    publications: formData.publications || [],
    languages: formData.languages || [],
    
    // Categorized skills
    skillsData: skillsData,
    
    // Skills (flattened)
    skills: allSkills,
    skillsGrouped: skills // Keep grouped version for templates that need it
  };
}

// ============================================================
// �📮 MAIN POST HANDLER
// ============================================================
export async function POST(request) {
  console.log('[API] CV GENERATION STARTED');
  const startTime = Date.now();
  
  // Add 60-second timeout for entire operation (PDF generation can take 20-30s)
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout - operation took too long')), 60000)
  );
  
  const mainOperation = async () => {
    try {
      // Parse JSON body first (before auth, as auth only reads headers)
      console.log('[API] Step 1: Parsing request body');
      const { formData, cvType = 'modern', industry = 'technology', userId, save = false, cvTitle, templateId } = await request.json();
      console.log('[API] Step 1 Complete: Request parsed');
      
      // Then authenticate
      const { decodedToken } = await requireAuth(request);
      console.log('[API] Step 1: Authentication passed');

      // 1. VALIDATE INPUTS
      console.log('[API] Step 2: Validating inputs');
      validateFormData(formData);
      
      if (!userId) {
        console.log('[API] Error: Missing userId');
        return NextResponse.json({ success: false, message: 'User ID required' }, { status: 400 });
      }

      assertSameUserOrAdmin(decodedToken, userId);

      // 2. GET USER DATA
      console.log('[API] Step 3: Fetching user data');
      const { ref: userRef, data: userData } = await getUserData(userId);
      console.log('[API] Step 3 Complete: User found');

      // 3. CHECK TOKENS (Free users only)
      console.log('[API] Step 4: Checking tokens');
      const tokens = Number(userData.tokens ?? 0);
      if (!userData.isPro && (!Number.isFinite(tokens) || tokens < 1)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Insufficient tokens. Upgrade to Pro or purchase tokens.',
          tokensRemaining: 0
        }, { status: 402 });
      }

      // 4. GENERATE CV WITH PREMIUM TEMPLATES (NO AI DEPENDENCY)
      console.log('[API] Step 5: Generating CV template');
      if (process.env.DEBUG) console.log(`[API] Generating ${cvType} CV for industry: ${industry}`);
      
      const archetype = (cvType || 'modern').toLowerCase();
      const { render } = getTemplate(archetype);
      const templateMeta = getMeta(archetype);
      const templateIdNormalized = Math.max(1, Number(templateId) || 1);

      // Transform nested formData to flat structure for templates
      const transformedData = transformFormDataForTemplates(formData);
      if (process.env.DEBUG) console.log('[API] Data transformed for template:', { 
        name: transformedData.name, 
        hasPhoto: !!transformedData.photoUrl,
        experienceCount: transformedData.experience?.length,
        skillsCount: transformedData.skills?.length
      });

      let cvHtml = null;
      let generationMethod = `archetype:${archetype}`;
      
      try {
        cvHtml = render(transformedData, industry, templateIdNormalized);
        console.log('[API] Step 5 Complete: Template generated');
        if (process.env.DEBUG) console.log(`[API] Archetype ${archetype} template generated`);
      } catch (templateError) {
        console.error('[API] Template generation failed, falling back to premium:', templateError);
        cvHtml = generatePremiumCV(transformedData, cvType, industry);
        generationMethod = 'premium-template-fallback';
      }

      if (!cvHtml || cvHtml.length < 500) {
        throw new Error('CV generation produced invalid output');
      }

      // 4.5 GENERATE PDF FROM HTML
      let pdfBuffer = null;
      let pdfBase64 = null;
      try {
        if (process.env.DEBUG) console.log('[API] Converting HTML to PDF...');
        // Wrap PDF generation with 35-second timeout
        const pdfPromise = generatePDF(cvHtml, cvTitle || `${cvType} CV`);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF generation timeout')), 35000)
        );
        pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]);
        pdfBase64 = pdfBuffer.toString('base64');
        if (process.env.DEBUG) console.log(`[API] PDF generated successfully (${pdfBuffer.length} bytes)`);
      } catch (pdfError) {
        console.error('[PDF Error] Failed to generate PDF:', pdfError.message);
        pdfBase64 = null; // Allow HTML fallback
      }

      // 5. NOTE: CV saving is now handled via /api/save-cv endpoint
      // This prevents duplicate saves and provides better error handling
      let cvId = null;

      // 6. DEDUCT TOKENS (Free users)
      // Note: Tokens are deducted regardless of save status
      if (!userData.isPro) {
        await userRef.update({ 
          tokens: admin.firestore.FieldValue.increment(-1),
          lastGenerated: new Date().toISOString(),
          totalGenerations: admin.firestore.FieldValue.increment(1)
        });
      } else {
        // Track generations for Pro users too
        await userRef.update({ 
          lastGenerated: new Date().toISOString(),
          totalGenerations: admin.firestore.FieldValue.increment(1)
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
          method: generationMethod
        });
      } catch (logError) {
        console.error('Logging error:', logError);
      }

      // 8. RETURN RESPONSE
      const duration = Date.now() - startTime;
      console.log('[API] CV GENERATION COMPLETED in ' + duration + 'ms');
      return NextResponse.json({ 
        success: true,
        cvHtml,
        pdfBase64: pdfBase64, // Include PDF in response
        formData: formData, // Include form data for editing
        cvType,
        archetype,
        templateMeta,
        templateId: templateIdNormalized,
        method: generationMethod,
        industry,
        tokensRemaining: userData.isPro ? 'unlimited' : Math.max(0, Number(userData.tokens ?? 0) - 1),
        message: 'Professional CV generated successfully',
        duration: duration
      });

    } catch (error) {
      console.error('[API Error]', error);    
      // Return appropriate status codes based on error type
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
      }
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
  };
  
  // Execute with timeout
  try {
    return await Promise.race([mainOperation(), timeoutPromise]);
  } catch (timeoutError) {
    console.error('[API Timeout]', timeoutError);
    return NextResponse.json({ 
      success: false, 
      message: 'Request timeout. Please try again.',
      error: process.env.NODE_ENV === 'development' ? timeoutError.toString() : undefined
    }, { status: 504 });
  }
}

// ============================================================
// 🔄 GET HANDLER - METADATA or RETRIEVE SAVED CV
// ============================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cvId = searchParams.get('cvId');
  const userId = searchParams.get('userId');

  // If no cvId, serve metadata (public)
  if (!cvId && !userId) {
    return NextResponse.json({
      success: true,
      archetypes: listArchetypes(),
      industries: Object.keys(INDUSTRY_PALETTES)
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    });
  }

  try {
    const { decodedToken } = await requireAuth(request);

    if (!cvId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const cvDoc = await db.collection('cvStorage').doc(cvId).get();
    
    if (!cvDoc.exists) {
      return NextResponse.json({ success: false, message: 'CV not found' }, { status: 404 });
    }

    const cvData = cvDoc.data();
    assertSameUserOrAdmin(decodedToken, cvData.userId);

    // Decompress HTML
    let cvHtml = cvData.compressedHtml;
    
    // Update last accessed
    await db.collection('cvStorage').doc(cvId).update({
      lastAccessed: new Date().toISOString()
    });

    return NextResponse.json({ success: true, cvHtml, cvData });

  } catch (error) {
    console.error('CV Retrieval Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: false, message: 'Failed to retrieve CV' }, { status: 500 });
  }
}
