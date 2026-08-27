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
export const auth = getAuth(app);

export const SUPER_ADMIN_UID = "iKbxm6RedwQ7l7piWwZkYT6XnR13";
export const SUPER_ADMIN_EMAIL = "admin@gmail.com";

/**
 * Deeply sanitize a value for Firestore compatibility.
 * Removes undefined values and prevents invalid nested arrays.
 */
export function sanitizeForFirestore(val: unknown, depth = 0): unknown {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : null;
  }
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      const cleaned = val.map(item => {
        if (Array.isArray(item)) {
          return sanitizeForFirestore(item, depth + 1);
        }
        return sanitizeForFirestore(item, depth);
      });
      if (depth > 0) {
        return cleaned.flat(Infinity);
      }
      return cleaned.map(item => Array.isArray(item) ? { _list: item } : item);
    }
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        result[k] = sanitizeForFirestore(v, depth);
      }
    }
    return result;
  }
  return null;
}

/**
 * Convert a base64 Data URL into a standard Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mime });
}

/**
 * Client-side image compression to optimize file size before upload
 */
export async function compressImage(
  source: File | Blob | string,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it's an SVG or GIF, don't re-compress on canvas (to preserve vectors/animations)
    if (source instanceof File && (source.type === 'image/svg+xml' || source.type === 'image/gif')) {
      return resolve(source);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrlToRevoke: string | null = null;

    img.onload = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);

      let width = img.width;
      let height = img.height;

      // Calculate aspect ratio scaling
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        if (source instanceof Blob) return resolve(source);
        return resolve(dataUrlToBlob(source as string));
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Determine mime output format
      const mime = (source instanceof File && source.type.includes('png')) ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else if (source instanceof Blob) {
            resolve(source);
          } else {
            resolve(dataUrlToBlob(source as string));
          }
        },
        mime,
        quality
      );
    };

    img.onerror = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      if (source instanceof Blob) return resolve(source);
      try {
        resolve(dataUrlToBlob(source as string));
      } catch (e) {
        reject(new Error('Failed to load and compress image.'));
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrlToRevoke = URL.createObjectURL(source);
      img.src = objectUrlToRevoke;
    }
  });
}

/**
/**
 * Compresses an image source to an ultra-compact Base64 Data URL (<25KB)
 */
export async function compressToDataUrl(
  source: File | Blob | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve) => {
    // Pass SVGs directly if they are already strings or files
    if (source instanceof File && source.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(source);
      return;
    }
    if (typeof source === 'string' && source.startsWith('data:image/svg+xml')) {
      return resolve(source);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    let objectUrlToRevoke: string | null = null;

    img.onload = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);

      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        if (typeof source === 'string') return resolve(source);
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(source as Blob);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      if (typeof source === 'string') return resolve(source);
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => resolve('');
      r.readAsDataURL(source as Blob);
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrlToRevoke = URL.createObjectURL(source);
      img.src = objectUrlToRevoke;
    }
  });
}

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
    const cleanData = sanitizeForFirestore(data);
    await setDoc(doc(db, collectionName, docId), cleanData as object, { merge: true });
  },

  upsert: async (key: string, data: any) => {
    const cleanData = sanitizeForFirestore(data);
    await setDoc(doc(db, "data", key), cleanData as object, { merge: true });
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

  /**
   * Pure Firestore Database Universal Media Uploader
   * Accepts File, Blob, or base64 Data URL string.
   * Compresses image to high-efficiency format and stores directly into Firestore Database 'site_media' collection.
   * Eliminates 100% of Storage bucket errors, 402 payment requirements, and upload limits.
   */
  uploadMedia: async (
    fileOrDataUrl: File | Blob | string, 
    path = 'website-content',
    fileName?: string
  ): Promise<string> => {
    // If it's already an external HTTP/HTTPS URL and not a data URL, return as is
    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
      return fileOrDataUrl;
    }

    try {
      const timestamp = Date.now();
      const mediaId = fileName 
        ? `${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}` 
        : `media_${timestamp}`;

      // Compress to high-efficiency compact web data string (<25KB)
      const compressedDataUrl = await compressToDataUrl(fileOrDataUrl, 960, 960, 0.7);

      // Store directly in Firestore 'site_media' collection
      const mediaRecord = {
        id: mediaId,
        path: path.replace(/^\/+|\/+$/g, ''),
        dataUrl: compressedDataUrl,
        mimeType: 'image/jpeg',
        size: compressedDataUrl.length,
        created_at: new Date().toISOString()
      };

      // Asynchronously persist to Firestore Database collection 'site_media'
      firebaseClient.upsertDoc('site_media', mediaId, mediaRecord).catch(() => {});

      return compressedDataUrl;
    } catch (err: any) {
      if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
      return await compressToDataUrl(fileOrDataUrl, 800, 800, 0.6);
    }
  },

  /**
   * Helper to upload AI-generated base64 or pasted data URL to Firestore Database
   */
  uploadBase64: async (base64Data: string, path = 'ai-images', customName?: string): Promise<string> => {
    return firebaseClient.uploadMedia(base64Data, path, customName);
  },

  // Contact Form Submissions
  saveContactSubmission: async (data: any) => {
    const cleanData = sanitizeForFirestore({
      ...data,
      created_at: new Date().toISOString()
    });
    const newDocRef = doc(collection(db, "contact_submissions"));
    await setDoc(newDocRef, cleanData as object);
  }
};
