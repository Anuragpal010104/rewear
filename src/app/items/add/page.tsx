import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Add Item</h2>
        {/* Add item form will go here */}
      </div>
    </ProtectedRoute>
  );
}
