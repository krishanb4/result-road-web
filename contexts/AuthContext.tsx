"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Types
export type UserRole =
  | "admin"
  | "participant"
  | "instructor"
  | "fitness_partner"
  | "service_provider"
  | "support_worker";

export type UserStatus = "active" | "inactive" | "pending";

// Role display names for UI
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  admin: "Administrator",
  participant: "Participant",
  instructor: "Instructor",
  fitness_partner: "Fitness Partner",
  service_provider: "Service Provider",
  support_worker: "Support Worker",
};

// Role permissions helper
export const ROLE_PERMISSIONS = {
  admin: ["read", "write", "delete", "manage_users", "manage_programs"],
  instructor: ["read", "write", "manage_sessions", "view_participants"],
  fitness_partner: ["read", "write", "manage_facilities", "manage_instructors"],
  service_provider: ["read", "write", "manage_clients", "manage_staff"],
  support_worker: ["read", "write", "view_clients", "update_progress"],
  participant: ["read", "view_own_data", "update_own_profile"],
} as const;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
  status: UserStatus;
  metadata?: {
    lastLogin?: any;
    preferences?: Record<string, any>;
    settings?: Record<string, any>;
  };
}

// Helper function to check if user has permission
export const hasPermission = (
  userRole: UserRole,
  permission: string
): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission as any) || false;
};

// Helper function to format role name
export const formatRoleName = (role: UserRole): string => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    displayName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to create user profile document
const createUserProfile = async (
  user: User,
  role: UserRole,
  displayName: string
): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    displayName,
    role,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    metadata: {
      lastLogin: serverTimestamp(),
      preferences: {},
      settings: {},
    },
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
  return userProfile;
};

// Helper function to get user profile
const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

// Helper function to update last login
const updateLastLogin = async (uid: string) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      "metadata.lastLogin": serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = () => setError(null);

  // Sign up function
  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    displayName: string
  ) => {
    try {
      setError(null);
      setLoading(true);

      // Create user account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name in Firebase Auth
      await updateFirebaseProfile(result.user, {
        displayName: displayName,
      });

      // Create user profile in Firestore
      const profile = await createUserProfile(result.user, role, displayName);
      setUserProfile(profile);

      console.log("User signed up successfully:", result.user.uid);
    } catch (error: any) {
      console.error("Sign up error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Failed to create account";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message || "Failed to create account";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Get user profile from Firestore
      const profile = await getUserProfile(result.user.uid);

      if (profile) {
        setUserProfile(profile);
        // Update last login
        await updateLastLogin(result.user.uid);
      } else {
        throw new Error("User profile not found");
      }

      console.log("User signed in successfully:", result.user.uid);
    } catch (error: any) {
      console.error("Sign in error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Failed to sign in";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message || "Failed to sign in";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      console.log("User signed out successfully");
    } catch (error: any) {
      console.error("Sign out error:", error);
      const errorMessage = error.message || "Failed to sign out";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);

      if (!user || !userProfile) {
        throw new Error("No user logged in");
      }

      const updatedProfile = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      // Update Firestore document
      await updateDoc(doc(db, "users", user.uid), updatedProfile);

      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));

      // If display name is being updated, also update Firebase Auth
      if (updates.displayName && updates.displayName !== user.displayName) {
        await updateFirebaseProfile(user, {
          displayName: updates.displayName,
        });
      }

      console.log("Profile updated successfully");
    } catch (error: any) {
      console.error("Update profile error:", error);
      const errorMessage = error.message || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);

        if (firebaseUser) {
          setUser(firebaseUser);

          // Get user profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);

          if (profile) {
            setUserProfile(profile);
          } else {
            console.warn("User profile not found in Firestore");
            // Optionally sign out the user if no profile exists
            // await firebaseSignOut(auth);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError("Authentication error occurred");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Clear error when user or userProfile changes
  useEffect(() => {
    if (user || userProfile) {
      setError(null);
    }
  }, [user, userProfile]);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
