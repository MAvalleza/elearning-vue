import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useEnrollments } from '../../src/stores/enrollments';
import EnrollmentsWebservice from '../../src/webservices/enrollmentsWebservice';

const mockSnack = vi.fn();

vi.mock('../../src/stores/ui', () => {
  let _cache: {
    showSnackbar: () => void,
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

describe('useEnrollments', () => {
  let enrollmentsStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    enrollmentsStore = useEnrollments();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch enrollments', async () => {
    const mockEnrollments = [{ id: 1 }];

    const mockResponse = {
      data: mockEnrollments,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'getEnrollments');
    fetchSpy.mockResolvedValue(mockResponse);

    await enrollmentsStore.fetchEnrollments(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(enrollmentsStore.enrollments).toEqual(mockResponse.data);
    expect(enrollmentsStore.enrollmentsTotal).toBe(1);
    expect(enrollmentsStore.enrollmentsCurrentPage).toBe(1);
  }); 

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };
    
    const fetchSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'getEnrollments');
    fetchSpy.mockResolvedValue(mockResponse);
  
    await enrollmentsStore.fetchEnrollments({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    })
  });

  it('should fetch specific enrollment', async () => {
    const enrollmentId = 'some_id';
    const mockResponse = {
      id: enrollmentId
    };
    const params = { some: 'param' };

    const getSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'getEnrollment');
    getSpy.mockResolvedValue(mockResponse);

    await enrollmentsStore.fetchEnrollment({
      id: enrollmentId,
      params
    });

    expect(getSpy).toHaveBeenCalledWith({
      id: enrollmentId,
      params
    });

    expect(enrollmentsStore.currentEnrollment).toEqual(mockResponse);
  });

  it('should create enrollment', async () => {
    const mockResponse = {
      id: 'some_id'
    };
    const params = { some: 'param' };

    const createSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'createEnrollment');
    createSpy.mockResolvedValue(mockResponse);

    await enrollmentsStore.createEnrollment(params);

    expect(createSpy).toHaveBeenCalledWith(params);
  });

  it('should update enrollment', async () => {
    const enrollmentId = 'some_id';
    const mockResponse = {
      id: enrollmentId
    };
    const data = { some: 'param' };

    const updateSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'updateEnrollment');
    updateSpy.mockResolvedValue(mockResponse);

    await enrollmentsStore.updateEnrollment({
      id: enrollmentId,
      data
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: enrollmentId,
      data,
    });
  });

  it('should unenroll', async () => {
    const enrollmentId = 'some_id';
    const mockResponse = {
      id: enrollmentId
    };

    const deleteSpy = vi.spyOn(EnrollmentsWebservice.prototype, 'deleteEnrollment');
    deleteSpy.mockResolvedValue(mockResponse);

    await enrollmentsStore.unenroll(enrollmentId);

    expect(deleteSpy).toHaveBeenCalledWith(enrollmentId);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully unenrolled.',
    });
  });
});
