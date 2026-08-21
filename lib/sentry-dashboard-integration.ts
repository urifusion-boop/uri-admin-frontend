/**
 * Custom Sentry Integration for Admin Frontend
 * Sends exceptions to BOTH Sentry AND your custom admin dashboard
 */

import * as Sentry from '@sentry/nextjs';
import type { Event, EventHint } from '@sentry/nextjs';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.uricreative.com:8443';

interface ExceptionLogPayload {
  userId?: string;
  exceptionDate: string;
  method: string;
  url: string;
  status: number;
  exception: string;
  serviceType: string;
}

/**
 * Custom integration that sends exceptions to your backend dashboard
 */
export const dashboardIntegration = () => {
  return {
    name: 'DashboardIntegration',
    setupOnce() {
      // This runs once when Sentry is initialized
    },
    processEvent(event: Event, hint: EventHint) {
      // Send to custom dashboard API
      sendToCustomDashboard(event, hint).catch((error) => {
        console.error('[Sentry Dashboard Integration] Failed to send to dashboard:', error);
      });

      // Return event to continue normal Sentry processing
      return event;
    },
  };
};

/**
 * Send exception to your custom backend dashboard
 */
async function sendToCustomDashboard(event: Event, hint: EventHint): Promise<void> {
  try {
    // Only send errors (not transactions, etc.). Sentry gives plain error
    // events type === undefined; every other EventType is a non-error.
    if (event.type !== undefined) {
      return;
    }

    // Extract error details
    const exception = event.exception?.values?.[0];
    if (!exception) return;

    // Get user info from Sentry scope
    const userId = String(event.user?.id || event.user?.email || 'anonymous');

    // Build exception log payload matching your backend schema
    const payload: ExceptionLogPayload = {
      userId,
      exceptionDate: new Date().toISOString(),
      method: event.request?.method || 'GET',
      url: event.request?.url || window.location.href,
      status: event.contexts?.response?.status_code || 500,
      exception: formatException(exception),
      serviceType: 'ADMIN_FRONTEND',
    };

    // Send to your backend API
    const response = await fetch(`${BACKEND_API_URL}/api/v1/admin/system/exception-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('[Dashboard Integration] Failed to log exception:', response.statusText);
    }
  } catch (error) {
    // Don't throw - we don't want to break Sentry's normal flow
    console.error('[Dashboard Integration] Error sending to dashboard:', error);
  }
}

/**
 * Format exception for dashboard (includes stack trace)
 */
function formatException(exception: any): string {
  const parts: string[] = [];

  if (exception.type) {
    parts.push(`${exception.type}: ${exception.value || 'Unknown error'}`);
  } else {
    parts.push(exception.value || 'Unknown error');
  }

  // Add stack trace if available
  if (exception.stacktrace?.frames) {
    parts.push('\n\nStack Trace:');
    exception.stacktrace.frames.reverse().forEach((frame: any) => {
      const filename = frame.filename || 'unknown';
      const func = frame.function || 'anonymous';
      const line = frame.lineno || '?';
      const col = frame.colno || '?';
      parts.push(`  at ${func} (${filename}:${line}:${col})`);
    });
  }

  return parts.join('\n');
}

/**
 * Helper to get auth token from storage
 * Adjust this based on how you store auth tokens
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // Check localStorage
    const token = localStorage.getItem('authToken') ||
                  localStorage.getItem('token') ||
                  localStorage.getItem('accessToken');
    return token;
  } catch {
    return null;
  }
}
