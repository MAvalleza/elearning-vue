import { setActivePinia, createPinia } from 'pinia';
import { describe, vi, it, expect, afterEach, beforeEach } from 'vitest';
import { useContents } from '../../src/stores/contents';
import ContentsWebservice from '../../src/webservices/contentsWebservice';

vi.mock('../../src/stores/ui', () => {
  let _cache: {
    showSnackbar: () => void;
    setLoading: () => void;
  };
  const useUI = () => {
    if (!_cache) {
      _cache = {
        showSnackbar: mockSnack,
        setLoading: vi.fn(),
      };
    }

    return _cache;
  };
  return { useUI };
});

const mockSnack = vi.fn();

describe('useContents', () => {
  let contentsStore;

  beforeEach(() => {
    setActivePinia(createPinia());

    contentsStore = useContents();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch contents', async () => {
    const mockContents = [{ id: 1 }];

    const mockResponse = {
      data: mockContents,
      errors: [],
      totalCount: 1,
      page: 1,
    };
    const params = { some: 'param' };

    const fetchSpy = vi.spyOn(ContentsWebservice.prototype, 'getContents');
    fetchSpy.mockResolvedValue(mockResponse);

    await contentsStore.fetchContents(params);

    expect(fetchSpy).toHaveBeenCalledWith(params);
    expect(contentsStore.contents).toEqual(mockResponse.data);
    expect(contentsStore.contentsTotal).toBe(1);
    expect(contentsStore.contentsCurrentPage).toBe(1);
  });

  it('should show a notification when there is an error', async () => {
    const mockResponse = {
      errors: ['Some error'],
    };

    const fetchSpy = vi.spyOn(ContentsWebservice.prototype, 'getContents');
    fetchSpy.mockResolvedValue(mockResponse);

    await contentsStore.fetchContents({});

    expect(mockSnack).toHaveBeenCalledWith({
      color: 'error',
      message: mockResponse.errors[0],
    });
  });

  it('should create content', async () => {
    const mockResponse = {
      id: 'some_id',
    };
    const params = { some: 'param' };

    const createSpy = vi.spyOn(ContentsWebservice.prototype, 'createContent');
    createSpy.mockResolvedValue(mockResponse);

    await contentsStore.createContent(params);

    expect(createSpy).toHaveBeenCalledWith(params);
  });

  it('should update content', async () => {
    const contentId = 'some_id';
    const mockResponse = {
      id: contentId,
    };
    const data = { some: 'param' };

    const updateSpy = vi.spyOn(ContentsWebservice.prototype, 'updateContent');
    updateSpy.mockResolvedValue(mockResponse);

    await contentsStore.updateContent({
      id: contentId,
      data,
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: contentId,
      data,
    });
  });
});
