import { describe, it, expect } from 'vitest';
import { extractJsonObject, ParsedDataMessage } from '../../src/stream/webREventReader';

describe('extractJsonObject', () => {
  it('returns null if no JSON object is found', () => {
    const input = 'no json here';
    expect(extractJsonObject(input)).toBeNull();
  });

  it('extracts a JSON object', () => {
    // Mock uuid to return a fixed value
    const input = '{"state": {"S": 8}}';
    const result = extractJsonObject(input) as ParsedDataMessage;
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { S: 8 }});
  });

  it('extracts only the first JSON object if multiple are present', () => {
    const input = '{"state": {"S":1}},{"state": {"S":2}}';
    const result = extractJsonObject(input) as ParsedDataMessage;
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { S: 1 }});
    expect(result?.remainingString).toBe(',{"state": {"S":2}}');
  });

  it('can parse objects if they have leading whitespace', () => {
    const input = ' {"state": {"S": 5}}';
    const result = extractJsonObject(input) as ParsedDataMessage;
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { S: 5 }});
  });

  it('does not throws if JSON is malformed', () => {
    const input = '{foo:bar}';
    expect(() => extractJsonObject(input)).not.toThrow();
  });
});
