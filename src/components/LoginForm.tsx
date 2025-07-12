"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-xl shadow border border-gray-200 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-6 flex items-center justify-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#a0aec0"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#a0aec0"/></svg>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Login</h2>
        {error && <div className="text-red-500 mb-2 w-full text-center">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-lg placeholder-gray-700 text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded text-lg placeholder-gray-700 text-gray-900"
          required
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-semibold" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
