"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Item {
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
  pointsRequired?: number;
}

export default function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Fetching items from Firestore...");
        // Only fetch approved items for regular users
        const q = query(collection(db, "items"), where("status", "==", "approved"));
        const snapshot = await getDocs(q);
        console.log("Query snapshot metadata:", snapshot.metadata);
        console.log("Query snapshot size:", snapshot.size);
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          console.log("Document data:", docData);
          console.log("Raw images data:", docData.images);
          
          // Handle images - now stored as base64 strings
          let images: string[] = [];
          if (Array.isArray(docData.images) && docData.images.length > 0) {
            images = docData.images.map(image => {
              if (typeof image === "string") {
                // Check if it's a base64 string or URL
                if (image.startsWith("data:image/") || image.startsWith("http")) {
                  return image;
                }
                return "";
              } else if (image && typeof image === "object") {
                // Legacy support for objects with URL property
                if (image.url) {
                  return image.url;
                }
                if (image.downloadURL) {
                  return image.downloadURL;
                }
                console.warn("Image object found without URL:", image);
                return "";
              } else {
                return "";
              }
            }).filter(Boolean);
          }
          console.log("Processed images:", images);
          return {
            id: doc.id,
            title: docData.title || "Untitled",
            description: docData.description || "",
            category: docData.category || "",
            type: docData.type || "",
            size: docData.size || "Unknown",
            condition: docData.condition || "",
            tags: docData.tags || [],
            status: docData.status || "Unavailable",
            uploader: docData.uploader || "",
            points: docData.points || 0,
            pointsRequired: docData.pointsRequired || 0,
            images,
          };
        });
        console.log("Mapped items:", data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div>No items available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <Link key={item.id} href={`/items/${item.id}`}>
              <div className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg">
                <div className="h-40 bg-gray-200 mb-2 rounded flex items-center justify-center overflow-hidden">
                  {item.images && item.images.length > 0 && item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={160}
                      height={160}
                      priority
                      unoptimized
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        console.error("Image failed to load:", item.images[0]);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <div className="text-2xl">📷</div>
                      <div className="text-sm">No Image Available</div>
                      {item.images && item.images.length === 0 && (
                        <div className="text-xs text-red-500 mt-1">No images uploaded</div>
                      )}
                    </div>
                  )}
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
