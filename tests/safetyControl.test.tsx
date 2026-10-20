import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SafetyControlCoach } from '../src/components/SafetyControlCoach';
import { nextPromptIndex, safetyControlPrompts, safetyProcedureSteps } from '../src/data/safetyControl';
import { sourceById } from '../src/data/sources';

describe('coupling and safety-control content', () => {
  it('keeps unique ids and traceable official sources', () => {
    const items = [...safetyProcedureSteps, ...safetyControlPrompts];
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    for (const item of items) {
      expect(item.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of item.sourceIds) expect(sourceById[sourceId], `${item.id} -> ${sourceId}`).toBeTruthy();
    }
  });

  it('covers the controls Trafikverket says are always included', () => {
    const text = safetyControlPrompts.filter((item) => item.alwaysIncluded).map((item) => `${item.prompt} ${item.checklist.join(' ')}`).join(' ').toLocaleLowerCase('sv');
    for (const required of ['dörr', 'last', 'registrering', 'koppling', 'katastrofbromsvajer', 'broms', 'elanslutning']) expect(text, required).toContain(required);
  });

  it('requires check, reason and safe fault action for every oral prompt', () => {
    for (const prompt of safetyControlPrompts) {
      expect(prompt.checklist.length).toBeGreaterThanOrEqual(3);
      expect(prompt.why.length).toBeGreaterThan(30);
      expect(prompt.faultAction.length).toBeGreaterThan(20);
    }
  });

  it('keeps Trafikverkets additional control areas represented', () => {
    expect(safetyControlPrompts.filter((item) => !item.alwaysIncluded).map((item) => item.id)).toEqual([
      'random-lighting',
      'random-brakes',
      'random-tyres',
      'random-signals',
      'random-fluids',
      'random-view',
      'random-steering',
      'random-warnings',
      'random-wipers',
    ]);
  });

  it('never repeats the same prompt and clamps random input', () => {
    for (let current = 0; current < safetyControlPrompts.length; current += 1) {
      expect(nextPromptIndex(current, 0)).not.toBe(current);
      expect(nextPromptIndex(current, 1)).not.toBe(current);
      expect(nextPromptIndex(current, -1)).not.toBe(current);
    }
  });

  it('renders coupling guidance with limitations and source links', () => {
    const html = renderToStaticMarkup(<SafetyControlCoach />);
    expect(html).toContain('Koppling &amp; säkerhetskontroll');
    expect(html).toContain('inte ett officiellt prov');
    expect(html).toContain('instruktionsbok');
    expect(html).toContain('Kontrollpunkt:');
    expect(html).toContain(sourceById['TRV-BE-PROV'].url);
  });

  it('renders oral mode without exposing an answer before reveal', () => {
    const html = renderToStaticMarkup(<SafetyControlCoach initialMode="oral" initialPromptIndex={0} />);
    expect(html).toContain('Tänk eller säg ditt svar högt');
    expect(html).toContain('Visa granskningslista');
    expect(html).not.toContain('<h3>Granskningslista</h3>');
    expect(html).not.toContain(safetyControlPrompts[0].faultAction);
  });
});
