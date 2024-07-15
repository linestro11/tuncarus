import { writable } from 'svelte/store';

interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string; // Add new fields as needed
  expiresAt: number;
}

export const sessionStore = writable<UserSession | null>(null);