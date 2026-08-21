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

const firebaseConfig = {
  apiKey: "AIzaSyCjr6addRfZbk7Ce4Lzku9HnBqzqHN5LtY",
  authDomain: "store-1a8c3.firebaseapp.com",
  projectId: "store-1a8c3",
  storageBucket: "store-1a8c3.firebasestorage.app",
  messagingSenderId: "1046602403433",
  appId: "1:1046602403433:web:ad52f96538bec45b5d1cf8",
  measurementId: "G-0Z9QMGFL4W"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Auth
export const adminLoginWithGoogle = async () => signInWithPopup(auth, provider);
export const adminLogout = async () => signOut(auth);
export const listenAuthState = (cb) => onAuthStateChanged(auth, cb);

// Convert Files to Base64 (Super Fast Local Upload)
export const convertFilesToBase64 = async (files) => {
  const promises = Array.from(files).map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  });
  return Promise.all(promises);
};

// Firestore Products
export const subscribeProducts = (cb) => {
  return onSnapshot(collection(db, "products"), (snapshot) => {
    cb(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const addProductToFirebase = async (productData) => addDoc(collection(db, "products"), productData);

export const updateProductInFirebase = async (id, updatedData) => {
  const productRef = doc(db, "products", id);
  return await updateDoc(productRef, updatedData);
};

export const toggleStockStatus = async (id, currentStatus) => {
  const productRef = doc(db, "products", id);
  return await updateDoc(productRef, { isStock: !currentStatus });
};

export const deleteProductFromFirebase = async (id) => deleteDoc(doc(db, "products"), id);
