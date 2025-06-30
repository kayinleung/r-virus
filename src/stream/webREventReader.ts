import type { DataElement } from '@state/form-controls';
import { executingSimulationRunNumber, simulationRuns } from '@state/simulation-runs';
import type { WebR as WebRType } from 'webr';

type ParsedMessage = {
  dataElement: DataElement;
  remainingString: string;
}

export const extractJsonObject = (inputString: string): ParsedMessage | null => {
  // Regex to match a 2-level deep JSON object: { ... { ... } ... }
  const regex = /\{[^{}]*\{[^{}]*\}[^{}]*\}/;
  const match = inputString.match(regex);
  if (!match) {
    return null;
  }
  const jsonString = match[0];
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;
  let dataElement: DataElement;
  try {
    dataElement = JSON.parse(jsonString) as DataElement;
  } catch (e) {
    console.error('webREventReader - Error parsing JSON:', e);
    return null;
  }
  return {
    dataElement,
    remainingString: inputString.substring(endIndex),
  };
};

export const readWebRDataElementsEvents = async (r: WebRType) => {

  r.flush();
  for await (const item of r.stream()) {
    if (item.type !== 'stdout') {
      console.log('webREventReader - item=', item);
      continue;
    }
    try {
      const parsedResult = extractJsonObject(item.data);
      if (!parsedResult) {
        continue;
      }
      const { dataElement } = parsedResult;
      r.flush();
      
      const resultKey = dataElement.simulation_id;
      const prevResults = simulationRuns.value[executingSimulationRunNumber.value].results[resultKey].data || [];
      simulationRuns.value = {
        ...simulationRuns.value,
        [executingSimulationRunNumber.value]: {
          ...simulationRuns.value[executingSimulationRunNumber.value],
          results: {
            ...simulationRuns.value[executingSimulationRunNumber.value].results,
            [resultKey]: {
              ...simulationRuns.value[executingSimulationRunNumber.value].results[resultKey],
              data: [...prevResults, dataElement],
            }
          }
        },
      };
    } catch (error) {
      console.error('webREventReader - Error parsing data element - error=', error);
      // continue;
    }
  }
};
