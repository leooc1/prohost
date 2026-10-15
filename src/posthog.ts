import posthog from 'posthog-js';

const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
const posthogKey = isLocalhost
  ? import.meta.env.VITE_POSTHOG_DEV_KEY
  : import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
export const posthogEnabled = Boolean(posthogKey && posthogHost);

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
  });
  posthog.startExceptionAutocapture({
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: false,
  });
} else if (import.meta.env.DEV) {
  if (!posthogKey) {
    const keyVariable = isLocalhost ? 'VITE_POSTHOG_DEV_KEY' : 'VITE_POSTHOG_KEY';
    throw new Error(
      `${keyVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${keyVariable} is configured`
    );
  }
  if (!posthogHost) {
    throw new Error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
    );
  }
}

export default posthog;
