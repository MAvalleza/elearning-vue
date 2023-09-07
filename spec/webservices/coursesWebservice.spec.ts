import { describe, vi, it, expect, afterEach } from 'vitest';
import CoursesWebservice from '../../src/webservices/coursesWebservice';

// Mock data
const resolvedResponse = { some: 'value' };
const mockHeaders = {
  'Content-Type': 'application/json',
  Authorization: 'some_token',
};
const mockURL = 'some_url';
const mockJSONStringified = 'some_stringified';

describe('CoursesWebservice', () => {
  const webservice = new CoursesWebservice();

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

  it('should get courses', async () => {
    const params = { some: 'param' };

    const result = await webservice.getCourses(params);

    expect(urlSpy).toHaveBeenCalledWith({
      path: 'courses',
      params,
    });

    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should create a course', async () => {
    const params = { param1: 'value' }; // Adjust the parameters as needed

    const result = await webservice.createCourse(params);

    expect(urlSpy).toHaveBeenCalledWith({ path: 'courses' });
    expect(jsonSpy).toHaveBeenCalledWith(params);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'POST',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should get a course by id', async () => {
    const id = 'some_id';
    const params = { some: 'param' };

    const result = await webservice.getCourse({ id, params });

    expect(urlSpy).toHaveBeenCalledWith({ path: `courses/${id}`, params });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'GET',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should update a course', async () => {
    const id = 'some_id';
    const data = { some: 'update' };

    const result = await webservice.updateCourse(id, data);

    expect(urlSpy).toHaveBeenCalledWith({ path: `courses/${id}` });
    expect(jsonSpy).toHaveBeenCalledWith(data);
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'PATCH',
      headers: mockHeaders,
      body: mockJSONStringified,
    });

    expect(result).toEqual(resolvedResponse);
  });

  it('should delete a course', async () => {
    const id = 'some_id';

    const result = await webservice.deleteCourse(id);

    expect(urlSpy).toHaveBeenCalledWith({ path: `courses/${id}` });
    expect(fetchSpy).toHaveBeenCalledWith(mockURL, {
      method: 'DELETE',
      headers: mockHeaders,
    });

    expect(result).toEqual(resolvedResponse);
  });
});
