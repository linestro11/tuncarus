import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { amount, recipient_code, reason } = await request.json();

        // Prepare the data for the transfer
        const data = {
            source: 'balance',
            amount: amount * 100, // Convert amount to kobo (1 Naira = 100 Kobo)
            recipient: recipient_code,
            reason
        };

        // Make the request to Paystack's transfer endpoint
        const response = await fetch('https://api.paystack.co/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`
            },
            body: JSON.stringify(data),
        });

        // Check if the response is not OK
        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.message || 'Failed to initiate transfer');
        }

        // Parse the response JSON
        const result = await response.json();

        // Return the result
        return json({ data: result.data });
    } catch (err) {
        // Handle any errors that occur during the process
        console.error('Error initiating transfer:', err);
        throw error(500, 'Internal Server Error');
    }
};