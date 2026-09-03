import { useMemo, useState } from 'react';
import { evaluateCombination, type CombinationInput } from '../domain/weights';
import { SourceLinks } from './SourceLinks';
import { ConceptHint } from './ConceptExplainer';
import { WEIGHT_LAB_CONCEPT_IDS } from '../data/concepts';

const defaults: CombinationInput = {
  carTotalKg: 2650,
  carGrossKg: 2350,
  trailerTotalKg: 2700,
  trailerGrossKg: 2150,
  carMaxTrailerGrossKg: 2200,
  carMaxTrainGrossKg: 4700,
};

export function WeightLab() {
  const [data, setData] = useState(defaults);
  const results = useMemo(() => evaluateCombination(data), [data]);
  const field = (key: keyof CombinationInput, label: string, conceptId: string, optional = false) => (
    <div className="weight-field">
      <div className="field-label">
        <label htmlFor={`weight-${key}`}>{label}{optional && ' (valfri)'}</label>
        <ConceptHint conceptId={conceptId} label={label} />
      </div>
      <div className="number">
        <input id={`weight-${key}`} type="number" min="0" inputMode="numeric" value={data[key] ?? ''} onChange={(e) => setData((old) => ({ ...old, [key]: optional && e.target.value === '' ? undefined : Number(e.target.value) }))} />
        <span>kg</span>
      </div>
    </div>
  );

  return <section className="panel"><span className="eyebrow">Interaktiv övning</span><h2>Viktlabbet</h2><p>Ändra värdena och se skillnaden mellan <strong>körkortsbehörighet</strong> och <strong>bilens tekniska gränser</strong>. Tryck på ⓘ för begreppet bakom siffran.</p>
    <div className="weight-grid">
      <div className="weight-card"><h3>Dragbil</h3>{field('carTotalKg','Totalvikt', WEIGHT_LAB_CONCEPT_IDS.totalvikt)}{field('carGrossKg','Aktuell bruttovikt', WEIGHT_LAB_CONCEPT_IDS.bruttovikt)}{field('carMaxTrailerGrossKg','Högsta släpvagnsvikt (O.1)', WEIGHT_LAB_CONCEPT_IDS.o1)}{field('carMaxTrainGrossKg','Högsta tågvikt (F.3)', WEIGHT_LAB_CONCEPT_IDS.f3, true)}</div>
      <div className="weight-card"><h3>Släp</h3>{field('trailerTotalKg','Totalvikt', WEIGHT_LAB_CONCEPT_IDS.totalvikt)}{field('trailerGrossKg','Aktuell bruttovikt', WEIGHT_LAB_CONCEPT_IDS.bruttovikt)}</div>
    </div>
    <div className="licence-results">{results.map((result) => <article key={result.licence} className={result.allowed ? 'result allowed' : 'result denied'}><div><strong>{result.licence}</strong><span>{result.allowed ? '✓ Behörighet och angivna tekniska fält är OK i denna övning' : '✕ Inte OK i övningen'}</span></div><ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></article>)}</div>
    <p className="notice"><strong>Viktigt:</strong> Viktlabbet är en avgränsad pedagogisk modell, inte ett myndighetsbesked. Den kontrollerar inte fullständigt bland annat O.2 för obromsat släp, axeltryck, kopplingsbegränsningar, kultryck, flera släp, hastighetsvillkor eller äldre körkorts övergångsregler. Kontrollera alltid ett verkligt ekipage mot registreringsbevis och Transportstyrelsens släpvagnskalkylator.</p>
    <SourceLinks ids={['TS-SLAP','TS-SLAP-REGLER','TS-VIKTER-SLAP','TS-BE','TS-KALKYLATOR']} />
  </section>;
}
