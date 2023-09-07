import { describe, vi, it, expect, afterEach } from 'vitest';
import AuthWebservice from '../../src/webservices/authWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('AuthWebservice', () => {
  const webservice = new AuthWebservice();

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

  it('should sign up user', async () => {
    const data = { some: 'param' };

    const result = await webservice.signUpUser(data);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'signup' });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(jsonSpy).toHaveBeenCalledWith(data);

    expect(result).toEqual(resolvedResponse);
  });

  it('should login user', async () => {
    const data = { email: 'some_test', password: 'pass' };

    const result = await webservice.loginUser(data);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'login' });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(jsonSpy).toHaveBeenCalledWith(data);

    expect(result).toEqual(resolvedResponse);
  });

  it('should logout user', async () => {
    await webservice.logoutUser();

    expect(urlSpy).toHaveBeenCalledWith({ path: 'logout' });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });
  });

  it('should request for reset password', async () => {
    const data = { some: 'request' };

    const result = await webservice.requestResetPassword(data);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'password', params: data });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should reset password', async () => {
    const data = { password: 'some_password' };
    const resetToken = 'some_reset_token';

    const result = await webservice.resetPassword(data, resetToken);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'password' });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: {
        ...mockHeaders,
        Authorization: `Bearer ${resetToken}`,
      },
      body: mockJSONStringified,
    });

    expect(jsonSpy).toHaveBeenCalledWith(data);

    expect(result).toEqual(resolvedResponse);
  });

  it('should activate account', async () => {
    const params = { token: 'some_token' };

    const result = await webservice.activateAccount(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'signup/verification',
      params,
    });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create verification', async () => {
    const data = { email: 'some_email' };

    const result = await webservice.createVerification(data);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'signup/verification' });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(jsonSpy).toHaveBeenCalledWith(data);

    expect(result).toEqual(resolvedResponse);
  });

  it('should validate session', async () => {
    const result = await webservice.validateSession();

    expect(urlSpy).toHaveBeenCalledWith({ path: 'validate-session' });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
