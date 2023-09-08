import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useSubjects } from '../../src/stores/subjects'; // Import your store module
import SubjectsWebservice from '../../src/webservices/subjectsWebservice';
import { faker } from '@faker-js/faker';

vi.mock('../../src/stores/ui', () => {
  let _cache;
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

describe('useSubjects', () => {
  let subjectsStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    subjectsStore = useSubjects();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch subjects', async () => {
    const mockSubjects = [
      {
        id: 1,
        title: faker.lorem.word(),
        courseIds: [1, 2],
      },
    ];

    const mappedSubjects = [
      {
        ...mockSubjects[0],
        status: 'Draft',
        totalCourses: mockSubjects[0].courseIds.length,
      },
    ];

    const mockResponse = {
      data: mockSubjects,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(SubjectsWebservice.prototype, 'getSubjects');
    fetchSpy.mockResolvedValue(mockResponse);

    await subjectsStore.fetchSubjects(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(subjectsStore.subjects).toEqual(mappedSubjects);
    expect(subjectsStore.subjectsTotal).toBe(1);
    expect(subjectsStore.subjectsCurrentPage).toBe(1);
  }); 

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };
    
    const fetchSpy = vi.spyOn(SubjectsWebservice.prototype, 'getSubjects');
    fetchSpy.mockResolvedValue(mockResponse);
  
    await subjectsStore.fetchSubjects({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    })
  })

  it('should create subject', async () => {
    const mockResponse = {
      id: 'some_id'
    };
    const params = { some: 'param' };

    const createSpy = vi.spyOn(SubjectsWebservice.prototype, 'createSubject');
    createSpy.mockResolvedValue(mockResponse);

    await subjectsStore.createSubject(params);

    expect(createSpy).toHaveBeenCalledWith(params);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully created a subject.',
    });
  });

  it('should fetch specific subject', async () => {
    const subjectId = 'some_id';
    const mockResponse = {
      id: subjectId
    };
    const params = { some: 'param' };

    const getSpy = vi.spyOn(SubjectsWebservice.prototype, 'getSubject');
    getSpy.mockResolvedValue(mockResponse);

    await subjectsStore.fetchSubject({
      id: subjectId,
      params
    });

    expect(getSpy).toHaveBeenCalledWith({
      id: subjectId,
      params
    });

    expect(subjectsStore.currentSubject).toEqual(mockResponse);
  });

  it('should update subject', async () => {
    const subjectId = 'some_id';
    const mockResponse = {
      id: subjectId
    };
    const params = { some: 'param' };

    const updateSpy = vi.spyOn(SubjectsWebservice.prototype, 'updateSubject');
    updateSpy.mockResolvedValue(mockResponse);

    await subjectsStore.updateSubject({
      id: subjectId,
      params
    });

    expect(updateSpy).toHaveBeenCalledWith(
      subjectId,
      params
    );

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully updated the subject.',
    });
  });

  it('should delete subject', async () => {
    const subjectId = 'some_id';
    const mockResponse = {
      id: subjectId
    };

    const deleteSpy = vi.spyOn(SubjectsWebservice.prototype, 'deleteSubject');
    deleteSpy.mockResolvedValue(mockResponse);

    await subjectsStore.deleteSubject(subjectId);

    expect(deleteSpy).toHaveBeenCalledWith(subjectId);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully deleted the subject.',
    });
  });

  it('should indicate deletion when delete table action is selected', async () => {
    const subjectId = 'some_id';
    const action = 'delete';

    const result = await subjectsStore.onTableAction({ id: subjectId, action });

    expect(result).toEqual({
      id: subjectId,
      delete: true
    }); 
  })
});
