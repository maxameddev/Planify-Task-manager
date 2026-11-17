import "server-only";

import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { mongoDb } from "@/lib/mongodb";
import { isValidTimeZone } from "@/features/tasks/time";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isProduction = process.env.NODE_ENV === "production";
const isVercelDeployment = process.env.VERCEL === "1";
const configuredAuthBaseURL = process.env.BETTER_AUTH_URL?.trim();

const vercelDeploymentHost = isProduction
  ? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  : process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
const vercelDeploymentBaseURL = vercelDeploymentHost
  ? `${vercelDeploymentHost.startsWith("https://") ? "" : "https://"}${vercelDeploymentHost}`
  : undefined;

function isPublicHttpsURL(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "localhost";
  } catch {
    return false;
  }
}

const authBaseURLFallback = isVercelDeployment
  ? isPublicHttpsURL(configuredAuthBaseURL)
    ? configuredAuthBaseURL
    : vercelDeploymentBaseURL ?? configuredAuthBaseURL
  : configuredAuthBaseURL ?? (isProduction ? undefined : "http://localhost:3000");

if (!authBaseURLFallback) {
  throw new Error("BETTER_AUTH_URL must be set in production (for example, https://your-app.vercel.app).");
}

const parsedAuthBaseURL = new URL(authBaseURLFallback);
if (isProduction && !isPublicHttpsURL(authBaseURLFallback)) {
  throw new Error("BETTER_AUTH_URL must be the public HTTPS URL of the production app.");
}

const vercelAuthHosts = [
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  parsedAuthBaseURL.hostname,
]
  .filter((host): host is string => typeof host === "string" && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/i.test(host))
  .filter((host, index, hosts) => hosts.indexOf(host) === index);
const authBaseURL = isVercelDeployment && vercelAuthHosts.length > 0
  ? { allowedHosts: vercelAuthHosts, protocol: "https" as const, fallback: authBaseURLFallback }
  : authBaseURLFallback;

export const auth = betterAuth({
  appName: "Planify",
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(mongoDb),
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
      },
      planningMode: {
        type: "string",
        required: false,
        defaultValue: "basic",
        input: true,
      },
      timeZone: {
        type: "string",
        required: false,
        defaultValue: "Africa/Mogadishu",
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
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
    max: 10,
    storage: "database",
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
        const planningMode = ctx.body?.planningMode;
        const timeZone = ctx.body?.timeZone;

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
        if (planningMode !== undefined && planningMode !== "basic" && planningMode !== "advanced") {
          throw new APIError("BAD_REQUEST", { message: "Choose a valid task planning mode." });
        }
        if (timeZone !== undefined && !isValidTimeZone(timeZone)) {
          throw new APIError("BAD_REQUEST", { message: "Choose a valid timezone." });
        }

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              ...(typeof name === "string" ? { name: name.trim() } : {}),
              ...(typeof phoneNumber === "string" ? { phoneNumber: phoneNumber.trim() } : {}),
              ...(typeof timeZone === "string" ? { timeZone: timeZone.trim() } : {}),
            },
          },
        };
      }
    }),
  },
});
