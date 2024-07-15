// src/routes/+layout.server.ts

import type { LayoutServerData } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const load: LayoutServerData = async ({ locals }) => {
    try {
        // Log initial server-side user data
        console.log('Server-side user data:', locals.user);

        // Check if user is authenticated and has an ID
        if (locals.user && locals.user.id) {
            const userId = locals.user.id;
            const docRef = doc(db, 'profiles', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const username = userData.username;

                // Log user data with username
                console.log('Server-side user data with username:', { id: userId, username });
                // Return user data including username
                return { serverUser: { id: userId, username } };
            } else {
                console.error('User profile not found for id:', userId);
                // Return default or handle error case
                return { serverUser: { id: userId, username: 'Unknown' } };
            }
        } else {
            console.error('No authenticated user found.');
            // Return null or handle error case where user is not authenticated
            return { serverUser: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Return null for serverUser in case of an error
        return { serverUser: null };
    }
};
