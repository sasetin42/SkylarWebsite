import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDY40zmjnYIAYOGLszmEjC9zv8V3jpw_a4",
  authDomain: "skylar-asia.firebaseapp.com",
  projectId: "skylar-asia",
  storageBucket: "skylar-asia.firebasestorage.app",
  messagingSenderId: "214317328512",
  appId: "1:214317328512:web:9327be6c67c50672a15e65",
  measurementId: "G-4PQCQZZPB8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const firebaseClient = {
  getAll: async () => {
    const data: Record<string, any> = {};
    const querySnapshot = await getDocs(collection(db, "data"));
    querySnapshot.forEach((docSnap) => {
      data[docSnap.id] = docSnap.data();
    });
    return data;
  },
  upsert: async (key: string, data: any) => {
    await setDoc(doc(db, "data", key), data, { merge: true });
  },
  saveContactSubmission: async (data: any) => {
    const newDocRef = doc(collection(db, "contact_submissions"));
    await setDoc(newDocRef, {
      ...data,
      created_at: new Date().toISOString()
    });
  },
  uploadMedia: async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
};
