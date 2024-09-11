const API_BASE_URL = 'https://api.real-estate-manager.redberryinternship.ge/api';
const BEARER_TOKEN = '9cfbbb0d-1b3a-4b23-82f3-f1774b36c02e'
async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const options = {
    method: method,
    headers: headers,
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (method === 'DELETE') {
      return { status: response.status, statusText: response.statusText };
    }

    return await response.json();
  } catch (error) {
    console.error(`Error making ${method} request:`, error);
    throw error;
  }
}

export const apiGet = (endpoint, BEARER_TOKEN) => apiRequest('GET', endpoint, BEARER_TOKEN);
export const apiPost = (endpoint, BEARER_TOKEN, body) => apiRequest('POST', endpoint, BEARER_TOKEN, body);
export const apiDelete = (endpoint, BEARER_TOKEN) => apiRequest('DELETE', endpoint, BEARER_TOKEN);
