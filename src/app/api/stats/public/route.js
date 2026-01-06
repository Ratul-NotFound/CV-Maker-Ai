import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Simple in-memory cache with TTL
let statsCache = null;
let cacheTTL = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes - reduced Firebase reads

export async function GET(request) {
  try {
    const fresh = request?.nextUrl?.searchParams?.get('fresh') === '1';

    // Return cached data if still valid
    if (!fresh && statsCache && Date.now() < cacheTTL) {
      return NextResponse.json(statsCache, {
        headers: {
          'Cache-Control': 'public, max-age=180, s-maxage=180',
          'X-Cache': 'HIT'
        }
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsersSnap, proUsersSnap, totalCvSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('users').where('isPro', '==', true).count().get(),
      db.collection('cvStorage').count().get()
    ]);

    let activeToday = 0;
    try {
      const activeTodaySnap = await db.collection('users').where('lastLogin', '>=', today).count().get();
      activeToday = activeTodaySnap.data().count || 0;
    } catch (activeErr) {
      console.warn('Active-today count query failed, falling back to scan:', activeErr.message);
      try {
        const recentUsersSnap = await db
          .collection('users')
          .orderBy('lastLogin', 'desc')
          .limit(2000)
          .get();
        const midnightMs = today.getTime();
        activeToday = recentUsersSnap.docs.reduce((acc, doc) => {
          const val = doc.data().lastLogin;
          let ms = null;
          if (val?.toDate) ms = val.toDate().getTime();
          else if (typeof val === 'string') ms = new Date(val).getTime();
          else if (typeof val === 'number') ms = val;
          return ms && ms >= midnightMs ? acc + 1 : acc;
        }, 0);
      } catch (scanErr) {
        console.error('Active-today scan failed:', scanErr.message);
        activeToday = 0;
      }
    }

    const totalUsers = totalUsersSnap.data().count || 0;
    const proUsers = proUsersSnap.data().count || 0;
    const totalGenerations = totalCvSnap.data().count || 0;

    statsCache = {
      success: true,
      totalUsers,
      proUsers,
      totalGenerations,
      activeToday,
      lastUpdated: new Date().toISOString(),
    };

    cacheTTL = Date.now() + CACHE_DURATION;

    return NextResponse.json(statsCache, {
      headers: {
        'Cache-Control': 'public, max-age=180, s-maxage=180',
        'X-Cache': fresh ? 'BYPASS' : 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);

    // Return cached data on error if available
    if (statsCache) {
      return NextResponse.json(statsCache, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache': 'STALE'
        }
      });
    }

    // Fallback data with error indication
    return NextResponse.json({
      success: false,
      totalUsers: 0,
      proUsers: 0,
      totalGenerations: 0,
      activeToday: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch stats'
    }, {
      status: 200, // Return 200 to prevent client errors
      headers: {
        'Cache-Control': 'no-cache, no-store',
      }
    });
  }
}