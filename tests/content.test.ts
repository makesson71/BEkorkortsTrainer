import { describe, expect, it } from 'vitest';
import { questions } from '../src/data/questions';
import { sourceById } from '../src/data/sources';

describe('training content hygiene', () => {
  it('gives every question at least one known source', () => {
    for (const question of questions) {
      expect(question.sourceIds.length).toBeGreaterThan(0);
      for (const id of question.sourceIds) expect(sourceById[id], `${question.id} -> ${id}`).toBeTruthy();
    }
  });

  it('has valid answer indexes and unique ids', () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    for (const question of questions) expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    for (const question of questions) expect(question.correctIndex).toBeLessThan(question.choices.length);
  });
});
