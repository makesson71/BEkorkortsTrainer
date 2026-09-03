import { sourceById } from '../data/sources';

export function SourceLinks({ ids }: { ids: string[] }) {
  return <div className="sources">
    <strong>Källor:</strong>{' '}
    {ids.map((id, index) => {
      const source = sourceById[id];
      return source ? <span key={id}>{index > 0 ? ' · ' : ''}<a href={source.url} target="_blank" rel="noreferrer">{source.publisher}: {source.title}</a></span> : null;
    })}
  </div>;
}
