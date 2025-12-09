'use client';

import { createContext, useContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthHelper, TokenDetails, AdminUser } from '@/lib/auth';
import { AuthService, LoginDto, LoginResponseDto } from '@/lib/api/auth-service';
import { UserService, UserDto } from '@/lib/api/user-service';
import { toast } from 'sonner';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = AuthHelper.getUserDetails();
      const tokens = AuthHelper.getTokens();

      if (storedUser && tokens?.accessToken) {
        // Check if token is expired
        if (AuthHelper.isTokenExpired(tokens.accessToken)) {
          // Token expired, clear auth
          AuthHelper.clearAuth();
          setUser(null);
        } else {
          setUser(storedUser);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);

        // Call login API
        const response = await AuthService.loginApi({ email, password });

        if (response.status && response.responseCode === 200) {
          const loginData = response.responseData;

          // Save tokens
          const tokens: TokenDetails = {
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
          };
          AuthHelper.saveTokens(tokens);

          // Parse JWT to get user ID
          const parsedToken = AuthHelper.parseJwt(loginData.accessToken);

          // Backend JWT has claims nested inside a 'claims' property
          const claims = parsedToken.claims || parsedToken;

          if (!claims?.userId) {
            throw new Error('Invalid token: No userId in claims');
          }

          // Fetch user details
          const userResponse = await UserService.getByUserIdApi(claims.userId);

          if (!userResponse.status || !userResponse.responseData) {
            throw new Error('Failed to fetch user details');
          }

          const userData = userResponse.responseData;

          // Verify user has admin role
          if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
            AuthHelper.clearAuth();
            toast.error('Access denied. Admin privileges required.');
            return;
          }

          // Save user details
          const adminUser: AdminUser = {
            userId: userData.userId,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role as 'ADMIN' | 'SUPER_ADMIN',
            userType: userData.userType,
          };

          AuthHelper.saveUserDetails(adminUser);
          setUser(adminUser);

          toast.success('Welcome to Admin Portal!');

          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          toast.error(response.responseMessage || 'Login failed');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.responseMessage || error.message || 'An error occurred during login');
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    AuthHelper.clearAuth();
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  }, [router]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
