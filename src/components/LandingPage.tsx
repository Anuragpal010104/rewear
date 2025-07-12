
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Item {
  id: string;
  title: string;
  size: string;
  status: string;
  images: string[];
}

export default function LandingPage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      const q = query(collection(db, "items"), where("featured", "==", true));
      const snapshot = await getDocs(q);
      setFeatured(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)));
    };
    const fetchAll = async () => {
      const q = query(collection(db, "items"), where("status", "==", "available"));
      const snapshot = await getDocs(q);
      setAllItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item)));
      setLoading(false);
    };
    fetchFeatured();
    fetchAll();
  }, []);

  const categories = [
    { name: "Men", icon: "/men.svg" },
    { name: "Women", icon: "/women.svg" },
    { name: "Kids", icon: "/kids.svg" },
    { name: "Accessories", icon: "/accessories.svg" },
  ];

  return (

    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-700">ReWear</h1>
        <p className="mb-4 text-lg text-gray-700">A community clothing exchange platform for sustainable fashion.</p>
        <div className="flex gap-4 mb-4">
          <Link href="/login" legacyBehavior><a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow inline-block">Start Swapping</a></Link>
          <Link href="/items" legacyBehavior><a className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow inline-block">Browse Items</a></Link>
          <Link href="/items/add" legacyBehavior><a className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded shadow inline-block">List an Item</a></Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search for clothing..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xl p-3 rounded border border-gray-300 bg-white shadow"
        />
      </div>

      {/* Featured Carousel */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Featured Items</h2>
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded shadow overflow-x-auto">
          {loading ? "Loading..." : featured.length === 0 ? "No featured items" : (
            <div className="flex gap-4">
              {featured.map(item => (
                <Link key={item.id} href={`/items/${item.id}`}>
                  <div className="w-40 h-40 bg-white rounded shadow flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                    {item.images && item.images[0] ? <Image src={item.images[0]} alt={item.title} width={96} height={96} className="h-24 w-auto object-cover rounded mb-2" /> : "No Image"}
                    <div className="font-bold text-center text-blue-700">{item.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <button key={cat.name} className="bg-white px-6 py-4 rounded shadow flex flex-col items-center justify-center hover:bg-blue-50 border border-gray-200">
              <span className="font-bold text-lg text-blue-700">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Listings Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Product Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allItems.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.size?.toLowerCase().includes(search.toLowerCase())
          ).map(item => (
            <Link key={item.id} href={`/items/${item.id}`}>
              <div className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg hover:bg-blue-50 border border-gray-200">
                <div className="h-40 bg-gray-100 mb-2 rounded flex items-center justify-center">
                  {item.images && item.images[0] ? <Image src={item.images[0]} alt={item.title} width={160} height={160} className="h-full w-auto object-cover rounded" /> : "No Image"}
                </div>
                <div className="font-bold text-blue-700">{item.title}</div>
                <div className="text-gray-600">Size: {item.size}</div>
                <div className="text-gray-500">{item.status}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
