import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { validateInput } from '@/lib/validation';
import logger from '@/lib/logger';
import { checkRateLimit, getClientIP } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    // Rate limiting - prevent spam
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP, 5, 3600000)) { // 5 requests per hour
      return NextResponse.json({
        success: false,
        message: 'Too many upgrade requests. Please try again later.'
      }, { status: 429 });
    }

    const body = await request.json();
    const { userId, userEmail, userName, transactionId, paymentMethod, amount, paymentNumber } = body;

    // Input validation
    if (!userId || !transactionId || !userEmail) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: userId, transactionId, userEmail' 
      }, { status: 400 });
    }

    try {
      validateInput.string(userId, 'userId', 128);
      validateInput.email(userEmail);
      validateInput.string(transactionId, 'transactionId', 100);
      if (userName) validateInput.string(userName, 'userName', 200);
      if (paymentMethod) validateInput.string(paymentMethod, 'paymentMethod', 50);
      if (paymentNumber) validateInput.string(paymentNumber, 'paymentNumber', 50);
      if (amount) validateInput.positiveNumber(amount, 'amount');
    } catch (validationError) {
      return NextResponse.json({
        success: false,
        message: validationError.message
      }, { status: 400 });
    }

    // Validate transaction ID format (at least 8 characters)
    if (transactionId.trim().length < 8) {
      return NextResponse.json({ 
        success: false, 
        message: 'Transaction ID must be at least 8 characters. Please check and try again.' 
      }, { status: 400 });
    }

    // Check if this transaction ID already exists
    const existingRequest = await db.collection('upgradeRequests')
      .where('transactionId', '==', transactionId.trim())
      .get();
    
    if (!existingRequest.empty) {
      logger.warn('UpgradeRequest', 'Duplicate transaction ID', { transactionId, userId });
      return NextResponse.json({ 
        success: false, 
        message: 'This transaction ID has already been submitted. Please contact support if this is an error.' 
      }, { status: 409 });
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
      }, { status: 409 });
    }

    // Save upgrade request to database
    const requestRef = await db.collection('upgradeRequests').add({
      userId,
      userEmail: userEmail.toLowerCase(),
      userName: (userName || 'User').substring(0, 200),
      transactionId: transactionId.trim(),
      paymentMethod: paymentMethod || 'bank_transfer',
      paymentNumber: paymentNumber ? paymentNumber.substring(0, 50) : null,
      amount: amount || 50,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewedAt: null,
      notes: ''
    });

    logger.info('UpgradeRequest', 'Upgrade request submitted', { 
      userId, 
      requestId: requestRef.id,
      transactionId: transactionId.substring(0, 4) + '***'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Upgrade request submitted successfully. Our team will review it shortly.',
      requestId: requestRef.id
    });

  } catch (error) {
    logger.error('UpgradeRequest', 'Failed to process upgrade request', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit upgrade request. Please try again later.' 
    }, { status: 500 });
  }
}
