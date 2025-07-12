"use client";
// AuthContext for Firebase authentication and route protection
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export interface User {
  uid: string;
  email: string | null; // Updated to match Firebase's 'User' type
  displayName?: string | null; // Updated to match Firebase's 'User' type
  role?: string;
}

interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  role: "user" | "admin";
  points: number;
}

interface AuthContextType {
  user: User | null;
  userData: FirestoreUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            uid: firebaseUser.uid,
            name: data.name || "",
            email: data.email || "",
            role: data.role || "user",
            points: typeof data.points === "number" ? data.points : 0,
          });
        } else {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
