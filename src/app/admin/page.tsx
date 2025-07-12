import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        {/* Admin panel content will go here */}
      </div>
    </ProtectedRoute>
  );
}
