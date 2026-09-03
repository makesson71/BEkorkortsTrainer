import { useState } from 'react';
import { confusionPairs } from '../data/confusionPairs';
import { conceptById } from '../data/concepts';
import { markConfusionCompleted } from '../domain/conceptProgress';
import { SourceLinks } from './SourceLinks';
import { valueKindBadge } from './ConceptExplainer';

export function ConfusionMode() {
  const [pairId, setPairId] = useState(confusionPairs[0].id);
  const [picked, setPicked] = useState<number | null>(null);
  const pair = confusionPairs.find((item) => item.id === pairId)!;
  const a = conceptById[pair.conceptIdA];
  const b = conceptById[pair.conceptIdB];
  const answered = picked != null;
  const correct = picked === pair.quizCorrectIndex;

  return (
    <section className="lab-block">
      <h2>Blanda inte ihop</h2>
      <p>Sida vid sida för de par som oftast blandas ihop. Färg är bara stöd – varje sida har också textetikett.</p>
      <div className="scenario-tabs" role="tablist">
        {confusionPairs.map((item) => (
          <button key={item.id} role="tab" aria-selected={item.id === pairId} className={item.id === pairId ? 'selected' : ''} onClick={() => { setPairId(item.id); setPicked(null); }}>{item.title}</button>
        ))}
      </div>
      <div className="split-cards">
        <article className="split">
          <h3>{a.term}</h3>
          <div className="kind-row">{a.valueKinds.map((kind) => <span key={kind}>{valueKindBadge(kind)}</span>)}</div>
          <p>{a.shortDefinition}</p>
        </article>
        <article className="split">
          <h3>{b.term}</h3>
          <div className="kind-row">{b.valueKinds.map((kind) => <span key={kind}>{valueKindBadge(kind)}</span>)}</div>
          <p>{b.shortDefinition}</p>
        </article>
      </div>
      <dl className="compare-dl">
        <div><dt>Vad ändras</dt><dd>{pair.whatChanges}</dd></div>
        <div><dt>Vad är fast</dt><dd>{pair.whatStaysFixed}</dd></div>
        <div><dt>Körkort</dt><dd>{pair.usedForLicence}</dd></div>
        <div><dt>Teknik</dt><dd>{pair.usedForTechnical}</dd></div>
        <div><dt>Räkneexempel</dt><dd>{pair.workedExample}</dd></div>
      </dl>
      <fieldset className="choices">
        <legend>Testa dig: {pair.quizPrompt}</legend>
        {pair.quizChoices.map((choice, index) => {
          const state = answered ? index === pair.quizCorrectIndex ? 'correct' : index === picked ? 'wrong' : '' : '';
          return <button key={choice} className={`choice ${state}`} disabled={answered} onClick={() => {
            setPicked(index);
            if (index === pair.quizCorrectIndex) markConfusionCompleted(pair.id);
          }}>{choice}</button>;
        })}
      </fieldset>
      {answered && (
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Rätt.' : 'Inte riktigt.'}</strong> {pair.quizExplanation}
          <SourceLinks ids={pair.sourceIds} />
        </div>
      )}
    </section>
  );
}
