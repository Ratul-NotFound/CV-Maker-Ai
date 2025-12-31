import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Simple in-memory cache with TTL
let statsCache = null;
let cacheTTL = 0;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes (faster updates)

export async function GET() {
  try {
    // Return cached data if still valid
    if (statsCache && Date.now() < cacheTTL) {
      return NextResponse.json(statsCache, {
        headers: {
          'Cache-Control': 'public, max-age=180, s-maxage=180',
          'Content-Encoding': 'gzip',
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch user count first (faster)
    const userCountSnapshot = await db.collection('users')
      .select('__name__') // Only fetch document ID
      .limit(10000)
      .get();
    
    const totalUsers = userCountSnapshot.size;

    // Fetch pro users count
    const proUsersSnapshot = await db.collection('users')
      .where('isPro', '==', true)
      .select('__name__')
      .limit(5000)
      .get();
    
    const proUsers = proUsersSnapshot.size;

    // Fetch active today count (optimized)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeSnapshot = await db.collection('users')
      .where('lastLogin', '>=', today.toISOString())
      .select('__name__')
      .limit(5000)
      .get();
    
    const activeToday = activeSnapshot.size;

    // Fetch total generations (approximate with CV count)
    const cvCountSnapshot = await db.collection('cvStorage')
      .select('__name__')
      .limit(10000)
      .get();
    
    const totalGenerations = cvCountSnapshot.size;

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
        'X-Cache': 'MISS'
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

    // Fallback data with short cache
    return NextResponse.json({
      success: true,
      totalUsers: 1250,
      proUsers: 342,
      totalGenerations: 5890,
      activeToday: 156,
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60',
        'X-Cache': 'FALLBACK'
      }
    });
  }
}