import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, userData, logout } = useAuth() ?? {};

  return (
    <nav className="w-full bg-gray-100 py-4 px-6 flex justify-between items-center shadow">
      <div className="font-bold text-xl">
        <Link href="/">ReWear</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/">Home</Link>
        <Link href="/items">Browse</Link>
        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Signup</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            {userData?.role === "admin" && <Link href="/admin">Admin</Link>}
          </>
        )}
      </div>
    </nav>
  );
}
