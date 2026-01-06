import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { requireAuth, assertAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    assertAdmin(decodedToken);
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'User ID is required' 
      }, { status: 400 });
    }

    // Update user to Pro
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      isPro: true,
      tokens: 999, // Unlimited tokens
      proSince: new Date().toISOString(),
      lastUpgraded: new Date().toISOString()
    });

    // Log the upgrade
    await db.collection('upgrades').add({
      userId,
      timestamp: new Date().toISOString(),
      plan: 'pro',
      amount: 50
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade successful' 
    });

  } catch (error) {
    console.error('Upgrade error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ 
      success: false, 
      message: 'Upgrade failed' 
    }, { status: 500 });
  }
}