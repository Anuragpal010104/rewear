"use client";
interface Item {
  id: string;
  title: string;
  status: string;
}

interface Order {
  id: string;
  itemID: string;
  type: string;
  status: string;
}
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const { userData, user } = useAuth() ?? {};

  const [myListings, setMyListings] = useState<Item[]>([]);
  const [myPurchases, setMyPurchases] = useState<Order[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        console.error("User is not authenticated. Cannot fetch listings.");
        return;
      }
      try {
        const q = query(collection(db, "items"), where("uploaderID", "==", user.uid));
        const snapshot = await getDocs(q);
        console.log("Fetched listings:", snapshot.docs.map(doc => doc.data()));
        setMyListings(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: typeof data.title === 'string' ? data.title : '',
            status: typeof data.status === 'string' ? data.status : '',
          };
        }));
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    const fetchPurchases = async () => {
      if (!user) {
        console.error("User is not authenticated. Cannot fetch purchases.");
        return;
      }
      try {
        const q = query(collection(db, "swap_requests"), where("requesterID", "==", user.uid), where("status", "==", "accepted"));
        const snapshot = await getDocs(q);
        console.log("Fetched purchases:", snapshot.docs.map(doc => doc.data()));
        setMyPurchases(snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            itemID: typeof data.itemID === 'string' ? data.itemID : '',
            type: typeof data.type === 'string' ? data.type : '',
            status: typeof data.status === 'string' ? data.status : '',
          };
        }));
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchListings();
    fetchPurchases();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen font-sans">
        <h1 className="text-5xl font-extrabold mb-8 text-blue-800">User Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-1 flex flex-col items-center bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <div className="w-28 h-28 rounded-full bg-gray-300 mb-6"></div>
            {userData && (
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{userData.name}</div>
                <div className="text-sm text-gray-500">{userData.email}</div>
                <div className="text-sm text-gray-500">Points: {userData.points}</div>
                <div className="text-sm text-gray-500">Role: {userData.role}</div>
              </div>
            )}
          </div>
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Profile Details</h2>
            {userData && (
              <div className="space-y-4">
                <div className="text-xl font-bold text-gray-800">{userData.name}</div>
                <div className="text-sm text-gray-500">{userData.email}</div>
                <div className="text-sm text-gray-500">Points: {userData.points}</div>
                <div className="text-sm text-gray-500">Role: {userData.role}</div>
              </div>
            )}
          </div>
        </div>
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">My Listings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {myListings.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No listings yet.</div>
            ) : (
              myListings.map(item => (
                <div key={item.id} className="p-6 bg-white border rounded-lg shadow-lg">
                  <div className="text-lg font-semibold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">Status: {item.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-700">My Purchases</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {myPurchases.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No purchases yet.</div>
            ) : (
              myPurchases.map(order => (
                <div key={order.id} className="p-6 bg-white border rounded-lg shadow-lg">
                  <div className="text-sm text-gray-500">Item ID: {order.itemID}</div>
                  <div className="text-sm text-gray-500">Type: {order.type}</div>
                  <div className="text-sm text-gray-500">Status: {order.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
