import { DataElement, DataElementR } from '@state/input-controls';
import { v4 as uuidv4 } from 'uuid';

import type { WebR as WebRType } from 'webr';

type ParsedMessage = {
  streamingId: string;
  dataElement: DataElement;
  remainingString: string;
}

const extractJsonObject = (inputString: string): ParsedMessage | null => {
  const regex = /\{[^}]*\}[^}]*\}/; // Matches { followed by any characters except }, until the second }
  const match = inputString.match(regex);

  if(!match) {
    return null; // No JSON object found
  }

  const jsonString = match[0];
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;

  return {
    streamingId: uuidv4(),
    dataElement: parseAndFlatten(jsonString),
    remainingString: inputString.substring(endIndex),
  };
};

export const readWebRDataElementsEvents = async function*(r: WebRType): AsyncGenerator<DataElement, void, unknown> {
  let buffer = "";
  for (;;) {
    const item = await r.read();
    if (item.type !== 'stdout') {
      continue;
    }
    buffer += item.data;
    const parseResult = extractJsonObject(buffer);
    if (!parseResult) {
      continue;
    }
    const { dataElement, remainingString } = parseResult;
    buffer = remainingString;
    // console.log('webREventReader - buffer=', buffer);
    yield {
      ...dataElement,
    };
  }
}

const parseAndFlatten = (jsonString: string): DataElement => {
  const parsed = JSON.parse(jsonString) as DataElementR;
  const flattened = {
    time: parsed.time[0],
    state: Object.fromEntries(
      Object.entries(parsed.state).map(([key, value]) => {
        const numberValue = value[0];
        return [key, Math.max(numberValue, 0)];
      })
    )
  } as DataElement;

  return flattened;
}