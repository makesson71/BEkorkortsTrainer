import { describe, expect, it } from 'vitest';
import { concepts, conceptById, importantConceptIds, VALID_REGISTRATION_FIELDS, WEIGHT_LAB_CONCEPT_IDS } from '../src/data/concepts';
import { conceptDrills } from '../src/data/conceptDrills';
import { confusionPairs } from '../src/data/confusionPairs';
import { certificateExercises, carTrainingCertificate, trailerTrainingCertificate } from '../src/data/certificateExercises';
import { licenceScenarios } from '../src/data/licenceScenarios';
import { questions } from '../src/data/questions';
import { sourceById } from '../src/data/sources';
import {
  combinedGrossKg,
  combinedRegisteredTotalKg,
  formatKg,
  grossFromServiceAndLoadKg,
  loadState,
  registeredMaxlastKg,
  whatStopsCombination,
} from '../src/domain/conceptMath';
import { evaluateCombination } from '../src/domain/weights';

describe('weight concept formulas', () => {
  it('uses tjänstevikt + maxlast = totalvikt', () => {
    expect(registeredMaxlastKg(700, 2000)).toBe(1300);
    expect(700 + registeredMaxlastKg(700, 2000)).toBe(2000);
  });

  it('computes gross from tjänstevikt + current load', () => {
    expect(grossFromServiceAndLoadKg(700, 900)).toBe(1600);
  });

  it('treats load equal to maxlast as on the total-weight limit', () => {
    const maxlast = registeredMaxlastKg(700, 2000);
    expect(loadState(grossFromServiceAndLoadKg(700, maxlast), 2000)).toBe('at-limit');
  });

  it('flags load over maxlast as overweight', () => {
    expect(loadState(grossFromServiceAndLoadKg(700, 1301), 2000)).toBe('over-total');
  });

  it('keeps zero load at tjänstevikt', () => {
    expect(grossFromServiceAndLoadKg(700, 0)).toBe(700);
    expect(loadState(700, 2000)).toBe('ok');
  });

  it('keeps boundary values inclusive', () => {
    expect(loadState(2000, 2000)).toBe('at-limit');
    expect(loadState(1999, 2000)).toBe('ok');
    expect(loadState(2001, 2000)).toBe('over-total');
  });

  it('adds combination weights without mixing total and gross', () => {
    expect(combinedRegisteredTotalKg(2450, 2000)).toBe(4450);
    expect(combinedGrossKg(2200, 1600)).toBe(3800);
  });

  it('names what stops a combination', () => {
    expect(whatStopsCombination(true, false)).toBe('technical');
    expect(whatStopsCombination(false, true)).toBe('licence');
    expect(whatStopsCombination(false, false)).toBe('both');
    expect(whatStopsCombination(true, true)).toBe('none');
  });

  it('formats kg with a Swedish separator', () => {
    expect(formatKg(1600)).toMatch(/1[\s\u00a0]?600 kg/);
  });
});

describe('concept data', () => {
  it('has unique concept ids', () => {
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(concepts.length);
  });

  it('resolves related and do-not-confuse ids', () => {
    for (const concept of concepts) {
      for (const id of [...concept.relatedConceptIds, ...concept.doNotConfuseWith]) {
        expect(conceptById[id], `${concept.id} -> ${id}`).toBeTruthy();
      }
    }
  });

  it('resolves source ids and keeps explanations for important concepts', () => {
    for (const concept of concepts) {
      expect(concept.sourceIds.length).toBeGreaterThan(0);
      for (const id of concept.sourceIds) expect(sourceById[id], `${concept.id} -> ${id}`).toBeTruthy();
      if (concept.importantForBE) {
        expect(concept.shortDefinition.trim().length).toBeGreaterThan(10);
        expect(concept.fullExplanation.trim().length).toBeGreaterThan(40);
        expect(concept.example.trim().length).toBeGreaterThan(10);
      }
    }
  });

  it('only uses known registration-certificate fields', () => {
    const allowed = new Set<string>(VALID_REGISTRATION_FIELDS);
    for (const concept of concepts) {
      if (concept.registrationCertificateField) expect(allowed.has(concept.registrationCertificateField)).toBe(true);
    }
  });

  it('does not present nettovikt or egenvikt as official vehicle-weight fields', () => {
    expect(conceptById.nettovikt.officialTerm).toBe(false);
    expect(conceptById.egenvikt.officialTerm).toBe(false);
    expect(conceptById.tjanstevikt.officialTerm).toBe(true);
    expect(conceptById.totalvikt.officialTerm).toBe(true);
    expect(conceptById.bruttovikt.officialTerm).toBe(true);
  });

  it('covers the core BE weight terms', () => {
    const required = ['tjanstevikt', 'totalvikt', 'maxlast', 'bruttovikt', 'sammanlagd-bruttovikt', 'tagvikt', 'maximal-tagvikt', 'f3', 'maximal-slapvagnsvikt', 'o1', 'o2', 'axeltryck', 'boggitryck', 'trippelaxeltryck', 'kultryck', 'slapvagn', 'slapkarra', 'efterfordon', 'bromsad-slapvagn', 'obromsad-slapvagn', 'latt-slap', 'tungt-slap', 'dragfordon', 'fordonskombination', 'fordonstag', 'ledad-dragstang', 'paskjutsbroms', 'katastrofbromsvajer', 'behorighet-b', 'utokad-b', 'behorighet-be', 'korkort-vs-teknik'];
    for (const id of required) expect(conceptById[id], id).toBeTruthy();
    expect(importantConceptIds.length).toBeGreaterThan(15);
  });
});

describe('drills, confusion pairs and certificate exercises', () => {
  const items = [
    ...conceptDrills,
    ...confusionPairs.map((pair) => ({
      id: pair.id,
      choices: pair.quizChoices,
      correctIndex: pair.quizCorrectIndex,
      sourceIds: pair.sourceIds,
    })),
    ...questions.map((question) => ({ id: question.id, choices: question.choices, correctIndex: question.correctIndex, sourceIds: question.sourceIds })),
  ];

  it('has at least 12 concept drills with valid answers', () => {
    expect(conceptDrills.length).toBeGreaterThanOrEqual(12);
    expect(new Set(conceptDrills.map((drill) => drill.id)).size).toBe(conceptDrills.length);
    for (const drill of conceptDrills) {
      expect(conceptById[drill.conceptId]).toBeTruthy();
      expect(drill.correctIndex).toBeGreaterThanOrEqual(0);
      expect(drill.correctIndex).toBeLessThan(drill.choices.length);
      expect(new Set(drill.choices).size).toBe(drill.choices.length);
      for (const id of drill.sourceIds) expect(sourceById[id]).toBeTruthy();
    }
  });

  it('keeps unique ids, sources and non-duplicate choices', () => {
    for (const item of items) {
      expect(item.sourceIds.length).toBeGreaterThan(0);
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(item.choices.length);
      expect(new Set(item.choices).size, item.id).toBe(item.choices.length);
    }
  });

  it('maps certificate targets to fields on the training cards', () => {
    const carCodes = new Set(carTrainingCertificate.fields.map((field) => field.code));
    const trailerCodes = new Set(trailerTrainingCertificate.fields.map((field) => field.code));
    expect(certificateExercises.length).toBeGreaterThanOrEqual(3);
    for (const exercise of certificateExercises) {
      const pool = exercise.card === 'trailer' ? trailerCodes : carCodes;
      expect(pool.has(exercise.targetField), exercise.id).toBe(true);
      for (const id of exercise.sourceIds) expect(sourceById[id]).toBeTruthy();
    }
  });

  it('resolves confusion pair concept ids', () => {
    expect(confusionPairs).toHaveLength(7);
    for (const pair of confusionPairs) {
      expect(conceptById[pair.conceptIdA]).toBeTruthy();
      expect(conceptById[pair.conceptIdB]).toBeTruthy();
    }
  });
});

describe('Weight Lab and licence-scenario integration', () => {
  it('maps Weight Lab help links to the matching concepts', () => {
    expect(WEIGHT_LAB_CONCEPT_IDS.o1).toBe('o1');
    expect(WEIGHT_LAB_CONCEPT_IDS.f3).toBe('f3');
    expect(conceptById[WEIGHT_LAB_CONCEPT_IDS.o1].registrationCertificateField).toBe('O.1');
    expect(conceptById[WEIGHT_LAB_CONCEPT_IDS.f3].registrationCertificateField).toBe('F.3');
    expect(conceptById[WEIGHT_LAB_CONCEPT_IDS.totalvikt].id).toBe('totalvikt');
    expect(conceptById[WEIGHT_LAB_CONCEPT_IDS.bruttovikt].id).toBe('bruttovikt');
  });

  it('keeps licence examples aligned with evaluateCombination', () => {
    for (const scenario of licenceScenarios) {
      const result = evaluateCombination(scenario.input);
      const b = result.find((item) => item.licence === 'B')!;
      const be = result.find((item) => item.licence === 'BE')!;
      const licenceAllowed = scenario.id === 'scenario-a' ? be.licenceAllowed : b.licenceAllowed;
      expect(whatStopsCombination(licenceAllowed, be.technicalAllowed)).toBe(scenario.expectedStopper);
    }
  });

  it('adds at least 15 sourced concept-lab questions', () => {
    const labQuestions = questions.filter((question) => question.conceptLab);
    expect(labQuestions.length).toBeGreaterThanOrEqual(15);
    for (const question of labQuestions) {
      expect(question.sourceIds.length).toBeGreaterThan(0);
      for (const id of question.sourceIds) expect(sourceById[id]).toBeTruthy();
    }
  });
});
