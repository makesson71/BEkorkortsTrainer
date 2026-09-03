import type { Confidence } from '../types';

export interface Attempt {
  questionId: string;
  correct: boolean;
  confidence: Confidence;
  at: string;
}

const KEY = 'be-trainer-progress-v1';

export function loadAttempts(): Attempt[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') as Attempt[]; }
  catch { return []; }
}

export function addAttempt(attempt: Attempt) {
  const attempts = loadAttempts();
  attempts.push(attempt);
  localStorage.setItem(KEY, JSON.stringify(attempts.slice(-500)));
}

export function masteryFor(questionId: string, attempts: Attempt[]) {
  const relevant = attempts.filter((a) => a.questionId === questionId).slice(-4);
  if (!relevant.length) return 0;
  const points = relevant.reduce((sum, a) => {
    if (!a.correct) return sum;
    if (a.confidence === 'vet') return sum + 1;
    if (a.confidence === 'tror') return sum + 0.65;
    return sum + 0.35;
  }, 0);
  return Math.round((points / relevant.length) * 100);
}
