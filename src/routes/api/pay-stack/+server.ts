import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const { email, amount, firstName, lastName, description } = await request.json();

    // Prepare data for Paystack API
    const data = {
        email,
        amount: amount * 100, // Convert amount to kobo (1 Naira = 100 Kobo)
        firstName,
        lastName,
        description
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw error(response.status, `HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return json({ data: result.data });
};