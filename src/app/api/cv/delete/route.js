import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAuth, assertSameUserOrAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
    const { decodedToken } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('cvId');
    const userId = searchParams.get('userId');

    if (!cvId || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing cvId or userId' 
      }, { status: 400 });
    }

    // Verify ownership
    const cvDoc = await db.collection('cvStorage').doc(cvId).get();
    
    if (!cvDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        error: 'CV not found' 
      }, { status: 404 });
    }

    assertSameUserOrAdmin(decodedToken, cvDoc.data().userId);

    // Delete the CV
    await cvDoc.ref.delete();

    // Update user's saved CV count
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      savedCVs: FieldValue.increment(-1)
    });

    return NextResponse.json({
      success: true,
      message: 'CV deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting CV:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete CV'
    }, { status: 500 });
  }
}
