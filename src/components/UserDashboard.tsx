"use client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface UploadedItem {
  id: string;
  title: string;
  status: string;
}

interface Swap {
  id: string;
  status: string;
}

export default function UserDashboard() {
  const { user, userData } = useAuth() ?? {};
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);

  useEffect(() => {
    const fetchUploadedItems = async () => {
      if (user) {
        const q = query(collection(db, "items"), where("uploader", "==", user.uid));
        const snapshot = await getDocs(q);
        setUploadedItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedItem)));
      }
    };

    const fetchSwaps = async () => {
      if (user) {
        const q = query(collection(db, "swaps"), where("participants", "array-contains", user.uid));
        const snapshot = await getDocs(q);
        setSwaps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Swap)));
      }
    };

    fetchUploadedItems();
    fetchSwaps();
  }, [user]);

  const completeListing = () => {
    // Logic to complete the listing and update points
  };

  const completeSwap = () => {
    // Logic to complete the swap and update points
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Profile</h2>
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <p><strong>Name:</strong> {userData?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Points:</strong> {userData?.points}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Uploaded Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {uploadedItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded shadow border border-gray-200">
              <p><strong>Title:</strong> {item.title}</p>
              <p><strong>Status:</strong> {item.status}</p>
              {user && (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  onClick={() => completeListing()}
                >
                  Complete Listing
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Swaps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {swaps.map(swap => (
            <div key={swap.id} className="bg-white p-4 rounded shadow border border-gray-200">
              <p><strong>Status:</strong> {swap.status}</p>
              {user && (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={() => completeSwap()}
                >
                  Complete Swap
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
