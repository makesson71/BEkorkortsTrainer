import { useEffect, useRef, useState } from 'react';
import { conceptById, CONCEPT_CATEGORY_LABELS } from '../data/concepts';
import { SourceLinks } from './SourceLinks';
import type { ConceptValueKind } from '../types';

const KIND_LABEL: Record<ConceptValueKind, string> = {
  registered: 'Fast · registrerad',
  actual: 'Nu · ändras med last',
  licence: 'Körkort',
  technical: 'Teknisk gräns',
};

export function valueKindBadge(kind: ConceptValueKind) {
  return <span className={`kind-badge kind-${kind}`}>{KIND_LABEL[kind]}</span>;
}

export function ConceptExplainer({ conceptId, onClose }: { conceptId: string; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const concept = conceptById[conceptId];

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!node.open) node.showModal();
    const onCancel = () => onClose();
    node.addEventListener('cancel', onCancel);
    return () => node.removeEventListener('cancel', onCancel);
  }, [onClose]);

  if (!concept) return null;

  return (
    <dialog
      ref={dialog}
      className="concept-dialog"
      aria-labelledby="concept-dialog-title"
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <form method="dialog" onSubmit={onClose}>
        <p className="eyebrow">{CONCEPT_CATEGORY_LABELS[concept.category]}</p>
        <h2 id="concept-dialog-title">{concept.term}</h2>
        <p className="lead">{concept.shortDefinition}</p>
        <div className="kind-row">{concept.valueKinds.map((kind) => <span key={kind}>{valueKindBadge(kind)}</span>)}</div>
        {!concept.officialTerm && <p className="notice"><strong>Blanda inte ihop:</strong> Detta är inte ett officiellt fordonsviktsfält.</p>}
        {concept.registrationCertificateField && <p><strong>På beviset:</strong> {concept.registrationCertificateField}</p>}
        <h3>Det här betyder det</h3>
        <p>{concept.fullExplanation}</p>
        {concept.formula && <p className="formula" role="note">{concept.formula}</p>}
        <h3>Exempel</h3>
        <p>{concept.example}</p>
        {concept.doNotConfuseWith.length > 0 && (
          <>
            <h3>Blanda inte ihop med</h3>
            <ul>{concept.doNotConfuseWith.map((id) => <li key={id}>{conceptById[id]?.term ?? id}</li>)}</ul>
          </>
        )}
        <p><strong>Vanligt misstag:</strong> {concept.commonMistake}</p>
        <SourceLinks ids={concept.sourceIds} />
        <button className="primary" type="submit">Stäng</button>
      </form>
    </dialog>
  );
}

export function ConceptHint({ conceptId, label }: { conceptId: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="hint-wrap">
      <button type="button" className="concept-hint" aria-label={`Förklaring: ${label}`} onClick={() => setOpen(true)}>ⓘ</button>
      {open && <ConceptExplainer conceptId={conceptId} onClose={() => setOpen(false)} />}
    </span>
  );
}
