import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
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

    if (cvDoc.data().userId !== userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 403 });
    }

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
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete CV'
    }, { status: 500 });
  }
}
