import { describe, expect, it } from 'vitest';
import { evaluateCombination } from '../src/domain/weights';

describe('evaluateCombination', () => {
  const input = (overrides: Partial<Parameters<typeof evaluateCombination>[0]> = {}) => ({
    carTotalKg: 2000,
    carGrossKg: 1800,
    trailerTotalKg: 1500,
    trailerGrossKg: 1200,
    carMaxTrailerGrossKg: 2000,
    ...overrides,
  });

  const licence = (name: 'B' | 'B96' | 'BE', overrides: Partial<Parameters<typeof evaluateCombination>[0]>) =>
    evaluateCombination(input(overrides)).find((item) => item.licence === name)!;

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

  it('keeps the B entitlement boundaries inclusive', () => {
    expect(licence('B', { carTotalKg: 3500, trailerTotalKg: 750 }).licenceAllowed).toBe(true);
    expect(licence('B', { carTotalKg: 2749, trailerTotalKg: 751 }).licenceAllowed).toBe(true);
    expect(licence('B', { carTotalKg: 2750, trailerTotalKg: 751 }).licenceAllowed).toBe(false);
  });

  it('keeps the B96 entitlement boundary inclusive', () => {
    expect(licence('B96', { carTotalKg: 2750, trailerTotalKg: 1500 }).licenceAllowed).toBe(true);
    expect(licence('B96', { carTotalKg: 2751, trailerTotalKg: 1500 }).licenceAllowed).toBe(false);
  });

  it('keeps the BE trailer boundary inclusive', () => {
    expect(licence('BE', { trailerTotalKg: 3500 }).licenceAllowed).toBe(true);
    expect(licence('BE', { trailerTotalKg: 3501 }).licenceAllowed).toBe(false);
  });

  it('keeps technical gross-weight boundaries inclusive', () => {
    const atTrailerMax = evaluateCombination(input({ trailerGrossKg: 2000, trailerTotalKg: 2500, carMaxTrailerGrossKg: 2000 }))[0];
    const overTrailerMax = evaluateCombination(input({ trailerGrossKg: 2001, trailerTotalKg: 2500, carMaxTrailerGrossKg: 2000 }))[0];
    const atTrainMax = evaluateCombination(input({ carGrossKg: 1800, trailerGrossKg: 1200, carMaxTrainGrossKg: 3000 }))[0];
    const overTrainMax = evaluateCombination(input({ carGrossKg: 1800, trailerGrossKg: 1201, carMaxTrainGrossKg: 3000 }))[0];
    expect(atTrailerMax.technicalAllowed).toBe(true);
    expect(overTrailerMax.technicalAllowed).toBe(false);
    expect(atTrainMax.technicalAllowed).toBe(true);
    expect(overTrainMax.technicalAllowed).toBe(false);
  });

  it('treats an omitted train limit differently from an invalid zero', () => {
    expect(evaluateCombination(input({ carMaxTrainGrossKg: undefined }))[0].technicalAllowed).toBe(true);
    const zero = evaluateCombination(input({ carMaxTrainGrossKg: 0 }))[0];
    expect(zero.technicalAllowed).toBe(false);
    expect(zero.reasons.some((reason) => reason.includes('positivt värde'))).toBe(true);
  });
});
