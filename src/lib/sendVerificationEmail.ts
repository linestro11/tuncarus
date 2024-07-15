// src/lib/sendVerificationEmail.ts
import { getAuth, sendEmailVerification } from 'firebase/auth';

export async function sendVerificationEmail(setPopupMessage: (message: string) => void) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            await sendEmailVerification(user);
            console.log('Verification email sent.');
            setPopupMessage('Verification email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error sending verification email:', error);
            setPopupMessage('Error sending verification email. Please try again.');
        }
    } else {
        console.log('No authenticated user.');
        setPopupMessage('No authenticated user. Please log in and try again.');
    }
}
