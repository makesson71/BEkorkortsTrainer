# Product spec — BE Trainer Sverige

## Problem
Experienced B drivers preparing for BE often need two different things at once:
1. BE-specific knowledge (weights, towing limits, coupling, load, stability, manoeuvring), and
2. selective refresh of B-level traffic theory that may have changed or faded over decades.

A conventional question bank treats both users and knowledge gaps as identical. This product should diagnose, explain and adapt.

## Primary user journey
1. **30-year diagnostic** — a short cross-section of BE plus high-value refresher areas.
2. **Personal gap map** — distinguish wrong answers from uncertain lucky guesses.
3. **Begreppslabbet** — learn the weight/trailer vocabulary, then read a training registration certificate.
4. **Micro-lessons** — 3–8 minutes, sourced to Swedish authorities.
5. **Weight Lab** — interactive B/B96/BE + technical-limit reasoning, with concept help from Begreppslabbet.
6. **Targeted practice** — spaced repetition weighted by correctness and confidence.
7. **Exam simulation** — when the question bank has enough unique, audited items: 60 questions, 40 minutes, pass display aligned with current Trafikverket format.
8. **Driving-test mode** — oral safety-control prompts, coupling checklist and manoeuvre preparation.

## MVP in repository now
- Responsive PWA shell.
- Offline service worker baseline.
- Source registry and source links in UI.
- Original training questions, including a focused concept-lab set.
- Confidence-aware attempts stored locally.
- Diagnostic subset.
- Seven micro-lessons.
- Interactive Weight Lab, with ⓘ links into concept explanations.
- Begreppslabbet: concept model, visualizer, confusion pairs, certificate trainer, drills, licence-versus-technical scenarios.
- Unit tests for B/B96/BE separation, technical towing limits and concept formulas.
- CI for tests + production build.

## Concept architecture
Structured records live in `src/data/concepts.ts`, not as copy pasted through components. Categories can later hold traffic-rule and road-sign concepts without a new model. Drills, confusion pairs and certificate exercises are separate from the main exam bank so the question count is not inflated.

## Core rule
Do not use **tågvikt** when you actually mean the sum of registered **totalvikter**. Combined registered total weight is a licence-entitlement concept. Tågvikt/F.3 concerns combined bruttovikt.

## Explicitly not claimed yet
- The current question bank is **not** a complete substitute for a full audited BE course.
- No training item is an official Trafikverket question.
- Weight Lab and Begreppslabbet are not legal authorities or replacements for Transportstyrelsen's släpvagnskalkylator.
- Driving-test oral mode, full exam simulator, road-sign catalogue and “what changed since I took my licence” remain planned work.

## Success criteria before calling v1.0 exam-ready
- 150+ unique, reviewed questions mapped to syllabus outcomes.
- Every rule-bearing item has primary-source provenance and review date.
- At least three forms of weight/registration-certificate problems.
- Full 60-question/40-minute simulator with no repeated item in a session.
- Coverage report shows no critical syllabus outcome with fewer than three questions.
- Accessibility audit, mobile Safari/Chrome test, PWA install test.
