export interface RoadSignProgress {
  identified: string[];
  actionSolved: string[];
}

const KEY = 'be-trainer-road-sign-progress-v1';

export function loadRoadSignProgress(): RoadSignProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || 'null') as RoadSignProgress | null;
    return parsed ?? { identified: [], actionSolved: [] };
  } catch {
    return { identified: [], actionSolved: [] };
  }
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function save(progress: RoadSignProgress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function markRoadSignIdentified(signId: string): RoadSignProgress {
  const progress = loadRoadSignProgress();
  const next = { ...progress, identified: unique([...progress.identified, signId]) };
  save(next);
  return next;
}

export function markRoadSignActionSolved(signId: string): RoadSignProgress {
  const progress = loadRoadSignProgress();
  const next = { ...progress, actionSolved: unique([...progress.actionSolved, signId]) };
  save(next);
  return next;
}
