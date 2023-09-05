import { describe, vi, afterEach, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import Webservice from '../../src/webservices/base';

// Mock functions
const mockToken = faker.database.mongodbObjectId();

const mocks = vi.hoisted(() => ({
  localStorageGet: vi.fn(() => mockToken),
}));

// Local storage mock
Storage.prototype.getItem = mocks.localStorageGet;

// Env mock
const mockURL = 'some_url';
vi.stubEnv('VITE_API_NAMESPACE', mockURL);

// Describe a test suite for the Webservice class
describe('Webservice', () => {
  const webservice = new Webservice();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should construct with the correct apiNamespace', () => {
    expect(webservice.apiNamespace).toBe(mockURL);
  });

  it('should return request headers with Authorization token', () => {
    const headers = webservice.requestHeaders();

    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mockToken}`,
    });
  });

  it('should parse params into a query string', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    };

    const queryString = webservice.parseParams(params);

    expect(queryString).toBe('?key1=value1&key2=value2');
  });

  it('should parse URL with path and optional params', () => {
    const url = webservice.parseURL({
      path: 'endpoint',
      params: {
        key1: 'value1',
        key2: 'value2',
      },
    });

    expect(url).toBe(`${mockURL}/endpoint?key1=value1&key2=value2`);
  });

  it('should parse URL with path and no params', () => {
    const url = webservice.parseURL({
      path: 'endpoint',
    });

    expect(url).toBe(`${mockURL}/endpoint`);
  });
});