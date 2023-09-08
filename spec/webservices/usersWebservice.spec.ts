import { describe, vi, it, expect, afterEach } from 'vitest';
import UsersWebservice from '../../src/webservices/usersWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('UsersWebservice', () => {
  const webservice = new UsersWebservice();

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

  it('should get users', async () => {
    const params = { some: 'param' };

    const result = await webservice.getUsers(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'users',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should get a user by id', async () => {
    const id = 'some_id';

    const result = await webservice.getUser(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `users/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a user', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateUser({ id, data });

    expect(urlSpy).toHaveBeenCalledWith({ path: `users/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should delete a user', async () => {
    const id = 'some_id';

    const result = await webservice.deleteUser(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `users/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
