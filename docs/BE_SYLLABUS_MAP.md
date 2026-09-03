# BE syllabus map

Current course plan: Transportstyrelsen TSFS 2011:21 (consolidated version linked from `TS-KURSPLAN-BE`). Current BE examination regulation: TSFS 2017:116 (consolidated version linked from `TS-FORARPROV-BE`). Checked 2026-09-03.

| Syllabus area | Required themes | Current app | Next content target |
|---|---|---|---|
| Manoeuvring, vehicle & environment | handling, construction/functions, safety systems, environment, steerability/stability, road surface, physics, weights, coupling, checks | Lessons + questions + Weight Lab + Begreppslabbet (weights, O.1/O.2/F.3, certificate trainer, coupling terms) | Visual coupling flow; braking/stability scenarios; road signs (later PR) |
| Different traffic environments | traffic rules, first aid, speed risk, load securing/distribution, dimensions, observation, margins, anticipation | Questions + lessons | Image/diagram situations; more B refresher questions; history of rule changes (later PR) |
| Car + trailer in special contexts | trip planning, traffic/weather/road surface, alcohol, medicine, drugs, stress, fatigue, time of day | Questions + refresher lesson | Adaptive risk module |
| Personal conditions/life goals | impulses, compliance, attitudes/lifestyle/social factors, group pressure, self-evaluation | Questions | More scenario-based self-evaluation |

## Coverage rule
Before v1.0, each important theory outcome should have at least:
- one explanation/lesson,
- three independently worded questions,
- one scenario question where the topic is naturally scenario-driven.

Weight/trailer terminology now has a dedicated concept model (`src/data/concepts.ts`), drills and certificate exercises in addition to the main question bank.

## Audit rule
When Transportstyrelsen or Trafikverket updates a source, search all question/lesson `sourceIds` referencing it and review affected content before changing the `checked` date.

The app remains an MVP. This map records current coverage but does not mean that the present question set is comprehensive BE theory preparation. Rewriting syllabus-meta questions as applied skills does not increase the documented coverage level.
