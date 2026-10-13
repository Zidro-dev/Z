import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  favoriteAnime?: string;
  isMegaFan: boolean;
  createdAt: string;
}

export const ANIME_AVATARS = [
  { id: 'jinwoo', name: 'Sung Jinwoo', icon: '🗡️', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-it355ZgzquUd.png' },
  { id: 'gojo', name: 'Satoru Gojo', icon: '👁️', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg' },
  { id: 'frieren', name: 'Frieren', icon: '✨', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg' },
  { id: 'tanjiro', name: 'Tanjiro Kamado', icon: '🌊', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-WBsBl0ClmgYL.jpg' },
  { id: 'denji', name: 'Denji', icon: '🪚', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-DdP4vAdssLoz.png' },
  { id: 'luffy', name: 'Monkey D. Luffy', icon: '🍖', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-ELSYx3yMPcKM.jpg' },
  { id: 'anya', name: 'Anya Forger', icon: '🥜', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-Kb6R5nYQfjmP.jpg' },
  { id: 'eren', name: 'Eren Jaeger', icon: '⚔️', url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg' },
];

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string, avatarUrl: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => void;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(() => {
    try {
      const saved = localStorage.getItem('aniroll_guest_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore or generate default
  const fetchOrCreateProfile = async (firebaseUser: User, customName?: string, customAvatar?: string) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfileData;
        setProfile(data);
      } else {
        const newProfile: UserProfileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: customName || firebaseUser.displayName || 'Anime Muxlisi',
          avatar: customAvatar || firebaseUser.photoURL || ANIME_AVATARS[0].url,
          favoriteAnime: 'Solo Leveling',
          isMegaFan: false,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (e) {
      console.warn('Could not sync Firestore profile, using local fallback:', e);
      // Fallback local profile
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: customName || firebaseUser.displayName || 'Anime Muxlisi',
        avatar: customAvatar || ANIME_AVATARS[0].url,
        favoriteAnime: 'Solo Leveling',
        isMegaFan: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchOrCreateProfile(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await fetchOrCreateProfile(cred.user);
  };

  const registerWithEmail = async (email: string, pass: string, displayName: string, avatarUrl: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateFirebaseProfile(cred.user, {
      displayName,
      photoURL: avatarUrl,
    });
    await fetchOrCreateProfile(cred.user, displayName, avatarUrl);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await fetchOrCreateProfile(cred.user);
  };

  const loginAsGuest = (name: string = "Mehmon Muxlis") => {
    const guestProfile: UserProfileData = {
      uid: `guest-${Date.now()}`,
      email: 'guest@aniroll.uz',
      displayName: name,
      avatar: ANIME_AVATARS[0].url,
      favoriteAnime: 'Solo Leveling',
      isMegaFan: true,
      createdAt: new Date().toISOString(),
    };
    setProfile(guestProfile);
    localStorage.setItem('aniroll_guest_profile', JSON.stringify(guestProfile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    setProfile(null);
    localStorage.removeItem('aniroll_guest_profile');
  };

  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, data);
      } catch (e) {
        console.warn('Failed to update Firestore profile:', e);
      }
    } else {
      localStorage.setItem('aniroll_guest_profile', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
