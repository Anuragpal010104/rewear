

"use client";
import ProtectedRoute from "../../../components/ProtectedRoute";
import AddProductForm from "../../../components/AddProductForm";

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <AddProductForm />
    </ProtectedRoute>
  );
}
