import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// In-memory cache for saved CVs
const cvCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

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

    // Check cache first
    const cacheKey = `cvs:${userId}`;
    const cached = cvCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({ success: true, cvs: cached.data }, {
        headers: {
          'Cache-Control': 'public, max-age=180',
          'X-Cache': 'HIT'
        }
      });
    }

    // Query all CVs for this user from cvStorage collection
    const cvSnapshot = await db
      .collection('cvStorage')
      .where('userId', '==', userId)
      .limit(100) // Safety limit
      .get();

    const cvs = [];
    cvSnapshot.forEach(doc => {
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
      });
    });

    // Sort by createdAt (descending)
    cvs.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Cache the result
    cvCache.set(cacheKey, {
      data: cvs,
      expiresAt: Date.now() + CACHE_TTL
    });

    return NextResponse.json({ success: true, cvs }, {
      headers: {
        'Cache-Control': 'public, max-age=180',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching saved CVs:', error);

    // Try to return cached data on error
    const cacheKey = `cvs:${searchParams?.get('userId')}`;
    const cached = cvCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, cvs: cached.data }, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache': 'STALE'
        }
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
