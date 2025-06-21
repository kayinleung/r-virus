import { ModelType } from '@state/chart';
import type { DataElement } from '@state/form-controls';
import { simulationId, simulationRuns } from '@state/simulation-runs';
import type { WebR as WebRType } from 'webr';

type BufferMap = Record<string, string>;


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

export const readWebRDataElementsEvents = async (r: WebRType, modelType: ModelType) => {
  const bufferMap: BufferMap = {};

  const bufferKey = `${simulationId.value}-${modelType}`;
  // Ensure bufferMap[bufferKey] is initialized as an empty string if undefined
  if (typeof bufferMap[bufferKey] !== 'string') {
    bufferMap[bufferKey] = '';
  }
  r.flush();
  for await (const item of r.stream()) {
    if (item.type !== 'stdout') {
      continue;
    }
    bufferMap[bufferKey] += item.data ?? '';
    try {
      const parsedResult = extractJsonObject(bufferMap[bufferKey]);
      console.log('webREventReader - parsedResult=', parsedResult);
      if (!parsedResult) {
        continue;
      }
      const { dataElement, remainingString } = parsedResult;
      bufferMap[bufferKey] = remainingString;
      r.flush();
      
      const resultKey = simulationId.value;
      console.log('webREventReader - dataElement, modelType=', dataElement, modelType);
      const prevResults = simulationRuns.value[resultKey].results ?? {
        model_network: [],
        model_reference: []
      };
      simulationRuns.value = {
        ...simulationRuns.value,
        [resultKey]: {
          ...simulationRuns.value[resultKey],
          results: {
            ...prevResults,
            [modelType]: [
              ...(prevResults[modelType] ?? []),
              dataElement
            ],
          }
        },
      }
      // console.log('webREventReader - Updated simulationRuns:', simulationRuns.value);
    } catch (e) {
      console.error('webREventReader - e=', e);
      bufferMap[bufferKey] = ""; // Reset bufferMap on error
      console.error('webREventReader - Error parsing data element. Buffer has been reset');
      continue;
    }
  }
};
