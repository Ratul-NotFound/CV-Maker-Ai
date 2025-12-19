import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Check if admin (you can implement proper admin auth later)
    // For now, we'll just return all requests
    
    const requestsRef = db.collection('upgradeRequests');
    const snapshot = await requestsRef.orderBy('submittedAt', 'desc').get();
    
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching upgrade requests:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { requestId, action, userId, reason } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    const requestRef = db.collection('upgradeRequests').doc(requestId);
    const requestDoc = await requestRef.get();
    
    if (!requestDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        message: 'Request not found' 
      }, { status: 404 });
    }

    const requestData = requestDoc.data();

    if (action === 'approve') {
      // Update user to Pro
      await db.collection('users').doc(requestData.userId).update({
        isPro: true,
        proSince: new Date().toISOString(),
        tokens: 999999
      });

      // Update request status
      await requestRef.update({
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin' // You can get admin info from auth
      });

      // Send email to user (implement email service later)
      // await sendUpgradeConfirmationEmail(requestData.userEmail);

    } else if (action === 'reject') {
      // Update request status
      await requestRef.update({
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'admin',
        notes: reason || 'Payment verification failed'
      });

      // Send rejection email (implement email service later)
      // await sendRejectionEmail(requestData.userEmail, reason);

    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid action' 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing upgrade request:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}