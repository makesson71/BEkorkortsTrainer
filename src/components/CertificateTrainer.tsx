import { useState } from 'react';
import { carTrainingCertificate, certificateExercises, trailerTrainingCertificate, type TrainingCertificate } from '../data/certificateExercises';
import { markCertificateCompleted } from '../domain/conceptProgress';
import { SourceLinks } from './SourceLinks';

function CertificateCard({ card, highlight, onPick, disabled }: {
  card: TrainingCertificate;
  highlight?: string;
  onPick?: (code: string) => void;
  disabled?: boolean;
}) {
  return (
    <article className="reg-card" aria-label={card.heading}>
      <header>
        <p className="eyebrow">Träningskort – inte ett riktigt registreringsbevis</p>
        <h3>{card.heading}</h3>
        <p>Reg.nr {card.registration} · fingerat fordon</p>
      </header>
      <dl>
        {card.fields.map((field) => {
          const interactive = Boolean(onPick);
          const selected = highlight === field.code;
          return (
            <div key={field.code} className={selected ? 'reg-field selected-field' : 'reg-field'}>
              {interactive ? (
                <button type="button" disabled={disabled} onClick={() => onPick?.(field.code)}>
                  <dt>{field.code} · {field.label}</dt>
                  <dd>{field.value}</dd>
                </button>
              ) : (
                <>
                  <dt>{field.code} · {field.label}</dt>
                  <dd>{field.value}</dd>
                </>
              )}
              <small>{field.hint}</small>
            </div>
          );
        })}
      </dl>
    </article>
  );
}

export function CertificateTrainer() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const exercise = certificateExercises[index];
  const answered = picked != null;
  const correct = picked === exercise.targetField;
  const showCar = exercise.card !== 'trailer';
  const showTrailer = exercise.card !== 'car';

  const choose = (code: string) => {
    if (answered) return;
    setPicked(code);
    if (code === exercise.targetField) markCertificateCompleted(exercise.id);
  };

  const next = () => {
    setPicked(null);
    setIndex((value) => (value + 1) % certificateExercises.length);
  };

  return (
    <section className="lab-block">
      <h2>Registreringsbeviset</h2>
      <p>Tryck på rätt fält. Kortet är originalträning, inte en kopia av ett myndighetsbevis.</p>
      <p className="question">{exercise.prompt}</p>
      <div className="reg-grid">
        {showCar && <CertificateCard card={carTrainingCertificate} highlight={answered ? exercise.targetField : picked ?? undefined} onPick={choose} disabled={answered} />}
        {showTrailer && <CertificateCard card={trailerTrainingCertificate} highlight={answered ? exercise.targetField : picked ?? undefined} onPick={choose} disabled={answered} />}
      </div>
      {answered && (
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Rätt fält.' : `Inte ${picked}. Rätt är ${exercise.targetField}.`}</strong>
          <p>{exercise.explanation}</p>
          <SourceLinks ids={exercise.sourceIds} />
          <button className="primary" type="button" onClick={next}>{index === certificateExercises.length - 1 ? 'Börja om' : 'Nästa övning'}</button>
        </div>
      )}
    </section>
  );
}
