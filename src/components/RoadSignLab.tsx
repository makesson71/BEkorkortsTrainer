import { useMemo, useState } from 'react';
import { ROAD_SIGN_CATEGORY_LABELS, roadSignById, roadSigns, searchRoadSigns } from '../data/roadSigns';
import { roadSignActionQuestions, roadSignIdentifyQuestions } from '../data/roadSignDrills';
import { markRoadSignActionSolved, markRoadSignIdentified, loadRoadSignProgress } from '../domain/roadSignProgress';
import type { RoadSignCategory, RoadSignQuizQuestion } from '../types';
import { SourceLinks } from './SourceLinks';
import { RoadSignVisual } from './RoadSignVisual';

type View = 'browse' | 'identify' | 'action' | 'confusion';

const CATEGORY_ORDER: RoadSignCategory[] = ['warning', 'priority', 'prohibition', 'mandatory', 'information', 'supplementary'];

function DrillCard({
  item,
  onCorrect,
  visualChoices,
}: {
  item: RoadSignQuizQuestion;
  onCorrect: (signId: string) => void;
  visualChoices: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === item.correctIndex;
  const sign = roadSignById[item.signId];

  return (
    <article className="lab-block">
      <p className="question">{item.prompt}</p>
      <RoadSignVisual signId={item.signId} size={124} />
      <div className="choices">
        {item.choices.map((choice, idx) => {
          const state = answered ? idx === item.correctIndex ? 'correct' : idx === selected ? 'wrong' : '' : '';
          const choiceSign = roadSignById[choice];
          return (
            <button key={choice} className={`choice ${state}`} onClick={() => setSelected(idx)} disabled={answered}>
              {visualChoices && choiceSign ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <RoadSignVisual signId={choice} size={48} />
                  <span>{choiceSign.officialCode} {choiceSign.nameSv}</span>
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
          {!correct && sign && <p><strong>Rätt märke:</strong> {sign.officialCode} {sign.nameSv}.</p>}
          <SourceLinks ids={item.sourceIds} />
          {correct && <button className="primary" onClick={() => onCorrect(item.signId)}>Markera klar</button>}
        </div>
      )}
    </article>
  );
}

export function RoadSignLab() {
  const [view, setView] = useState<View>('browse');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<RoadSignCategory | 'alla'>('alla');
  const progress = loadRoadSignProgress();

  const filtered = useMemo(() => searchRoadSigns(query, category), [query, category]);

  const identify = roadSignIdentifyQuestions[(progress.identified.length) % roadSignIdentifyQuestions.length];
  const action = roadSignActionQuestions[(progress.actionSolved.length) % roadSignActionQuestions.length];

  return (
    <section className="concept-lab">
      <span className="eyebrow">Pedagogiskt labb</span>
      <h1>Vägmärkeslabbet</h1>
      <p>Fokuserat urval för BE: vikt, mått, väjningsregler, fart, järnväg, riskmiljö och tilläggstavlor.</p>
      <nav className="lab-nav" aria-label="Vägmärkeslabbet">
        <button className={view === 'browse' ? 'selected' : ''} onClick={() => setView('browse')}>Bläddra</button>
        <button className={view === 'identify' ? 'selected' : ''} onClick={() => setView('identify')}>Vilket märke?</button>
        <button className={view === 'action' ? 'selected' : ''} onClick={() => setView('action')}>Vad kräver märket?</button>
        <button className={view === 'confusion' ? 'selected' : ''} onClick={() => setView('confusion')}>Förväxlingspar</button>
      </nav>

      {view === 'browse' && (
        <div className="lab-block">
          <label>Sök vägmärke
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Exempel: C21, axeltryck, sidvind" />
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
            {filtered.map((sign) => (
              <article className="concept-card" key={sign.id}>
                <RoadSignVisual signId={sign.id} />
                <h3>{sign.officialCode} {sign.nameSv}</h3>
                <p><strong>Betydelse:</strong> {sign.meaning}</p>
                <p><strong>I praktiken:</strong> {sign.driverAction}</p>
                <p><strong>BE-relevans:</strong> {sign.beRelevance}</p>
                <p><strong>Vanlig förväxling:</strong> {sign.commonConfusion}</p>
                <SourceLinks ids={sign.sourceIds} />
              </article>
            ))}
          </div>
        </div>
      )}

      {view === 'identify' && <DrillCard item={identify} onCorrect={markRoadSignIdentified} visualChoices />}
      {view === 'action' && <DrillCard item={action} onCorrect={markRoadSignActionSolved} visualChoices={false} />}

      {view === 'confusion' && (
        <div className="lab-block">
          <h2>Vanliga förväxlingar</h2>
          <ul className="fact-list">
            <li><strong>C21 vs C23:</strong> C21 gäller hela fordonets/fordonstågets bruttovikt, C23 gäller en axel.</li>
            <li><strong>C16 vs A5:</strong> C16 är ett förbud med exakt breddgräns, A5 är en varning om avsmalning.</li>
            <li><strong>B1 vs B2:</strong> B1 innebär väjningsplikt, B2 kräver fullständigt stopp.</li>
            <li><strong>Huvudmärke utan/med T11-T12:</strong> Tilläggstavlan kan ändra var regeln gäller.</li>
          </ul>
          <SourceLinks ids={['TS-FORBUDSMARKEN', 'TS-TILLAGGSTAVLOR', 'SFS-2007-90']} />
        </div>
      )}
      <p className="notice"><strong>Utbildning, inte juridisk beslutstjänst.</strong> Kontrollera alltid verkligt ekipage och lokala föreskrifter.</p>
    </section>
  );
}
