"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Updated item submission to store images as base64 in Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("User not authenticated");
      return;
    }
    setLoading(true);
    
    try {
      let imageUrls: string[] = [];
      
      // Convert images to base64 if any
      if (images) {
        console.log("Converting", images.length, "images to base64...");
        const base64Promises = Array.from(images).map(async (file) => {
          console.log("Converting file:", file.name, "size:", file.size);
          
          // Check file size (limit to 1MB per image for Firestore)
          if (file.size > 1024 * 1024) {
            throw new Error(`Image ${file.name} is too large. Please use images smaller than 1MB.`);
          }
          
          const base64String = await fileToBase64(file);
          console.log("Conversion successful for:", file.name);
          return base64String;
        });
        
        imageUrls = await Promise.all(base64Promises);
        console.log("All images converted successfully, total:", imageUrls.length);
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
        images: imageUrls, // Store base64 strings instead of URLs
        uploader: user.uid,
        status: "pending approval", // Always set to pending approval for admin review
        createdAt: new Date().toISOString(),
      };
      
      console.log("Saving item data with", imageUrls.length, "images");
      await addDoc(collection(db, "items"), itemData);
      console.log("Item added successfully");
      
      // Show success message and redirect
      alert("Product submitted successfully! It will be reviewed by an admin before appearing in the marketplace.");
      router.push("/items");
    } catch (err) {
      console.error("Error adding item:", err);
      setError(err instanceof Error ? err.message : "Failed to add item. Please try again.");
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
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-1">
            Select multiple images (max 1MB each). Supported formats: JPG, PNG, WebP
          </p>
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
