import type { Source } from '../types';

export const sources: Source[] = [
  {
    id: 'TRV-BE-PROV',
    title: 'Bil med tungt släp (BE)',
    publisher: 'Trafikverket',
    url: 'https://www.trafikverket.se/korkort/ta-korkort/personbil-och-latt-lastbil/bil-med-tungt-slap-be/',
    checked: '2026-09-03',
    note: 'Provformat, körprov, säkerhetskontroll och krav på provfordon.',
  },
  {
    id: 'TS-BE',
    title: 'BE – Personbil med tungt släp',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/korkort/ta-korkort/valj-behorighet/personbil-och-latt-lastbil/be-personbil/',
    checked: '2026-09-03',
  },
  {
    id: 'TS-SLAP',
    title: 'Personbil med släp',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/personbil-med-slap/',
    checked: '2026-09-03',
  },
  {
    id: 'TS-SLAP-REGLER',
    title: 'Köra personbil eller lätt lastbil med släp- eller husvagn',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/regler-for-olika-fordonsslag/slap/slapvagn-husvagn/',
    checked: '2026-09-03',
    note: 'Hastighet, registreringsbevis och tekniska viktbegränsningar.',
  },
  {
    id: 'TS-VIKTER-SLAP',
    title: 'Vikter att ta hänsyn till när du drar en släpvagn',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/slap/vikter-att-ta-hansyn-till-nar-du-drar-en-slapvagn/',
    checked: '2026-09-03',
    note: 'Totalvikt, tjänstevikt, bruttovikt, maxlast, O.1/O.2 och maximal tågvikt (F.3).',
  },
  {
    id: 'TS-KURSPLAN-BE',
    title: 'TSFS 2011:21 – kursplan, behörighet BE (konsoliderad)',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/TSFS/TSFS%202011_21k.pdf',
    checked: '2026-09-03',
    note: 'Kursplanens kunskapsområden och mål.',
  },
  {
    id: 'TS-FORARPROV-BE',
    title: 'TSFS 2017:116 – Transportstyrelsens föreskrifter om förarprov, behörighet BE (konsoliderad)',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/TSFS/TSFS%202017_116k.pdf',
    checked: '2026-09-03',
    note: 'Bindande krav för kunskapsprov, körprov och provets inledning.',
  },
];

export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
