export interface PointLoad {
  id: string;
  label: string;
  massKg: number;
  positionM: number;
}

export interface BeamModel {
  couplingM: number;
  axleM: number;
  loads: PointLoad[];
}

export interface StaticReactions {
  totalMassKg: number;
  centreOfMassM: number | null;
  couplingKg: number;
  axleKg: number;
  momentAboutCouplingKgM: number;
  momentAboutAxleKgM: number;
}

/**
 * Educational, static 2D beam model. Masses are shown as kg-equivalent reactions;
 * multiplying every value by g gives forces in newtons. The coupling and one axle
 * group are ideal point supports and longitudinal point loads do not move sideways.
 */
export function calculateStaticReactions(model: BeamModel): StaticReactions {
  const wheelbase = model.axleM - model.couplingM;
  if (!(wheelbase > 0)) throw new Error('Axeln måste ligga bakom kopplingen.');
  if (model.loads.some((load) => load.massKg < 0)) throw new Error('Massa kan inte vara negativ.');

  const totalMassKg = model.loads.reduce((sum, load) => sum + load.massKg, 0);
  const firstMoment = model.loads.reduce((sum, load) => sum + load.massKg * (load.positionM - model.couplingM), 0);
  const axleKg = firstMoment / wheelbase;
  const couplingKg = totalMassKg - axleKg;
  const centreOfMassM = totalMassKg === 0 ? null : model.couplingM + firstMoment / totalMassKg;

  return {
    totalMassKg,
    centreOfMassM,
    couplingKg,
    axleKg,
    momentAboutCouplingKgM: axleKg * wheelbase - firstMoment,
    momentAboutAxleKgM: couplingKg * wheelbase - model.loads.reduce(
      (sum, load) => sum + load.massKg * (model.axleM - load.positionM), 0),
  };
}

export type StabilityState = 'front-heavy' | 'balanced' | 'rear-heavy' | 'unsafe';

export interface ExerciseChecks {
  licencePass: boolean;
  technicalPass: boolean;
  stabilityPass: boolean;
  securementPass: boolean;
}

export function classifyStability(
  reactions: StaticReactions,
  plausibleCouplingRangeKg?: [number, number],
  couplingLimitKg?: number,
  axleLimitKg?: number,
): StabilityState {
  if (reactions.couplingKg <= 0 || (couplingLimitKg !== undefined && reactions.couplingKg > couplingLimitKg) ||
      (axleLimitKg !== undefined && reactions.axleKg > axleLimitKg)) return 'unsafe';
  if (!plausibleCouplingRangeKg) return reactions.couplingKg > 0 ? 'balanced' : 'rear-heavy';
  if (reactions.couplingKg < plausibleCouplingRangeKg[0]) return 'rear-heavy';
  if (reactions.couplingKg > plausibleCouplingRangeKg[1]) return 'front-heavy';
  return 'balanced';
}

export function exerciseOverallPass(checks: ExerciseChecks): boolean {
  return checks.licencePass && checks.technicalPass && checks.stabilityPass && checks.securementPass;
}
