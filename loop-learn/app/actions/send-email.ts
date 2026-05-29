'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string) {
  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Loop-Learn <onboarding@resend.dev>',
      to: [email],
      subject: 'Hello from Loop-Learn!',
      html: '<p>This is a test email from your new <strong>Loop-Learn</strong> app!</p>',
    });

    if (error) {
      console.error('Resend Error:', error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('System Error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}
