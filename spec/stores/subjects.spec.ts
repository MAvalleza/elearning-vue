import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useSubjects } from '../../src/stores/subjects'; // Import your store module
import SubjectsWebservice from '../../src/webservices/subjectsWebservice';
// import { useUI as uiStore } from '../../src/stores/ui';
import { faker } from '@faker-js/faker';

vi.mock('../../src/webservices/subjectsWebservice');
vi.mock('../../src/stores/ui');

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
    expect(subjectsStore.loadingSubjects).toBe(false);
    expect(subjectsStore.subjects).toEqual(mappedSubjects);
    expect(subjectsStore.subjectsTotal).toBe(1);
    expect(subjectsStore.subjectsCurrentPage).toBe(1);
  });
});
