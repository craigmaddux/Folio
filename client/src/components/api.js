const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://devapi.leafquill.com/api';

export const fetchFromAPI = async (endpoint, options = {}) => {
    console.log("Checking url...");
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
