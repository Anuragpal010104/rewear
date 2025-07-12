"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, userData } = useAuth() ?? {};
  const router = useRouter();
  const [item, setItem] = useState<{ id: string; title: string; description: string; images: string[]; uploaderID: string; status: string; pointsRequired: number; size?: string; category?: string; type?: string; condition?: string; tags?: string[] } | null>(null);
  const [uploader, setUploader] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const itemDoc = await getDoc(doc(db, "items", id as string));
      if (itemDoc.exists()) {
        const data = itemDoc.data();
        setItem({
          id: id as string,
          title: typeof data.title === "string" ? data.title : "",
          description: typeof data.description === "string" ? data.description : "",
          images: Array.isArray(data.images) ? data.images : [],
          uploaderID: typeof data.uploaderID === "string" ? data.uploaderID : "",
          status: typeof data.status === "string" ? data.status : "",
          pointsRequired: typeof data.pointsRequired === "number" ? data.pointsRequired : 0,
          size: typeof data.size === "string" ? data.size : "",
          category: typeof data.category === "string" ? data.category : "",
          type: typeof data.type === "string" ? data.type : "",
          condition: typeof data.condition === "string" ? data.condition : "",
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
        const uploaderDoc = await getDoc(doc(db, "users", itemDoc.data().uploaderID));
        if (uploaderDoc.exists()) {
          const uploaderData = uploaderDoc.data();
          setUploader({
            name: typeof uploaderData.name === "string" ? uploaderData.name : "",
            email: typeof uploaderData.email === "string" ? uploaderData.email : ""
          });
        } else {
          setUploader(null);
        }
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!user || !item || item.status !== "available") return;
    setError("");
    try {
      await addDoc(collection(db, "swap_requests"), {
        requesterID: user.uid,
        ownerID: item.uploaderID,
        itemID: item.id,
        status: "pending",
        type: "swap",
      });
      router.push("/dashboard");
    } catch {
      setError("Failed to request swap.");
    }
  };

  const handleRedeem = async () => {
    if (!user || !item || item.status !== "available") return;
    setError("");
    if ((userData?.points ?? 0) < (item.pointsRequired ?? 0)) {
      setError("Not enough points.");
      return;
    }
    try {
      // Deduct points, mark item swapped, update both users
      await setDoc(doc(db, "items", item.id), { ...item, status: "swapped" });
      if (!userData) throw new Error("User data not loaded");
      await setDoc(doc(db, "users", user.uid), { ...userData, points: userData.points - item.pointsRequired });
      const ownerDoc = await getDoc(doc(db, "users", item.uploaderID));
      if (ownerDoc.exists()) {
        const ownerData = ownerDoc.data();
        await setDoc(doc(db, "users", item.uploaderID), { ...ownerData, points: (ownerData.points ?? 0) + (item.pointsRequired ?? 0) });
      }
      await addDoc(collection(db, "swap_requests"), {
        requesterID: user.uid,
        ownerID: item.uploaderID,
        itemID: item.id,
        status: "accepted",
        type: "redeem",
      });
      router.push("/dashboard");
    } catch {
      setError("Failed to redeem item.");
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto mt-10 p-6">Loading...</div>;
  if (!item) return <div className="max-w-3xl mx-auto mt-10 p-6">Item not found.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Product Detail</h2>
      {/* Image gallery */}
      <div className="flex gap-2 mb-2">
        {item.images && item.images.length > 0 ? item.images.map((img: string, idx: number) => (
          <Image key={idx} src={img} alt={item.title} width={128} height={128} style={{ objectFit: "cover", borderRadius: "0.5rem" }} />
        )) : <div className="h-32 w-32 bg-gray-200 rounded">No Images</div>}
      </div>
      <div className="font-bold text-xl mb-2">{item.title}</div>
      <div className="mb-2">{item.description}</div>
      <div className="mb-2">Uploader: {uploader ? uploader.name : item.uploaderID} ({uploader ? uploader.email : ""})</div>
      <div className="mb-2">Size: {item.size} | Category: {item.category} | Type: {item.type} | Condition: {item.condition}</div>
      <div className="mb-2">Tags: {item.tags?.join(", ")}</div>
      <div className="mb-2">Status: {item.status}</div>
      <div className="mb-2">Points Required: {item.pointsRequired}</div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {user && item.status === "available" && (
        <div className="flex gap-4 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSwapRequest}>Swap Request</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleRedeem}>Redeem via Points</button>
        </div>
      )}
    </div>
  );
}
