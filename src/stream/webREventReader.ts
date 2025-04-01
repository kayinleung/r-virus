import { v4 as uuidv4 } from 'uuid';
import type { WebR as WebRType } from 'webr';

export type DataElement = {
  streamingId: string;
  time: number;
  new_cases: number;
  recovered: number;
};

type ParsedMessage = {
  streamingId: string;
  dataElement: DataElement;
  remainingString: string;
}

const extractJsonObject = (inputString: string): ParsedMessage | null => {
  const regex = /\{[^}]*\}/; // Matches { followed by any characters except }, until the first }
  const match = inputString.match(regex);

  if(!match) {
    return null; // No JSON object found
  }

  const jsonString = match[0];
  const startIndex = inputString.indexOf(jsonString);
  const endIndex = startIndex + jsonString.length;

  return {
    streamingId: uuidv4(),
    dataElement: JSON.parse(jsonString) as DataElement,
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
    yield {
      ...dataElement,
      streamingId: parseResult.streamingId,
    };
  }
}


export const readWebREvents = async function*(r: WebRType): AsyncGenerator<string, void, unknown> {
  for (;;) {
    const item = await r.read();
    // if (item.type !== 'stdout') {
    //   continue;
    // }
    console.log('webREventReader - item.data=', item.data);
    yield item.data;
  }
}