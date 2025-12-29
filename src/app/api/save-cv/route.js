import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { compressCV } from '@/lib/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request) {
  try {
    const { userId, htmlContent, title, industry, template, formData } = await request.json();
    
    if (!userId || !htmlContent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Check if user is Pro
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc || !userDoc.exists || !userDoc.data().isPro) {
      return NextResponse.json({ 
        success: false, 
        error: 'Only Pro users can save CVs' 
      }, { status: 403 });
    }
    
    // Compress and save CV
    const compressedHtml = compressCV(htmlContent);
    const cvRef = db.collection('cvStorage').doc();
    
    const cvData = {
      id: cvRef.id,
      userId,
      title: title || 'My CV',
      compressedHtml,
      originalSize: htmlContent.length,
      compressedSize: compressedHtml.length,
      industry: industry || 'general',
      template: template || 'modern',
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
    
    return NextResponse.json({
      success: true,
      cvId: cvRef.id,
      message: 'CV saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving CV:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save CV'
    }, { status: 500 });
  }
}