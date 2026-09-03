import { useMemo, useState } from 'react';
import type { Confidence, Question } from '../types';
import { addAttempt } from '../domain/progress';
import { SourceLinks } from './SourceLinks';

export function Quiz({ pool, title, onDone }: { pool: Question[]; title: string; onDone: () => void }) {
  const session = useMemo(() => [...pool].sort(() => Math.random() - 0.5), [pool]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<Confidence>('tror');
  const [score, setScore] = useState(0);
  const question = session[index];

  if (!question) return <section className="panel"><h2>{title}</h2><p>Inga frågor hittades.</p><button onClick={onDone}>Till startsidan</button></section>;
  const answered = selected !== null;
  const correct = selected === question.correctIndex;

  const answer = (choiceIndex: number) => {
    if (answered) return;
    setSelected(choiceIndex);
    const isCorrect = choiceIndex === question.correctIndex;
    if (isCorrect) setScore((value) => value + 1);
    addAttempt({ questionId: question.id, correct: isCorrect, confidence, at: new Date().toISOString() });
  };

  const next = () => {
    if (index === session.length - 1) return onDone();
    setIndex((value) => value + 1);
    setSelected(null);
    setConfidence('tror');
  };

  return <section className="panel quiz-panel">
    <div className="quiz-head"><div><span className="eyebrow">{title}</span><h2>Fråga {index + 1} av {session.length}</h2></div><span className="score">{score} rätt</span></div>
    <div className="progress"><span style={{ width: `${((index + 1) / session.length) * 100}%` }} /></div>
    <p className="question">{question.prompt}</p>
    {!answered && <div className="confidence"><span>Hur säker är du?</span>{(['vet','tror','gissar'] as Confidence[]).map((value) => <button key={value} className={confidence === value ? 'selected small' : 'small'} onClick={() => setConfidence(value)}>{value === 'vet' ? 'Jag vet' : value === 'tror' ? 'Jag tror' : 'Jag gissar'}</button>)}</div>}
    <div className="choices">{question.choices.map((choice, choiceIndex) => {
      const state = answered ? choiceIndex === question.correctIndex ? 'correct' : choiceIndex === selected ? 'wrong' : '' : '';
      return <button key={choice} className={`choice ${state}`} onClick={() => answer(choiceIndex)} disabled={answered}>{choice}</button>;
    })}</div>
    {answered && <div className={`feedback ${correct ? 'ok' : 'bad'}`}><strong>{correct ? 'Rätt.' : 'Inte riktigt.'}</strong> {question.explanation}<SourceLinks ids={question.sourceIds} /><button className="primary" onClick={next}>{index === session.length - 1 ? 'Avsluta' : 'Nästa fråga'}</button></div>}
  </section>;
}
