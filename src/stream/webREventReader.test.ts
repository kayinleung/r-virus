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
    const input = 'prefix {"state": {"foo":"bar"}} suffix';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { foo: 'bar' }});
    expect(result?.remainingString).toBe(' suffix');
  });

  it('extracts only the first JSON object if multiple are present', () => {
    const input = '{"state": {"a":1}},{"state": {"b":2}}';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { a: 1 }});
    expect(result?.remainingString).toBe(',{"state": {"b":2}}');
  });

  it('can parse partial into remainingString', () => {
    const input = '{"state": {"a":1}}, {"state": {"b';
    const result = extractJsonObject(input);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { a: 1 }});
    const nextInput = `${result?.remainingString}":2}}{`;
    const nextResult = extractJsonObject(nextInput);
    expect(nextResult?.dataElement).toEqual({state:{ b: 2 }});
    expect(nextResult?.remainingString).toBe('{');
  });


  it('can parse objects if they have leading non-json chars', () => {
    const input = ' {"state": {"foo":"bar"}}';
    const result = extractJsonObject(input);
    console.log('webREventReader.test - result=', result);
    expect(result).not.toBeNull();
    expect(result?.dataElement).toEqual({state: { foo: 'bar' }});
  });

  it('does not throws if JSON is malformed', () => {
    const input = '{foo:bar}';
    expect(() => extractJsonObject(input)).not.toThrow();
  });
});
