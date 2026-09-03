# Suggested first Codex task

Start from current `main` of **BE-Trainer-Sverige**.

Read `AGENTS.md`, `docs/PRODUCT_SPEC.md`, `docs/BE_SYLLABUS_MAP.md`, `docs/CONTENT_AND_SOURCES.md`, and `docs/ROADMAP.md` before changing code.

Implement **PR 1 — Foundation hardening** only.

Goals:
1. Add ESLint with a small, conventional React/TypeScript config and wire `npm run lint` into CI.
2. Add component-level tests for:
   - confidence selection (`Jag vet`, `Jag tror`, `Jag gissar`),
   - answering a quiz question and revealing explanation/source links,
   - Weight Lab rendering separate B/B96/BE outcomes.
3. Add a source-integrity test that fails if:
   - a rule-bearing question/lesson references an unknown source ID,
   - a source has no `checked` date,
   - a source URL is not HTTPS.
4. Improve PWA installability with 192x192 and 512x512 local icons and keep the app functional offline after first production load.
5. Do not add or alter legal/regulatory claims unless verified against a current official Trafikverket or Transportstyrelsen source. If any factual inconsistency is discovered, document it in the PR and fix it with source evidence.
6. Keep the PR focused. Do not start Weight Lab 2.0, visual load simulation or the full exam simulator.

Acceptance:
- `npm test`, `npm run lint`, and `npm run build` pass.
- No sleeps/timeouts in tests.
- No official-question claims.
- Mobile layout still works at 375px width.
- Update README if commands change.

Open a PR with a concise summary, tests run, and source-content impact statement.
