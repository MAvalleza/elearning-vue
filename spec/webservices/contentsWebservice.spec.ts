import { describe, vi, it, expect, afterEach } from 'vitest';
import ContentsWebservice from '../../src/webservices/contentsWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('ContentsWebservice', () => {
  const webservice = new ContentsWebservice();

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Fetch mock
  const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve(<Response>{
      json: () => Promise.resolve(resolvedResponse),
    })
  );

  // Headers mock
  const headersSpy = vi.spyOn(webservice, 'requestHeaders');
  headersSpy.mockReturnValue(mockHeaders);

  // Parse URL mock
  const urlSpy = vi.spyOn(webservice, 'parseURL');
  urlSpy.mockReturnValue(mockURL);

  // JSON mock
  const jsonSpy = vi.spyOn(JSON, 'stringify');
  jsonSpy.mockReturnValue(mockJSONStringified);

  it('should get contents', async () => {
    const params = { some: 'param' };

    const result = await webservice.getContents(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'contents',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create a content', async () => {
    const params = { param1: 'value' }; // Adjust the parameters as needed

    const result = await webservice.createContent(params);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'contents' });
    expect(jsonSpy).toHaveBeenCalledWith(params);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a content', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateContent(id, data);

    expect(urlSpy).toHaveBeenCalledWith({ path: `contents/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
