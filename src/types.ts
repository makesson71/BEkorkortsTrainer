export type Category =
  | 'fordon-manovrering'
  | 'trafikregler'
  | 'trafiksakerhet'
  | 'miljo'
  | 'personliga-forutsattningar'
  | 'b-repetition';

export type Confidence = 'vet' | 'tror' | 'gissar';

export type SourcePublisher = 'Trafikverket' | 'Transportstyrelsen' | 'Sveriges riksdag';

export interface Source {
  id: string;
  title: string;
  publisher: SourcePublisher;
  url: string;
  checked: string;
  note?: string;
}

export interface Question {
  id: string;
  category: Category;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceIds: string[];
  difficulty: 1 | 2 | 3;
  refresher?: boolean;
  diagnostic?: boolean;
  conceptLab?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  minutes: number;
  summary: string;
  bullets: string[];
  sourceIds: string[];
}

/** Future concept families can reuse this union without a new data model. */
export type ConceptCategory =
  | 'vikt'
  | 'fordon-slap'
  | 'korkort'
  | 'registrering'
  | 'koppling-broms'
  | 'forvaxling'
  | 'trafikregel'
  | 'vagmarke';

export type ConceptValueKind = 'registered' | 'actual' | 'licence' | 'technical';

export type PedagogyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Concept {
  id: string;
  term: string;
  shortDefinition: string;
  fullExplanation: string;
  category: ConceptCategory;
  sourceIds: string[];
  aliases: string[];
  relatedConceptIds: string[];
  doNotConfuseWith: string[];
  example: string;
  registrationCertificateField?: string;
  importantForBE: boolean;
  commonMistake: string;
  formula?: string;
  valueKinds: ConceptValueKind[];
  officialTerm: boolean;
  pedagogyLevel: PedagogyLevel;
}

export interface ConceptDrill {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  sourceIds: string[];
  conceptId: string;
  level: PedagogyLevel;
}

export interface ConfusionPair {
  id: string;
  title: string;
  conceptIdA: string;
  conceptIdB: string;
  whatChanges: string;
  whatStaysFixed: string;
  usedForLicence: string;
  usedForTechnical: string;
  workedExample: string;
  quizPrompt: string;
  quizChoices: string[];
  quizCorrectIndex: number;
  quizExplanation: string;
  sourceIds: string[];
}

export interface CertificateExercise {
  id: string;
  prompt: string;
  targetField: string;
  explanation: string;
  sourceIds: string[];
  card: 'car' | 'trailer' | 'both';
}
