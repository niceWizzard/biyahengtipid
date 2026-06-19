import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/db/schema';
import { db } from '@/db';
import { sendEmail } from '@/lib/email';
import { VerifyEmail } from '@/components/email/VerifyEmail';
import { ResetPasswordEmail } from '@/components/email/ResetPasswordEmail';
import React from 'react';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password - Biyaheng Tipid',
        node: React.createElement(ResetPasswordEmail, { url }),
      });
    },
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your email address - Biyaheng Tipid',
        node: React.createElement(VerifyEmail, { url }),
      });
    },
  },
  user: {
    modelName: 'users',
    additionalFields: {
      username: {
        type: 'string',
        required: true,
        unique: true,
      },
    },
  },
  session: {
    modelName: 'sessions',
  },
  account: {
    modelName: 'accounts',
  },
  verification: {
    modelName: 'verifications',
  },
});
