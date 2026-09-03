export type Category =
  | 'fordon-manovrering'
  | 'trafikregler'
  | 'trafiksakerhet'
  | 'miljo'
  | 'personliga-forutsattningar'
  | 'b-repetition';

export type Confidence = 'vet' | 'tror' | 'gissar';

export interface Source {
  id: string;
  title: string;
  publisher: 'Trafikverket' | 'Transportstyrelsen';
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
