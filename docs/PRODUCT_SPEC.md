# Product spec — BE Trainer Sverige

## Problem
Experienced B drivers preparing for BE often need two different things at once:
1. BE-specific knowledge (weights, towing limits, coupling, load, stability, manoeuvring), and
2. selective refresh of B-level traffic theory that may have changed or faded over decades.

A conventional question bank treats both users and knowledge gaps as identical. This product should diagnose, explain and adapt.

## Primary user journey
1. **30-year diagnostic** — a short cross-section of BE plus high-value refresher areas.
2. **Personal gap map** — distinguish wrong answers from uncertain lucky guesses.
3. **Micro-lessons** — 3–8 minutes, sourced to Swedish authorities.
4. **Weight Lab** — interactive B/B96/BE + technical-limit reasoning.
5. **Targeted practice** — spaced repetition weighted by correctness and confidence.
6. **Exam simulation** — when the question bank has enough unique, audited items: 60 questions, 40 minutes, pass display aligned with current Trafikverket format.
7. **Driving-test mode** — oral safety-control prompts, coupling checklist and manoeuvre preparation.

## MVP in repository now
- Responsive PWA shell.
- Offline service worker baseline.
- Source registry and source links in UI.
- 37 original training questions.
- Confidence-aware attempts stored locally.
- Diagnostic subset.
- Seven micro-lessons.
- Interactive Weight Lab.
- Unit tests for B/B96/BE separation and technical towing limits.
- CI for tests + production build.

## Explicitly not claimed yet
- The current question bank is **not** a complete substitute for a full audited BE course.
- No training item is an official Trafikverket question.
- Weight Lab is not a legal authority or replacement for Transportstyrelsen's släpvagnskalkylator.
- Driving-test oral mode and full exam simulator remain planned work.

## Success criteria before calling v1.0 exam-ready
- 150+ unique, reviewed questions mapped to syllabus outcomes.
- Every rule-bearing item has primary-source provenance and review date.
- At least three forms of weight/registration-certificate problems.
- Full 60-question/40-minute simulator with no repeated item in a session.
- Coverage report shows no critical syllabus outcome with fewer than three questions.
- Accessibility audit, mobile Safari/Chrome test, PWA install test.
