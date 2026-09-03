export type LoadState = 'ok' | 'at-limit' | 'over-total';
export type CombinationStopper = 'licence' | 'technical' | 'both' | 'none';

export function registeredMaxlastKg(serviceWeightKg: number, totalWeightKg: number): number {
  return totalWeightKg - serviceWeightKg;
}

export function grossFromServiceAndLoadKg(serviceWeightKg: number, currentLoadKg: number): number {
  return serviceWeightKg + currentLoadKg;
}

export function loadState(grossKg: number, totalKg: number): LoadState {
  if (grossKg > totalKg) return 'over-total';
  if (grossKg === totalKg) return 'at-limit';
  return 'ok';
}

export function combinedGrossKg(carGrossKg: number, trailerGrossKg: number): number {
  return carGrossKg + trailerGrossKg;
}

export function combinedRegisteredTotalKg(carTotalKg: number, trailerTotalKg: number): number {
  return carTotalKg + trailerTotalKg;
}

export function whatStopsCombination(licenceAllowed: boolean, technicalAllowed: boolean): CombinationStopper {
  if (!licenceAllowed && !technicalAllowed) return 'both';
  if (!licenceAllowed) return 'licence';
  if (!technicalAllowed) return 'technical';
  return 'none';
}

export function formatKg(value: number): string {
  return `${value.toLocaleString('sv-SE')} kg`;
}
