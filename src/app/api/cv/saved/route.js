import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { requireAuth, assertSameUserOrAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// In-memory cache for saved CVs
const cvCache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes - reduced Firebase reads

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  try {
    const { decodedToken } = await requireAuth(request);
    const userId = searchParams.get('userId');
    const limitParam = Number(searchParams.get('limit'));
    const cursor = searchParams.get('cursor');
    const includeCount = searchParams.get('includeCount') === '1';
    const pageSize = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 100 ? limitParam : 10;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing userId' 
      }, { status: 400 });
    }

    assertSameUserOrAdmin(decodedToken, userId);

    // Pagination: no cache to avoid mixing pages
    let queryRef = db
      .collection('cvStorage')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(pageSize);

    if (cursor) {
      const cursorDate = new Date(cursor);
      queryRef = Number.isNaN(cursorDate.getTime())
        ? queryRef.startAfter(cursor)
        : queryRef.startAfter(cursorDate);
    }

    let cvSnapshot;
    try {
      cvSnapshot = await queryRef.get();
    } catch (indexError) {
      // If Firestore demands an index, fall back to full-scan + in-memory sort/pagination
      if (indexError?.code === 9 || (indexError?.message || '').includes('FAILED_PRECONDITION')) {
        return await handleIndexFallback({ userId, pageSize, cursor });
      }
      try {
        queryRef = db
          .collection('cvStorage')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(pageSize);
        if (cursor) {
          const fallbackCursorDate = new Date(cursor);
          if (!Number.isNaN(fallbackCursorDate.getTime())) {
            queryRef = queryRef.startAfter(fallbackCursorDate);
          }
        }
        cvSnapshot = await queryRef.get();
      } catch (fallbackError) {
        console.error('Error fetching CVs:', fallbackError.message);
        throw fallbackError;
      }
    }

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
        compressedSize: cvData.compressedSize || 0,
        isPublic: cvData.isPublic || false
      });
    });

    // Sort by createdAt (descending) to ensure consistent order
    cvs.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    const last = cvSnapshot.docs[cvSnapshot.docs.length - 1];
    const lastCreatedAt = last ? last.data().createdAt : null;
    const nextCursor = lastCreatedAt
      ? (lastCreatedAt.toDate ? lastCreatedAt.toDate().toISOString() : lastCreatedAt)
      : null;

    let totalCount = undefined;
    if (includeCount) {
      try {
        const countSnapshot = await db
          .collection('cvStorage')
          .where('userId', '==', userId)
          .count()
          .get();
        totalCount = countSnapshot.data().count || 0;
      } catch (countError) {
        console.warn('Count aggregator failed, falling back to full scan:', countError.message);
        try {
          const fullScan = await db
            .collection('cvStorage')
            .where('userId', '==', userId)
            .select('__name__')
            .get();
          totalCount = fullScan.size;
        } catch (fullScanError) {
          console.error('Full scan count failed:', fullScanError.message);
          totalCount = cvs.length;
        }
      }
    }

    return NextResponse.json({ success: true, cvs, nextCursor, totalCount }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error fetching saved CVs:', error.message);

    // Provide clearer guidance when Firestore index is missing
    if (error.code === 9 || (error.message && error.message.includes('FAILED_PRECONDITION'))) {
      return await handleIndexFallback({ userId: searchParams.get('userId'), pageSize: 10, cursor: searchParams.get('cursor') });
    }

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

async function handleIndexFallback({ userId, pageSize, cursor }) {
  try {
    const snapshot = await db
      .collection('cvStorage')
      .where('userId', '==', userId)
      .get();

    const all = snapshot.docs.map(doc => {
      const data = doc.data();
      const created = data.createdAt || null;
      return {
        id: doc.id,
        title: data.title || 'Untitled CV',
        template: data.template || 'modern',
        industry: data.industry || 'general',
        createdAt: created ? (created.toDate ? created.toDate().toISOString() : created) : null,
        lastAccessed: data.lastAccessed,
        downloadCount: data.downloadCount || 0,
        compressedSize: data.compressedSize || 0,
        isPublic: data.isPublic || false,
      };
    });

    // Sort newest first
    all.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    const cursorKey = cursor || null;
    let startIndex = 0;
    if (cursorKey) {
      const idx = all.findIndex(cv => `${cv.createdAt || ''}__${cv.id}` === cursorKey);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    const page = all.slice(startIndex, startIndex + pageSize);
    const last = page[page.length - 1];
    const nextCursor = last ? `${last.createdAt || ''}__${last.id}` : null;

    return NextResponse.json({
      success: true,
      cvs: page,
      nextCursor,
      totalCount: all.length,
      indexFallback: true
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (fallbackError) {
    console.error('Index fallback failed:', fallbackError.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch without index: ' + fallbackError.message }, { status: 500 });
  }
}

// Sync the actual count with user document
export async function PUT(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing userId' 
      }, { status: 400 });
    }

    assertSameUserOrAdmin(decodedToken, userId);

    // Count actual CVs in database
    const cvSnapshot = await db
      .collection('cvStorage')
      .where('userId', '==', userId)
      .select('__name__')
      .get();

    const actualCount = cvSnapshot.size;

    // Update user document with correct count
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      savedCVs: actualCount,
      lastSyncedAt: new Date().toISOString()
    });

    // Clear cache for this user
    const cacheKey = `cvs:${userId}`;
    cvCache.delete(cacheKey);

    return NextResponse.json({ 
      success: true, 
      count: actualCount,
      message: 'CV count synced successfully'
    });

  } catch (error) {
    console.error('Error syncing CV count:', error.message);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
