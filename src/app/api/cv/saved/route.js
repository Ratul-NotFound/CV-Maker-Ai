import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing userId' 
      }, { status: 400 });
    }

    // Query all CVs for this user from cvStorage collection
    // Note: Not using orderBy to avoid requiring a composite index
    // Sorting is done on client side
    const cvSnapshot = await db
      .collection('cvStorage')
      .where('userId', '==', userId)
      .get();

    const cvs = [];
    cvSnapshot.forEach(doc => {
      try {
        const cvData = doc.data();
        cvs.push({
          id: doc.id,
          title: cvData.title || 'Untitled CV',
          template: cvData.template || 'modern',
          industry: cvData.industry || 'general',
          createdAt: cvData.createdAt || new Date().toISOString(),
          lastAccessed: cvData.lastAccessed,
          downloadCount: cvData.downloadCount || 0,
          isPublic: cvData.isPublic || false
          // Don't send HTML content in list view
        });
      } catch (docError) {
        console.error('Error processing CV document:', doc.id, docError);
      }
    });

    // Sort by createdAt on the server side (descending)
    cvs.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      cvs: cvs,
      count: cvs.length
    });

  } catch (error) {
    console.error('Error fetching saved CVs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch saved CVs'
    }, { status: 500 });
  }
}
