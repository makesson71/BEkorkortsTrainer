import type { CertificateExercise } from '../types';

export interface TrainingCertificate {
  kind: 'car' | 'trailer';
  heading: string;
  registration: string;
  fields: { code: string; label: string; value: string; hint: string }[];
}

export const carTrainingCertificate: TrainingCertificate = {
  kind: 'car',
  heading: 'Dragbil · del 1 tekniska data',
  registration: 'ABC 12D',
  fields: [
    { code: 'G', label: 'Tjänstevikt', value: '1 850 kg', hint: 'Körklart inklusive förare.' },
    { code: 'F.1', label: 'Totalvikt', value: '2 450 kg', hint: 'Tjänstevikt plus maxlast. Körkortssiffra.' },
    { code: 'maxlast', label: 'Maxlast', value: '600 kg', hint: '2 450 − 1 850. Passagerare och gods.' },
    { code: 'O.1', label: 'Högsta vikt bromsad släpvagn', value: '1 800 kg', hint: 'Tekniskt tak mot släpets bruttovikt.' },
    { code: 'O.2', label: 'Högsta vikt obromsad släpvagn', value: '750 kg', hint: 'Tekniskt tak om släpet saknar broms.' },
    { code: 'F.3', label: 'Högsta sammanlagda bruttovikt', value: '4 200 kg', hint: 'Maximal tågvikt. Bil plus släp just nu.' },
    { code: '(34)', label: 'Högsta totalvikt på släpet för B / B utökat', value: '1 050 kg / 1 800 kg', hint: 'Körkortshjälp för just den här bilen, ersätter inte O.1.' },
  ],
};

export const trailerTrainingCertificate: TrainingCertificate = {
  kind: 'trailer',
  heading: 'Släpvagn · del 1 tekniska data',
  registration: 'DEF 45E',
  fields: [
    { code: 'G', label: 'Tjänstevikt', value: '700 kg', hint: 'Körklart utan last.' },
    { code: 'F.1', label: 'Totalvikt', value: '2 000 kg', hint: 'Används när du bedömer BE och lätt/tungt släp.' },
    { code: 'maxlast', label: 'Maxlast', value: '1 300 kg', hint: '2 000 − 700.' },
  ],
};

export const certificateExercises: CertificateExercise[] = [
  {
    id: 'cert-01',
    prompt: 'Vilket värde visar hur tung bromsad släpvagn bilen tekniskt får dra?',
    targetField: 'O.1',
    explanation: 'O.1 är högsta vikt för släpvagn med broms. Jämför mot släpets bruttovikt, inte mot släpets totalvikt.',
    sourceIds: ['TS-VIKTER-SLAP', 'TS-SLAP'],
    card: 'car',
  },
  {
    id: 'cert-02',
    prompt: 'Vilket fält begränsar bilens och släpets sammanlagda aktuella bruttovikt?',
    targetField: 'F.3',
    explanation: 'F.3 är högsta sammanlagda bruttovikt (maximal tågvikt). Addera vad bilen och släpet väger just nu.',
    sourceIds: ['TS-VIKTER-SLAP', 'TS-SLAP-REGLER'],
    card: 'car',
  },
  {
    id: 'cert-03',
    prompt: 'Vilket värde använder du när du först bedömer BE-behörighet för släpets registrerade vikt?',
    targetField: 'F.1',
    explanation: 'BE tittar på släpets totalvikt (här 2 000 kg). Bruttovikten just nu används i de tekniska kontrollerna.',
    sourceIds: ['TS-BE', 'TS-SLAP'],
    card: 'trailer',
  },
  {
    id: 'cert-04',
    prompt: 'Vilket fält gäller om släpet saknar bromsar?',
    targetField: 'O.2',
    explanation: 'O.2 är högsta vikt för obromsad släpvagn. O.1 får inte användas i stället.',
    sourceIds: ['TS-VIKTER-SLAP', 'TS-SLAP-REGLER'],
    card: 'car',
  },
  {
    id: 'cert-05',
    prompt: 'Var ser du hur mycket släpet får lastas enligt sin egen konstruktion?',
    targetField: 'maxlast',
    explanation: 'Maxlast = totalvikt minus tjänstevikt på släpets bevis. Bilens O.1 kan ändå tvinga dig att lasta mindre.',
    sourceIds: ['TS-VIKTER', 'TS-SLAP-REGLER'],
    card: 'trailer',
  },
  {
    id: 'cert-06',
    prompt: 'Vilket fält på bilen är körkortshjälp för B och utökad B – inte samma sak som O.1?',
    targetField: '(34)',
    explanation: 'Punkt (34) anger högsta totalvikt på släpet utifrån B/B utökat för just den bilen. Tekniska tak gäller ändå.',
    sourceIds: ['TS-VIKTER-SLAP'],
    card: 'car',
  },
];
