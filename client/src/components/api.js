const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://folio-server-app-ftg0eecmb5dcg9eb.eastus2-01.azurewebsites.net:8-80/api';

export const fetchFromAPI = async (endpoint, options = {}) => {
    console.log(`${API_BASE_URL}${endpoint}`);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};
