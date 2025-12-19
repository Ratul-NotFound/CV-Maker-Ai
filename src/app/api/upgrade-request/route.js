import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { userId, userEmail, userName, transactionId, paymentMethod, amount, paymentNumber } = await request.json();

    if (!userId || !transactionId || !userEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Validate transaction ID format
    if (transactionId.length < 8) {
      return NextResponse.json({ 
        success: false, 
        message: 'Transaction ID seems invalid. Please check and try again.' 
      }, { status: 400 });
    }

    // Check if this transaction ID already exists
    const existingRequest = await db.collection('upgradeRequests')
      .where('transactionId', '==', transactionId)
      .get();
    
    if (!existingRequest.empty) {
      return NextResponse.json({ 
        success: false, 
        message: 'This transaction ID has already been submitted. Please contact support if this is an error.' 
      }, { status: 400 });
    }

    // Check if user already has pending request
    const userPendingRequest = await db.collection('upgradeRequests')
      .where('userId', '==', userId)
      .where('status', '==', 'pending')
      .get();
    
    if (!userPendingRequest.empty) {
      return NextResponse.json({ 
        success: false, 
        message: 'You already have a pending upgrade request. Please wait for admin approval.' 
      }, { status: 400 });
    }

    // Save upgrade request to database
    const requestRef = await db.collection('upgradeRequests').add({
      userId,
      userEmail,
      userName: userName || 'User',
      transactionId: transactionId.trim(),
      paymentMethod,
      paymentNumber,
      amount: amount || 50,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      notes: ''
    });

    // Send email notification to admin (you can implement this later)
    // await sendAdminNotification({ userId, userEmail, transactionId });

    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade request submitted successfully',
      requestId: requestRef.id
    });

  } catch (error) {
    console.error('Upgrade request error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}