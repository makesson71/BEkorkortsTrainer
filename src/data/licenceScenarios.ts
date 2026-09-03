import type { CombinationInput } from '../domain/weights';

export interface LicenceScenario {
  id: string;
  title: string;
  story: string;
  input: CombinationInput;
  expectedStopper: 'licence' | 'technical' | 'both' | 'none';
  stopperQuestion: string;
  why: string;
  sourceIds: string[];
}

export const licenceScenarios: LicenceScenario[] = [
  {
    id: 'scenario-a',
    title: 'A · BE klarar, O.1 stoppar',
    story: 'Du har BE. Bilens totalvikt 2 450 kg, släpets totalvikt 2 000 kg. O.1 är 1 800 kg. Släpet är lastat så att det väger 1 850 kg just nu.',
    input: {
      carTotalKg: 2450,
      carGrossKg: 2200,
      trailerTotalKg: 2000,
      trailerGrossKg: 1850,
      carMaxTrailerGrossKg: 1800,
      carMaxTrainGrossKg: 4200,
    },
    expectedStopper: 'technical',
    stopperQuestion: 'Vad stoppar ekipaget här?',
    why: 'BE ser totalvikter 2 450 kg och 2 000 kg, båda under 3 500 kg. Den tekniska kontrollen faller eftersom släpets bruttovikt 1 850 kg är över O.1 1 800 kg.',
    sourceIds: ['TS-BE', 'TS-VIKTER-SLAP', 'TS-SLAP-REGLER'],
  },
  {
    id: 'scenario-b',
    title: 'B · Tekniken klarar, B stoppar',
    story: 'Du har bara B. Bil 2 500 kg totalvikt, släp 1 500 kg totalvikt. Släpet väger 1 200 kg just nu, O.1 är 1 800 kg och F.3 är 5 000 kg.',
    input: {
      carTotalKg: 2500,
      carGrossKg: 2200,
      trailerTotalKg: 1500,
      trailerGrossKg: 1200,
      carMaxTrailerGrossKg: 1800,
      carMaxTrainGrossKg: 5000,
    },
    expectedStopper: 'licence',
    stopperQuestion: 'Vad stoppar ekipaget här?',
    why: 'O.1 och F.3 klarar de aktuella bruttovikterna. B räcker inte: släpet är över 750 kg och sammanlagd totalvikt 4 000 kg är över 3 500 kg. B96 skulle klara 4 000 kg, BE likaså.',
    sourceIds: ['TS-SLAP', 'TS-B96', 'TS-VIKTER-SLAP'],
  },
  {
    id: 'scenario-c',
    title: 'C · Både behörighet och angivna tekniska fält klaras',
    story: 'B-körkort. Bil 2 000 kg totalvikt, släp 1 400 kg totalvikt. Aktuella vikter 1 850 + 1 100 kg. O.1 1 600 kg, F.3 4 000 kg.',
    input: {
      carTotalKg: 2000,
      carGrossKg: 1850,
      trailerTotalKg: 1400,
      trailerGrossKg: 1100,
      carMaxTrailerGrossKg: 1600,
      carMaxTrainGrossKg: 4000,
    },
    expectedStopper: 'none',
    stopperQuestion: 'Vad stoppar ekipaget här?',
    why: 'Sammanlagd totalvikt 3 400 kg är högst 3 500 kg, så B kan räcka. Släpets bruttovikt 1 100 kg är under O.1 1 600 kg och tågvikten 2 950 kg är under F.3. Övningen kontrollerar inte axeltryck, kultryck eller kopplingstyp.',
    sourceIds: ['TS-SLAP', 'TS-VIKTER-SLAP'],
  },
  {
    id: 'scenario-d',
    title: 'D · Både körkort och teknik stoppar',
    story: 'B-körkort. Bil 2 800 kg och släp 1 600 kg i totalvikt. Släpet väger 1 700 kg just nu mot O.1 1 500 kg.',
    input: {
      carTotalKg: 2800,
      carGrossKg: 2500,
      trailerTotalKg: 1600,
      trailerGrossKg: 1700,
      carMaxTrailerGrossKg: 1500,
      carMaxTrainGrossKg: 4000,
    },
    expectedStopper: 'both',
    stopperQuestion: 'Vad stoppar ekipaget här?',
    why: 'Sammanlagd totalvikt 4 400 kg fäller B och B96. Släpets bruttovikt 1 700 kg är dessutom över både totalvikt 1 600 kg och O.1 1 500 kg.',
    sourceIds: ['TS-SLAP', 'TS-BE', 'TS-VIKTER-SLAP'],
  },
];
