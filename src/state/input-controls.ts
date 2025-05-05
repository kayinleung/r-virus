import { computed, signal } from "@preact/signals-react";
import { v4 as uuidv4 } from "uuid";

export type DataElementR = {
  time: number[];
  state: {
    S: number[],
    E: number[],
    I: number[],
    R: number[]
  };
};
export type DataElement = {
  time: number;
  state: {
    S: number,
    E: number,
    I: number,
    R: number
  };
};
export type SimulationRun = {
  id: string;
}
export const simulationRuns = signal<SimulationRun[]>([{
  id: uuidv4()
}])
export const population = signal(10);
export const dataSignal = signal<DataElement[]>([]);
export const simulationId = computed(() => {
  return simulationRuns.value[simulationRuns.value.length - 1].id;
});