import type { DataElement, ErrorMessage } from '@state/form-controls';
import { executingSimulationRunNumber, setSimulationRunStatus, simulationRuns, SimulationRunStatuses } from '@state/simulation-runs';
import type { WebR as WebRType } from 'webr';

type ParsedDataMessage = {
  dataElement: DataElement;
  remainingString: string;
}
type ParsedErrorMessage = {
  error: ErrorMessage;
  isError: true;
};

type ParsedMessage = ParsedDataMessage | ParsedErrorMessage;

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
  try {
    const parsedMessage = JSON.parse(jsonString) as unknown;
    if(!(parsedMessage && typeof parsedMessage === 'object')) {
      return null;
    }
    if ('error' in parsedMessage) {
      return {
        ...parsedMessage,
        isError: true,
      } as ParsedErrorMessage;
    }
    if(typeof (parsedMessage as DataElement).state['S'] !== 'number') {
      return {
        error: {
          simulation_id: (parsedMessage as DataElement).simulation_id,
          message: 'NA data element',
        },
        isError: true,
      } as ParsedErrorMessage;
    }

    if ('state' in parsedMessage) {
      return {
        dataElement: parsedMessage as DataElement,
        remainingString: inputString.substring(endIndex),
      } as ParsedDataMessage;
    }

    return null;
  } catch (e) {
    console.error('webREventReader - Error parsing JSON:', e);
    return null;
  }
};

export const readWebRDataElementsEvents = async (r: WebRType) => {

  for await (const item of r.stream()) {
    console.log('webREventReader - item=', item);
    if (item.type === 'stderr') {
      const parsedMessage = extractJsonObject(item.data) as ParsedErrorMessage;
      const resultKey = parsedMessage?.error.simulation_id;
      setSimulationRunStatus({
        simulationId: resultKey,
        status: SimulationRunStatuses.ERROR,
      });
      continue;
    }
    try {
      const parsedResult = extractJsonObject(item.data);
      if (!parsedResult) {
        continue;
      }
      if((parsedResult as ParsedErrorMessage).isError) {
        setSimulationRunStatus({
          simulationId: (parsedResult as ParsedErrorMessage).error.simulation_id,
          status: SimulationRunStatuses.ERROR,
        });
        continue;
      }
      const { dataElement } = parsedResult as ParsedDataMessage;
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
              status: dataElement.time < simulationRuns.value[executingSimulationRunNumber.value].formValues.timeEnd ?
                SimulationRunStatuses.IN_PROGRESS :
                SimulationRunStatuses.COMPLETED,
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
