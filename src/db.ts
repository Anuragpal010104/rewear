import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";

// Define interfaces for Firestore data
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploader: string;
  status: string; // 'pending approval', 'approved', or 'rejected'
  points: number;
  pointsRequired: number;
  createdAt: string;
}

export interface Swap {
  id: string;
  participants: string[];
  status: string;
  createdAt: string;
}

// Add a new item
export const addItem = async (item: Omit<Item, "id">): Promise<string> => {
  try {
    const itemData = {
      ...item,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "items"), itemData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding item:", error);
    throw new Error(`Failed to add item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get all items
export const getAllItems = async (): Promise<Item[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
  } catch (error) {
    console.error("Error fetching all items:", error);
    throw new Error(`Failed to fetch all items: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get items by uploader
export const getItemsByUploader = async (uploaderId: string): Promise<Item[]> => {
  try {
    const q = query(collection(db, "items"), where("uploader", "==", uploaderId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
  } catch (error) {
    console.error("Error fetching items by uploader:", error);
    throw new Error(`Failed to fetch items: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get a single item by ID
export const getItemById = async (id: string): Promise<Item | null> => {
  try {
    const docRef = doc(db, "items", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Item;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw new Error(`Failed to fetch item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Update an existing item
export const updateItem = async (itemId: string, updatedFields: Partial<Omit<Item, "id">>): Promise<void> => {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, updatedFields);
  } catch (error) {
    console.error("Error updating item:", error);
    throw new Error(`Failed to update item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Delete an item
export const deleteItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, "items", itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error(`Failed to delete item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Approve an item
export const approveItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, { status: "approved" });
  } catch (error) {
    console.error("Error approving item:", error);
    throw new Error(`Failed to approve item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Reject an item
export const rejectItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, { status: "rejected" });
  } catch (error) {
    console.error("Error rejecting item:", error);
    throw new Error(`Failed to reject item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Unapprove an item (set back to pending approval)
export const unapproveItem = async (itemId: string): Promise<void> => {
  try {
    const itemRef = doc(db, "items", itemId);
    await updateDoc(itemRef, { status: "pending approval" });
  } catch (error) {
    console.error("Error unapproving item:", error);
    throw new Error(`Failed to unapprove item: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get items by status
export const getItemsByStatus = async (status: string): Promise<Item[]> => {
  try {
    const q = query(collection(db, "items"), where("status", "==", status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Item[];
  } catch (error) {
    console.error("Error fetching items by status:", error);
    throw new Error(`Failed to fetch items: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get approved items only
export const getApprovedItems = async (): Promise<Item[]> => {
  return getItemsByStatus("approved");
};

// Get pending approval items
export const getPendingItems = async (): Promise<Item[]> => {
  return getItemsByStatus("pending approval");
};

// Get rejected items
export const getRejectedItems = async (): Promise<Item[]> => {
  return getItemsByStatus("rejected");
};

// Add a new swap
export const addSwap = async (swap: Omit<Swap, "id">): Promise<string> => {
  try {
    const swapData = {
      ...swap,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "swaps"), swapData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding swap:", error);
    throw new Error(`Failed to add swap: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get swaps by participant
export const getSwapsByParticipant = async (participantId: string): Promise<Swap[]> => {
  try {
    const q = query(collection(db, "swaps"), where("participants", "array-contains", participantId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Swap[];
  } catch (error) {
    console.error("Error fetching swaps by participant:", error);
    throw new Error(`Failed to fetch swaps: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Get a single swap by ID
export const getSwapById = async (id: string): Promise<Swap | null> => {
  try {
    const docRef = doc(db, "swaps", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Swap;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching swap ${id}:`, error);
    throw new Error(`Failed to fetch swap: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Added function to update user points
export const updateUserPoints = async (userId: string, points: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { points });
  } catch (error) {
    console.error("Error updating user points:", error);
    throw new Error(`Failed to update user points: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Added function to handle points for swaps
export const completeSwap = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentPoints = userSnap.data().points || 0;
      await updateDoc(userRef, { points: currentPoints + 50 });
    }
  } catch (error) {
    console.error("Error completing swap:", error);
    throw new Error(`Failed to complete swap: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Added function to handle points for listings
export const completeListing = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentPoints = userSnap.data().points || 0;
      await updateDoc(userRef, { points: currentPoints + 100 });
    }
  } catch (error) {
    console.error("Error completing listing:", error);
    throw new Error(`Failed to complete listing: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Added function to redeem points
export const redeemPoints = async (userId: string, pointsToRedeem: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentPoints = userSnap.data().points || 0;
      if (currentPoints >= pointsToRedeem) {
        await updateDoc(userRef, { points: currentPoints - pointsToRedeem });
      } else {
        throw new Error("Insufficient points to redeem");
      }
    }
  } catch (error) {
    console.error("Error redeeming points:", error);
    throw new Error(`Failed to redeem points: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
