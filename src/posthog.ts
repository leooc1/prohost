import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const posthogConfigured = Boolean(posthogKey && posthogHost);

if (posthogConfigured) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    autocapture: false,
    capture_pageview: 'history_change',
  });
  posthog.startExceptionAutocapture({
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: false,
  });
} else if (import.meta.env.DEV) {
  if (!posthogKey) {
    console.error(
      'VITE_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_KEY is configured'
    );
  }
  if (!posthogHost) {
    console.error(
      'VITE_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_POSTHOG_HOST is configured'
    );
  }
}

type PostHogUser = {
  email?: string;
  nome?: string;
  create_date?: string;
  qtd_acomodacoes?: number;
};

export function identifyUser(user: PostHogUser) {
  const email = user.email?.trim().toLowerCase();
  if (!posthogConfigured || !email) return;

  const identifiedUserId = posthog.get_property('$user_id');
  if (typeof identifiedUserId === 'string' && identifiedUserId !== email) {
    posthog.reset();
  }

  posthog.identify(email, {
    email,
    name: user.nome,
    conta_criada_em: user.create_date,
    qtd_acomodacoes: user.qtd_acomodacoes,
  });
}

export default posthog;
