// src/hooks.server.ts

// Importing the Handle type from SvelteKit
import type { Handle } from '@sveltejs/kit';

// Define the handle function with Handle type
export const handle: Handle = async ({ event, resolve }) => {
    // Extract session cookie from the incoming request
    const session = event.cookies.get('session');

    if (session) {
        try {
            // Deserialize and decrypt the session data (simulated here with base64 decoding)
            const sessionData = JSON.parse(Buffer.from(session, 'base64').toString());
            
            console.log('Session data:', sessionData);
            // Check if the session is still valid (expiresAt is a hypothetical property)
            if (sessionData.expiresAt > Date.now()) {
                // Set user data in event.locals to be accessible in subsequent middleware and routes
                event.locals.user = { id: sessionData.userId };
            } else {
                // Session has expired, delete the session cookie
                event.cookies.delete('session', { path: '/' });
            }
        } catch (e) {
            // Error handling for invalid session data format or decryption errors
            event.cookies.delete('session', { path: '/' });
        }
    }

    // Continue resolving the request with updated event object
    return await resolve(event);
};






