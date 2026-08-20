import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ==========================================
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCjr6addRfZbk7Ce4Lzku9HnBqzqHN5LtY",
  authDomain: "store-1a8c3.firebaseapp.com",
  projectId: "store-1a8c3",
  storageBucket: "store-1a8c3.firebasestorage.app",
  messagingSenderId: "1046602403433",
  appId: "1:1046602403433:web:ad52f96538bec45b5d1cf8",
  measurementId: "G-0Z9QMGFL4W"
};

// App aur Core Services Initialize karein
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);

// ==========================================
// 2. PRODUCTS & INVENTORY MANAGEMENT
// ==========================================

/**
 * Real-time products listener (Store Page & Inventory Control ke liye)
 */
export function subscribeProducts(callback) {
  try {
    const productsRef = collection(db, "products");
    return onSnapshot(productsRef, (snapshot) => {
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(products);
    }, (error) => {
      console.error("Error fetching products:", error);
    });
  } catch (error) {
    console.error("Subscription failed:", error);
  }
}

/**
 * Naya product upload karne ke liye (Admin Only)
 */
export async function addProductToFirebase(product) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

/**
 * Product stock status badalne ke liye (In Stock / Out of Stock)
 */
export async function toggleStockStatus(productId, currentStatus) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { isStock: !currentStatus });
  } catch (error) {
    console.error("Error updating stock status:", error);
    throw error;
  }
}

/**
 * Product delete karne ke liye
 */
export async function deleteProductFromFirebase(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// ==========================================
// 3. ORDERS & CHECKOUT MANAGEMENT
// ==========================================

/**
 * Customer order save karne ke liye (Cart Checkout)
 */
export async function placeOrderInFirebase(orderData) {
  try {
    const orderPayload = {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "Processing"
    };
    const docRef = await addDoc(collection(db, "orders"), orderPayload);
    return docRef.id;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

/**
 * Real-time orders stream (Admin Dashboard par naye orders dekhne ke liye)
 */
export function subscribeOrders(callback) {
  try {
    const ordersRef = collection(db, "orders");
    return onSnapshot(ordersRef, (snapshot) => {
      const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(orders);
    }, (error) => {
      console.error("Error fetching orders:", error);
    });
  } catch (error) {
    console.error("Order subscription failed:", error);
  }
}

// ==========================================
// 4. ADMIN AUTHENTICATION
// ==========================================

/**
 * Admin Panel me login karne ke liye
 */
export async function adminLogin(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

/**
 * Admin Session logout karne ke liye
 */
export async function adminLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

/**
 * Auth state check karne ke liye (Unauthorized users ko rokna)
 */
export function listenAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
