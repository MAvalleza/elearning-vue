import { describe, vi, it, expect, afterEach } from 'vitest';
import SubjectsWebservice from '../../src/webservices/subjectsWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('SubjectsWebservice', () => {
  const webservice = new SubjectsWebservice();

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

  it('should get subjects', async () => {
    const params = { some: 'param' };

    const result = await webservice.getSubjects(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'subjects',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create a subject', async () => {
    const params = { param1: 'value' }; // Adjust the parameters as needed

    const result = await webservice.createSubject(params);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'subjects' });
    expect(jsonSpy).toHaveBeenCalledWith(params);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should get a subject by id', async () => {
    const id = 'some_id';
    const params = { some: 'param' };

    const result = await webservice.getSubject({ id, params });

    expect(urlSpy).toHaveBeenCalledWith({ path: `subjects/${id}`, params });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a subject', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateSubject({ id, data });

    expect(urlSpy).toHaveBeenCalledWith({ path: `subjects/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should delete a subject', async () => {
    const id = 'some_id';

    const result = await webservice.deleteSubject(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `subjects/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
