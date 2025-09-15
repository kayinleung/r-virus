import { computed, signal } from "@preact/signals-react";
import type { ModelType } from "./chart";

export const MIN_INDEX = 0;
export const MAX_INDEX = 1;

const archetypes = {
  '1': { value: 1, label: 'CCHFV, ZIKV', corollaries: {
    reproductionNumber: {
      default: 0.37,
      range: [0, 0.39],
    },
    serialInterval: {
      default: 5.03,
      range: [3.85, 23.66],
    },
  } },
  '2': { value: 2, label: 'COVID-19, Alpha, Delta, Omicron', corollaries: {
    reproductionNumber: {
      default: 5.33,
      range: [3.58, 11.13],
    },
    serialInterval: {
      default: 3.42,
      range: [2.78, 4.19],
    }
  } },
  // TODO: JFisher
  // '3': { value: 2, label: 'user', corollaries: {} },
} as const;


type ArchetypeOptionKeys = keyof typeof archetypes;

const DEFAULT_ARCHETYPE: ArchetypeOptionKeys = '2';

export const archetypeOptions = Object.values(archetypes).map(model => model.label);

export type ArchetypeOption = typeof archetypeOptions[number];

export type NumberKeys = 'populationSize' | 'seedInfected' | 'mu' | 'dispersion' | 'serialInterval' | 'reproductionNumber';

export type FormValues = {
  archetype: ArchetypeOption;
  populationSize: number;
  modelType: ModelType;
  degreeDistribution: string;
  infection: string;
  increment: number;
  seedInfected: number;
  mu: number;
  dispersion: number;
  serialInterval: number;
  reproductionNumber: number;
};

export type DataElement = {
  simulation_id: string;
  model_type: ModelType;
  time: number;
  state: {
    S: number;
    E: number;
    I: number;
    R: number;
    incidence: number;
  };
};

export type DataElementError = {
  model_type: ModelType;
};

export type ErrorMessage = {
  simulation_id: string;
  message?: string;
};

export const currentForm = signal<FormValues>({
  archetype: 'COVID-19, Alpha, Delta, Omicron',
  populationSize: 1e2,
  modelType: 'model_reference',
  degreeDistribution: 'poisson',
  infection: 'SEIR',
  increment: 0.5,
  seedInfected: 1e-3,
  mu: 5.4,
  dispersion: 10,
  serialInterval: archetypes[DEFAULT_ARCHETYPE].corollaries.serialInterval.default,
  reproductionNumber: archetypes[DEFAULT_ARCHETYPE].corollaries.reproductionNumber.default,
});

// Helper function to find an archetype by its label
const findArchetypeByLabel = (label: ArchetypeOption) => {
  return Object.values(archetypes).find(archetype => archetype.label === label);
};

// Create a wrapper around currentForm to handle archetype changes
export const updateArchetypeCorollaries = (archetypeLabel: ArchetypeOption) => {
  const archetype = findArchetypeByLabel(archetypeLabel);
  if (!archetype) return;
  
  // Update all relevant values based on the selected archetype
  currentForm.value = {
    ...currentForm.value,
    archetype: archetypeLabel,
  };
  // TODO: JFisher
  // if(archetype.corollaries?.reproductionNumber !== undefined) {
  //   currentForm.value = {
  //     ...currentForm.value,
  //     reproductionNumber: archetype.corollaries?.reproductionNumber?.default,
  //   }
};

export const archetypeCorollaries = computed(() => {
  const archetype = findArchetypeByLabel(currentForm.value.archetype);
  return archetype?.corollaries ?? archetypes[DEFAULT_ARCHETYPE].corollaries;
});