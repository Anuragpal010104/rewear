"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Item {
  id: string;
  title: string;
  size: string;
  status: string;
  images: string[];
}

export default function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(collection(db, "items"), where("status", "==", "available"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item.id} href={`/items/${item.id}`}>
              <div className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg">
                <div className="h-40 bg-gray-200 mb-2 rounded flex items-center justify-center">
                  {item.images && item.images[0] ? <Image src={item.images[0]} alt={item.title} width={160} height={160} style={{ objectFit: "cover", borderRadius: "0.5rem" }} /> : "No Image"}
                </div>
                <div className="font-bold">{item.title}</div>
                <div>Size: {item.size}</div>
                <div>{item.status}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
