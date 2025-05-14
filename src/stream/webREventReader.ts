import type { DataElement } from '@state/form-controls';
import { v4 as uuidv4 } from 'uuid';

import type { WebR as WebRType } from 'webr';


type ParsedMessage = {
  streamingId: string;
  dataElement: DataElement;
  remainingString: string;
}

const extractJsonObject = (inputString: string): ParsedMessage | null => {
  const regex = /\{[^}]*\}/; // Matches { followed by any characters except }
  const match = inputString.match(regex);

  if(!match) {
    return null; // No JSON object found
  }

  const jsonString = match[0];
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;

  return {
    streamingId: uuidv4(),
    dataElement: JSON.parse(jsonString) as DataElement, //parseAndFlatten(jsonString),
    remainingString: inputString.substring(endIndex),
  };
};

export const readWebRDataElementsEvents = async function*(r: WebRType): AsyncGenerator<DataElement, void, unknown> {
  let buffer = "";
  r.flush();
  for (;;) {
    r.flush();
    const item = await r.read();
    if (item.type !== 'stdout') {
      continue;
    }
    buffer += item.data;
    try {
      const parseResult = extractJsonObject(buffer); 
      if (!parseResult) {
        continue;
      }
      const { dataElement, remainingString } = parseResult;
      buffer = remainingString;
      r.flush();
      yield {
        ...dataElement,
      };
    } catch {
      continue;
    }
  }
};
