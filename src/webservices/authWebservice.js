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

export const loginUser = async data => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const logoutUser = async () => {
  await fetch(`${API_URL}/logout`, {
    method: 'DELETE',
    headers: requestHeaders,
  });
};

const requestHeaders = {
  'Content-Type': 'application/json',
};
