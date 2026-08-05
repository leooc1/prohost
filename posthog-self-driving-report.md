# PostHog Self-driving Setup Report

**Project:** Prohost (hospitality/property management SaaS)
**Date:** 2026-08-03
**Inbox:** https://us.posthog.com/project/540874/inbox

## Summary

PostHog Self-driving has been configured for this project. Signal sources for error tracking, session replay, health checks, and support tickets are now active. A scout troop of 5 (general + 4 specialists) is enabled and will start scanning within ~30 minutes. Findings will begin appearing in your [Self-driving inbox](https://us.posthog.com/project/540874/inbox) within about 30 minutes.

---

## AI Data Processing

**Status:** Approved. Organization-level AI data processing consent was granted before this setup ran.

---

## GitHub

**Status:** Connected during this run.

| Detail | Value |
|---|---|
| Integration ID | 199932 |
| Account | leooc1 |
| Connected at | 2026-08-03T19:46:29Z |

GitHub access is required for Self-driving to investigate findings in code and open draft fixes.

---

## Products Enabled

The `products-enable` tool was not available in this MCP session. The three products must be enabled manually (see Follow-ups). The `posthog.init` call in `src/main.tsx` is clean — it sets neither `disable_session_recording: true` nor `capture_exceptions: false` — so once the products are toggled on server-side, the client will capture sessions and exceptions automatically.

| Product | Status |
|---|---|
| Session Replay | Needs manual enable (see Follow-ups) |
| Error Tracking | Needs manual enable (see Follow-ups) |
| Support (Conversations) | Needs manual enable (see Follow-ups) |

---

## Signal Sources

All sources were newly created (no existing rows).

| Source product | Source type | Action | Notes |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | On by default | Scout gate is always on; no row needed |
| `health_checks` | `health_issue` | **Enabled** (id: 019fc92a-e420-…) | |
| `error_tracking` | `issue_created` | **Enabled** (id: 019fc92a-e81b-…) | |
| `error_tracking` | `issue_reopened` | **Enabled** (id: 019fc92a-eba0-…) | |
| `error_tracking` | `issue_spiking` | **Enabled** (id: 019fc92a-ef75-…) | |
| `session_replay` | `session_analysis_cluster` | **Enabled** (id: 019fc92a-f3b2-…) | Sample rate 0.1 (server default) |
| `conversations` | `ticket` | **Enabled** (id: 019fc92a-f83a-…) | Stays dormant until an inbound channel is connected |

---

## Connected Tools

No external tools were selected in step 5.

| Tool | Status |
|---|---|
| GitHub Issues | Not used |
| Linear | Not used |
| Jira | Not used |
| Sentry | Not used |
| Zendesk | Not used |

---

## Scout Troop

**Run budget:** 100 runs/day (early access default), 0 used today.
**Banner:** "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

**Enabled (5 scouts):**

| Scout | Reason enabled |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers |
| `signals-scout-product-analytics` | Strong evidence: multiple captured events (login, account_created, trial_started, payment flow) |
| `signals-scout-web-analytics` | Web SPA with `capture_pageview: 'history_change'` and multi-page routing |
| `signals-scout-anomaly-detection` | Cross-product safety net for dashboards/insights as they're built |
| `signals-scout-observability-gaps` | Valuable on a new setup — flags events with no insight/dashboard coverage |

**Disabled (22 scouts):**

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by native error tracking source (intentional exclusion) |
| `signals-scout-session-replay` | Covered by native session replay source (intentional exclusion) |
| `signals-scout-feature-flags` | No feature flag usage found in codebase |
| `signals-scout-surveys` | 0 surveys exist for this project |
| `signals-scout-experiments` | No A/B experiments configured |
| `signals-scout-revenue-analytics` | PostHog Revenue Analytics not configured (no Stripe sync) |
| `signals-scout-ai-observability` | No `$ai_*` events or LLM SDK detected |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | No group/accounts analytics detected |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports |
| `signals-scout-data-warehouse` | No warehouse sources connected |
| `signals-scout-conversations` | Support channel not yet connected |
| `signals-scout-apm` | No APM/tracing configured |
| `signals-scout-health-checks` | The `health_checks` native source covers this surface |
| `signals-scout-inbox-validation` | No resolved reports yet (fresh setup) |
| `signals-scout-insight-alerts` | No insight alerts configured |
| `signals-scout-mcp-tool-calls` | No MCP tool call telemetry |
| `signals-scout-replay-vision` | No Replay Vision scanners configured |
| `signals-scout-skills-store` | Not a priority surface |
| `signals-scout-tasks` | Not a priority surface |
| `signals-scout-web-vitals` | No `$web_vitals` capture detected |

Re-enable a disabled specialist in PostHog (Settings → Self-driving → Scouts) if you adopt the corresponding surface later.

---

## Custom Scouts

Two custom scout candidates were proposed based on named events in the codebase that no built-in scout currently watches. Both were declined.

**Proposed and declined:**

| Candidate | Surface | Why no built-in covers it | Filter that killed it |
|---|---|---|---|
| `signals-scout-subscription-funnel` | `account_created → trial_started → payment_confirmed` conversion | `product-analytics` watches saved funnel insights — no funnel insight exists yet for this team | Declined by user |
| `signals-scout-auth-health` | `login_failed / total_logins` ratio | No built-in scout watches auth failure rates | Declined by user |

**Surfaces considered and ruled out (not proposed):**

| Surface | Filter |
|---|---|
| Airbnb/Booking.com import health | No explicit import events found (`import_started`, `import_completed`, `import_failed`) — autocapture only, not ready for a named discriminator |
| AI agent usage (AgentChatPage/AgentAdminPage) | No `$ai_*` events or named agent events found — not watchable without explicit instrumentation |

**Noise escape hatch:** If a custom scout you create later turns out noisy, set `emit: false` on its config in PostHog to switch it to dry-run — it will keep running and logging but write nothing to the inbox until you tune it.

---

## Follow-ups

- [ ] **Enable Session Replay**: go to PostHog → Settings → Session replay → turn on "Record user sessions"
- [ ] **Enable Error Tracking**: go to PostHog → Settings → Error tracking → turn on "Enable exception autocapture"
- [ ] **Enable Support (Conversations)**: go to PostHog → product sidebar → Support → enable Conversations
- [ ] **Connect a support inbound channel** (email / inbox / Slack) in PostHog so the `conversations / ticket` source starts routing tickets into the inbox. The responder row is already enabled and waiting.
- [ ] **Consider adding explicit events for the import flow** (`import_started`, `import_completed`, `import_failed` on `ImportacaoAirbnb` / `ImportacaoBooking` pages) to enable import health monitoring in a future custom scout.
- [ ] **Consider adding explicit events for AI agent usage** (on `AgentChatPage` / `AgentAdminPage`) to enable AI usage monitoring in a future custom scout.
- [ ] **Re-enable `signals-scout-subscription-funnel`** later if you want automated monitoring of your account_created → payment funnel — can be created via PostHog Self-driving → Custom scouts.
- [ ] **Re-enable `signals-scout-auth-health`** later if you want automated login failure rate monitoring.

---

## What Happens Next

- The scout coordinator picks up fresh configs within ~30 minutes and fires the first scans.
- Each scout run draws from the project's daily budget (100 runs/day during early access).
- Findings cluster into reports in the inbox; immediately-actionable ones can start coding tasks.
- Visit your inbox: https://us.posthog.com/project/540874/inbox
