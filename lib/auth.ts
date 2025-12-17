import { STORE_KEYS } from './http';

export interface TokenDetails {
  accessToken: string;
  refreshToken: string;
}

export interface AdminUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  userType: string;
}

export type JwtClaims = {
  exp?: number;
  userId?: string;
  claims?: unknown;
  [key: string]: unknown;
};

export class AuthHelper {
  /**
   * Save authentication tokens to localStorage
   */
  static saveTokens(tokens: TokenDetails): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORE_KEYS.USER_TOKENS, JSON.stringify(tokens));
  }

  /**
   * Get stored authentication tokens
   */
  static getTokens(): TokenDetails | null {
    if (typeof window === 'undefined') return null;
    const tokens = localStorage.getItem(STORE_KEYS.USER_TOKENS);
    return tokens ? JSON.parse(tokens) : null;
  }

  /**
   * Save user details to localStorage
   */
  static saveUserDetails(user: AdminUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORE_KEYS.USER_DETAILS, JSON.stringify(user));
  }

  /**
   * Get stored user details
   */
  static getUserDetails(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(STORE_KEYS.USER_DETAILS);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return !!tokens?.accessToken;
  }

  /**
   * Check if user has admin role
   */
  static isAdmin(): boolean {
    const user = this.getUserDetails();
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORE_KEYS.USER_TOKENS);
    localStorage.removeItem(STORE_KEYS.USER_DETAILS);
  }

  /**
   * Parse JWT token to extract claims
   */
  static parseJwt(token: string): JwtClaims | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtClaims;
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const claims = this.parseJwt(token) as { exp?: number } | null;
    if (!claims || !claims.exp) return true;

    const expirationTime = claims.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  }
}
