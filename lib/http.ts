import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const STORE_KEYS = {
  USER_TOKENS: '@URI_ADMIN@USER_TOKENS',
  USER_DETAILS: '@URI_ADMIN@USER_DETAILS',
};

class AdminHttpClient {
  private static client: AxiosInstance;

  static initialize() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URI_API_BASE_URL || 'https://api.uricreative.com:8443',
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Add JWT token to every request
    this.client.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle responses and errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleErrorResponse(error);
      }
    );
  }

  static getClient(): AxiosInstance {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  static addHeaders(headers: Record<string, string>): void {
    this.getClient().defaults.headers = {
      ...this.getClient().defaults.headers,
      ...headers,
    };
  }

  private static getStoredTokens() {
    if (typeof window === 'undefined') return null;
    const tokensString = localStorage.getItem(STORE_KEYS.USER_TOKENS);
    if (!tokensString) return null;

    try {
      const tokens = JSON.parse(tokensString);
      // Return null if tokens object is empty or missing accessToken
      if (!tokens || !tokens.accessToken) return null;
      return tokens;
    } catch (error) {
      console.error('Error parsing stored tokens:', error);
      return null;
    }
  }

  private static async handleErrorResponse(error: AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          // Unauthorized - clear auth data and redirect to login
          this.clearUserData();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('unauthorized'));
            window.location.href = '/login';
          }
          return await Promise.reject(error.response);
        default:
          return await Promise.resolve(error.response);
      }
    }
    return Promise.reject(error);
  }

  private static clearUserData() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORE_KEYS.USER_DETAILS);
    localStorage.removeItem(STORE_KEYS.USER_TOKENS);
  }

  static readonly instantiate = () => new AdminHttpClient();
}

export { AdminHttpClient, STORE_KEYS };
