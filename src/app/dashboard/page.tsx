import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function DashboardPage() {
  const { userData, logout, user } = useAuth() ?? {};
  const [tab, setTab] = useState("listings");
  const [myListings, setMyListings] = useState<any[]>([]);
  const [myPurchases, setMyPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      const q = query(collection(db, "items"), where("uploaderID", "==", user.uid));
      const snapshot = await getDocs(q);
      setMyListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchPurchases = async () => {
      if (!user) return;
      const q = query(collection(db, "swap_requests"), where("requesterID", "==", user.uid), where("status", "==", "accepted"));
      const snapshot = await getDocs(q);
      setMyPurchases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchListings();
    fetchPurchases();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {userData && (
          <div className="mb-4">
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Points:</strong> {userData.points}</div>
            <div><strong>Role:</strong> {userData.role}</div>
          </div>
        )}
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">Logout</button>
        <div className="flex gap-4 mb-4">
          <button onClick={() => setTab("listings")} className={tab === "listings" ? "font-bold underline" : ""}>My Listings</button>
          <button onClick={() => setTab("purchases")} className={tab === "purchases" ? "font-bold underline" : ""}>My Purchases</button>
        </div>
        {tab === "listings" ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">My Listings</h3>
            {myListings.length === 0 ? <div>No listings yet.</div> : (
              <ul>
                {myListings.map(item => (
                  <li key={item.id} className="mb-2 p-2 border rounded">
                    <strong>{item.title}</strong> - Status: {item.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">My Purchases</h3>
            {myPurchases.length === 0 ? <div>No purchases yet.</div> : (
              <ul>
                {myPurchases.map(order => (
                  <li key={order.id} className="mb-2 p-2 border rounded">
                    Item ID: {order.itemID} - Type: {order.type} - Status: {order.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
