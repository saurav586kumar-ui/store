import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Exact Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjr6addRfZbk7Ce4Lzku9HnBqzqHN5LtY",
  authDomain: "store-1a8c3.firebaseapp.com",
  projectId: "store-1a8c3",
  storageBucket: "store-1a8c3.firebasestorage.app",
  messagingSenderId: "1046602403433",
  appId: "1:1046602403433:web:ad52f96538bec45b5d1cf8",
  measurementId: "G-0Z9QMGFL4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Auth Functions
export const adminLoginWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};

export const adminLogout = async () => {
  return await signOut(auth);
};

export const listenAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Firestore Products Functions
export const subscribeProducts = (callback) => {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(products);
  });
};

export const addProductToFirebase = async (productData) => {
  return await addDoc(collection(db, "products"), productData);
};

export const toggleStockStatus = async (id, currentStatus) => {
  const productRef = doc(db, "products", id);
  return await updateDoc(productRef, { isStock: !currentStatus });
};

export const deleteProductFromFirebase = async (id) => {
  return await deleteDoc(doc(db, "products"), id);
};

// Firestore Orders Functions
export const placeOrderInFirebase = async (orderData) => {
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    status: "Processing",
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

export const subscribeOrders = (callback) => {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
};
