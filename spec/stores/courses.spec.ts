import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useCourses } from '../../src/stores/courses'; // Import your store module
import CoursesWebservice from '../../src/webservices/coursesWebservice';
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

describe('useCourses', () => {
  let coursesStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    coursesStore = useCourses();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch courses', async () => {
    const mockCourses = [
      {
        id: 1,
        title: faker.lorem.word(),
        moduleIds: [1, 2, 3],
      },
    ];

    const mappedCourses = [
      {
        ...mockCourses[0],
        status: 'Draft',
        totalCourses: mockCourses[0].moduleIds.length,
      },
    ];

    const mockResponse = {
      data: mockCourses,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(CoursesWebservice.prototype, 'getCourses');
    fetchSpy.mockResolvedValue(mockResponse);

    const result = await coursesStore.fetchcourses(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(coursesStore.courses).toEqual(mappedCourses);
    expect(coursesStore.coursesTotal).toBe(1);
    expect(coursesStore.coursesCurrentPage).toBe(1);

    expect(result).toEqual(mappedCourses);
  }); 

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };
    
    const fetchSpy = vi.spyOn(CoursesWebservice.prototype, 'getCourses');
    fetchSpy.mockResolvedValue(mockResponse);
  
    await coursesStore.fetchcourses({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    })
  })

  it('should create course', async () => {
    const mockResponse = {
      id: 'some_id'
    };
    const params = { some: 'param' };

    const createSpy = vi.spyOn(CoursesWebservice.prototype, 'createCourse');
    createSpy.mockResolvedValue(mockResponse);

    await coursesStore.createCourse(params);

    expect(createSpy).toHaveBeenCalledWith(params);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully created a course.',
    });
  });

  it('should fetch specific course', async () => {
    const courseId = 'some_id';
    const mockResponse = {
      id: courseId
    };
    const params = { some: 'param' };

    const getSpy = vi.spyOn(CoursesWebservice.prototype, 'getCourse');
    getSpy.mockResolvedValue(mockResponse);

    await coursesStore.fetchCourse({
      id: courseId,
      params
    });

    expect(getSpy).toHaveBeenCalledWith({
      id: courseId,
      params
    });

    expect(coursesStore.currentCourse).toEqual(mockResponse);
  });

  it('should update course', async () => {
    const courseId = 'some_id';
    const mockResponse = {
      id: courseId
    };
    const data = { some: 'param' };

    const updateSpy = vi.spyOn(CoursesWebservice.prototype, 'updateCourse');
    updateSpy.mockResolvedValue(mockResponse);

    await coursesStore.updateCourse({
      id: courseId,
      data
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: courseId,
      data
    });

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully updated the course.',
    });
  });

  it('should delete course', async () => {
    const courseId = 'some_id';
    const mockResponse = {
      id: courseId
    };

    const deleteSpy = vi.spyOn(CoursesWebservice.prototype, 'deleteCourse');
    deleteSpy.mockResolvedValue(mockResponse);

    await coursesStore.deleteCourse(courseId);

    expect(deleteSpy).toHaveBeenCalledWith(courseId);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully deleted the course.',
    });
  });

  it('should indicate deletion when delete table action is selected', async () => {
    const courseId = 'some_id';
    const action = 'delete';

    const result = await coursesStore.onTableAction({ id: courseId, action });

    expect(result).toEqual({
      id: courseId,
      delete: true
    }); 
  })
});
