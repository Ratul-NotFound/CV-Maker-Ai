import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
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
    return NextResponse.json({ 
      success: false, 
      message: 'Upgrade failed' 
    }, { status: 500 });
  }
}