import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET: List all users
export async function GET() {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update User (Set Pro/Unlimited)
export async function POST(request) {
  try {
    const { userId, updates } = await request.json();
    await db.collection('users').doc(userId).update(updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Add specific tokens
export async function PUT(request) {
  try {
    const { userId, action, amount } = await request.json();
    if (action === 'add_tokens') {
      await db.collection('users').doc(userId).update({
        tokens: FieldValue.increment(amount)
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}