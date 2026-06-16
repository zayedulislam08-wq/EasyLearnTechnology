import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AuthAPI } from '../services/api';
import { seedAdminAccount, seedCourses } from '../lib/database';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          if (firebaseUser.email === 'zayedulislam08@gmail.com') {
            await seedAdminAccount(firebaseUser.uid);
            await seedCourses(firebaseUser.uid);
          }

          // Fetch the profile containing the specific roles and extended data
          const profile = await AuthAPI.getUserProfile(firebaseUser.uid, firebaseUser.email);
          
          const fullUser: User = {
            id: profile.id,
            name: profile.name,
            email: firebaseUser.email || profile.email,
            role: profile.role as Role,
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${firebaseUser.email || profile.email}`,
          };
          setUser(fullUser);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    // If no password provided, it acts as a mock mode fallback for existing UI
    if (!password) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        role: 'student' as Role, // Fallback default
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}`,
      };
      setUser(mockUser);
      return;
    }
    
    await signInWithEmailAndPassword(auth, email, password);
  };
  
  const signUp = async (email: string, password?: string, role: Role = 'student') => {
    if (!password) return;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userUid = userCredential.user.uid;

    // We only set doc here if it's NOT the admin account, as onAuthStateChanged handles the admin account seeding to avoid a race condition.
    if (email !== 'zayedulislam08@gmail.com') {
      await setDoc(doc(db, 'users', userUid), {
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        role,
        createdAt: new Date().toISOString()
      });
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}