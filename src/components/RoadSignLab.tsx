import { useMemo, useState } from 'react';
import { ROAD_SIGN_CATEGORY_LABELS, roadSignById, searchRoadSigns } from '../data/roadSigns';
import { roadSignActionQuestions, roadSignIdentifyQuestions } from '../data/roadSignDrills';
import { markRoadSignActionSolved, markRoadSignIdentified } from '../domain/roadSignProgress';
import type { RoadSign, RoadSignCategory, RoadSignQuizQuestion } from '../types';
import { SourceLinks } from './SourceLinks';
import { RoadSignVisual } from './RoadSignVisual';

type View = 'browse' | 'identify' | 'action' | 'confusion';

const CATEGORY_ORDER: RoadSignCategory[] = ['warning', 'priority', 'prohibition', 'mandatory', 'instruction', 'supplementary'];

export function applySignDrillAnswer(
  item: RoadSignQuizQuestion,
  selectedIndex: number,
  onCorrect: (signId: string) => void,
): boolean {
  const correct = selectedIndex === item.correctIndex;
  if (correct) onCorrect(item.signId);
  return correct;
}

export function SignDrillCard({
  item,
  onCorrect,
  visualChoices,
  initiallySelected = null,
  onNext,
}: {
  item: RoadSignQuizQuestion;
  onCorrect: (signId: string) => void;
  visualChoices: boolean;
  initiallySelected?: number | null;
  onNext?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(initiallySelected);
  const answered = selected !== null;
  const correct = selected === item.correctIndex;
  const sign = roadSignById[item.signId];

  const answer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    applySignDrillAnswer(item, idx, onCorrect);
  };

  return (
    <article className="lab-block sign-drill">
      <p className="question">{item.prompt}</p>
      <div className="sign-prompt">
        <RoadSignVisual signId={item.signId} size={148} mode={answered ? 'reference' : 'quiz'} />
      </div>
      <div className="choices">
        {item.choices.map((choice, idx) => {
          const state = answered ? idx === item.correctIndex ? 'correct' : idx === selected ? 'wrong' : '' : '';
          const choiceSign = roadSignById[choice];
          return (
            <button key={choice} className={`choice ${state}`} onClick={() => answer(idx)} disabled={answered}>
              {visualChoices && choiceSign ? (
                <span className="sign-choice">
                  <RoadSignVisual signId={choice} size={52} mode={answered ? 'reference' : 'quiz'} />
                  <span>
                    <strong>{choiceSign.nameSv}</strong>
                    {answered && <small> {choiceSign.officialCode}</small>}
                  </span>
                </span>
              ) : choice}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`feedback ${correct ? 'ok' : 'bad'}`}>
          <strong>{correct ? 'Rätt.' : 'Inte riktigt.'}</strong>{' '}
          {correct ? item.explanationCorrect : item.explanationWrong}
          {sign && (
            <p>
              <strong>Rätt märke:</strong> {sign.officialCode} {sign.nameSv}.
            </p>
          )}
          <SourceLinks ids={item.sourceIds} />
          {onNext && <button className="primary" onClick={onNext}>Nästa</button>}
        </div>
      )}
    </article>
  );
}

function BrowseCard({ sign }: { sign: RoadSign }) {
  return (
    <article className="concept-card">
      <RoadSignVisual signId={sign.id} mode="reference" />
      <h3>{sign.officialCode} {sign.nameSv}</h3>
      <p><strong>Betydelse:</strong> {sign.meaning}</p>
      <p><strong>I praktiken:</strong> {sign.driverAction}</p>
      <p><strong>BE-relevans:</strong> {sign.beRelevance}</p>
      <p><strong>Vanlig förväxling:</strong> {sign.commonConfusion}</p>
      <SourceLinks ids={sign.sourceIds} />
    </article>
  );
}

export function RoadSignLab({ initialView = 'browse' }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RoadSignCategory | 'alla'>('alla');
  const [identifyIndex, setIdentifyIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);

  const filtered = useMemo(() => searchRoadSigns(query, category), [query, category]);
  const identify = roadSignIdentifyQuestions[identifyIndex % roadSignIdentifyQuestions.length];
  const action = roadSignActionQuestions[actionIndex % roadSignActionQuestions.length];

  return (
    <section className="concept-lab">
      <span className="eyebrow">Pedagogiskt labb</span>
      <h1>Vägmärkeslabbet</h1>
      <p>Fokuserat urval för BE: vikt, mått, väjningsregler, fart, järnväg, riskmiljö och tilläggstavlor. I “Vilket märke?” ska du känna igen symbolen, inte koden.</p>
      <nav className="lab-nav" aria-label="Vägmärkeslabbet">
        <button className={view === 'browse' ? 'selected' : ''} onClick={() => setView('browse')}>Bläddra</button>
        <button className={view === 'identify' ? 'selected' : ''} onClick={() => setView('identify')}>Vilket märke?</button>
        <button className={view === 'action' ? 'selected' : ''} onClick={() => setView('action')}>Vad kräver märket?</button>
        <button className={view === 'confusion' ? 'selected' : ''} onClick={() => setView('confusion')}>Förväxlingspar</button>
      </nav>

      {view === 'browse' && (
        <div className="lab-block">
          <label>Sök vägmärke
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Exempel: C21, axeltryck, sidvind" />
          </label>
          <div className="scenario-tabs" role="tablist" aria-label="Vägmärkeskategorier">
            <button className={category === 'alla' ? 'selected' : ''} onClick={() => setCategory('alla')}>Alla</button>
            {CATEGORY_ORDER.map((id) => (
              <button key={id} className={category === id ? 'selected' : ''} onClick={() => setCategory(id)}>
                {ROAD_SIGN_CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
          <div className="concept-grid">
            {filtered.map((sign) => <BrowseCard key={sign.id} sign={sign} />)}
          </div>
        </div>
      )}

      {view === 'identify' && (
        <SignDrillCard
          key={`identify-${identifyIndex}`}
          item={identify}
          visualChoices
          onCorrect={markRoadSignIdentified}
          onNext={() => setIdentifyIndex((value) => value + 1)}
        />
      )}
      {view === 'action' && (
        <SignDrillCard
          key={`action-${actionIndex}`}
          item={action}
          visualChoices={false}
          onCorrect={markRoadSignActionSolved}
          onNext={() => setActionIndex((value) => value + 1)}
        />
      )}

      {view === 'confusion' && (
        <div className="lab-block">
          <h2>Vanliga förväxlingar</h2>
          <ul className="fact-list">
            <li><strong>C20 vs C21:</strong> C20 gäller ett fordon, C21 fordon och fordonståg.</li>
            <li><strong>C21 vs C23 vs C24:</strong> C21 är bruttovikt, C23 en axel, C24 en boggi.</li>
            <li><strong>C16 vs C17 vs C18:</strong> bredd, höjd och längd är tre olika förbud.</li>
            <li><strong>C16 vs A5:</strong> C16 är ett förbud med exakt breddgräns, A5 är en varning om avsmalning.</li>
            <li><strong>C2 vs C3 vs C6:</strong> tom ring, personbil, bil med släpvagn. C6 undantar släpkärra och påhängsvagn om inte tilläggstavla säger annat.</li>
            <li><strong>B1 vs B2:</strong> B1 är väjningsplikt (spets nedåt), B2 kräver stopp.</li>
            <li><strong>A3 vs A4:</strong> nedförslutning lutar ned åt höger, stigning upp åt höger.</li>
            <li><strong>T11 vs T12:</strong> T11 visar utsträckning, T12 riktning.</li>
          </ul>
          <SourceLinks ids={['TS-FORBUDSMARKEN', 'TS-TILLAGGSTAVLOR', 'SFS-2007-90']} />
        </div>
      )}
      <p className="notice"><strong>Utbildning, inte juridisk beslutstjänst.</strong> Kontrollera alltid verkligt ekipage och lokala föreskrifter.</p>
    </section>
  );
}
