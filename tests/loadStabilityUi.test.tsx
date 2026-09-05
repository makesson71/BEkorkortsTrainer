import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LoadStabilityLab } from '../src/components/LoadStabilityLab';

describe('LoadStabilityLab initial UI', () => {
  const html = renderToStaticMarkup(<LoadStabilityLab onOpenWeightLab={() => undefined} />);

  it('renders a movable load, derived values and balanced state', () => {
    expect(html).toContain('aria-label="Låda, 300 kg, läge 2.25 meter. Dra eller använd knapparna."');
    expect(html).toContain('Kopplingsreaktion');
    expect(html).toContain('Rimligt område');
  });
  it('provides keyboard button alternatives and reset', () => {
    expect(html).toContain('Flytta Låda 10 centimeter framåt');
    expect(html).toContain('Flytta Låda 10 centimeter bakåt');
    expect(html).toContain('Återställ scenario');
  });
  it('does not leak quiz answers before submission', () => {
    expect(html).not.toContain('Rätt svar:');
    expect(html).not.toContain('Trögheten ger en rörelsetendens');
  });
});
