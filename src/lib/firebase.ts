import { initializeApp } from 'firebase/app';
import { getAuth, type User } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { goto } from '$app/navigation';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function checkAndUpdateEmailVerification(user: User | null): Promise<boolean> {
  if (!user) {
    console.log('No user provided to checkAndUpdateEmailVerification');
    return false;
  }

  try {
    // Reload the user to get the most up-to-date information
    await user.reload();
    
    const userDocRef = doc(db, 'profiles', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      console.log('User document does not exist in Firestore');
      return false;
    }

    if (user.emailVerified) {
      await updateDoc(userDocRef, {
        emailVerified: true
      });
      console.log('Email verified. Status updated in Firestore.');
      return true;
    } else {
      await updateDoc(userDocRef, {
        emailVerified: false
      });
      console.log('Email not verified. Status updated in Firestore.');
      // Redirect to email verification page
      goto('/email');
      return false;
    }
  } catch (error) {
    console.error('Error checking and updating email verification status:', error);
    return false;
  }
}