const API_BASE = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // v1 - Fake DB
  getUsersV1() {
    return this.request('/v1/users');
  }

  createUserV1(userData) {
    return this.request('/v1/users', {
      method: 'POST',
      body: userData,
    });
  }

  updateUserV1(id, userData) {
    return this.request(`/v1/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }

  deleteUserV1(id) {
    return this.request(`/v1/users/${id}`, {
      method: 'DELETE',
    });
  }

  // v2 - MongoDB
  getUsersV2() {
    return this.request('/v2/users');
  }

  createUserV2(userData) {
    return this.request('/v2/users', {
      method: 'POST',
      body: userData,
    });
  }

  updateUserV2(id, userData) {
    return this.request(`/v2/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }

  deleteUserV2(id) {
    return this.request(`/v2/users/${id}`, {
      method: 'DELETE',
    });
  }

  loginUserV2(credentials) {
    return this.request('/v2/users/login', {
      method: 'POST',
      body: credentials,
    });
  }

  logoutUserV2() {
    return this.request('/v2/users/logout', {
      method: 'POST',
    });
  }

  checkAuthV2() {
    return this.request('/v2/users/auth');
  }

  // v2 - Supabase
  getUsersSupabase() {
    return this.request('/v2/users/pg');
  }

  createUserSupabase(userData) {
    return this.request('/v2/users/pg', {
      method: 'POST',
      body: userData,
    });
  }

  updateUserSupabase(id, userData) {
    return this.request(`/v2/users/pg/${id}`, {
      method: 'PUT',
      body: userData,
    });
  }

  deleteUserSupabase(id) {
    return this.request(`/v2/users/pg/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();