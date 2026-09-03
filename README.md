# BE Trainer Sverige

Mobile-first Swedish training app for BE (car + heavy trailer), designed especially for an experienced B driver who wants **BE-specific learning plus selective refresh** rather than re-reading an entire beginner course.

> **Not an official Trafikverket or Transportstyrelsen product.** Training questions are original. Rule-bearing content is traceable to primary Swedish authority sources.

## What is already included
- 30-year diagnostic with confidence (`Jag vet / Jag tror / Jag gissar`).
- Confidence-aware local progress.
- 37 original, source-linked questions.
- Seven short lessons.
- Interactive Weight Lab separating licence entitlement (B/B96/BE) from technical towing limits.
- Swedish authority source registry with `checked` dates.
- Responsive PWA baseline and offline service worker.
- Unit tests and GitHub Actions CI.
- Product spec, syllabus map, content policy, roadmap and Codex instructions (`AGENTS.md`).

## Verified 2026 anchors
As checked 2026-08-31 against official pages:
- BE theory: 60 questions, 40 minutes, pass at 44 points; five questions are unscored test questions, giving max 55 points.
- Passed BE theory is valid for one year.
- Current BE: towing vehicle total weight max 3,500 kg; trailer(s) combined total weight max 3,500 kg.
- B96: car + trailer combined total weight max 4,250 kg.
- Vehicle technical towing limits still apply regardless of licence entitlement.

See `src/data/sources.ts` and `docs/CONTENT_AND_SOURCES.md`.

## Run locally
```bash
npm install
npm run dev
```

## Quality gates
```bash
npm test
npm run build
```

## Repository principles
- Primary sources first.
- No fake "official questions".
- Explain the reason after every answer.
- Keep legal entitlement and vehicle engineering limits separate.
- Mobile-first, accessible and Swedish-first.

## Status
Foundation/MVP. The app is useful for early study but should not be marketed as a complete exam-preparation product until the audited question bank and syllabus coverage targets in `docs/PRODUCT_SPEC.md` are met.
