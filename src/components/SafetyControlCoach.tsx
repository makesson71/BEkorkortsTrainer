import { useState } from 'react';
import { nextPromptIndex, safetyControlPrompts, safetyProcedureSteps } from '../data/safetyControl';
import type { SafetyProcedure } from '../types';
import { SourceLinks } from './SourceLinks';

type Mode = SafetyProcedure | 'oral';

export function SafetyControlCoach({ initialMode = 'couple', initialPromptIndex = 0 }: { initialMode?: Mode; initialPromptIndex?: number }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [completed, setCompleted] = useState<string[]>([]);
  const [promptIndex, setPromptIndex] = useState(((initialPromptIndex % safetyControlPrompts.length) + safetyControlPrompts.length) % safetyControlPrompts.length);
  const [revealed, setRevealed] = useState(false);
  const steps = mode === 'oral' ? [] : safetyProcedureSteps.filter((step) => step.procedure === mode);
  const prompt = safetyControlPrompts[promptIndex];

  const changeMode = (next: Mode) => {
    setMode(next);
    setCompleted([]);
    setRevealed(false);
  };

  return <section className="safety-coach">
    <span className="eyebrow">Praktisk repetition · källspårad</span>
    <h1>Koppling & säkerhetskontroll</h1>
    <p className="lead">Öva ordningen och resonemanget utan tidspress. Detta är egenformulerad träning, inte ett officiellt prov eller ett bevis på körkompetens.</p>
    <div className="safety-warning"><strong>Utrustningen styr.</strong> Kopplingar och stöd skiljer sig. Följ alltid bilens, släpets och kopplingens instruktionsbok när du gör momenten i verkligheten.</div>
    <div className="lab-nav" aria-label="Välj övning">
      <button className={mode === 'couple' ? 'selected' : ''} aria-pressed={mode === 'couple'} onClick={() => changeMode('couple')}>Koppla</button>
      <button className={mode === 'uncouple' ? 'selected' : ''} aria-pressed={mode === 'uncouple'} onClick={() => changeMode('uncouple')}>Koppla av</button>
      <button className={mode === 'oral' ? 'selected' : ''} aria-pressed={mode === 'oral'} onClick={() => changeMode('oral')}>Muntligt provläge</button>
    </div>

    {mode !== 'oral' && <div className="procedure-list">
      <p aria-live="polite"><strong>{completed.length} av {steps.length}</strong> steg markerade. Markeringen sparas inte och är inget kompetensmått.</p>
      <ol>{steps.map((step, index) => {
        const checked = completed.includes(step.id);
        return <li key={step.id} className={checked ? 'done' : ''}>
          <div className="step-number" aria-hidden="true">{index + 1}</div>
          <div><h2>{step.title}</h2><p>{step.instruction}</p><p className="confirmation"><strong>Kontrollpunkt:</strong> {step.confirmation}</p><SourceLinks ids={step.sourceIds}/>
            <label className="step-check"><input type="checkbox" checked={checked} onChange={() => setCompleted((current) => checked ? current.filter((id) => id !== step.id) : [...current, step.id])}/> Jag har gått igenom kontrollpunkten</label>
          </div>
        </li>;
      })}</ol>
      <button onClick={() => setCompleted([])}>Nollställ markeringar</button>
    </div>}

    {mode === 'oral' && <article className="oral-card">
      <span className="prompt-kind">{prompt.alwaysIncluded ? 'Ingår alltid enligt Trafikverket' : 'Möjlig slumpkontroll'}</span>
      <h2>{prompt.title}</h2>
      <p className="question">{prompt.prompt}</p>
      {!revealed && <><p>Tänk eller säg ditt svar högt. Ta med <strong>vad</strong> du kontrollerar, <strong>varför</strong> och <strong>vad du gör vid fel</strong>.</p><button className="primary" onClick={() => setRevealed(true)}>Visa granskningslista</button></>}
      {revealed && <div className="audit-answer" aria-live="polite"><h3>Granskningslista</h3><ul>{prompt.checklist.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Varför:</strong> {prompt.why}</p><p><strong>Vid fel:</strong> {prompt.faultAction}</p><SourceLinks ids={prompt.sourceIds}/></div>}
      <button onClick={() => { setPromptIndex((current) => nextPromptIndex(current)); setRevealed(false); }}>Ny kontrollfråga</button>
    </article>}
  </section>;
}
