import { useMemo, useState } from 'react';
import { lessons } from './data/lessons';
import { questions } from './data/questions';
import { sources } from './data/sources';
import { loadAttempts, masteryFor } from './domain/progress';
import { Quiz } from './components/Quiz';
import { WeightLab } from './components/WeightLab';
import { ConceptLab } from './components/ConceptLab';
import { SourceLinks } from './components/SourceLinks';

type View = 'home' | 'diagnostic' | 'practice' | 'lessons' | 'weights' | 'concepts' | 'sources';

export default function App() {
  const [view, setView] = useState<View>('home');
  const attempts = loadAttempts();
  const averageMastery = useMemo(() => {
    const seen = questions.filter((q) => attempts.some((a) => a.questionId === q.id));
    if (!seen.length) return 0;
    return Math.round(seen.reduce((sum, q) => sum + masteryFor(q.id, attempts), 0) / seen.length);
  }, [attempts, view]);
  const diagnostic = questions.filter((question) => question.diagnostic);

  const home = <>
    <section className="hero"><div><span className="eyebrow">BE-körkort · Sverige</span><h1>Förstå ekipaget.<br/>Klara teorin.</h1><p>Byggd för dig som redan kan köra men vill fräscha upp rätt saker – BE-specifikt först, gammal B-teori bara där diagnostiken hittar luckor.</p><div className="hero-actions"><button className="primary" onClick={() => setView('diagnostic')}>Starta diagnostik</button><button onClick={() => setView('concepts')}>Öppna Begreppslabbet</button></div></div><div className="exam-card"><span>BE-teoriprovet</span><strong>60 frågor</strong><div><b>40 min</b><b>44+ poäng</b></div><small>5 testfrågor räknas inte. Max 55 poäng.</small></div></section>
    <section className="stats"><div><strong>{averageMastery}%</strong><span>beräknad behärskning</span></div><div><strong>{attempts.length}</strong><span>besvarade träningsfrågor</span></div><div><strong>{lessons.length}</strong><span>kortlektioner</span></div></section>
    <section><div className="section-head"><div><span className="eyebrow">Träna smart</span><h2>Fem vägar in</h2></div></div><div className="cards">
      <button className="feature-card" onClick={() => setView('diagnostic')}><span>Diagnos</span><h3>30-årsdiagnos</h3><p>Hitta vad som faktiskt behöver fräschas upp.</p></button>
      <button className="feature-card" onClick={() => setView('concepts')}><span>Begrepp</span><h3>Begreppslabbet</h3><p>Vikter, registreringsbevis och vad som inte får blandas ihop.</p></button>
      <button className="feature-card" onClick={() => setView('weights')}><span>Vikter</span><h3>Viktlabbet</h3><p>Flytta siffrorna och förstå B, B96, BE och tekniska gränser.</p></button>
      <button className="feature-card" onClick={() => setView('lessons')}><span>Lektioner</span><h3>Snabblektioner</h3><p>3–8 minuter per område, alltid med myndighetskälla.</p></button>
      <button className="feature-card" onClick={() => setView('practice')}><span>Frågor</span><h3>Frågeträning</h3><p>Vet, tror eller gissar – så rätt gissning inte lurar systemet.</p></button>
    </div></section>
    <section className="notice"><strong>Inte en officiell Trafikverket-app.</strong> Alla träningsfrågor är egenformulerade. Regelfakta ska vara spårbara till Trafikverket eller Transportstyrelsen och ha datum för senaste kontroll. Viktlabbet och Begreppslabbet ger inte ett fullständigt lagligt klartecken för ett verkligt ekipage.</section>
  </>;

  return <div className="app"><header><button className="brand" onClick={() => setView('home')}><span>BE</span><div>Trainer<small>Sverige</small></div></button><nav><button onClick={() => setView('lessons')}>Lär</button><button onClick={() => setView('concepts')}>Begrepp</button><button onClick={() => setView('weights')}>Vikter</button><button onClick={() => setView('practice')}>Träna</button><button onClick={() => setView('sources')}>Källor</button></nav></header><main>
    {view === 'home' && home}
    {view === 'diagnostic' && <Quiz pool={diagnostic} title="30-årsdiagnos" onDone={() => setView('home')} />}
    {view === 'practice' && <Quiz pool={questions} title="Frågeträning" onDone={() => setView('home')} />}
    {view === 'weights' && <WeightLab />}
    {view === 'concepts' && <ConceptLab onOpenWeightLab={() => setView('weights')} />}
    {view === 'lessons' && <section><span className="eyebrow">Kort och källspårat</span><h1>Lektioner</h1><div className="lesson-list">{lessons.map((lesson) => <article className="lesson" key={lesson.id}><div><span>{lesson.minutes} min</span><h2>{lesson.title}</h2><p>{lesson.summary}</p></div><ul>{lesson.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><SourceLinks ids={lesson.sourceIds}/></article>)}</div></section>}
    {view === 'sources' && <section><span className="eyebrow">Källhygien</span><h1>Officiella källor</h1><p>Varje regelbärande fråga ska peka på minst en källa. Senast kontrollerad datum lagras separat så att innehållet kan auditeras.</p><div className="lesson-list">{sources.map((source) => <article className="lesson" key={source.id}><h2>{source.publisher}</h2><p><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></p><small>Kontrollerad {source.checked} · {source.id}</small>{source.note && <p>{source.note}</p>}</article>)}</div></section>}
  </main><footer>BE Trainer Sverige · träningsverktyg, ej myndighetstjänst</footer></div>;
}
