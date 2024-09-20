const API_BASE_URL = 'https://api.real-estate-manager.redberryinternship.ge/api';
const BEARER_TOKEN = '9cfbbb0d-1b3a-4b23-82f3-f1774b36c02e';

async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
  };

  const options = {
    method: method,
    headers: headers,
    body: body
  };

  if (body && (method === 'POST')) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }


  try {
    const response = await fetch(url, options);
    const responseData = await (method === 'DELETE' ? response.text() : response.json().catch(() => null));
    if (!response.ok) {
      throw new Error(responseData?.message || `HTTP error! status: ${response.status}`);
    }
    return {
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers),
    };
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error;
  }
}

export const apiGet = (endpoint) => apiRequest('GET', endpoint);
export const apiPost = (endpoint, body) => apiRequest('POST', endpoint, body);
export const apiDelete = (endpoint) => apiRequest('DELETE', endpoint);