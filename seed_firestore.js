import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

// Simulated data extracting logic
// We will rely on the client to sync up local storage for now, but we'll create the empty collections.
async function seedCollections() {
  console.log("Creating RDN structure...");
  const collections = [
    'courses', 'categories', 'locations', 'students', 'trainers', 
    'sessions', 'settings', 'admin_users', 'corporate_clients',
    'blog_posts', 'testimonials', 'roles', 'system_modules', 'site_pages'
  ];

  for (const coll of collections) {
    console.log(`Creating collection ${coll}...`);
    // Create a dummy document to ensure the collection exists in the Firebase console view
    await setDoc(doc(db, coll, "_init"), { _initialized: true, timestamp: new Date().toISOString() });
  }

  // Create subcollections example
  console.log("Creating subcollections...");
  await setDoc(doc(db, "students", "_init", "documents", "_init"), { _initialized: true });
  await setDoc(doc(db, "students", "_init", "certificates", "_init"), { _initialized: true });

  console.log("RDN Firestore Schema Applied Successfully!");
}

seedCollections().catch(console.error);
