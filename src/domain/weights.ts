export type Licence = 'B' | 'B96' | 'BE';

export interface CombinationInput {
  carTotalKg: number;
  carGrossKg: number;
  trailerTotalKg: number;
  trailerGrossKg: number;
  carMaxTrailerGrossKg: number;
  carMaxTrainGrossKg?: number;
}

export interface EligibilityResult {
  licence: Licence;
  licenceAllowed: boolean;
  technicalAllowed: boolean;
  allowed: boolean;
  reasons: string[];
}

export function evaluateCombination(input: CombinationInput): EligibilityResult[] {
  const technicalReasons: string[] = [];
  if (input.carMaxTrainGrossKg !== undefined && input.carMaxTrainGrossKg <= 0) {
    technicalReasons.push('Högsta tågvikt måste lämnas tom eller anges som ett positivt värde.');
  }
  const validMasses = input.carGrossKg <= input.carTotalKg && input.trailerGrossKg <= input.trailerTotalKg;
  if (!validMasses) technicalReasons.push('Aktuell bruttovikt får inte vara högre än fordonets totalvikt i den här övningen.');
  if (input.trailerGrossKg > input.carMaxTrailerGrossKg) technicalReasons.push('Släpets aktuella bruttovikt överskrider bilens angivna högsta släpvagnsvikt.');
  if (input.carMaxTrainGrossKg !== undefined && input.carMaxTrainGrossKg > 0 && input.carGrossKg + input.trailerGrossKg > input.carMaxTrainGrossKg) technicalReasons.push('Aktuell tågvikt överskrider angiven teknisk gräns.');
  const technicalAllowed = validMasses && technicalReasons.length === 0;

  const licenceChecks: Record<Licence, { ok: boolean; reasons: string[] }> = {
    B: {
      ok: input.carTotalKg <= 3500 && (input.trailerTotalKg <= 750 || input.carTotalKg + input.trailerTotalKg <= 3500),
      reasons: input.carTotalKg > 3500
        ? ['Dragbilens totalvikt är över 3 500 kg.']
        : input.trailerTotalKg <= 750
          ? ['Släpets totalvikt är högst 750 kg.']
          : input.carTotalKg + input.trailerTotalKg <= 3500
            ? ['Bilens och släpets sammanlagda totalvikt är högst 3 500 kg.']
            : ['Släpet är över 750 kg och sammanlagd totalvikt är över 3 500 kg.'],
    },
    B96: {
      ok: input.carTotalKg <= 3500 && input.carTotalKg + input.trailerTotalKg <= 4250,
      reasons: input.carTotalKg > 3500
        ? ['Dragbilens totalvikt är över 3 500 kg.']
        : input.carTotalKg + input.trailerTotalKg <= 4250
          ? ['Sammanlagd totalvikt är högst 4 250 kg.']
          : ['Sammanlagd totalvikt är över 4 250 kg.'],
    },
    BE: {
      ok: input.carTotalKg <= 3500 && input.trailerTotalKg <= 3500,
      reasons: [
        ...(input.carTotalKg <= 3500 ? [] : ['Dragbilens totalvikt är över 3 500 kg.']),
        ...(input.trailerTotalKg <= 3500 ? [] : ['Släpets totalvikt är över 3 500 kg.']),
        ...(input.carTotalKg <= 3500 && input.trailerTotalKg <= 3500 ? ['BE:s behörighetsgränser är uppfyllda.'] : []),
      ],
    },
  };

  return (['B', 'B96', 'BE'] as Licence[]).map((licence) => ({
    licence,
    licenceAllowed: licenceChecks[licence].ok,
    technicalAllowed,
    allowed: licenceChecks[licence].ok && technicalAllowed,
    reasons: [...licenceChecks[licence].reasons, ...technicalReasons],
  }));
}
