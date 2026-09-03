# Content and source policy

## Authority hierarchy
1. Transportstyrelsen regulations and current guidance.
2. Trafikverket current test information.
3. Other primary legislation/authority material when needed.
4. Secondary material only for pedagogy, never as the sole authority for a legal rule.

## Current verified anchors (2026-09-03)
- Trafikverket BE page: 60 questions, 40 minutes, 44 points to pass, maximum 55 because five are test questions; passed theory valid one year; driving-test structure and vehicle requirements.
- Transportstyrelsen BE page: car/light truck total weight max 3,500 kg; trailer(s) combined total weight max 3,500 kg for current BE.
- Transportstyrelsen Personbil med släp: B and B96 entitlement structure.
- Transportstyrelsen släp/husvagn rules: technical towing weight in registration certificate and current trailer speed rules.
- **Current course plan:** consolidated TSFS 2011:21, which defines curriculum outcomes for BE.
- **Current BE examination regulation:** consolidated TSFS 2017:116, which regulates the BE examination. Repealed TSFS 2012:45 is not used as the current regulation.
- Transportstyrelsen's dedicated weight guidance: totalvikt, tjänstevikt, maxlast, bruttovikt, O.1/O.2 and maximal tågvikt (F.3).
- Transportstyrelsen general weight page: tjänstevikt, totalvikt, bruttovikt, maximilast.
- Lag (2001:559) om vägtrafikdefinitioner: släpvagn, släpkärra, efterfordon, fordonståg, lätt/tungt släpfordon, släpvagnsvikt.
- TSFS 2015:63: registration-certificate field codes F.2, F.3, O.1, O.2.
- TSFS 2019:127: coupling break / reservkoppling (säkerhetsvajer).

## Core rule
Do not use **tågvikt** when you actually mean the sum of registered **totalvikter**.

- Combined registered **totalvikt** is a licence-entitlement concept (B, B96, BE).
- **Tågvikt / F.3** concerns combined **bruttovikt** (what the combination weighs now).

### Terminology clash to keep documented
- Släpvagnsvägledningen (`TS-VIKTER-SLAP`) likställer F.3 med högsta sammanlagda **bruttovikt** (tågvikt).
- TSFS 2015:63 labels F.3 “största tillåtna **totalvikt** för fordonskombinationen i körklart skick”.
- *Personbil med släp* (`TS-SLAP`) uses “tågvikt” also when describing B + lätt släp up to 4 250 kg **registered total weight**.

The app follows the trailer-weight guidance for calculations and teaches learners not to rename the licence sum as tågvikt.

## Terms that are not official vehicle-weight fields
- **Nettovikt** is not a Transportstyrelsen / lag (2001:559) vehicle-weight field. Teach it as “Blanda inte ihop”.
- **Egenvikt** appears inside the legal definition of släpvagnsvikt, but the registered ready-to-drive mass taught on certificates is **tjänstevikt**.

## Question authoring checklist
- Is there exactly one best answer?
- Does the explanation teach *why*?
- Does the question avoid pretending to be copied from the real exam?
- Is every legal/numeric claim backed by a source ID?
- If a weight calculation is involved, are total weight and current gross weight kept distinct?
- Could the wording become false after a regulation change? If yes, make source-review dependency obvious.

## Concept data
Rule-bearing definitions live in `src/data/concepts.ts` with `sourceIds`. Do not invent kg limits (for example a universal kultryck) that primary sources do not state.

## Safety note
The app is for training. For a real vehicle combination, the user should verify registration certificates and use Transportstyrelsen's current tools/guidance.

This is still an MVP, not comprehensive BE theory preparation. The questions are original training material and are not claimed to be, or copied from, official Trafikverket exam questions. Begreppslabbet and Weight Lab do not provide a complete legal clearance.
