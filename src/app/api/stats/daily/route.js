import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const cvStorageSnapshot = await getDocs(collection(db, 'cvStorage'));
    const dailyStats = {};
    
    cvStorageSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.createdAt) {
        // Parse the date properly
        const dateObj = new Date(data.createdAt);
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
      success: false,
      dailyStats: sampleStats,
      isSample: true
    });
  }
}