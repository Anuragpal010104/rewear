"use client";
import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddItemPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const itemData = {
        title,
        description,
        category,
        type,
        size,
        condition,
        tags: tags.split(",").map(tag => tag.trim()),
        images: [],
        uploader: "user-id-placeholder", // Replace with actual user ID
        status: "available",
        points: 0,
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Add New Item</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow border border-gray-200">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border rounded"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Type</label>
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Size</label>
          <input
            type="text"
            value={size}
            onChange={e => setSize(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Condition</label>
          <input
            type="text"
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full p-3 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
