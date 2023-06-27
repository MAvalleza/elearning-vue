const API_URL = '/api';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return await response.json();
};

export const signUpUser = async data => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(data),
  });

  return await response.json();
};

const requestHeaders = {
  'Content-Type': 'application/json',
};
