import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const cvStorageSnapshot = await getDocs(collection(db, 'cvStorage'));
    const count = cvStorageSnapshot.size;
    
    return Response.json({ count });
  } catch (error) {
    console.error('Error counting CVs:', error);
    return Response.json({ count: 0 });
  }
}