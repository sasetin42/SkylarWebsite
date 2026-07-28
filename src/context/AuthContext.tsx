import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth, SUPER_ADMIN_EMAIL, SUPER_ADMIN_UID, firebaseClient } from '../../services/firebaseClient';

interface UserProfile {
  uid: string;
  email: string | null;
  role: string;
  name?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isSuperAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isSuperAdmin: false,
  loading: true,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const isSuperAdminDomain = Boolean(user.email && (user.email.endsWith('@skylareducation.asia') || user.email.endsWith('@skylar.com.ph')));
        const isSuperAdminUser = user.uid === SUPER_ADMIN_UID || user.email === SUPER_ADMIN_EMAIL || isSuperAdminDomain;
        const profile: UserProfile = {
          uid: user.uid,
          email: user.email,
          role: isSuperAdminUser ? 'Super Admin' : 'Student',
          name: user.displayName || user.email?.split('@')[0] || 'User',
        };

        // Ensure user document exists in Firestore
        await firebaseClient.upsertDoc('users', user.uid, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const isSuperAdmin = Boolean(
    currentUser && (
      currentUser.uid === SUPER_ADMIN_UID || 
      currentUser.email === SUPER_ADMIN_EMAIL || 
      (currentUser.email && (currentUser.email.endsWith('@skylareducation.asia') || currentUser.email.endsWith('@skylar.com.ph'))) || 
      userProfile?.role === 'Super Admin'
    )
  );

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isSuperAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
