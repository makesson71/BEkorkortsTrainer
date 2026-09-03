import { useMemo, useState } from 'react';
import { evaluateCombination, type CombinationInput } from '../domain/weights';
import { SourceLinks } from './SourceLinks';

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
  const field = (key: keyof CombinationInput, label: string) => <label>{label}<div className="number"><input type="number" inputMode="numeric" value={data[key] ?? ''} onChange={(e) => setData((old) => ({ ...old, [key]: Number(e.target.value) }))}/><span>kg</span></div></label>;

  return <section className="panel"><span className="eyebrow">Interaktiv övning</span><h2>Viktlabbet</h2><p>Ändra värdena och se skillnaden mellan <strong>körkortsbehörighet</strong> och <strong>bilens tekniska gränser</strong>.</p>
    <div className="weight-grid">
      <div className="weight-card"><h3>🚙 Dragbil</h3>{field('carTotalKg','Totalvikt')}{field('carGrossKg','Aktuell bruttovikt')}{field('carMaxTrailerGrossKg','Högsta släpvagnsvikt')}{field('carMaxTrainGrossKg','Högsta tågvikt')}</div>
      <div className="weight-card"><h3>▰ Släp</h3>{field('trailerTotalKg','Totalvikt')}{field('trailerGrossKg','Aktuell bruttovikt')}</div>
    </div>
    <div className="licence-results">{results.map((result) => <article key={result.licence} className={result.allowed ? 'result allowed' : 'result denied'}><div><strong>{result.licence}</strong><span>{result.allowed ? '✓ Tillåtet i övningen' : '✕ Inte tillåtet'}</span></div><ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></article>)}</div>
    <p className="notice"><strong>Viktigt:</strong> Viktlabbet är en pedagogisk modell, inte ett myndighetsbesked. Kontrollera alltid ett verkligt ekipage mot registreringsbevis och Transportstyrelsens släpvagnskalkylator.</p>
    <SourceLinks ids={['TS-SLAP','TS-SLAP-REGLER','TS-BE']} />
  </section>;
}
