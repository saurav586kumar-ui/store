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

export const adminLoginWithGoogle = async () => signInWithPopup(auth, provider);
export const adminLogout = async () => signOut(auth);
export const listenAuthState = (cb) => onAuthStateChanged(auth, cb);

// Image Upload
export const uploadImagesToCloudinary = async (files) => {
  const cloudName = "qrfra7ry"; 
  const uploadPreset = "justkharido_preset";

  const uploadPromises = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error?.message || "Image upload failed");
    }
    const data = await res.json();
    return data.secure_url;
  });

  return Promise.all(uploadPromises);
};

// Real-time Firestore Subscriber with Safe Fallback
export const subscribeProducts = (cb) => {
  return onSnapshot(
    collection(db, "products"), 
    (snapshot) => {
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      cb(products);
    },
    (error) => {
      console.error("Firestore Listen Error:", error);
    }
  );
};

export const addProductToFirebase = async (productData) => addDoc(collection(db, "products"), productData);
export const updateProductInFirebase = async (id, updatedData) => updateDoc(doc(db, "products", id), updatedData);
export const toggleStockStatus = async (id, currentStatus) => updateDoc(doc(db, "products", id), { isStock: !currentStatus });
export const deleteProductFromFirebase = async (id) => deleteDoc(doc(db, "products", id));
