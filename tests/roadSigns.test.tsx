import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { roadSigns, roadSignById, searchRoadSigns } from '../src/data/roadSigns';
import { roadSignActionQuestions, roadSignIdentifyQuestions } from '../src/data/roadSignDrills';
import { ruleRefreshers } from '../src/data/ruleRefreshers';
import { questions } from '../src/data/questions';
import { sourceById } from '../src/data/sources';
import { RoadSignVisual, ROAD_SIGN_VISUAL_IDS, roadSignAccessibleName } from '../src/components/RoadSignVisual';
import { applySignDrillAnswer, RoadSignLab, SignDrillCard } from '../src/components/RoadSignLab';
import { loadRoadSignProgress, markRoadSignActionSolved, markRoadSignIdentified } from '../src/domain/roadSignProgress';

function svgTextContent(html: string): string {
  return [...html.matchAll(/<text\b[^>]*>([^<]*)<\/text>/gi)].map((match) => match[1]).join(' ');
}

function ariaLabel(html: string): string {
  return html.match(/aria-label="([^"]*)"/)?.[1] ?? '';
}

function titleText(html: string): string {
  return [...html.matchAll(/<title>([^<]*)<\/title>/gi)].map((match) => match[1]).join(' ');
}

function visualFingerprint(html: string): string {
  return html
    .replace(/id="[^"]+"/g, '')
    .replace(/clip-path="[^"]+"/g, '')
    .replace(/clipPath="[^"]+"/g, '')
    .replace(/aria-label="[^"]+"/g, '')
    .replace(/<title>[^<]*<\/title>/g, '');
}

function withStorage() {
  const store: Record<string, string> = {};
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
    },
  });
  return store;
}

describe('road sign data hygiene', () => {
  it('has unique sign ids and valid source ids', () => {
    expect(roadSigns).toHaveLength(30);
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
    expect(searchRoadSigns('', 'instruction').some((sign) => sign.id === 'e31')).toBe(true);
  });

  it('keeps C6 trailer-type semantics from vägmärkesförordningen', () => {
    const c6 = roadSignById.c6;
    expect(c6.meaning).toMatch(/påhängsvagn eller släpkärra/i);
    expect(c6.meaning).toMatch(/tilläggstavla/i);
    expect(c6.meaning).not.toMatch(/alla släp är förbjudna/i);
  });
});

describe('road sign drills', () => {
  const drills = [...roadSignIdentifyQuestions, ...roadSignActionQuestions];

  it('has unique distractors, one correct choice and valid indexes', () => {
    expect(drills.length).toBeGreaterThanOrEqual(8);
    expect(new Set(drills.map((item) => item.id)).size).toBe(drills.length);
    for (const item of drills) {
      expect(roadSignById[item.signId]).toBeTruthy();
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(item.choices.length);
      expect(new Set(item.choices).size, item.id).toBe(item.choices.length);
      expect(item.choices.filter((choice) => choice === item.choices[item.correctIndex])).toHaveLength(1);
      expect(item.explanationWrong.trim().length).toBeGreaterThan(20);
      expect(item.explanationCorrect.trim().length).toBeGreaterThan(20);
      expect(item.sourceIds.length).toBeGreaterThan(0);
      for (const id of item.sourceIds) expect(sourceById[id]).toBeTruthy();
    }
  });

  it('uses sign ids only for identify-mode distractors', () => {
    for (const item of roadSignIdentifyQuestions) {
      for (const choice of item.choices) expect(roadSignById[choice], `${item.id} -> ${choice}`).toBeTruthy();
    }
  });

  it('cannot be answered from a code printed in the identify prompt', () => {
    for (const item of roadSignIdentifyQuestions) {
      const sign = roadSignById[item.signId];
      expect(item.prompt).toBe('Vilket märke är detta?');
      expect(item.prompt).not.toContain(sign.officialCode ?? '');
      const html = renderToStaticMarkup(<RoadSignVisual signId={item.signId} mode="quiz" />);
      expect(svgTextContent(html)).not.toContain(sign.officialCode ?? '___');
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

  it('keeps verified dates and does not erase pre-2020 environmental zones', () => {
    const mobile = ruleRefreshers.find((card) => card.id === 'change-handheld-mobile-2018')!;
    const zones = ruleRefreshers.find((card) => card.id === 'change-miljozon-klass-2-3-2020')!;
    expect(mobile.historical?.effectiveDate).toBe('2018-02-01');
    expect(zones.historical?.effectiveDate).toBe('2020-01-01');
    expect(zones.historical?.oldSituation).toMatch(/tunga fordon/i);
    expect(zones.historical?.whatChanged).toMatch(/klass 2 och 3/i);
    expect(`${zones.summary} ${zones.historical?.oldSituation}`).not.toMatch(/fanns inte.*miljö/i);
  });
});

describe('road sign visuals', () => {
  it('has a dedicated schematic for every curated sign and no generic fallback', () => {
    expect(ROAD_SIGN_VISUAL_IDS.sort()).toEqual([...roadSigns.map((sign) => sign.id)].sort());
    const fingerprints = new Set<string>();
    for (const sign of roadSigns) {
      const html = renderToStaticMarkup(<RoadSignVisual signId={sign.id} mode="reference" />);
      expect(html).toContain(`data-sign-id="${sign.id}"`);
      expect(html).not.toContain('data-fallback');
      expect(svgTextContent(html)).not.toContain(sign.officialCode ?? '___');
      fingerprints.add(visualFingerprint(html));
    }
    expect(fingerprints.size).toBe(roadSigns.length);
  });

  it('keeps weight, slope and zone pairs visually distinct', () => {
    const html = (id: string) => visualFingerprint(renderToStaticMarkup(<RoadSignVisual signId={id} />));
    expect(html('c20')).not.toBe(html('c21'));
    expect(html('c23')).not.toBe(html('c24'));
    expect(html('c16')).not.toBe(html('c17'));
    expect(html('c17')).not.toBe(html('c18'));
    expect(html('a3')).not.toBe(html('a4'));
    expect(html('b1')).not.toBe(html('b2'));
    expect(html('c2')).not.toBe(html('c3'));
    expect(html('c3')).not.toBe(html('c6'));
    expect(html('e31')).not.toBe(html('e32'));
    expect(html('t11')).not.toBe(html('t12'));
  });

  it('does not leak official identity in quiz mode before answering', () => {
    for (const sign of roadSigns) {
      const html = renderToStaticMarkup(<RoadSignVisual signId={sign.id} mode="quiz" />);
      expect(roadSignAccessibleName(sign.id, 'quiz')).toBe('Vägmärke att identifiera');
      expect(ariaLabel(html)).toBe('Vägmärke att identifiera');
      expect(titleText(html)).toBe('');
      expect(svgTextContent(html)).not.toContain(sign.officialCode ?? '___');
      expect(ariaLabel(html)).not.toContain(sign.officialCode ?? '');
      expect(ariaLabel(html)).not.toContain(sign.nameSv);
    }
  });

  it('exposes official identity in browse/reference mode', () => {
    for (const sign of roadSigns) {
      const html = renderToStaticMarkup(<RoadSignVisual signId={sign.id} mode="reference" />);
      expect(ariaLabel(html)).toContain(sign.officialCode ?? sign.id.toUpperCase());
      expect(ariaLabel(html)).toContain(sign.nameSv);
      expect(titleText(html)).toContain(sign.officialCode ?? '');
    }
  });
});

describe('identify pedagogy and progress', () => {
  it('shows names but not codes on unanswered identify choices', () => {
    const item = roadSignIdentifyQuestions[0];
    const html = renderToStaticMarkup(
      <SignDrillCard item={item} visualChoices onCorrect={() => undefined} />,
    );
    const sign = roadSignById[item.signId];
    expect(html).toContain('Vägmärke att identifiera');
    expect(html).toContain(roadSignById[item.choices[0]].nameSv);
    expect(html).not.toContain(`<small> ${sign.officialCode}</small>`);
    expect(svgTextContent(html)).not.toContain(sign.officialCode ?? '___');
  });

  it('explains a wrong answer, links sources and reveals the identity after answering', () => {
    const item = roadSignIdentifyQuestions[0];
    const wrong = item.correctIndex === 0 ? 1 : 0;
    const html = renderToStaticMarkup(
      <SignDrillCard item={item} visualChoices initiallySelected={wrong} onCorrect={() => undefined} />,
    );
    const sign = roadSignById[item.signId];
    expect(html).toContain('Inte riktigt.');
    expect(html).toContain(item.explanationWrong);
    expect(html).toContain(`Rätt märke:</strong> ${sign.officialCode} ${sign.nameSv}`);
    expect(html).toContain('Källor:');
    expect(html).toContain(sourceById[item.sourceIds[0]].title);
  });

  it('records progress only for a correct answer and keeps it deterministic', () => {
    withStorage();
    const item = roadSignIdentifyQuestions[0];
    const recorded: string[] = [];
    expect(applySignDrillAnswer(item, item.correctIndex === 0 ? 1 : 0, (id) => recorded.push(id))).toBe(false);
    expect(recorded).toEqual([]);
    expect(applySignDrillAnswer(item, item.correctIndex, (id) => {
      recorded.push(id);
      markRoadSignIdentified(id);
    })).toBe(true);
    const again = markRoadSignIdentified(item.signId);
    expect(recorded).toEqual([item.signId]);
    expect(again.identified).toEqual([item.signId]);
    expect(loadRoadSignProgress().identified).toEqual([item.signId]);
    expect(markRoadSignActionSolved('c17').actionSolved).toEqual(['c17']);
  });

  it('opens identify mode with a quiz-safe prompt visual', () => {
    const html = renderToStaticMarkup(<RoadSignLab initialView="identify" />);
    expect(html).toContain('Vilket märke?');
    expect(html).toContain('Vägmärke att identifiera');
    expect(html).toContain('data-visual-mode="quiz"');
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
