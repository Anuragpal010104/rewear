"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, userData, logout } = useAuth() ?? {};

  return (
    <nav className="w-full bg-white py-4 px-6 flex justify-between items-center shadow border-b border-gray-200">
      <div className="font-bold text-2xl text-blue-700">
        <Link href="/">ReWear</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-gray-700 font-medium hover:text-blue-700">Home</Link>
        <Link href="/items" className="text-gray-700 font-medium hover:text-blue-700">Browse</Link>
        {!user ? (
          <>
            <Link href="/login" className="text-gray-700 font-medium hover:text-blue-700">Login</Link>
            <Link href="/register" className="text-gray-700 font-medium hover:text-blue-700">Signup</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-gray-700 font-medium hover:text-blue-700">Dashboard</Link>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Logout</button>
            {userData?.role === "admin" && <Link href="/admin" className="text-gray-700 font-medium hover:text-blue-700">Admin</Link>}
          </>
        )}
      </div>
    </nav>
  );
}
