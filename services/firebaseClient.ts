import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  onSnapshot, 
  query,
  Unsubscribe
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDY40zmjnYIAYOGLszmEjC9zv8V3jpw_a4",
  authDomain: "skylar-asia.firebaseapp.com",
  projectId: "skylar-asia",
  storageBucket: "skylar-asia.firebasestorage.app",
  messagingSenderId: "214317328512",
  appId: "1:214317328512:web:9327be6c67c50672a15e65",
  measurementId: "G-4PQCQZZPB8"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export const SUPER_ADMIN_UID = "iKbxm6RedwQ7l7piWwZkYT6XnR13";
export const SUPER_ADMIN_EMAIL = "admin@gmail.com";

export const firebaseClient = {
  // Generic collection reader
  getCollection: async (collectionName: string) => {
    const snap = await getDocs(collection(db, collectionName));
    const result: any[] = [];
    snap.forEach((docSnap) => {
      result.push({ id: docSnap.id, ...docSnap.data() });
    });
    return result;
  },

  // Document Upsert
  upsertDoc: async (collectionName: string, docId: string, data: any) => {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
  },

  upsert: async (key: string, data: any) => {
    await setDoc(doc(db, "data", key), data, { merge: true });
  },

  getAll: async () => {
    const snap = await getDocs(collection(db, "data"));
    const result: Record<string, any> = {};
    snap.forEach((docSnap) => {
      result[docSnap.id] = docSnap.data();
    });
    return result;
  },

  // Document Delete
  deleteDoc: async (collectionName: string, docId: string) => {
    await deleteDoc(doc(db, collectionName, docId));
  },

  // Real-Time Collection Listener
  subscribeToCollection: (collectionName: string, callback: (data: any[]) => void): Unsubscribe => {
    const q = query(collection(db, collectionName));
    return onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      callback(list);
    }, (error) => {
      console.warn(`Firestore real-time subscription error [${collectionName}]:`, error);
    });
  },

  // Real-Time Document Listener
  subscribeToDoc: (collectionName: string, docId: string, callback: (data: any | null) => void): Unsubscribe => {
    return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        callback(null);
      }
    });
  },

  // Media Upload
  uploadMedia: async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  // Contact Form Submissions
  saveContactSubmission: async (data: any) => {
    const newDocRef = doc(collection(db, "contact_submissions"));
    await setDoc(newDocRef, {
      ...data,
      created_at: new Date().toISOString()
    });
  }
};
