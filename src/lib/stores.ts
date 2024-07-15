import { writable, type Writable } from 'svelte/store';
import { setContext, getContext } from 'svelte';
import type { User as FirebaseUser } from 'firebase/auth'; // Ensure correct import
 // Ensure correct import

// Create writable stores for user state, authentication state, and loading state
export const user: Writable<FirebaseUser | null> = writable(null);
export const isAuthenticated: Writable<boolean> = writable(false);
export const isLoading: Writable<boolean> = writable(true);
export const email: Writable<string | null> = writable(null); // Add email store

// Define the UserContext interface to be used with Svelte context API
interface UserContext {
  user: Writable<FirebaseUser | null>;
  username: Writable<string | null>;
  loading: Writable<boolean>;
  uid: Writable<string | null>;
  email: Writable<string | null>; // Include email in the context
}

// Symbol key for setting and getting the context
const userContextKey = Symbol();

// Function to create and provide user context
export function createUserContext() {
  const user: Writable<FirebaseUser | null> = writable(null);
  const username: Writable<string | null> = writable(null);
  const loading: Writable<boolean> = writable(true);
  const uid: Writable<string | null> = writable(null);
  const email: Writable<string | null> = writable(null); // Initialize email

  // Update email store when user changes
  user.subscribe((currentUser) => {
    const currentEmail = currentUser ? currentUser.email : null;
    email.set(currentEmail);
    console.log('User Email:', currentEmail); // Log the user email
  });

  const context: UserContext = { user, username, loading, uid, email };
  setContext(userContextKey, context);

  return context;
}

// Function to get the user context
export function getUserContext(): UserContext {
  return getContext(userContextKey);
}

export { writable };
