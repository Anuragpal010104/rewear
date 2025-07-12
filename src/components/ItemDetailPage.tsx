"use client";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { User } from "../context/AuthContext";

interface ItemDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploader: string;
  status: string;
  points: number;
}

export default function ItemDetailPage({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [user] = useState<User | null>(null); // Assuming user state is managed here
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "items", itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() } as ItemDetail);
      } else {
        console.error("Item not found");
      }
    };

    fetchItem();
  }, [itemId]);

  const handleRedeem = async () => {
    try {
      if (!user) {
        setError("User not authenticated");
        return;
      }
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentPoints = userSnap.data().points || 0;
        if (item && currentPoints >= item.points) {
          await updateDoc(userRef, { points: currentPoints - item.points });
          alert("Product redeemed successfully!");
        } else {
          alert("Insufficient points to redeem this product.");
        }
      }
    } catch (error) {
      console.error("Error redeeming product:", error);
      setError("Failed to redeem product. Please try again.");
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">{item.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="grid grid-cols-1 gap-4">
            {item.images.map((image, index) => (
              <Image key={index} src={image} alt={item.title} width={500} height={500} className="rounded shadow" />
            ))}
          </div>
        </div>
        <div>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Size:</strong> {item.size}</p>
          <p><strong>Condition:</strong> {item.condition}</p>
          <p><strong>Tags:</strong> {item.tags.join(", ")}</p>
          <p><strong>Uploader:</strong> {item.uploader}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Points:</strong> {item.points}</p>
          <div className="flex gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Swap Request</button>
            <button onClick={handleRedeem} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Redeem via Points</button>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}
