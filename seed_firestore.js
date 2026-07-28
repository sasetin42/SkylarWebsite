import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

async function seedCollections() {
  console.log("Seeding Super Admin user & initializing Cloud Firestore schema...");

  // 1. Seed Super Admin user
  const superAdminUid = "iKbxm6RedwQ7l7piWwZkYT6XnR13";
  await setDoc(doc(db, "users", superAdminUid), {
    uid: superAdminUid,
    email: "admin@skylareducation.asia",
    role: "Super Admin",
    name: "System Admin",
    status: "Active",
    created_at: new Date().toISOString()
  });
  console.log("✓ Super Admin user seeded successfully!");

  // 2. Initialize system collections
  const collections = [
    'courses', 'categories', 'locations', 'students', 'trainers', 
    'sessions', 'settings', 'admin_users', 'corporate_clients',
    'blog_posts', 'testimonials', 'roles', 'system_modules', 'site_pages',
    'payments', 'tickets', 'audit_logs', 'sections'
  ];

  for (const coll of collections) {
    console.log(`Initializing collection: ${coll}`);
    await setDoc(doc(db, coll, "_init"), { _initialized: true, timestamp: new Date().toISOString() });
  }

  console.log("🎉 Firestore Schema and Collections Seeded Successfully!");
}

seedCollections().catch(console.error);
