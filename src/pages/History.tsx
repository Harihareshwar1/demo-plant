import  { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

interface HistoryEntry {
  imageurl: string;
  prediction: string;
  timestamp: string;
}

interface HistoryData {
  email: string;
  username: string;
  history: HistoryEntry[];
}

export const History = () => {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser?.email) return;

      const db = getFirestore();
      const userDocRef = doc(db, 'history', auth.currentUser.email);
      
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as HistoryData;
          setHistoryData(data.history.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-6">Prediction History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {historyData.map((entry, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <img 
              src={entry.imageurl} 
              alt={`Prediction ${index + 1}`} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p className="text-lg font-semibold">
                Prediction: {entry.prediction}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {historyData.length === 0 && (
        <p className="text-center text-gray-400">No prediction history found.</p>
      )}
    </div>
  );
};

export default History;
