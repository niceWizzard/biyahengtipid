import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '@/db/schema';
import { db } from '@/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Replace with an actual email provider later
      console.log(`\n\n[EMAIL] 📧 Verify email for ${user.email}:\n➡️  ${url}\n\n`);
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
    modelName: "verifications"
  }
});
