"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting to register user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully:", userCredential);
      await updateProfile(userCredential.user, { displayName: name });
      console.log("Profile updated with name:", name);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        points: 100,
      });
      console.log("User data saved to Firestore:", {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        points: 100,
      });
      console.log("Navigating to dashboard...");
      router.push("/dashboard");
      console.log("Navigation to dashboard successful.");
    } catch (err) {
      console.error("Registration error:", err);
      setError((err as Error).message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-xl shadow border border-gray-200 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-6 flex items-center justify-center">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#a0aec0"/><rect x="6" y="14" width="12" height="6" rx="3" fill="#a0aec0"/></svg>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Sign Up</h2>
        {error && <div className="text-red-500 mb-2 w-full text-center">{error}</div>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-lg placeholder-gray-700 text-gray-900"
          required
        />
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
          className="w-full mb-4 p-3 border rounded text-lg placeholder-gray-700 text-gray-900"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-lg placeholder-gray-700 text-gray-900"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-lg text-gray-900"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg font-semibold" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
