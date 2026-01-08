import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { UserRole, EvaluationResult } from '../types';

// Check for API Key validity
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || 
               (typeof process !== 'undefined' ? (process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY) : undefined);

const hasApiKey = !!apiKey && apiKey !== 'undefined' && apiKey !== '';

// --- Real Firebase Implementation Variables ---
let realAuth: any;
let realDb: any;
let realApp: any;

if (hasApiKey) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (typeof process !== 'undefined' ? process.env.FIREBASE_AUTH_DOMAIN : undefined),
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || (typeof process !== 'undefined' ? process.env.FIREBASE_PROJECT_ID : undefined),
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (typeof process !== 'undefined' ? process.env.FIREBASE_STORAGE_BUCKET : undefined),
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (typeof process !== 'undefined' ? process.env.FIREBASE_MESSAGING_SENDER_ID : undefined),
    appId: import.meta.env.VITE_FIREBASE_APP_ID || (typeof process !== 'undefined' ? process.env.FIREBASE_APP_ID : undefined),
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (typeof process !== 'undefined' ? process.env.FIREBASE_MEASUREMENT_ID : undefined)
  };
  try {
    realApp = initializeApp(firebaseConfig);
    realAuth = getAuth(realApp);
    realDb = getFirestore(realApp);
    if (typeof window !== 'undefined') {
      getAnalytics(realApp);
    }
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  console.warn("Firebase API Key missing. Using Mock Service with localStorage.");
}

// --- Mock Implementation Helpers ---
const MOCK_STORAGE_KEY = 'prashikshan_users';
const MOCK_SESSION_KEY = 'prashikshan_session';
let mockAuthListeners: ((user: any) => void)[] = [];

// Initialize with a default user for easier testing
const DEFAULT_USER_EMAIL = 'student@demo.com';
const DEFAULT_USER = {
  uid: 'mock_default_student',
  name: 'Demo Student',
  email: DEFAULT_USER_EMAIL,
  role: UserRole.STUDENT,
  password: 'password', // Simple password for demo
  createdAt: new Date().toISOString(),
  evaluation: null
};

const getMockUsers = () => {
  try {
    const data = localStorage.getItem(MOCK_STORAGE_KEY);
    let users = data ? JSON.parse(data) : {};
    
    // FORCE INJECT DEFAULT USER if missing (Fixes invalid credentials error)
    if (!users[DEFAULT_USER_EMAIL]) {
      users[DEFAULT_USER_EMAIL] = DEFAULT_USER;
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(users));
    }
    
    return users;
  } catch { 
    // Fallback if corrupted
    const initial = { [DEFAULT_USER_EMAIL]: DEFAULT_USER };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initial));
    return initial; 
  }
};

const saveMockUsers = (users: any) => localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(users));

const notifyAuthListeners = (user: any) => {
  mockAuthListeners.forEach(l => l(user));
};

export const firebaseService = {
  // Auth Helpers
  async signUp(email: string, password: string, name: string, role: UserRole) {
    if (hasApiKey && realAuth) {
      const userCredential = await createUserWithEmailAndPassword(realAuth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(realDb, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        evaluation: null
      });
      return { user, role };
    } else {
      // Mock SignUp
      await new Promise(r => setTimeout(r, 800)); // Simulate network
      const users = getMockUsers();
      if (users[email]) throw new Error("User already exists (Mock Mode)");
      
      const uid = 'mock_' + Date.now();
      const newUser = {
        uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        evaluation: null
      };
      
      // In a real app, never store passwords in plain text!
      users[email] = { ...newUser, password }; 
      saveMockUsers(users);
      localStorage.setItem(MOCK_SESSION_KEY, email);
      
      const mockUserObj = { uid, displayName: name, email };
      notifyAuthListeners(mockUserObj);
      
      return { user: mockUserObj, role };
    }
  },

  async signIn(email: string, password: string) {
    if (hasApiKey && realAuth) {
      const userCredential = await signInWithEmailAndPassword(realAuth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(realDb, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      return { 
        user, 
        role: userData?.role as UserRole || UserRole.STUDENT,
        userData 
      };
    } else {
      // Mock SignIn
      await new Promise(r => setTimeout(r, 800));
      const users = getMockUsers();
      const user = users[email];
      
      if (!user || user.password !== password) {
        throw new Error(`Invalid credentials (Mock Mode). Try ${DEFAULT_USER_EMAIL} / password`);
      }
      
      localStorage.setItem(MOCK_SESSION_KEY, email);
      const mockUserObj = { uid: user.uid, displayName: user.name, email };
      notifyAuthListeners(mockUserObj);
      
      return {
        user: mockUserObj,
        role: user.role,
        userData: user
      };
    }
  },

  async logout() {
    if (hasApiKey && realAuth) {
      await firebaseSignOut(realAuth);
    } else {
      localStorage.removeItem(MOCK_SESSION_KEY);
      notifyAuthListeners(null);
    }
  },

  // Firestore Helpers
  async saveEvaluationResult(userId: string, result: EvaluationResult) {
    if (hasApiKey && realDb) {
      const userRef = doc(realDb, 'users', userId);
      await updateDoc(userRef, {
        evaluation: result,
        lastUpdated: new Date().toISOString()
      });
    } else {
      const users = getMockUsers();
      const email = Object.keys(users).find(k => users[k].uid === userId);
      if (email) {
        users[email].evaluation = result;
        users[email].lastUpdated = new Date().toISOString();
        saveMockUsers(users);
      }
    }
  },

  async saveResumeAnalysis(userId: string, resumeText: string, analysis: any) {
    if (hasApiKey && realDb) {
      const userRef = doc(realDb, 'users', userId);
      // In a real app, you might want to store this in a sub-collection 'resumeHistory'
      // For now, we'll store it in a single field or simple array
      await updateDoc(userRef, {
        lastResumeAnalysis: {
          text: resumeText,
          analysis,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      const users = getMockUsers();
      const email = Object.keys(users).find(k => users[k].uid === userId);
      if (email) {
        users[email].lastResumeAnalysis = {
          text: resumeText,
          analysis,
          timestamp: new Date().toISOString()
        };
        saveMockUsers(users);
      }
    }
  },

  async getUserProfile(userId: string) {
    if (hasApiKey && realDb) {
      const docRef = doc(realDb, 'users', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } else {
      const users = getMockUsers();
      const email = Object.keys(users).find(k => users[k].uid === userId);
      return email ? users[email] : null;
    }
  },

  // State Listener Wrapper
  onAuthStateChanged(callback: (user: any) => void) {
    if (hasApiKey && realAuth) {
      return firebaseOnAuthStateChanged(realAuth, callback);
    } else {
      // Register mock listener
      mockAuthListeners.push(callback);
      // Check current session
      const email = localStorage.getItem(MOCK_SESSION_KEY);
      if (email) {
        const users = getMockUsers();
        const user = users[email];
        if (user) {
          callback({ uid: user.uid, displayName: user.name, email });
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
      // Return unsubscribe
      return () => {
        mockAuthListeners = mockAuthListeners.filter(l => l !== callback);
      };
    }
  },

  getCurrentUser() {
    if (hasApiKey && realAuth) {
      return realAuth.currentUser;
    } else {
      const email = localStorage.getItem(MOCK_SESSION_KEY);
      if (email) {
        const users = getMockUsers();
        const user = users[email];
        return user ? { uid: user.uid, displayName: user.name, email } : null;
      }
      return null;
    }
  }
};

// Export raw auth/db if needed, but handled mostly by service now
export const auth = hasApiKey ? realAuth : null;
export const db = hasApiKey ? realDb : null;
