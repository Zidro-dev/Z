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
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Episode } from '../types/anime';

export const OWNER_EMAIL = 'yusufjonovm30@gmail.com';

export type UserRole = 'owner' | 'admin' | 'user';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  role: UserRole;
  favoriteAnime?: string;
  isMegaFan: boolean;
  isBanned?: boolean;
  isPermanentlyBanned?: boolean;
  bannedBy?: string;
  banReason?: string;
  adminBanCount?: number; // How many bans this admin has issued (max 3 for admin)
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

const INITIAL_MOCK_USERS: UserProfileData[] = [
  {
    uid: 'owner-primary',
    email: OWNER_EMAIL,
    displayName: 'Asosiy Boshqaruvchi (Owner)',
    avatar: ANIME_AVATARS[0].url,
    role: 'owner',
    isMegaFan: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    uid: 'user-sample-1',
    email: 'anivar_99@gmail.com',
    displayName: 'Anvar Muxlis',
    avatar: ANIME_AVATARS[1].url,
    role: 'admin',
    isMegaFan: true,
    adminBanCount: 1,
    createdAt: '2026-02-10T12:00:00.000Z',
  },
  {
    uid: 'user-sample-2',
    email: 'sevara_anime@gmail.com',
    displayName: 'Sevara Otakuxon',
    avatar: ANIME_AVATARS[2].url,
    role: 'user',
    isMegaFan: false,
    createdAt: '2026-02-15T15:30:00.000Z',
  },
  {
    uid: 'user-sample-3',
    email: 'spammer_troll@gmail.com',
    displayName: 'Troll User (Qoidabuzar)',
    avatar: ANIME_AVATARS[4].url,
    role: 'user',
    isMegaFan: false,
    isBanned: true,
    bannedBy: 'Anvar Muxlis (Admin)',
    banReason: "Izohlarda nomaqbul so'zlar ishlatgani uchun",
    createdAt: '2026-03-01T09:00:00.000Z',
  },
];

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  allUsers: UserProfileData[];
  customEpisodes: Record<string, Episode[]>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string, avatarUrl: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (name?: string) => void;
  loginAsOwnerDemo: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfileData>) => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
  demoteAdmin: (userId: string) => Promise<void>;
  banUser: (userId: string, reason: string, isPermanent?: boolean) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  addNewEpisode: (episode: Episode) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(() => {
    try {
      const saved = localStorage.getItem('aniroll_active_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [allUsers, setAllUsers] = useState<UserProfileData[]>(() => {
    try {
      const saved = localStorage.getItem('aniroll_all_users');
      return saved ? JSON.parse(saved) : INITIAL_MOCK_USERS;
    } catch {
      return INITIAL_MOCK_USERS;
    }
  });

  const [customEpisodes, setCustomEpisodes] = useState<Record<string, Episode[]>>(() => {
    try {
      const saved = localStorage.getItem('aniroll_custom_episodes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [loading, setLoading] = useState(true);

  // Determine Owner and Admin status
  const isOwner = Boolean(
    profile?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() ||
    profile?.role === 'owner' ||
    user?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  );

  const isAdmin = Boolean(isOwner || profile?.role === 'admin');

  // Persist all users changes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_all_users', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  // Persist custom episodes
  useEffect(() => {
    try {
      localStorage.setItem('aniroll_custom_episodes', JSON.stringify(customEpisodes));
    } catch {}
  }, [customEpisodes]);

  // Sync profile from Firestore or generate default
  const fetchOrCreateProfile = async (firebaseUser: User, customName?: string, customAvatar?: string) => {
    const isTargetOwner = firebaseUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfileData;
        // Ensure owner email always has owner role
        if (isTargetOwner && data.role !== 'owner') {
          data.role = 'owner';
          await updateDoc(userRef, { role: 'owner' });
        }
        setProfile(data);
        localStorage.setItem('aniroll_active_profile', JSON.stringify(data));
      } else {
        const newProfile: UserProfileData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: customName || firebaseUser.displayName || (isTargetOwner ? 'AniRoll Egasi (Owner)' : 'Anime Muxlisi'),
          avatar: customAvatar || firebaseUser.photoURL || ANIME_AVATARS[0].url,
          role: isTargetOwner ? 'owner' : 'user',
          favoriteAnime: 'Solo Leveling',
          isMegaFan: isTargetOwner,
          adminBanCount: 0,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
        localStorage.setItem('aniroll_active_profile', JSON.stringify(newProfile));

        // Add to users list
        setAllUsers((prev) => {
          if (!prev.some((u) => u.uid === newProfile.uid)) {
            return [newProfile, ...prev];
          }
          return prev;
        });
      }
    } catch (e) {
      console.warn('Could not sync Firestore profile, using local fallback:', e);
      const fallbackProfile: UserProfileData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: customName || firebaseUser.displayName || (isTargetOwner ? 'AniRoll Egasi (Owner)' : 'Anime Muxlisi'),
        avatar: customAvatar || ANIME_AVATARS[0].url,
        role: isTargetOwner ? 'owner' : 'user',
        favoriteAnime: 'Solo Leveling',
        isMegaFan: isTargetOwner,
        adminBanCount: 0,
        createdAt: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
      localStorage.setItem('aniroll_active_profile', JSON.stringify(fallbackProfile));
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
      role: 'user',
      favoriteAnime: 'Solo Leveling',
      isMegaFan: false,
      adminBanCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProfile(guestProfile);
    localStorage.setItem('aniroll_active_profile', JSON.stringify(guestProfile));
  };

  // Dedicated instant Owner quick login mode for yusufjonovm30@gmail.com
  const loginAsOwnerDemo = () => {
    const ownerProfile: UserProfileData = {
      uid: 'owner-primary',
      email: OWNER_EMAIL,
      displayName: 'Asosiy Boshqaruvchi (Owner)',
      avatar: ANIME_AVATARS[0].url,
      role: 'owner',
      favoriteAnime: 'Solo Leveling',
      isMegaFan: true,
      createdAt: new Date().toISOString(),
    };
    setProfile(ownerProfile);
    localStorage.setItem('aniroll_active_profile', JSON.stringify(ownerProfile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setUser(null);
    setProfile(null);
    localStorage.removeItem('aniroll_active_profile');
  };

  const updateUserProfile = async (data: Partial<UserProfileData>) => {
    if (!profile) return;
    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem('aniroll_active_profile', JSON.stringify(updated));

    // Update in allUsers list as well
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === updated.uid ? updated : u))
    );

    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, data);
      } catch (e) {
        console.warn('Failed to update Firestore profile:', e);
      }
    }
  };

  // Promote user to Admin (Only Owner can execute)
  const promoteToAdmin = async (userId: string) => {
    if (!isOwner) {
      throw new Error("Faqat sayt egasi (Owner) yangi adminlarni tayinlashi mumkin!");
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, role: 'admin', adminBanCount: 0 } : u))
    );

    if (profile && profile.uid === userId) {
      setProfile({ ...profile, role: 'admin', adminBanCount: 0 });
    }

    try {
      const uRef = doc(db, 'users', userId);
      await updateDoc(uRef, { role: 'admin', adminBanCount: 0 });
    } catch (e) {
      console.warn("Firestore update skipped:", e);
    }
  };

  // Demote Admin back to regular User (Only Owner can execute)
  const demoteAdmin = async (userId: string) => {
    if (!isOwner) {
      throw new Error("Faqat sayt egasi (Owner) adminlik vakolatini bekor qilishi mumkin!");
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.uid === userId ? { ...u, role: 'user' } : u))
    );

    try {
      const uRef = doc(db, 'users', userId);
      await updateDoc(uRef, { role: 'user' });
    } catch (e) {
      console.warn("Firestore update skipped:", e);
    }
  };

  // Ban user (Admin quota: 3 bans max; Owner: unlimited + permanent ban option)
  const banUser = async (userId: string, reason: string, isPermanent: boolean = false) => {
    if (!isAdmin) {
      throw new Error("Foydalanuvchilarni bloklash huquqiga ega emassiz!");
    }

    const targetUser = allUsers.find((u) => u.uid === userId);
    if (!targetUser) {
      throw new Error("Foydalanuvchi topilmadi.");
    }
    if (targetUser.role === 'owner') {
      throw new Error("Sayt egasini (Owner) bloklash mumkin emas!");
    }
    if (targetUser.role === 'admin' && !isOwner) {
      throw new Error("Admin boshqa adminni bloklay olmaydi. Faqat Owner bu ishni qila oladi.");
    }

    // Check Admin ban quota (max 3 bans)
    if (!isOwner && profile?.role === 'admin') {
      const currentBans = profile.adminBanCount || 0;
      if (currentBans >= 3) {
        throw new Error("Adminga berilgan 3 ta foydalanuvchini bloklash limiti tugagan!");
      }
      // Increment admin ban count
      await updateUserProfile({ adminBanCount: currentBans + 1 });
    }

    // Apply ban
    const updatedUser: UserProfileData = {
      ...targetUser,
      isBanned: true,
      isPermanentlyBanned: isOwner ? isPermanent : false,
      bannedBy: isOwner ? "Sayt Egasi (Owner)" : `${profile?.displayName} (Admin)`,
      banReason: reason.trim() || "Qoidalarni buzganligi sababli",
    };

    setAllUsers((prev) =>
      prev.map((u) => (u.uid === userId ? updatedUser : u))
    );

    try {
      const uRef = doc(db, 'users', userId);
      await updateDoc(uRef, {
        isBanned: true,
        isPermanentlyBanned: updatedUser.isPermanentlyBanned,
        bannedBy: updatedUser.bannedBy,
        banReason: updatedUser.banReason,
      });
    } catch (e) {
      console.warn("Firestore update skipped:", e);
    }
  };

  // Unban user
  const unbanUser = async (userId: string) => {
    if (!isAdmin) {
      throw new Error("Foydalanuvchini blokdan chiqarish huquqiga ega emassiz!");
    }

    const targetUser = allUsers.find((u) => u.uid === userId);
    if (targetUser?.isPermanentlyBanned && !isOwner) {
      throw new Error("Ushbu foydalanuvchi Owner tomonidan butunlay bloklangan. Faqat Owner blokdan chiqara oladi!");
    }

    setAllUsers((prev) =>
      prev.map((u) =>
        u.uid === userId
          ? {
              ...u,
              isBanned: false,
              isPermanentlyBanned: false,
              banReason: undefined,
              bannedBy: undefined,
            }
          : u
      )
    );

    try {
      const uRef = doc(db, 'users', userId);
      await updateDoc(uRef, {
        isBanned: false,
        isPermanentlyBanned: false,
        banReason: null,
        bannedBy: null,
      });
    } catch (e) {
      console.warn("Firestore update skipped:", e);
    }
  };

  // Add new anime episode (Admin or Owner)
  const addNewEpisode = async (episode: Episode) => {
    if (!isAdmin) {
      throw new Error("Faqat Admin yoki Sayt Egasi yangi qismlarni qo'sha oladi!");
    }

    setCustomEpisodes((prev) => {
      const existing = prev[episode.id] || [];
      return {
        ...prev,
        [episode.id]: [episode, ...existing],
      };
    });

    try {
      const epRef = doc(db, 'added_episodes', `${episode.id}-${episode.episodeNumber}`);
      await setDoc(epRef, {
        ...episode,
        addedBy: profile?.displayName || 'Admin',
        addedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Firestore added_episodes write skipped:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isOwner,
        isAdmin,
        allUsers,
        customEpisodes,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsGuest,
        loginAsOwnerDemo,
        logout,
        updateUserProfile,
        promoteToAdmin,
        demoteAdmin,
        banUser,
        unbanUser,
        addNewEpisode,
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
