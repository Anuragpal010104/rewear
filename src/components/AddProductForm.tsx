"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddProductForm() {
  const { user } = useAuth() ?? {};
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState("");
  const [pointsRequired, setPointsRequired] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  // Updated item submission to mark items as 'pending approval'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    const imageUrls: string[] = [];
    try {
      if (images) {
        for (const file of images) {
          const storageRef = ref(getStorage(), `items/${user.uid}/${file.name}`);
          const uploadTask = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(uploadTask.ref);
          imageUrls.push(downloadURL);
          console.log("Uploaded file:", file.name, "URL:", downloadURL);
        }
      }
      const itemData = {
        title,
        description,
        category,
        size,
        type,
        condition,
        tags: tags.split(",").map(tag => tag.trim()),
        pointsRequired,
        images: imageUrls,
        uploader: user.uid,
        status: "pending approval",
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, "items"), itemData);
      router.push("/items");
    } catch (err) {
      console.error("Error adding item:", err);
      setError("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Add Product</h1>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Size</label>
          <input
            type="text"
            value={size}
            onChange={e => setSize(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Type</label>
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Condition</label>
          <input
            type="text"
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Points Required</label>
          <input
            type="number"
            value={pointsRequired}
            onChange={e => setPointsRequired(Number(e.target.value))}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Images</label>
          <input
            type="file"
            onChange={e => setImages(e.target.files)}
            className="w-full p-2 border rounded text-gray-900"
            multiple
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
