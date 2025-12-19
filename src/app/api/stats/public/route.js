import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    
    // Get all CVs from cvStorage
    const cvStorageSnapshot = await db.collection('cvStorage').get();
    
    // Calculate stats
    const proUsers = users.filter(user => user.isPro).length;
    
    // Count users active today (within last 24 hours)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = users.filter(user => {
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
      return lastLogin && lastLogin >= today;
    }).length;
    
    // Count total CV generations
    const cvStorageCount = cvStorageSnapshot.size;
    const userTotalGenerations = users.reduce((sum, user) => {
      return sum + (user.totalGenerations || 0);
    }, 0);
    
    const totalGenerations = Math.max(cvStorageCount, userTotalGenerations);
    
    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      proUsers,
      totalGenerations,
      activeToday,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}