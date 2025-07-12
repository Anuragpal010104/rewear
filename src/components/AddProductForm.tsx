import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const { user } = useAuth() ?? {};
  const router = useRouter();
  // Form state for all required fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState("");
  const [pointsRequired, setPointsRequired] = useState(0);
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: Add Firestore/Storage logic

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("You must be logged in to add an item.");
      return;
    }
    setLoading(true);
    let imageUrls: string[] = [];
    try {
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const storageRef = ref(storage, `items/${user.uid}/${Date.now()}_${image.name}`);
          await uploadBytes(storageRef, image);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
        }
      }
      const tagsArr = tags.split(",").map(t => t.trim()).filter(Boolean);
      await addDoc(collection(db, "items"), {
        title,
        description,
        category,
        size,
        type,
        condition,
        tags: tagsArr,
        uploaderID: user.uid,
        status: "pending",
        images: imageUrls,
        pointsRequired,
        featured: false,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError("Failed to add product. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <input type="text" placeholder="Size" value={size} onChange={e => setSize(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <input type="text" placeholder="Type" value={type} onChange={e => setType(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <input type="text" placeholder="Condition" value={condition} onChange={e => setCondition(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
      <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} className="w-full mb-2 p-2 border rounded" />
      <input type="number" placeholder="Points Required" value={pointsRequired} onChange={e => setPointsRequired(Number(e.target.value))} className="w-full mb-2 p-2 border rounded" required />
      <input type="file" multiple onChange={e => setImages(e.target.files)} className="w-full mb-4" />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>{loading ? "Submitting..." : "Add Product"}</button>
    </form>
  );
}
