// src/routes/api/login/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { userId } = await request.json();

    if (!userId) {
        return json({ error: 'No userId provided' }, { status: 400 });
    }

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        
        // Create a simple session object
        const session = {
            userId: userId,
            expiresAt: Date.now() + expiresIn
        };

        // Serialize and encrypt the session (in a real app, you'd want to use a proper encryption method)
        const sessionCookie = Buffer.from(JSON.stringify(session)).toString('base64');
        
        cookies.set('session', sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });

        return json({ status: 'success' });
    } catch (error) {
        console.error('Error creating session:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};