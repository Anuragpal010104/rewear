import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { userData, logout } = useAuth() ?? {};

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {userData && (
          <div className="mb-4">
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email}</div>
            <div><strong>Points:</strong> {userData.points}</div>
            <div><strong>Role:</strong> {userData.role}</div>
          </div>
        )}
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </ProtectedRoute>
  );
}
