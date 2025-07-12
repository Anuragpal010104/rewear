"use client";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminPanel from "../../components/AdminPanel";

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <AdminPanel />
      </div>
    </ProtectedRoute>
  );
}
