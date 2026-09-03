import type { Source } from '../types';

export const sources: Source[] = [
  {
    id: 'TRV-BE-PROV',
    title: 'Bil med tungt släp (BE)',
    publisher: 'Trafikverket',
    url: 'https://www.trafikverket.se/korkort/ta-korkort/personbil-och-latt-lastbil/bil-med-tungt-slap-be/',
    checked: '2026-08-31',
    note: 'Provformat, körprov, säkerhetskontroll och krav på provfordon.',
  },
  {
    id: 'TS-BE',
    title: 'BE – Personbil med tungt släp',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/korkort/ta-korkort/valj-behorighet/personbil-och-latt-lastbil/be-personbil/',
    checked: '2026-08-31',
  },
  {
    id: 'TS-SLAP',
    title: 'Personbil med släp',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/personbil-med-slap/',
    checked: '2026-08-31',
  },
  {
    id: 'TS-SLAP-REGLER',
    title: 'Köra personbil eller lätt lastbil med släp- eller husvagn',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/fordonsregler/regler-for-olika-fordonsslag/slap/slapvagn-husvagn/',
    checked: '2026-08-31',
    note: 'Hastighet, registreringsbevis och tekniska viktbegränsningar.',
  },
  {
    id: 'TS-KURSPLAN-BE',
    title: 'TSFS 2011:21 – kursplan, behörighet BE (konsoliderad)',
    publisher: 'Transportstyrelsen',
    url: 'https://www.transportstyrelsen.se/sv/om-oss/dina-rattigheter-lagar-och-regler/forfattningssamling/ts-foreskrifter-i-nummerordning/2012/details?RuleNumber=2012%3A53&ruleprefix=TSFS',
    checked: '2026-08-31',
    note: 'Kursplanens kunskapsområden och mål.',
  },
];

export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
