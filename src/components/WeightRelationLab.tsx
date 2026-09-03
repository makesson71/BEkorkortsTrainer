import { useEffect, useMemo, useState } from 'react';
import { evaluateCombination } from '../domain/weights';
import { formatKg, grossFromServiceAndLoadKg, loadState, registeredMaxlastKg } from '../domain/conceptMath';
import { markVisualizerUsed } from '../domain/conceptProgress';
import { ConceptHint } from './ConceptExplainer';
import { SourceLinks } from './SourceLinks';

const TRAILER_SERVICE = 700;
const TRAILER_TOTAL = 2000;
const CAR_O1 = 1800;
const CAR_TOTAL = 2450;
const CAR_GROSS = 2200;
const CAR_F3 = 4200;

export function WeightRelationLab() {
  const maxlast = registeredMaxlastKg(TRAILER_SERVICE, TRAILER_TOTAL);
  const [load, setLoad] = useState(900);
  const gross = grossFromServiceAndLoadKg(TRAILER_SERVICE, load);
  const state = loadState(gross, TRAILER_TOTAL);
  const results = useMemo(
    () => evaluateCombination({
      carTotalKg: CAR_TOTAL,
      carGrossKg: CAR_GROSS,
      trailerTotalKg: TRAILER_TOTAL,
      trailerGrossKg: gross,
      carMaxTrailerGrossKg: CAR_O1,
      carMaxTrainGrossKg: CAR_F3,
    }),
    [gross],
  );
  const technical = results[0];
  const o1Fail = gross > CAR_O1;
  const totalWidth = 100;
  const servicePct = (TRAILER_SERVICE / (TRAILER_TOTAL + 400)) * totalWidth;
  const loadPct = (load / (TRAILER_TOTAL + 400)) * totalWidth;
  const totalPct = (TRAILER_TOTAL / (TRAILER_TOTAL + 400)) * totalWidth;

  useEffect(() => { markVisualizerUsed(); }, []);

  return (
    <section className="lab-block">
      <h2>Tjänstevikt + last = bruttovikt</h2>
      <p>Totalvikten är ett fast tak. Bruttovikten rör sig när du lastar. Övningen använder samma tekniska jämförelse som Viktlabbet: O.1 mot släpets bruttovikt.</p>
      <div className="stack-bars" aria-hidden="true">
        <div className="bar-row">
          <span className="bar-label">Bruttovikt nu</span>
          <div className="bar-track">
            <span className="bar-seg registered" style={{ width: `${servicePct}%` }}>Tjänstevikt</span>
            <span className={`bar-seg actual ${state === 'over-total' ? 'over' : ''}`} style={{ width: `${loadPct}%` }}>Last</span>
          </div>
          <strong>{formatKg(gross)}</strong>
        </div>
        <div className="bar-row">
          <span className="bar-label">Totalvikt (fast)</span>
          <div className="bar-track">
            <span className="bar-seg registered-outline" style={{ width: `${totalPct}%` }}>Totalvikt {formatKg(TRAILER_TOTAL)}</span>
          </div>
          <strong>{formatKg(TRAILER_TOTAL)}</strong>
        </div>
      </div>
      <p className="sr-only">Släpets tjänstevikt {formatKg(TRAILER_SERVICE)}, last {formatKg(load)}, bruttovikt {formatKg(gross)}, totalvikt {formatKg(TRAILER_TOTAL)}.</p>
      <label className="load-control">Aktuell last på släpet
        <div className="load-row">
          <input type="range" min={0} max={TRAILER_TOTAL + 400} step={10} value={load} onChange={(event) => setLoad(Number(event.target.value))} aria-valuetext={`${load} kilogram`} />
          <div className="number"><input type="number" inputMode="numeric" min={0} value={load} onChange={(event) => setLoad(Math.max(0, Number(event.target.value) || 0))} /><span>kg</span></div>
        </div>
      </label>
      <ul className="fact-list">
        <li><span className="kind-badge kind-registered">Fast · registrerad</span> Tjänstevikt {formatKg(TRAILER_SERVICE)} · maxlast {formatKg(maxlast)} · <ConceptHint conceptId="totalvikt" label="Totalvikt" /> totalvikt {formatKg(TRAILER_TOTAL)}</li>
        <li><span className="kind-badge kind-actual">Nu · ändras med last</span> <ConceptHint conceptId="bruttovikt" label="Bruttovikt" /> bruttovikt {formatKg(gross)}</li>
      </ul>
      {state === 'over-total' && <p className="notice" role="status"><strong>Över registrerad totalvikt.</strong> Bruttovikt {formatKg(gross)} är högre än totalvikt {formatKg(TRAILER_TOTAL)}. Det är ett otillåtet exempel i övningen.</p>}
      {state === 'at-limit' && <p className="notice" role="status">Lasten fyller maxlasten. Bruttovikten är lika med totalvikten.</p>}
      <h3>Kopplat till bilen · O.1 {formatKg(CAR_O1)}</h3>
      <p>Bilens <ConceptHint conceptId="o1" label="O.1" /> högsta släpvagnsvikt jämförs med släpets bruttovikt {formatKg(gross)}.</p>
      <p className={o1Fail ? 'result denied' : 'result allowed'} role="status">
        {o1Fail
          ? `O.1 faller: ${formatKg(gross)} är över ${formatKg(CAR_O1)}.`
          : `O.1 klaras: ${formatKg(gross)} är högst ${formatKg(CAR_O1)}.`}
      </p>
      {technical.reasons.length > 0 && <ul>{technical.reasons.filter((reason) => reason.includes('släp') || reason.includes('bruttovikt') || reason.includes('tågvikt')).map((reason) => <li key={reason}>{reason}</li>)}</ul>}
      <p className="notice">Pedagogisk modell, inte ett myndighetsbesked. Axeltryck, kultryck och kopplingstyp ingår inte.</p>
      <SourceLinks ids={['TS-VIKTER-SLAP', 'TS-VIKTER', 'TS-SLAP']} />
    </section>
  );
}
