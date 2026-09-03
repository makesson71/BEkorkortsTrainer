import { useMemo, useState } from 'react';
import { conceptDrills } from '../data/conceptDrills';
import { markDrillCompleted } from '../domain/conceptProgress';
import { SourceLinks } from './SourceLinks';
import { ConceptHint } from './ConceptExplainer';

export function ConceptDrillSession() {
  const ordered = useMemo(() => [...conceptDrills].sort((a, b) => a.level - b.level || a.id.localeCompare(b.id)), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const drill = ordered[index];
  const answered = selected != null;
  const correct = selected === drill.correctIndex;

  const answer = (choiceIndex: number) => {
    if (answered) return;
    setSelected(choiceIndex);
    if (choiceIndex === drill.correctIndex) markDrillCompleted(drill.id);
  };

  const next = () => {
    setSelected(null);
    setIndex((value) => Math.min(value + 1, ordered.length - 1));
  };

  return (
    <section className="lab-block">
      <h2>Vilket begrepp är det?</h2>
      <p>Nivå {drill.level} av 6 · fråga {index + 1} av {ordered.length}. Ordningen går från igenkänning till beräkning, inte slump från start.</p>
      <p className="question">{drill.prompt}</p>
      <div className="choices">
        {drill.choices.map((choice, choiceIndex) => {
          const state = answered ? choiceIndex === drill.correctIndex ? 'correct' : choiceIndex === selected ? 'wrong' : '' : '';
          return <button key={choice} className={`choice ${state}`} onClick={() => answer(choiceIndex)} disabled={answered}>{choice}</button>;
        })}
      </div>
      {answered && (
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Rätt.' : 'Inte riktigt.'}</strong> {drill.explanation}
          <p><ConceptHint conceptId={drill.conceptId} label="Öppna begreppet" /> läs begreppet</p>
          <SourceLinks ids={drill.sourceIds} />
          {index < ordered.length - 1 ? <button className="primary" type="button" onClick={next}>Nästa</button> : <p>Klart med den här rundan.</p>}
        </div>
      )}
    </section>
  );
}
