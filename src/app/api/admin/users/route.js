import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAuth, assertAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: List all users
export async function GET(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    assertAdmin(decodedToken);
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, users });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update User (Set Pro/Unlimited)
export async function POST(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    assertAdmin(decodedToken);
    const { userId, updates } = await request.json();
    await db.collection('users').doc(userId).update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Add specific tokens
export async function PUT(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    assertAdmin(decodedToken);
    const { userId, action, amount } = await request.json();
    if (action === 'add_tokens') {
      await db.collection('users').doc(userId).update({
        tokens: FieldValue.increment(amount)
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}