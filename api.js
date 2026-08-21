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
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
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
export const storage = getStorage(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Auth
export const adminLoginWithGoogle = async () => signInWithPopup(auth, provider);
export const adminLogout = async () => signOut(auth);
export const listenAuthState = (cb) => onAuthStateChanged(auth, cb);

// Upload Multiple Files to Firebase Storage
export const uploadMultipleImages = async (files) => {
  const imageUrls = [];
  for (let file of files) {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    imageUrls.push(url);
  }
  return imageUrls;
};

// Firestore Products CRUD
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

// Firestore Orders
export const subscribeOrders = (cb) => {
  return onSnapshot(collection(db, "orders"), (snapshot) => {
    cb(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};
