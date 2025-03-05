import React, { useState } from 'react';
import axios from 'axios';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const Predict = () => {
  const [file, setFile] = useState<File | null>(null);
  const [disease, setDisease] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const diseases = ["Blight", "Rust", "Mildew", "Wilt", "Spot"];
  const db = getFirestore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!file || !auth.currentUser) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload image
      const response = await axios.post('https://demo-plant-backend.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const uploadedUrl = response.data.url;
      setImageUrl(uploadedUrl);

      // Generate prediction
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      setDisease(randomDisease);

      // Save to Firestore with regular timestamp
      const userEmail:any = auth.currentUser.email;
      const userDocRef = doc(db, 'history', userEmail);
      const userDoc = await getDoc(userDocRef);

      const newHistoryEntry = {
        imageurl: uploadedUrl,
        prediction: randomDisease,
        timestamp: new Date().toISOString() // Using ISO string format instead of serverTimestamp
      };

      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          history: arrayUnion(newHistoryEntry)
        });
      } else {
        await setDoc(userDocRef, {
          email: userEmail,
          username: auth.currentUser.displayName,
          history: [newHistoryEntry]
        });
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Predict Plant Disease</h1>
      <div className="space-y-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button 
          onClick={handlePredict}
          disabled={!file || isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Predict'}
        </button>
        
        {disease && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p className="text-xl">Predicted Disease: {disease}</p>
            {imageUrl && (
              <img src={imageUrl} alt="Uploaded plant" className="mt-2 max-w-md rounded" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predict;
