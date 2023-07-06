// TODO: Turn into a webservice class

const API_URL = '/api';

export const getSubjects = async (token) => {
  const response = await fetch(`${API_URL}/subjects`, {
    method: 'GET',
    headers: {
      ...requestHeaders,
      Authorization: token,
    },
  });

  return await response.json();
};

const requestHeaders = {
  'Content-Type': 'application/json',
};