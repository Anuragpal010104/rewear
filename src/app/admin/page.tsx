"use client";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  requesterID: string;
  ownerID: string;
  itemID: string;
  status: string;
  type: string;
}

interface Item {
  id: string;
  title: string;
  status: string;
}
import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";

export default function AdminPage() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [listings, setListings] = useState<Item[]>([]);
  const [pendingListings, setPendingListings] = useState<Item[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: typeof data.name === 'string' ? data.name : '',
          email: typeof data.email === 'string' ? data.email : '',
          role: typeof data.role === 'string' ? data.role : '',
        };
      }));
    };
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "swap_requests"));
      setOrders(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          requesterID: typeof data.requesterID === 'string' ? data.requesterID : '',
          ownerID: typeof data.ownerID === 'string' ? data.ownerID : '',
          itemID: typeof data.itemID === 'string' ? data.itemID : '',
          status: typeof data.status === 'string' ? data.status : '',
          type: typeof data.type === 'string' ? data.type : '',
        };
      }));
    };
    const fetchListings = async () => {
      const all = await getDocs(collection(db, "items"));
      setListings(all.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: typeof data.title === 'string' ? data.title : '',
          status: typeof data.status === 'string' ? data.status : '',
        };
      }));
      const pendingQ = query(collection(db, "items"), where("status", "==", "pending"));
      const pending = await getDocs(pendingQ);
      setPendingListings(pending.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: typeof data.title === 'string' ? data.title : '',
          status: typeof data.status === 'string' ? data.status : '',
        };
      }));
    };
    fetchUsers();
    fetchOrders();
    fetchListings();
  }, []);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow border border-gray-200">
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
                <li key={user.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                  <span>{user.name} ({user.email}) - Role: {user.role}</span>
                  <div className="flex gap-2">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Ban user (set role to 'banned')
                      await setDoc(doc(db, "users", user.id), { ...user, role: "banned" });
                      window.location.reload();
                    }}>Ban</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Delete user from Firestore and Firebase Auth
                      await setDoc(doc(db, "users", user.id), {});
                      try {
                        const auth = getAuth();
                        // Only admins can delete other users, so use Admin SDK in backend for real deletion
                        // Here, attempt to delete if current user matches
                        if (auth.currentUser && auth.currentUser.uid === user.id) {
                          await deleteUser(auth.currentUser);
                        }
                        // For other users, deletion should be handled server-side with Admin SDK
                      } catch (err) {
                        // Handle error (likely not allowed for other users)
                        console.error("Error deleting user from Auth:", err);
                      }
                      window.location.reload();
                    }}>Delete</button>
                  </div>
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
                <li key={order.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                  <span>Requester: {order.requesterID} | Owner: {order.ownerID} | Item: {order.itemID} | Status: {order.status} | Type: {order.type}</span>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Accept order
                      await setDoc(doc(db, "swap_requests", order.id), { ...order, status: "accepted" });
                      window.location.reload();
                    }}>Accept</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Reject order
                      await setDoc(doc(db, "swap_requests", order.id), { ...order, status: "rejected" });
                      window.location.reload();
                    }}>Reject</button>
                  </div>
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
                <li key={item.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                  <span><strong>{item.title}</strong> - Status: {item.status}</span>
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Approve listing
                      await setDoc(doc(db, "items", item.id), { ...item, status: "available" });
                      window.location.reload();
                    }}>Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Reject listing
                      await setDoc(doc(db, "items", item.id), { ...item, status: "rejected" });
                      window.location.reload();
                    }}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">All Listings</h3>
            <ul>
              {listings.map(item => (
                <li key={item.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                  <span><strong>{item.title}</strong> - Status: {item.status}</span>
                  <div className="flex gap-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
                      // Delete listing (mark as spam)
                      await setDoc(doc(db, "items", item.id), { ...item, status: "spam" });
                      window.location.reload();
                    }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
