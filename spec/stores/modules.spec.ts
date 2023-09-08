import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useModules } from '../../src/stores/modules'; // Import your store module
import ModulesWebservice from '../../src/webservices/modulesWebservice';
import { faker } from '@faker-js/faker';
import omit from 'lodash-es/omit';

const mockSnack = vi.fn();
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

const contentMocks = {
  create: vi.fn(),
  fetch: vi.fn(),
};
vi.mock('../../src/stores/contents', () => {
  let _cache: {
    createContent: () => void,
    fetchContents: () => void,
  };

  const useContents = () => {
    if (!_cache) {
      _cache = {
        createContent: contentMocks.create,
        fetchContents: contentMocks.fetch,
      }
    }

    return _cache;
  }
  return { useContents };
})

describe('useModules', () => {
  let modulesStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    modulesStore = useModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch modules', async () => {
    const mockModules = [
      {
        id: 1,
        title: faker.lorem.word(),
        course: { title: faker.lorem.word() },
      },
    ];

    const mappedModules = [
      {
        ...mockModules[0],
        status: 'Draft',
        courseTitle: mockModules[0].course.title,
      },
    ];

    const mockResponse = {
      data: mockModules,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(ModulesWebservice.prototype, 'getModules');
    fetchSpy.mockResolvedValue(mockResponse);

    const result = await modulesStore.fetchModules(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(modulesStore.modules).toEqual(mappedModules);
    expect(modulesStore.modulesTotal).toBe(1);
    expect(modulesStore.modulesCurrentPage).toBe(1);

    expect(result).toEqual(mappedModules);
  }); 

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };
    
    const fetchSpy = vi.spyOn(ModulesWebservice.prototype, 'getModules');
    fetchSpy.mockResolvedValue(mockResponse);
  
    await modulesStore.fetchModules({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    })
  })

  it('should create module', async () => {
    const mockResponse = {
      id: 'some_id'
    };
    const data = { content: 'some_content', isPublished: true };

    const createSpy = vi.spyOn(ModulesWebservice.prototype, 'createModule');
    createSpy.mockResolvedValue(mockResponse);

    await modulesStore.createModule(data);

    expect(createSpy).toHaveBeenCalledWith(omit(data, 'content'));
    expect(contentMocks.create).toHaveBeenCalledWith({
      moduleId: mockResponse.id,
      content: data.content,
      isPublished: data.isPublished,
      type: 'document'
    })

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully created a module.',
    });
  });

  it('should fetch specific module', async () => {
    const moduleId = 'some_id';
    const mockResponse = {
      id: moduleId
    };
    const params = { some: 'param' };

    const getSpy = vi.spyOn(ModulesWebservice.prototype, 'getModule');
    getSpy.mockResolvedValue(mockResponse);

    await modulesStore.fetchModule({
      id: moduleId,
      params
    });

    expect(getSpy).toHaveBeenCalledWith({
      id: moduleId,
      params
    });

    expect(contentMocks.fetch).toHaveBeenCalledWith({ module: moduleId });

    expect(modulesStore.currentModule).toEqual(mockResponse);
  });

  it('should update module', async () => {
    const moduleId = 'some_id';
    const mockResponse = {
      id: moduleId
    };
    const data = { some: 'param' };

    const updateSpy = vi.spyOn(ModulesWebservice.prototype, 'updateModule');
    updateSpy.mockResolvedValue(mockResponse);

    await modulesStore.updateModule({
      id: moduleId,
      data
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: moduleId,
      data
    });

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully updated the module.',
    });
  });

  it('should delete module', async () => {
    const moduleId = 'some_id';
    const mockResponse = {
      id: moduleId
    };

    const deleteSpy = vi.spyOn(ModulesWebservice.prototype, 'deleteModule');
    deleteSpy.mockResolvedValue(mockResponse);

    await modulesStore.deleteModule(moduleId);

    expect(deleteSpy).toHaveBeenCalledWith(moduleId);

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'success',
      message: 'Successfully deleted the module.',
    });
  });

  it('should indicate deletion when delete table action is selected', async () => {
    const moduleId = 'some_id';
    const action = 'delete';

    const result = await modulesStore.onTableAction({ id: moduleId, action });

    expect(result).toEqual({
      id: moduleId,
      delete: true
    }); 
  })
});
