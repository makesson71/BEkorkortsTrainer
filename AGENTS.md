# AGENTS.md — BE Trainer Sverige

## Product intent
Build the best Swedish BE licence training experience for an experienced B driver who may have taken the original licence decades ago.

## Non-negotiable content rules
1. Do not claim that any training question is an official Trafikverket exam question.
2. Rule-bearing content must cite one or more source IDs from `src/data/sources.ts`.
3. Prefer primary Swedish authorities: Trafikverket and Transportstyrelsen. Do not use driving-school blogs as authority when a primary source exists.
4. When a rule is changed or ambiguous, stop and verify the current official source before changing app behaviour.
5. Store a `checked` date for every authority source.
6. Separate driving-licence entitlement from the vehicle's technical towing limits.
7. Weight Lab is educational; never present it as a legal decision service. Link users to the official trailer calculator for real combinations.

## UX principles
- Swedish first.
- Mobile first and thumb-friendly.
- Teach the reasoning after every error.
- Confidence matters: `Jag vet`, `Jag tror`, `Jag gissar`.
- A lucky guess must not be treated as mastery.
- Experienced-driver refresher content should be adaptive instead of forcing a full B course.
- Accessibility: readable contrast, keyboard navigation, semantic controls, no essential information conveyed only by colour.

## Engineering
- React + TypeScript + Vite.
- Keep domain rules pure and unit tested.
- CI must pass `npm test` and `npm run build`.
- Add tests before changing weight/eligibility rules.
- Avoid hidden timers/sleeps in tests.

## PR policy
Keep PRs focused. A PR that introduces new legal/regulatory content must include:
- authority source URL,
- date checked,
- tests for domain logic when applicable,
- a short content-audit note in the PR description.
