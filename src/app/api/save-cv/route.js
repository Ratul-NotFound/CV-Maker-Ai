import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { compressCV } from '@/lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { validateInput } from '@/lib/validation';
import logger from '@/lib/logger';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 20, 60000)) { // 20 requests per minute
      return NextResponse.json({
        success: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    const body = await request.json();
    const { userId, htmlContent, title, industry, template, formData } = body;
    
    // Input validation
    if (!userId || !htmlContent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: userId and htmlContent' 
      }, { status: 400 });
    }

    // Validate inputs
    validateInput.string(userId, 'userId', 128);
    validateInput.string(htmlContent, 'htmlContent', 2000000); // 2MB limit
    if (title) validateInput.string(title, 'title', 200);
    if (industry) validateInput.string(industry, 'industry', 50);
    if (template) validateInput.string(template, 'template', 50);
    
    // Check if user is Pro
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc || !userDoc.exists) {
      logger.error('SaveCV', 'User not found', { userId });
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    if (!userDoc.data().isPro) {
      return NextResponse.json({ 
        success: false, 
        error: 'Only Pro users can save CVs. Please upgrade your account.' 
      }, { status: 403 });
    }
    
    // Compress and save CV
    const compressedHtml = compressCV(htmlContent);
    const cvRef = db.collection('cvStorage').doc();
    
    const cvData = {
      id: cvRef.id,
      userId,
      title: (title || 'My CV').substring(0, 200),
      compressedHtml,
      originalSize: htmlContent.length,
      compressedSize: compressedHtml.length,
      industry: (industry || 'general').substring(0, 50),
      template: (template || 'modern').substring(0, 50),
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      downloadCount: 0,
      isPublic: false,
      formData: formData || {} // Store original form data for editing
    };
    
    await cvRef.set(cvData);
    
    // Update user's saved CV count
    await userRef.update({
      savedCVs: FieldValue.increment(1),
      lastSavedCV: new Date().toISOString()
    });

    logger.info('SaveCV', 'CV saved successfully', { userId, cvId: cvRef.id });
    
    return NextResponse.json({
      success: true,
      cvId: cvRef.id,
      message: 'CV saved successfully'
    });
    
  } catch (error) {
    if (error.message && error.message.includes('must be')) {
      // Validation error
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }

    logger.error('SaveCV', 'Failed to save CV', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save CV. Please try again.'
    }, { status: 500 });
  }
}