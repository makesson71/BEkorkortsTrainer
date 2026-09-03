import { useEffect, useMemo, useState } from 'react';
import { licenceScenarios } from '../data/licenceScenarios';
import { evaluateCombination } from '../domain/weights';
import { whatStopsCombination, type CombinationStopper } from '../domain/conceptMath';
import { markLicenceLabUsed } from '../domain/conceptProgress';
import { SourceLinks } from './SourceLinks';

const ANSWERS: { id: CombinationStopper; label: string }[] = [
  { id: 'licence', label: 'Körkortet' },
  { id: 'technical', label: 'Teknisk gräns' },
  { id: 'both', label: 'Båda' },
  { id: 'none', label: 'Inget av de kontrollerade fälten' },
];

export function LicenceVsTechnical() {
  const [scenarioId, setScenarioId] = useState(licenceScenarios[0].id);
  const [picked, setPicked] = useState<CombinationStopper | null>(null);
  const scenario = licenceScenarios.find((item) => item.id === scenarioId)!;
  const evaluated = useMemo(() => evaluateCombination(scenario.input), [scenario]);
  const b = evaluated.find((item) => item.licence === 'B')!;
  const b96 = evaluated.find((item) => item.licence === 'B96')!;
  const be = evaluated.find((item) => item.licence === 'BE')!;
  const licenceCheck = scenario.id === 'scenario-a' ? be : b;
  const stopper = whatStopsCombination(licenceCheck.licenceAllowed, be.technicalAllowed);

  useEffect(() => { markLicenceLabUsed(); }, []);
  useEffect(() => { setPicked(null); }, [scenarioId]);

  return (
    <section className="lab-block">
      <h2>Körkort mot fordonets tekniska gränser</h2>
      <p>Vänster: registrerade <strong>totalvikter</strong>. Höger: <strong>O.1 / F.3</strong> mot bruttovikter. Båda måste klaras.</p>
      <div className="split-cards">
        <article className="split licence-side">
          <h3>Körkort</h3>
          <p>Använder främst registrerade totalvikter för B, B96 och BE.</p>
          <ul>
            <li>B: {b.licenceAllowed ? 'klarar totalvikterna' : 'stoppar'}</li>
            <li>B96: {b96.licenceAllowed ? 'klarar totalvikterna' : 'stoppar'}</li>
            <li>BE: {be.licenceAllowed ? 'klarar totalvikterna' : 'stoppar'}</li>
          </ul>
        </article>
        <article className="split tech-side">
          <h3>Fordonet</h3>
          <p>Använder tekniska tak som O.1 och F.3 mot aktuella bruttovikter.</p>
          <ul>
            <li>O.1 {scenario.input.carMaxTrailerGrossKg} kg mot släp {scenario.input.trailerGrossKg} kg</li>
            <li>F.3 {scenario.input.carMaxTrainGrossKg} kg mot {scenario.input.carGrossKg + scenario.input.trailerGrossKg} kg</li>
            <li>{be.technicalAllowed ? 'Angivna tekniska fält klaras i övningen' : 'Teknisk gräns stoppar'}</li>
          </ul>
        </article>
      </div>
      <div className="scenario-tabs" role="tablist" aria-label="Exempel">
        {licenceScenarios.map((item) => (
          <button key={item.id} role="tab" aria-selected={item.id === scenarioId} className={item.id === scenarioId ? 'selected' : ''} onClick={() => setScenarioId(item.id)}>{item.title}</button>
        ))}
      </div>
      <p>{scenario.story}</p>
      <fieldset className="choices">
        <legend>{scenario.stopperQuestion}</legend>
        {ANSWERS.map((answer) => {
          const state = picked == null ? '' : answer.id === stopper ? 'correct' : answer.id === picked ? 'wrong' : '';
          return <button key={answer.id} className={`choice ${state}`} onClick={() => setPicked(answer.id)} disabled={picked != null}>{answer.label}</button>;
        })}
      </fieldset>
      {picked != null && (
        <div className={`feedback ${picked === stopper ? 'ok' : 'bad'}`}>
          <strong>{picked === stopper ? 'Rätt.' : 'Inte riktigt.'}</strong> {scenario.why}
          <p>Domänlogiken är samma som i Viktlabbet. Övningen är inte ett myndighetsbesked.</p>
          <SourceLinks ids={scenario.sourceIds} />
        </div>
      )}
    </section>
  );
}
