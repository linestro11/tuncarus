import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import type { RequestHandler } from './$types';

// Create a Nodemailer transporter using MailerSend SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtp.mailersend.net',  // MailerSend SMTP host
  port: 587,                     // MailerSend SMTP port for TLS
  secure: false,                 // Use TLS, set to false because we're using port 587
  auth: {
    user: import.meta.env.VITE_MAILERSEND_USERNAME,  // Username from MailerSend SMTP
    pass: import.meta.env.VITE_MAILERSEND_PASSWORD,  // Password from MailerSend SMTP
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,  // Do not fail on invalid certificates (not recommended for production)
  },
});

// Define a POST request handler
export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse JSON body from request
    const { type, category, subcategory, amount, quantity, userEmail } = await request.json();

    let subject, text, toEmail;

    // Determine email subject and body based on notification type
    if (type === 'submission') {
      subject = 'New Gift Card Request Submitted';
      text = `A new gift card request has been submitted:
      
      Category: ${category}
      Subcategory: ${subcategory}
      Amount: ${amount}
      Quantity: ${quantity}
      User Email: ${userEmail}
      
      Please review this request at your earliest convenience.`;
      toEmail = import.meta.env.VITE_MAILERSEND_FROM_EMAIL; // Send to the registered MailerSend email
    } else if (type === 'confirmation') {
      subject = 'Gift Card Request Confirmed';
      text = `Your gift card request has been confirmed:
      
      Category: ${category}
      Subcategory: ${subcategory}
      Amount: ${amount}
      Quantity: ${quantity}
      
      Go to your dashboard and click on the payment button to make payment
      The gift card(s) will be processed and sent to you shortly.`;
      toEmail = userEmail; // Send to the user's email
    } else if (type === 'not-available') {
      subject = 'Gift Card Request Not Available';
      text = `We regret to inform you that your gift card request is not available:
      
      Category: ${category}
      Subcategory: ${subcategory}
      Amount: ${amount}
      Quantity: ${quantity}
      
      Please contact support for further assistance.`;
      toEmail = userEmail; // Send to the user's email
    } else {
      return json({ success: false, message: 'Invalid notification type' }, { status: 400 });
    }

    // Email options
    const mailOptions = {
      from: import.meta.env.VITE_MAILERSEND_FROM_EMAIL, // Set this in your .env file
      to: toEmail,
      subject,
      text,
    };

    // Send email using Nodemailer transporter
    await transporter.sendMail(mailOptions);

    // Respond with success message
    return json({ success: true, message: 'Notification email sent successfully' });

  } catch (error) {
    // Handle errors
    console.error('Error sending email:', error);
    return json({ success: false, message: 'Failed to send notification email' }, { status: 500 });
  }
};
