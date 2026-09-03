import { describe, expect, it } from 'vitest';
import { evaluateCombination } from '../src/domain/weights';

describe('evaluateCombination', () => {
  it('separates licence permission from technical towing limit', () => {
    const result = evaluateCombination({ carTotalKg: 2650, carGrossKg: 2300, trailerTotalKg: 2700, trailerGrossKg: 2300, carMaxTrailerGrossKg: 2200, carMaxTrainGrossKg: 5000 });
    const be = result.find((item) => item.licence === 'BE')!;
    expect(be.licenceAllowed).toBe(true);
    expect(be.technicalAllowed).toBe(false);
    expect(be.allowed).toBe(false);
  });

  it('allows B96 only up to 4250 kg combined total weight', () => {
    const ok = evaluateCombination({ carTotalKg: 2250, carGrossKg: 2000, trailerTotalKg: 2000, trailerGrossKg: 1600, carMaxTrailerGrossKg: 2000 });
    const tooHeavy = evaluateCombination({ carTotalKg: 2500, carGrossKg: 2100, trailerTotalKg: 2000, trailerGrossKg: 1600, carMaxTrailerGrossKg: 2000 });
    expect(ok.find((item) => item.licence === 'B96')!.licenceAllowed).toBe(true);
    expect(tooHeavy.find((item) => item.licence === 'B96')!.licenceAllowed).toBe(false);
  });

  it('applies current BE trailer total-weight cap', () => {
    const result = evaluateCombination({ carTotalKg: 3000, carGrossKg: 2500, trailerTotalKg: 3600, trailerGrossKg: 2000, carMaxTrailerGrossKg: 2500 });
    expect(result.find((item) => item.licence === 'BE')!.licenceAllowed).toBe(false);
  });
});
