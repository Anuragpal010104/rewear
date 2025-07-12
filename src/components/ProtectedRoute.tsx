"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, userData, loading } = useAuth() ?? {};
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && userData?.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, userData, loading, adminOnly, router]);

  if (loading || !user || (adminOnly && userData?.role !== "admin")) {
    return <div className="text-center mt-10 p-6 bg-white rounded shadow border border-gray-200 max-w-md mx-auto">Loading...</div>;
  }
  return <>{children}</>;
}
