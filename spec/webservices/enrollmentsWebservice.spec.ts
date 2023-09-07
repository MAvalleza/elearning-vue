import { describe, vi, it, expect, afterEach } from 'vitest';
import EnrollmentsWebservice from '../../src/webservices/enrollmentsWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('EnrollmentsWebservice', () => {
  const webservice = new EnrollmentsWebservice();

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

  it('should get enrollments', async () => {
    const params = { some: 'param' };

    const result = await webservice.getEnrollments(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'enrollments',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create a enrollment', async () => {
    const params = { param1: 'value' }; // Adjust the parameters as needed

    const result = await webservice.createEnrollment(params);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'enrollments' });
    expect(jsonSpy).toHaveBeenCalledWith(params);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should get a enrollment by id', async () => {
    const id = 'some_id';
    const params = { some: 'param' };

    const result = await webservice.getEnrollment({ id, params });

    expect(urlSpy).toHaveBeenCalledWith({ path: `enrollments/${id}`, params });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a enrollment', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateEnrollment(id, data);

    expect(urlSpy).toHaveBeenCalledWith({ path: `enrollments/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should delete a enrollment', async () => {
    const id = 'some_id';

    const result = await webservice.deleteEnrollment(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `enrollments/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
