// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { browserProfilingIntegration } from "@sentry/profiling-node";
import { dashboardIntegration } from "./lib/sentry-dashboard-integration";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://4ec6964cbc2c5b6b20601105a0e6c57e@o4510504340160512.ingest.us.sentry.io/4510507365302272",

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
      autoInject: false, // Manual control over when to show feedback
    }),
    // Custom integration: Send exceptions to YOUR custom dashboard
    dashboardIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Profile 100% of sampled transactions for browser profiling
  profilesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // Increased to 50% for admin dashboard (more valuable user sessions)
  replaysSessionSampleRate: 0.5,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Add custom tags for better filtering
  initialScope: {
    tags: {
      service: "uri-admin-frontend",
      runtime: "browser",
    },
  },

  // Custom context and user enrichment
  beforeSend(event, hint) {
    // Add custom context based on user session
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent;
      event.contexts = {
        ...event.contexts,
        browser_info: {
          user_agent: userAgent,
          language: window.navigator.language,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
        },
      };
    }
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;