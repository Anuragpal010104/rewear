"use client";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
import Image from "next/image";

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploader: string;
  status: string;
  pointsRequired: number;
  createdAt: string;
}

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

export default function AdminPanel() {
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [tab, setTab] = useState("listings");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, "items"));
        const snapshot = await getDocs(q);
        const fetchedItems = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Item));
        setItems(fetchedItems);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "Unknown",
        email: doc.data().email || "Unknown",
        role: doc.data().role || "Unknown",
      })));
    };

    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "swap_requests"));
      setOrders(snapshot.docs.map(doc => ({
        id: doc.id,
        requesterID: doc.data().requesterID || "Unknown",
        ownerID: doc.data().ownerID || "Unknown",
        itemID: doc.data().itemID || "Unknown",
        status: doc.data().status || "Unknown",
        type: doc.data().type || "Unknown",
      })));
    };

    fetchItems();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleApprove = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "approved" });
      setItems(items.map(item => (item.id === itemId ? { ...item, status: "approved" } : item)));
    } catch (err) {
      console.error("Error approving item:", err);
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "rejected" });
      setItems(items.map(item => (item.id === itemId ? { ...item, status: "rejected" } : item)));
    } catch (err) {
      console.error("Error rejecting item:", err);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }
    
    try {
      const itemRef = doc(db, "items", itemId);
      await deleteDoc(itemRef);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleUnapprove = async (itemId: string) => {
    try {
      const itemRef = doc(db, "items", itemId);
      await updateDoc(itemRef, { status: "pending approval" });
      setItems(items.map(item => (item.id === itemId ? { ...item, status: "pending approval" } : item)));
    } catch (err) {
      console.error("Error unapproving item:", err);
    }
  };

  // Filter items based on selected filter
  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending approval";
    if (filter === "approved") return item.status === "approved";
    if (filter === "rejected") return item.status === "rejected";
    return true;
  });



  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Admin Panel - Product Management</h1>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => setTab("users")} className={tab === "users" ? "font-bold underline" : ""}>Manage Users</button>
        <button onClick={() => setTab("orders")} className={tab === "orders" ? "font-bold underline" : ""}>Manage Orders</button>
        <button onClick={() => setTab("listings")} className={tab === "listings" ? "font-bold underline" : ""}>Manage Listings</button>
      </div>

      {/* Filter Controls for Listings */}
      {tab === "listings" && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <label htmlFor="filter" className="block text-gray-700 font-medium mb-2">Filter by status:</label>
          <select
            id="filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
          >
            <option value="all">All</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      {tab === "users" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">All Users</h3>
          <ul>
            {users.map(user => (
              <li key={user.id} className="mb-2 p-2 border rounded flex justify-between items-center">
                <span>{user.name} ({user.email}) - Role: {user.role}</span>
                <div className="flex gap-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={async () => {
                    await setDoc(doc(db, "users", user.id), { ...user, role: "banned" });
                    window.location.reload();
                  }}>Ban</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
                    await setDoc(doc(db, "users", user.id), {});
                    try {
                      const auth = getAuth();
                      if (auth.currentUser && auth.currentUser.uid === user.id) {
                        await deleteUser(auth.currentUser);
                      }
                    } catch (err) {
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
                    await setDoc(doc(db, "swap_requests", order.id), { ...order, status: "accepted" });
                    window.location.reload();
                  }}>Accept</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={async () => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              <div className="h-40 bg-gray-200 mb-2 rounded flex items-center justify-center overflow-hidden">
                {item.images && item.images.length > 0 && (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
              <h2 className="text-lg font-bold mb-2">{item.title}</h2>
              <p className="text-gray-700 mb-2">{item.description}</p>
              <p className="text-gray-500 mb-2">Status: {item.status}</p>
              <div className="flex flex-wrap gap-2">
                {item.status === "pending approval" && (
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
                {item.status === "approved" && (
                  <button
                    onClick={() => handleUnapprove(item.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Unapprove
                  </button>
                )}
                {item.status !== "rejected" && (
                  <button
                    onClick={() => handleReject(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
