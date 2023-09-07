import { describe, vi, it, expect, afterAll } from 'vitest';
import ModulesWebservice from '../../src/webservices/modulesWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('ModulesWebservice', () => {
  const webservice = new ModulesWebservice();

  afterAll(() => {
    vi.resetAllMocks();
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

  it('should get modules', async () => {
    const params = { some: 'param' };

    const result = await webservice.getModules(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'modules',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create a module', async () => {
    const params = { param1: 'value' }; // Adjust the parameters as needed

    const result = await webservice.createModule(params);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'modules' });
    expect(jsonSpy).toHaveBeenCalledWith(params);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should get a module by id', async () => {
    const id = 'some_id';
    const params = { some: 'param' };

    const result = await webservice.getModule({ id, params });

    expect(urlSpy).toHaveBeenCalledWith({ path: `modules/${id}`, params });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a module', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateModule(id, data);

    expect(urlSpy).toHaveBeenCalledWith({ path: `modules/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should delete a module', async () => {
    const id = 'some_id';

    const result = await webservice.deleteModule(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `modules/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
