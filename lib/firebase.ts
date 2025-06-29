// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    memoryLocalCache
} from 'firebase/firestore';

const firebaseConfig = {
    // Your Firebase config object
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with modern persistence API
export const db = (() => {
    if (typeof window === 'undefined') {
        // Server-side: use default Firestore
        return getFirestore(app);
    }

    // Client-side: initialize with persistence
    try {
        return initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (error) {
        console.warn('Failed to enable persistent cache, using memory cache:', error);
        try {
            return initializeFirestore(app, {
                localCache: memoryLocalCache()
            });
        } catch (fallbackError) {
            console.warn('Failed to initialize with memory cache, using default:', fallbackError);
            return getFirestore(app);
        }
    }
})();

export default app;