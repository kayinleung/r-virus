import type { DataElement } from '@state/form-controls';
import { simulationId, simulationRuns } from '@state/simulation-runs';
import type { WebR as WebRType } from 'webr';

type BufferMap = Record<string, string>;

const bufferMap: BufferMap = {};

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
      continue;
    }
    const uuid = simulationId.value;
    bufferMap[uuid] += item.data ?? '';
    try {
      const parseResult = extractJsonObject(bufferMap[uuid]); 
      if (!parseResult) {
        continue;
      }
      const { dataElement, remainingString } = parseResult;
      bufferMap[uuid] = remainingString;
      r.flush();
      
      simulationRuns.value = {
        ...simulationRuns.value,
        [simulationId.value]: {
          ...simulationRuns.value[simulationId.value],
          results: [...(simulationRuns.value[simulationId.value].results ?? []), dataElement],
        },
      }
    } catch (e) {
      console.error('webREventReader - e=', e);
      bufferMap[uuid] = ""; // Reset bufferMap on error
      console.error('webREventReader - Error parsing data element, resetting buffer');
      continue;
    }
  }
};
