"use client";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

interface Item {
  id: string;
  title: string;
  status: string;
}

export default function AdminPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, "items"));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)));
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to fetch items.");
      }
    };

    fetchItems();
  }, []);

  const handleApprove = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "approved" });
      setItems(items.map(item => (item.id === itemId ? { ...item, status: "approved" } : item)));
    } catch (err) {
      console.error("Error approving item:", err);
      setError("Failed to approve item.");
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "rejected" });
      setItems(items.map(item => (item.id === itemId ? { ...item, status: "rejected" } : item)));
    } catch (err) {
      console.error("Error rejecting item:", err);
      setError("Failed to reject item.");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await deleteDoc(itemRef);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Admin Panel</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded shadow border border-gray-200">
            <p><strong>Title:</strong> {item.title}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleApprove(item.id)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
