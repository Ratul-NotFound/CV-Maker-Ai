import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { decompressCV } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');

    if (!cvId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing cvId' 
      }, { status: 400 });
    }

    // Fetch CV from Firestore
    const cvDoc = await db.collection('cvStorage').doc(cvId).get();

    if (!cvDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'CV not found' 
      }, { status: 404 });
    }

    const cvData = cvDoc.data();
    
    // Decompress HTML if needed
    let htmlContent = cvData.compressedHtml || cvData.htmlContent || '';
    if (htmlContent && !htmlContent.startsWith('<!DOCTYPE')) {
      try {
        htmlContent = decompressCV(htmlContent);
      } catch (decompressError) {
        console.error('Decompression failed in view:', decompressError);
        htmlContent = cvData.htmlContent || '';
      }
    }

    return NextResponse.json({
      success: true,
      cv: {
        id: cvDoc.id,
        title: cvData.title || 'Untitled CV',
        htmlContent: htmlContent,
        template: cvData.template || 'modern',
        industry: cvData.industry || 'general',
        formData: cvData.formData || null,
        createdAt: cvData.createdAt || new Date().toISOString(),
        lastAccessed: cvData.lastAccessed
      }
    });

  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch CV'
    }, { status: 500 });
  }
}
