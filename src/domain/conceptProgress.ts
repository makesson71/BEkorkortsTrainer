export interface ConceptProgress {
  viewedIds: string[];
  completedDrillIds: string[];
  completedConfusionIds: string[];
  completedCertificateIds: string[];
  visualizerUsed: boolean;
  licenceLabUsed: boolean;
}

const KEY = 'be-trainer-concepts-v1';

const empty: ConceptProgress = {
  viewedIds: [],
  completedDrillIds: [],
  completedConfusionIds: [],
  completedCertificateIds: [],
  visualizerUsed: false,
  licenceLabUsed: false,
};

export function loadConceptProgress(): ConceptProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || 'null') as Partial<ConceptProgress> | null;
    if (!parsed) return { ...empty, viewedIds: [], completedDrillIds: [], completedConfusionIds: [], completedCertificateIds: [] };
    return {
      viewedIds: parsed.viewedIds ?? [],
      completedDrillIds: parsed.completedDrillIds ?? [],
      completedConfusionIds: parsed.completedConfusionIds ?? [],
      completedCertificateIds: parsed.completedCertificateIds ?? [],
      visualizerUsed: Boolean(parsed.visualizerUsed),
      licenceLabUsed: Boolean(parsed.licenceLabUsed),
    };
  } catch {
    return { ...empty, viewedIds: [], completedDrillIds: [], completedConfusionIds: [], completedCertificateIds: [] };
  }
}

function save(progress: ConceptProgress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function markConceptViewed(id: string) {
  const progress = loadConceptProgress();
  save({ ...progress, viewedIds: unique([...progress.viewedIds, id]) });
}

export function markDrillCompleted(id: string) {
  const progress = loadConceptProgress();
  save({ ...progress, completedDrillIds: unique([...progress.completedDrillIds, id]) });
}

export function markConfusionCompleted(id: string) {
  const progress = loadConceptProgress();
  save({ ...progress, completedConfusionIds: unique([...progress.completedConfusionIds, id]) });
}

export function markCertificateCompleted(id: string) {
  const progress = loadConceptProgress();
  save({ ...progress, completedCertificateIds: unique([...progress.completedCertificateIds, id]) });
}

export function markVisualizerUsed() {
  save({ ...loadConceptProgress(), visualizerUsed: true });
}

export function markLicenceLabUsed() {
  save({ ...loadConceptProgress(), licenceLabUsed: true });
}

export function pedagogyLevelStatus(progress: ConceptProgress, importantIds: string[], drillIds: string[], confusionIds: string[], certificateIds: string[]) {
  const viewedImportant = importantIds.filter((id) => progress.viewedIds.includes(id)).length;
  return [
    { level: 1 as const, done: progress.viewedIds.length >= 5 },
    { level: 2 as const, done: importantIds.length > 0 && viewedImportant >= Math.min(8, importantIds.length) },
    { level: 3 as const, done: confusionIds.filter((id) => progress.completedConfusionIds.includes(id)).length >= Math.min(4, confusionIds.length) },
    { level: 4 as const, done: progress.visualizerUsed || drillIds.filter((id) => progress.completedDrillIds.includes(id)).length >= 8 },
    { level: 5 as const, done: certificateIds.length > 0 && certificateIds.every((id) => progress.completedCertificateIds.includes(id)) },
    { level: 6 as const, done: progress.licenceLabUsed },
  ];
}
