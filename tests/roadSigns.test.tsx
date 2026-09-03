import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { roadSigns, roadSignById, searchRoadSigns } from '../src/data/roadSigns';
import { roadSignActionQuestions, roadSignIdentifyQuestions } from '../src/data/roadSignDrills';
import { ruleRefreshers } from '../src/data/ruleRefreshers';
import { questions } from '../src/data/questions';
import { sourceById } from '../src/data/sources';
import { RoadSignVisual } from '../src/components/RoadSignVisual';
import { markRoadSignActionSolved, markRoadSignIdentified } from '../src/domain/roadSignProgress';

describe('road sign data hygiene', () => {
  it('has unique sign ids and valid source ids', () => {
    expect(new Set(roadSigns.map((sign) => sign.id)).size).toBe(roadSigns.length);
    for (const sign of roadSigns) {
      expect(sign.sourceIds.length).toBeGreaterThan(0);
      for (const id of sign.sourceIds) expect(sourceById[id], `${sign.id} -> ${id}`).toBeTruthy();
    }
  });

  it('keeps unique official codes where present', () => {
    const codes = roadSigns.map((sign) => sign.officialCode).filter(Boolean) as string[];
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('resolves relatedSignIds', () => {
    for (const sign of roadSigns) {
      for (const id of sign.relatedSignIds) {
        expect(roadSignById[id], `${sign.id} -> ${id}`).toBeTruthy();
      }
    }
  });

  it('filters signs by query and category', () => {
    expect(searchRoadSigns('axeltryck', 'prohibition').some((sign) => sign.id === 'c23')).toBe(true);
    expect(searchRoadSigns('sidvind', 'warning').some((sign) => sign.id === 'a24')).toBe(true);
    expect(searchRoadSigns('c21', 'alla').some((sign) => sign.id === 'c21')).toBe(true);
  });
});

describe('road sign drills', () => {
  const drills = [...roadSignIdentifyQuestions, ...roadSignActionQuestions];

  it('has valid distractors and answer indexes', () => {
    expect(drills.length).toBeGreaterThanOrEqual(8);
    expect(new Set(drills.map((item) => item.id)).size).toBe(drills.length);
    for (const item of drills) {
      expect(roadSignById[item.signId]).toBeTruthy();
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(item.choices.length);
      expect(new Set(item.choices).size, item.id).toBe(item.choices.length);
      for (const id of item.sourceIds) expect(sourceById[id]).toBeTruthy();
    }
  });

  it('uses sign ids only for identify-mode distractors', () => {
    for (const item of roadSignIdentifyQuestions) {
      for (const choice of item.choices) expect(roadSignById[choice], `${item.id} -> ${choice}`).toBeTruthy();
    }
  });
});

describe('rule refresher cards', () => {
  it('requires historical evidence for verified changes only', () => {
    for (const card of ruleRefreshers) {
      expect(card.sourceIds.length).toBeGreaterThan(0);
      for (const id of card.sourceIds) expect(sourceById[id]).toBeTruthy();
      if (card.kind === 'verified-change') {
        expect(card.historical, card.id).toBeTruthy();
        expect(card.historical!.effectiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(card.historical!.evidenceSourceIds.length).toBeGreaterThan(0);
      } else {
        expect(card.historical, card.id).toBeUndefined();
      }
    }
  });
});

describe('road sign visuals and progress', () => {
  it('renders accessible labels for every sign visual', () => {
    for (const sign of roadSigns) {
      const html = renderToStaticMarkup(<RoadSignVisual signId={sign.id} />);
      expect(html).toContain('aria-label');
      expect(html).toContain(sign.officialCode ?? sign.id.toUpperCase());
    }
  });

  it('tracks identify and action progress without throwing', () => {
    const store: Record<string, string> = {};
    const original = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
      },
      configurable: true,
    });
    markRoadSignIdentified('c21');
    markRoadSignActionSolved('c17');
    Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true });
    expect(true).toBe(true);
  });
});

describe('question bank integration', () => {
  it('keeps unique question ids after adding road-sign/refresher questions', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  it('adds sourced road-sign and refresher questions without conceptLab flag', () => {
    const added = questions.filter((q) => ['q57', 'q58', 'q59', 'q60'].includes(q.id));
    expect(added).toHaveLength(4);
    for (const question of added) {
      expect(question.conceptLab).toBeUndefined();
      expect(question.sourceIds.length).toBeGreaterThan(0);
    }
  });
});
