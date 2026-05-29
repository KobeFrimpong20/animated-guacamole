'use server';

import { Resend } from 'resend';
import { SessionReportEmail } from '../../emails/SessionReportEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendSessionReportOptions {
  email: string;
  studentName: string;
  tutorName: string;
  confidence: number;
  focus: number;
  mastery: number;
  sessionSummary: string;
  whatWentWell: string;
  areasForGrowth: string;
  nextSessionPlan: string;
}

export async function sendEmail(options: SendSessionReportOptions) {
  const { 
    email, 
    studentName, 
    tutorName, 
    confidence, 
    focus, 
    mastery, 
    sessionSummary, 
    whatWentWell, 
    areasForGrowth, 
    nextSessionPlan 
  } = options;

  if (!email) {
    return { error: 'Email is required' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Loop-Learn <onboarding@resend.dev>',
      to: [email],
      subject: `Session Report for ${studentName}`,
      react: React.createElement(SessionReportEmail, {
        studentName,
        tutorName,
        confidence,
        focus,
        mastery,
        sessionSummary,
        whatWentWell,
        areasForGrowth,
        nextSessionPlan,
      }),
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
