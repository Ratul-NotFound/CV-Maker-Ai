import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { decompressCV } from '@/lib/firestore';

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
    
    // Decompress HTML if it's compressed
    let htmlContent = cvData.compressedHtml || cvData.htmlContent || '';
    if (htmlContent && !htmlContent.startsWith('<!DOCTYPE')) {
      try {
        // Try to decompress if it looks compressed
        htmlContent = decompressCV(htmlContent);
      } catch (decompressError) {
        console.error('Decompression failed, using raw content:', decompressError);
        // If decompression fails, use HTML content as fallback
        htmlContent = cvData.htmlContent || '';
      }
    }

    // Update last accessed time and download count
    try {
      await cvDoc.ref.update({
        lastAccessed: new Date().toISOString(),
        downloadCount: (cvData.downloadCount || 0) + 1
      });
    } catch (updateError) {
      console.warn('Warning: Could not update download stats:', updateError);
      // Don't fail the request if stats update fails
    }

    return NextResponse.json({
      success: true,
      html: htmlContent,
      title: cvData.title,
      template: cvData.template,
      industry: cvData.industry
    });

  } catch (error) {
    console.error('Error downloading CV:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to download CV'
    }, { status: 500 });
  }
}
