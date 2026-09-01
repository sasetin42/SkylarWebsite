import { initializeApp } from "firebase/app";
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  onSnapshot, 
  query,
  Unsubscribe,
  setLogLevel,
  disableNetwork,
  enableNetwork,
  persistentLocalCache,
  persistentMultipleTabManager
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

// Suppress Firestore internal debug/backoff logs from spamming the console
try {
  setLogLevel('silent');
} catch (e) {}

export const app = initializeApp(firebaseConfig);

// Initialize Firestore with experimentalForceLongPolling to eliminate QUIC/HTTP3 stream errors & connection drops
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (e) {
    return getFirestore(app);
  }
})();

export const auth = getAuth(app);

export const SUPER_ADMIN_UID = "iKbxm6RedwQ7l7piWwZkYT6XnR13";
export const SUPER_ADMIN_EMAIL = "admin@gmail.com";

// --- Firestore Circuit Breaker (Graceful Offline & Quota Fallback) ---
let isFirestoreQuotaExhaustedOrBlocked = (() => {
  try {
    if (typeof window === 'undefined') return false;
    const blocked = window.sessionStorage?.getItem('apex_firestore_blocked') === 'true' ||
                    window.localStorage?.getItem('apex_firestore_blocked') === 'true';
    if (blocked) {
      try {
        disableNetwork(db).catch(() => {});
      } catch (e) {}
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
})();

export function handleFirestoreError(err: any): void {
  const errMsg = err?.message || String(err || '');
  const errCode = err?.code || '';
  if (
    errCode === 'resource-exhausted' ||
    errCode === 'unavailable' ||
    errCode === 'failed-precondition' ||
    errCode === 'permission-denied' ||
    errCode === 'unimplemented' ||
    errMsg.includes('Quota exceeded') ||
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('ERR_BLOCKED_BY_CLIENT') ||
    errMsg.includes('net::ERR_BLOCKED_BY_CLIENT') ||
    errMsg.includes('Failed to fetch') ||
    errMsg.includes('network-request-failed') ||
    errMsg.includes('Failed to get document') ||
    errMsg.includes('terminate')
  ) {
    isFirestoreQuotaExhaustedOrBlocked = true;
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage?.setItem('apex_firestore_blocked', 'true');
        window.localStorage?.setItem('apex_firestore_blocked', 'true');
      }
    } catch (e) {}
    try {
      disableNetwork(db).catch(() => {});
    } catch (e) {}
  }
}

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
    const mime = source instanceof File ? source.type : 'image/jpeg';
    if (mime === 'image/svg+xml') {
      if (source instanceof Blob) return resolve(source);
      return resolve(dataUrlToBlob(source as string));
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
        if (source instanceof Blob) return resolve(source);
        return resolve(dataUrlToBlob(source as string));
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            if (source instanceof Blob) return resolve(source);
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
 * Compresses an image source to an ultra-compact Base64 Data URL (<25KB)
 */
export async function compressToDataUrl(
  source: File | Blob | string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.6
): Promise<string> {
  return new Promise((resolve) => {
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
  isAvailable: () => !isFirestoreQuotaExhaustedOrBlocked,

  // Generic collection reader
  getCollection: async (collectionName: string): Promise<any[]> => {
    if (isFirestoreQuotaExhaustedOrBlocked) return [];
    try {
      const snap = await getDocs(collection(db, collectionName));
      const result: any[] = [];
      snap.forEach((docSnap) => {
        result.push({ id: docSnap.id, ...docSnap.data() });
      });
      return result;
    } catch (err) {
      handleFirestoreError(err);
      return [];
    }
  },

  // Document Upsert
  upsertDoc: async (collectionName: string, docId: string, data: any): Promise<void> => {
    if (isFirestoreQuotaExhaustedOrBlocked) return;
    try {
      const cleanData = sanitizeForFirestore(data);
      await setDoc(doc(db, collectionName, docId), cleanData as object, { merge: true });
    } catch (err) {
      handleFirestoreError(err);
    }
  },

  upsert: async (key: string, data: any): Promise<void> => {
    if (isFirestoreQuotaExhaustedOrBlocked) return;
    try {
      const cleanData = sanitizeForFirestore(data);
      await setDoc(doc(db, "data", key), cleanData as object, { merge: true });
    } catch (err) {
      handleFirestoreError(err);
    }
  },

  getAll: async (): Promise<Record<string, any>> => {
    if (isFirestoreQuotaExhaustedOrBlocked) return {};
    try {
      const snap = await getDocs(collection(db, "data"));
      const result: Record<string, any> = {};
      snap.forEach((docSnap) => {
        result[docSnap.id] = docSnap.data();
      });
      return result;
    } catch (err) {
      handleFirestoreError(err);
      return {};
    }
  },

  // Document Delete
  deleteDoc: async (collectionName: string, docId: string): Promise<void> => {
    if (isFirestoreQuotaExhaustedOrBlocked) return;
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (err) {
      handleFirestoreError(err);
    }
  },

  // Real-Time Collection Listener with Circuit Breaker
  subscribeToCollection: (collectionName: string, callback: (data: any[]) => void): Unsubscribe => {
    if (isFirestoreQuotaExhaustedOrBlocked) {
      return () => {};
    }
    try {
      const q = query(collection(db, collectionName));
      return onSnapshot(q, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        callback(list);
      }, (error) => {
        handleFirestoreError(error);
      });
    } catch (err) {
      handleFirestoreError(err);
      return () => {};
    }
  },

  // Real-Time Document Listener with Circuit Breaker
  subscribeToDoc: (collectionName: string, docId: string, callback: (data: any | null) => void): Unsubscribe => {
    if (isFirestoreQuotaExhaustedOrBlocked) {
      return () => {};
    }
    try {
      return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        } else {
          callback(null);
        }
      }, (error) => {
        handleFirestoreError(error);
      });
    } catch (err) {
      handleFirestoreError(err);
      return () => {};
    }
  },

  /**
   * Pure Firestore Database Universal Media Uploader
   * Accepts File, Blob, or base64 Data URL string.
   * Compresses image to high-efficiency format and stores directly into Firestore Database 'site_media' collection.
   */
  uploadMedia: async (
    fileOrDataUrl: File | Blob | string, 
    path = 'website-content',
    fileName?: string
  ): Promise<string> => {
    if (typeof fileOrDataUrl === 'string' && (fileOrDataUrl.startsWith('http://') || fileOrDataUrl.startsWith('https://'))) {
      return fileOrDataUrl;
    }

    try {
      const timestamp = Date.now();
      const mediaId = fileName 
        ? `${timestamp}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}` 
        : `media_${timestamp}`;

      const compressedDataUrl = await compressToDataUrl(fileOrDataUrl, 960, 960, 0.7);

      if (!isFirestoreQuotaExhaustedOrBlocked) {
        const mediaRecord = {
          id: mediaId,
          path: path.replace(/^\/+|\/+$/g, ''),
          dataUrl: compressedDataUrl,
          mimeType: 'image/jpeg',
          size: compressedDataUrl.length,
          created_at: new Date().toISOString()
        };
        firebaseClient.upsertDoc('site_media', mediaId, mediaRecord).catch(() => {});
      }

      return compressedDataUrl;
    } catch (err: any) {
      if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
      return await compressToDataUrl(fileOrDataUrl, 800, 800, 0.6);
    }
  },

  uploadBase64: async (base64Data: string, path = 'ai-images', customName?: string): Promise<string> => {
    return firebaseClient.uploadMedia(base64Data, path, customName);
  },

  compressToDataUrl: async (fileOrDataUrl: File | Blob | string, maxWidth = 960, maxHeight = 960, quality = 0.7): Promise<string> => {
    return compressToDataUrl(fileOrDataUrl, maxWidth, maxHeight, quality);
  },

  saveContactSubmission: async (data: any) => {
    if (isFirestoreQuotaExhaustedOrBlocked) return;
    try {
      const cleanData = sanitizeForFirestore({
        ...data,
        created_at: new Date().toISOString()
      });
      const newDocRef = doc(collection(db, "contact_submissions"));
      await setDoc(newDocRef, cleanData as object);
    } catch (err) {
      handleFirestoreError(err);
    }
  },

  resetConnection: async () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage?.removeItem('apex_firestore_blocked');
        window.localStorage?.removeItem('apex_firestore_blocked');
      }
      isFirestoreQuotaExhaustedOrBlocked = false;
      await enableNetwork(db);
    } catch (e) {}
  }
};
