import { useMemo, useState } from 'react';
import { concepts, CONCEPT_CATEGORY_LABELS, importantConceptIds, PEDAGOGY_LEVELS } from '../data/concepts';
import { conceptDrills } from '../data/conceptDrills';
import { confusionPairs } from '../data/confusionPairs';
import { certificateExercises } from '../data/certificateExercises';
import { loadConceptProgress, markConceptViewed, pedagogyLevelStatus } from '../domain/conceptProgress';
import type { Concept, ConceptCategory } from '../types';
import { ConceptExplainer, valueKindBadge } from './ConceptExplainer';
import { WeightRelationLab } from './WeightRelationLab';
import { LicenceVsTechnical } from './LicenceVsTechnical';
import { CertificateTrainer } from './CertificateTrainer';
import { ConceptDrillSession } from './ConceptDrillSession';
import { ConfusionMode } from './ConfusionMode';
import { Quiz } from './Quiz';
import { conceptQuestions } from '../data/questions';

type LabView = 'start' | 'browse' | 'visualizer' | 'compare' | 'certificate' | 'drills' | 'licence' | 'apply';

const BROWSE_CATEGORIES: ConceptCategory[] = ['vikt', 'registrering', 'fordon-slap', 'korkort', 'koppling-broms', 'forvaxling'];

function ConceptPreview({ concept, onOpen }: { concept: Concept; onOpen: (id: string) => void }) {
  return (
    <article className="concept-card">
      <header>
        <h3>{concept.term}</h3>
        <div className="kind-row">{concept.valueKinds.map((kind) => <span key={kind}>{valueKindBadge(kind)}</span>)}</div>
      </header>
      <p>{concept.shortDefinition}</p>
      {!concept.officialTerm && <p className="mini-notice">Inte ett officiellt fordonsviktsfält.</p>}
      <button type="button" className="primary" onClick={() => onOpen(concept.id)}>Öppna kortet</button>
    </article>
  );
}

export function ConceptLab({ onOpenWeightLab }: { onOpenWeightLab: () => void }) {
  const [view, setView] = useState<LabView>('start');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ConceptCategory | 'alla'>('alla');
  const [openId, setOpenId] = useState<string | null>(null);
  const progress = loadConceptProgress();
  const levels = pedagogyLevelStatus(
    progress,
    importantConceptIds,
    conceptDrills.map((item) => item.id),
    confusionPairs.map((item) => item.id),
    certificateExercises.map((item) => item.id),
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('sv');
    return concepts.filter((concept) => {
      if (concept.category === 'trafikregel' || concept.category === 'vagmarke') return false;
      if (category !== 'alla' && concept.category !== category) return false;
      if (!needle) return true;
      const hay = [concept.term, concept.shortDefinition, ...concept.aliases, concept.registrationCertificateField ?? ''].join(' ').toLocaleLowerCase('sv');
      return hay.includes(needle);
    });
  }, [query, category]);

  const openConcept = (id: string) => {
    markConceptViewed(id);
    setOpenId(id);
  };

  return (
    <section className="concept-lab">
      <span className="eyebrow">Pedagogiskt labb</span>
      <h1>Begreppslabbet</h1>
      <p>Lär viktspråket så att orden inte bara låter bekanta. Registrerade tak, aktuella vikter, körkort och teknik är fyra olika saker.</p>
      <nav className="lab-nav" aria-label="Begreppslabbet">
        <button type="button" className={view === 'start' ? 'selected' : ''} onClick={() => setView('start')}>Översikt</button>
        <button type="button" className={view === 'browse' ? 'selected' : ''} onClick={() => setView('browse')}>Begrepp</button>
        <button type="button" className={view === 'visualizer' ? 'selected' : ''} onClick={() => setView('visualizer')}>Räkna</button>
        <button type="button" className={view === 'compare' ? 'selected' : ''} onClick={() => setView('compare')}>Blanda inte ihop</button>
        <button type="button" className={view === 'certificate' ? 'selected' : ''} onClick={() => setView('certificate')}>Registreringsbevis</button>
        <button type="button" className={view === 'drills' ? 'selected' : ''} onClick={() => setView('drills')}>Vilket begrepp</button>
        <button type="button" className={view === 'licence' ? 'selected' : ''} onClick={() => setView('licence')}>Körkort mot teknik</button>
        <button type="button" className={view === 'apply' ? 'selected' : ''} onClick={() => setView('apply')}>Tillämpa</button>
      </nav>

      {view === 'start' && (
        <div className="lab-block">
          <ol className="level-list">
            {PEDAGOGY_LEVELS.map((level) => {
              const status = levels.find((item) => item.level === level.level)!;
              return (
                <li key={level.level}>
                  <span aria-hidden="true">{status.done ? '✓' : level.level}</span>
                  <div>
                    <strong>Nivå {level.level}: {level.title}</strong>
                    <p>{level.goal} {status.done ? 'Klar i den här enheten.' : 'Inte klar än.'}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => setView('browse')}>Börja med begreppen</button>
            <button type="button" onClick={() => setView('visualizer')}>Hoppa till räkning</button>
          </div>
          <p className="notice"><strong>Inte ett myndighetsbesked.</strong> Labbet tränar begrepp. Ett verkligt ekipage ska kontrolleras mot registreringsbevis och Transportstyrelsens släpvagnskalkylator. Vägmärken och “vad har ändrats sedan jag tog körkort” kommer i ett senare steg.</p>
        </div>
      )}

      {view === 'browse' && (
        <div className="lab-block">
          <label>Sök begrepp
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Till exempel O.1, bruttovikt, B96" />
          </label>
          <div className="scenario-tabs" role="tablist" aria-label="Kategori">
            <button type="button" className={category === 'alla' ? 'selected' : ''} onClick={() => setCategory('alla')}>Alla</button>
            {BROWSE_CATEGORIES.map((id) => (
              <button key={id} type="button" className={category === id ? 'selected' : ''} onClick={() => setCategory(id)}>{CONCEPT_CATEGORY_LABELS[id]}</button>
            ))}
          </div>
          <div className="concept-grid">
            {filtered.map((concept) => <ConceptPreview key={concept.id} concept={concept} onOpen={openConcept} />)}
          </div>
        </div>
      )}

      {view === 'visualizer' && <WeightRelationLab />}
      {view === 'compare' && <ConfusionMode />}
      {view === 'certificate' && <CertificateTrainer />}
      {view === 'drills' && <ConceptDrillSession />}
      {view === 'licence' && <LicenceVsTechnical />}
      {view === 'apply' && (
        <div>
          <p>Tillämpa flera begrepp på samma ekipage. Frågorna är egenformulerade träningsfrågor, inte Trafikverkets provfrågor.</p>
          <Quiz pool={conceptQuestions} title="Tillämpa begreppen" onDone={() => setView('start')} />
          <p><button type="button" onClick={onOpenWeightLab}>Fortsätt i Viktlabbet</button></p>
        </div>
      )}

      {openId && <ConceptExplainer conceptId={openId} onClose={() => setOpenId(null)} />}
    </section>
  );
}
