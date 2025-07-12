import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [pendingListings, setPendingListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "swap_requests"));
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchListings = async () => {
      const all = await getDocs(collection(db, "items"));
      setListings(all.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const pendingQ = query(collection(db, "items"), where("status", "==", "pending"));
      const pending = await getDocs(pendingQ);
      setPendingListings(pending.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
    fetchOrders();
    fetchListings();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <div className="flex gap-4 mb-4">
          <button onClick={() => setTab("users")} className={tab === "users" ? "font-bold underline" : ""}>Manage Users</button>
          <button onClick={() => setTab("orders")} className={tab === "orders" ? "font-bold underline" : ""}>Manage Orders</button>
          <button onClick={() => setTab("listings")} className={tab === "listings" ? "font-bold underline" : ""}>Manage Listings</button>
        </div>
        {tab === "users" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">All Users</h3>
            <ul>
              {users.map(user => (
                <li key={user.id} className="mb-2 p-2 border rounded">
                  {user.name} ({user.email}) - Role: {user.role}
                  {/* Actions: View, Ban/Delete */}
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "orders" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">All Swap Requests</h3>
            <ul>
              {orders.map(order => (
                <li key={order.id} className="mb-2 p-2 border rounded">
                  Requester: {order.requesterID} | Owner: {order.ownerID} | Item: {order.itemID} | Status: {order.status} | Type: {order.type}
                  {/* Admin override actions */}
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "listings" && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Pending Listings</h3>
            <ul>
              {pendingListings.map(item => (
                <li key={item.id} className="mb-2 p-2 border rounded">
                  <strong>{item.title}</strong> - Status: {item.status}
                  {/* Approve/Reject actions */}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">All Listings</h3>
            <ul>
              {listings.map(item => (
                <li key={item.id} className="mb-2 p-2 border rounded">
                  <strong>{item.title}</strong> - Status: {item.status}
                  {/* Delete for spam, other actions */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
