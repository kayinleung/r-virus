import { describe, it, expect } from 'vitest';
import { extractJsonObject } from '../../src/stream/webREventReader';
import { WebR } from 'webr';
import { DataElement } from '@state/form-controls';

describe('extractJsonObject', () => {
  it('returns null if no JSON object is found', () => {
    const input = 'no json here';
    expect(extractJsonObject(input)).toBeNull();
  });

  it('extracts a JSON object and remaining string', () => {
    // Mock uuid to return a fixed value
    const input = 'prefix {"foo":"bar"} suffix';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({ foo: 'bar' });
    expect(result?.remainingString).toBe(' suffix');
  });

  it('extracts only the first JSON object if multiple are present', () => {
    const input = '{"a":1}{"b":2}';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({ a: 1 });
    expect(result?.remainingString).toBe('{"b":2}');
  });

  it('can parse partial into remainingString', () => {
    const input = '{"a":1}{"b';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({ a: 1 });
    const nextInput = `${result?.remainingString}":2}{`;
    console.log('webREventReader.test - nextInput=', nextInput);
    const nextResult = extractJsonObject(nextInput);
    expect(nextResult?.dataElement).toEqual({ b: 2 });
    expect(nextResult?.remainingString).toBe('{');
  });

  it('throws if JSON is malformed', () => {
    const input = '{foo:bar}';
    expect(() => extractJsonObject(input)).toThrow();
  });
});

describe('readWebRDataElementsEvents', () => {
  function createMockWebR(stdoutItems: string[]) {
    let callCount = 0;
    return {
      flush: () => {},
      read: async () => {
        if (callCount < stdoutItems.length) {
          return { type: 'stdout', data: stdoutItems[callCount++] };
        }
        return { type: 'done', data: '' };
      },
    };
  }

  it('yields parsed DataElement objects from stdout', async () => {
    const { readWebRDataElementsEvents } = await import('./webREventReader');
    const data1: DataElement = { time: 0, S: 1, E: 1, I: 1, R: 0 };
    const json1 = JSON.stringify(data1);
    const mockWebR = createMockWebR([ json1 ]);
    const gen = readWebRDataElementsEvents(mockWebR as WebR);

    for await (const item of gen) {
      expect(item).toEqual(data1);
      break;
    }
  });
});
