import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useAuth } from '../../src/stores/auth';
import AuthWebservice from '../../src/webservices/authWebservice';

const mockSnack = vi.fn();
vi.mock('../../src/stores/ui', () => {
  let _cache: {
    showSnackbar: () => void,
    setLoading: () => void,
  };
  const useUI = () => {
    if (!_cache) {
      _cache = {
        showSnackbar: mockSnack,
        setLoading: vi.fn(),
      }
    }

    return _cache;
  }
  return { useUI };
});

// Local storage mock
const mockLocalStorage = {
  setItem: vi.fn(),
  removeItem: vi.fn(),
  getItem: vi.fn(() => 'some_token'),
};
Storage.prototype.setItem = mockLocalStorage.setItem;
Storage.prototype.removeItem = mockLocalStorage.removeItem;
Storage.prototype.getItem = mockLocalStorage.getItem;

describe('useAuth', () => {
  let authStore;
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    setActivePinia(createPinia());

    authStore = useAuth();
    authStore.$router = mockRouter;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register user', async () => {
    const data = {
      email: 'some_email',
      password: 'some_pass',
    };
    const mockResponse = { id: 'some_id' };

    const signUpSpy = vi.spyOn(AuthWebservice.prototype, 'signUpUser');
    signUpSpy.mockResolvedValue(mockResponse);

    await authStore.registerUser(data);

    expect(signUpSpy).toHaveBeenCalledWith(data);
  });

  it('should login user', async () => {
    const data = {
      email: 'some_email',
      password: 'some_pass',
    };
    const mockResponse = { id: 'some_id' };

    const loginSpy = vi.spyOn(AuthWebservice.prototype, 'loginUser');
    loginSpy.mockResolvedValue(mockResponse);

    await authStore.loginUser(data);

    expect(authStore.currentUser).toEqual(mockResponse);
  });

  it('should logout user', async () => {
    const data = {
      email: 'some_email',
      password: 'some_password'
    };
    const mockCurrentUser = { id: 'some_id' };

    vi.spyOn(AuthWebservice.prototype, 'loginUser').mockResolvedValue(mockCurrentUser);
    
    await authStore.loginUser(data);
    
    const logoutSpy = vi.spyOn(AuthWebservice.prototype, 'logoutUser').mockResolvedValue();
    await authStore.logoutUser();

    expect(logoutSpy).toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });

  it('should request to reset password', async () => {
    const data = { some: 'data' };
    const mockResponse = { some: 'response' };

    const requestSpy = vi.spyOn(AuthWebservice.prototype, 'requestResetPassword');
    requestSpy.mockResolvedValue(mockResponse);

    await authStore.requestResetPassword(data);

    expect(requestSpy).toHaveBeenCalledWith(data);
  });

  it('should reset password', async () => {
    const data = { password: 'data' };
    const token = 'some_token';
    const mockResponse = { some: 'response' };

    const resetSpy = vi.spyOn(AuthWebservice.prototype, 'resetPassword');
    resetSpy.mockResolvedValue(mockResponse);

    await authStore.resetPassword(data, token);

    expect(resetSpy).toHaveBeenCalledWith({ password: data.password}, token);
    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Password reset successful.',
    });
  });

  it('should activate account', async () => {
    const token = 'some_token';
    const mockResponse = { some: 'response' };

    const activateSpy = vi.spyOn(AuthWebservice.prototype, 'activateAccount');
    activateSpy.mockResolvedValue(mockResponse);

    await authStore.activateAccount(token);

    expect(activateSpy).toHaveBeenCalledWith({ token });
  });

  it('resend verification', async () => {
    const data = { email: 'some_email' };
    const mockResponse = { some: 'response' };

    const resendSpy = vi.spyOn(AuthWebservice.prototype, 'createVerification');
    resendSpy.mockResolvedValue(mockResponse);

    await authStore.resendVerification(data);

    expect(resendSpy).toHaveBeenCalledWith(data);
  });

  it('should validate session', async () => {
    const mockResponse = { some: 'response' };

    const validateSpy = vi.spyOn(AuthWebservice.prototype, 'validateSession');
    validateSpy.mockResolvedValue(mockResponse);

    await authStore.validateSession();

    expect(validateSpy).toHaveBeenCalled();
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });
});