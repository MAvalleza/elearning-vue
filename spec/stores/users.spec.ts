import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useUsers } from '../../src/stores/users'; // Import your store module
import UsersWebservice from '../../src/webservices/usersWebservice';
import testTableActions from './shared/table-actions';

vi.mock('../../src/stores/ui', () => {
  let _cache: {
    showSnackbar: () => void
  };
  const useUI = () => {
    if (!_cache) {
      _cache = {
        showSnackbar: mockSnack,
      }
    }

    return _cache;
  }
  return { useUI };
});

const mockSnack = vi.fn();

describe('useUsers', () => {
  let usersStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    usersStore = useUsers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch users', async () => {
    const mockUsers = [{ id: 1 }];

    const mockResponse = {
      data: mockUsers,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(UsersWebservice.prototype, 'getUsers');
    fetchSpy.mockResolvedValue(mockResponse);

    const result = await usersStore.fetchUsers(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(usersStore.users).toEqual(mockUsers);
    expect(usersStore.usersTotal).toBe(1);
    expect(usersStore.usersCurrentPage).toBe(1);

    expect(result).toEqual(mockUsers);
  }); 

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };
    
    const fetchSpy = vi.spyOn(UsersWebservice.prototype, 'getUsers');
    fetchSpy.mockResolvedValue(mockResponse);
  
    await usersStore.fetchUsers({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    })
  });

  it('should fetch specific user', async () => {
    const userId = 'some_id';
    const mockResponse = {
      id: userId
    };

    const getSpy = vi.spyOn(UsersWebservice.prototype, 'getUser');
    getSpy.mockResolvedValue(mockResponse);

    await usersStore.fetchUser(userId);

    expect(getSpy).toHaveBeenCalledWith(userId);

    expect(usersStore.currentFetchedUser).toEqual(mockResponse);
  });

  it('should update user', async () => {
    const userId = 'some_id';
    const mockResponse = {
      id: userId
    };
    const data = { some: 'param' };

    const updateSpy = vi.spyOn(UsersWebservice.prototype, 'updateUser');
    updateSpy.mockResolvedValue(mockResponse);

    await usersStore.updateUser({
      id: userId,
      data
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: userId,
      data
    });

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully updated the user.',
    });
  });

  it('should delete user', async () => {
    const userId = 'some_id';
    const mockResponse = {
      id: userId
    };

    const deleteSpy = vi.spyOn(UsersWebservice.prototype, 'deleteUser');
    deleteSpy.mockResolvedValue(mockResponse);

    await usersStore.deleteUser(userId);

    expect(deleteSpy).toHaveBeenCalledWith(userId);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully deleted the user.',
    });
  });

  testTableActions({ useStore: useUsers });
});
