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
    const freeUsers = users.length - proUsers;
    
    // Count users active today (within last 24 hours)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = users.filter(user => {
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
      return lastLogin && lastLogin >= today;
    }).length;
    
    // Count total CV generations
    // First, count from cvStorage (for pro users)
    const cvStorageCount = cvStorageSnapshot.size;
    
    // Then, sum totalGenerations from all users (includes free user CVs)
    const userTotalGenerations = users.reduce((sum, user) => {
      return sum + (user.totalGenerations || 0);
    }, 0);
    
    // Use the larger number (or sum them for complete picture)
    const totalGenerations = Math.max(cvStorageCount, userTotalGenerations);
    
    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      proUsers,
      freeUsers,
      totalGenerations,
      activeToday,
      lastUpdated: new Date().toISOString(),
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        isPro: u.isPro,
        lastLogin: u.lastLogin
      }))
    });
  } catch (error) {
    console.error('Error fetching all stats:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      totalUsers: 0,
      proUsers: 0,
      freeUsers: 0,
      totalGenerations: 0,
      activeToday: 0,
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
}