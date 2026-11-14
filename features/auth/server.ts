import "server-only";

import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { emailOTP } from "better-auth/plugins";
import { mongoDb } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/features/auth/verificationEmail";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const requireEmailVerification = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  appName: "Planify",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(mongoDb),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  socialProviders: googleClientId && googleClientSecret
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          prompt: "select_account",
        },
      }
    : {},
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email" || ctx.path === "/sign-in/email") {
        const email = ctx.body?.email;
        if (typeof email === "string") {
          return {
            context: {
              ...ctx,
              body: { ...ctx.body, email: email.trim().toLowerCase() },
            },
          };
        }
      }

      if (["/sign-up/email", "/sign-in/email", "/change-password", "/reset-password"].includes(ctx.path)) {
        const password = ctx.body?.password ?? ctx.body?.newPassword;
        if (typeof password === "string" && password.trim().length === 0) {
          throw new APIError("BAD_REQUEST", {
            message: "Password cannot contain only whitespace.",
          });
        }
      }

      if (ctx.path === "/update-user") {
        const name = ctx.body?.name;
        const phoneNumber = ctx.body?.phoneNumber;
        const image = ctx.body?.image;

        if (typeof name === "string" && (!name.trim() || name.trim().length > 100)) {
          throw new APIError("BAD_REQUEST", {
            message: "Name must be between 1 and 100 characters.",
          });
        }
        if (typeof phoneNumber === "string" && phoneNumber && !/^\+?[0-9][0-9\s().-]{5,24}$/.test(phoneNumber.trim())) {
          throw new APIError("BAD_REQUEST", {
            message: "Enter a valid phone number.",
          });
        }
        if (typeof image === "string" && image.length > 500_000) {
          throw new APIError("BAD_REQUEST", {
            message: "Profile image must be smaller than 500 KB.",
          });
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              ...(typeof name === "string" ? { name: name.trim() } : {}),
              ...(typeof phoneNumber === "string" ? { phoneNumber: phoneNumber.trim() } : {}),
            },
          },
        };
      }
    }),
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60,
      allowedAttempts: 5,
      storeOTP: "hashed",
      sendVerificationOnSignUp: false,
      sendVerificationOTP: ({ email, otp }) => sendVerificationEmail(email, otp),
    }),
  ],
});
