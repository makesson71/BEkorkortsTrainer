import { describe, expect, it } from 'vitest';
import { questions } from '../src/data/questions';
import { sourceById, sources } from '../src/data/sources';

describe('training content hygiene', () => {
  it('gives every question at least one known source', () => {
    for (const question of questions) {
      expect(question.sourceIds.length).toBeGreaterThan(0);
      for (const id of question.sourceIds) expect(sourceById[id], `${question.id} -> ${id}`).toBeTruthy();
    }
  });

  it('has valid answer indexes and unique ids', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const question of questions) {
      expect(question.choices.length).toBeGreaterThanOrEqual(2);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.choices.length);
    }
  });

  it('makes q07 ask for one unique maximum value', () => {
    const q07 = questions.find((question) => question.id === 'q07')!;
    const numericChoices = q07.choices.map((choice) => Number(choice.replace(/\D/g, '')));
    expect(q07.correctIndex).toBe(numericChoices.indexOf(Math.max(...numericChoices.filter((value) => value <= 750))));
    expect(numericChoices.filter((value) => value === 750)).toHaveLength(1);
  });

  it('uses current regulation sources rather than presenting TSFS 2012:45 as current', () => {
    expect(sourceById['TS-KURSPLAN-BE'].title).toContain('TSFS 2011:21');
    expect(sourceById['TS-FORARPROV-BE'].title).toContain('TSFS 2017:116');
    expect(sources.some((source) => source.title.includes('TSFS 2012:45'))).toBe(false);
    for (const source of sources) expect(source.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
