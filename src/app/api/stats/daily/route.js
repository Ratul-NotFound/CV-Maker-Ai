import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cvStorageSnapshot = await db.collection('cvStorage')
      .orderBy('createdAt', 'desc')
      .limit(2000) // Limit for performance but more headroom
      .get();
    
    const dailyStats = {};
    
    cvStorageSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        // Parse Firestore Timestamp, ISO string, or ms number
        let dateObj = null;
        if (data.createdAt?.toDate) dateObj = data.createdAt.toDate();
        else if (typeof data.createdAt === 'string') dateObj = new Date(data.createdAt);
        else if (typeof data.createdAt === 'number') dateObj = new Date(data.createdAt);
        if (!dateObj || Number.isNaN(dateObj.getTime())) return;

        const date = dateObj.toISOString().split('T')[0];
        
        if (!dailyStats[date]) {
          dailyStats[date] = 0;
        }
        dailyStats[date]++;
      }
    });
    
    // If no data, return sample data for demo
    if (Object.keys(dailyStats).length === 0) {
      // Generate sample data for last 7 days
      const sampleStats = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        sampleStats[dateStr] = Math.floor(Math.random() * 50) + 20;
      }
      
      const formattedStats = Object.entries(sampleStats)
        .map(([date, generations]) => ({ date, generations }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return Response.json({
        success: true,
        dailyStats: formattedStats,
        isSample: true
      });
    }
    
    const formattedStats = Object.entries(dailyStats)
      .map(([date, generations]) => ({ date, generations }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // Last 30 days
    
    return Response.json({
      success: true,
      dailyStats: formattedStats,
      isSample: false
    });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    
    // Return sample data on error
    const sampleStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      sampleStats.push({
        date: dateStr,
        generations: Math.floor(Math.random() * 50) + 20
      });
    }
    
    return Response.json({
      success: true, // Return success:true even on error to prevent client crashes
      dailyStats: sampleStats,
      isSample: true,
      error: error.message
    }, { status: 200 });
  }
}