import { ruleRefreshers } from '../data/ruleRefreshers';
import { SourceLinks } from './SourceLinks';

export function RefresherLab() {
  const verified = ruleRefreshers.filter((item) => item.kind === 'verified-change');
  const current = ruleRefreshers.filter((item) => item.kind === 'current-refresher');

  return (
    <section className="concept-lab">
      <span className="eyebrow">Erfaren förare</span>
      <h1>Vad har ändrats / vad är lätt att glömma?</h1>
      <p>Två spår: verifierade regeländringar med datum och sådant som är viktigt att repetera utan att påstå historisk ändring.</p>

      <div className="lab-block">
        <h2>Verifierad förändring</h2>
        {verified.map((card) => (
          <article key={card.id} className="concept-card refresher-card verified-change">
            <span className="refresher-badge verified">Verifierad förändring</span>
            <h3>{card.title}</h3>
            <p><strong>Område:</strong> {card.area}</p>
            <p>{card.summary}</p>
            <p><strong>Nuvarande regel:</strong> {card.currentRule}</p>
            <p><strong>BE-koppling:</strong> {card.beConnection}</p>
            {card.historical && (
              <ul>
                <li><strong>Vad ändrades:</strong> {card.historical.whatChanged}</li>
                <li><strong>Gäller från:</strong> {card.historical.effectiveDate}</li>
                <li><strong>Tidigare:</strong> {card.historical.oldSituation}</li>
                <li><strong>Nu:</strong> {card.historical.currentSituation}</li>
              </ul>
            )}
            <small>Kontrollerad {card.checked}</small>
            <SourceLinks ids={card.sourceIds} />
          </article>
        ))}
      </div>

      <div className="lab-block">
        <h2>Aktuell repetition (utan historiskt anspråk)</h2>
        {current.map((card) => (
          <article key={card.id} className="concept-card refresher-card current-refresher">
            <span className="refresher-badge current">Aktuell repetition</span>
            <h3>{card.title}</h3>
            <p><strong>Område:</strong> {card.area}</p>
            <p>{card.summary}</p>
            <p><strong>Nuvarande regel:</strong> {card.currentRule}</p>
            <p><strong>BE-koppling:</strong> {card.beConnection}</p>
            <small>Kontrollerad {card.checked}</small>
            <SourceLinks ids={card.sourceIds} />
          </article>
        ))}
      </div>
      <p className="notice"><strong>Träningsmaterial.</strong> Inte juridisk rådgivning eller myndighetsbeslut.</p>
    </section>
  );
}
