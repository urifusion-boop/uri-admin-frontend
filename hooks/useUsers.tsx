'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, UserListFilterDto, UserDto, CreateUserPayload } from '@/lib/api/user-service';

/**
 * Hook to fetch user analytics
 */
export function useUserAnalytics() {
  return useQuery({
    queryKey: ['users', 'analytics'],
    queryFn: async () => {
      const response = await UserService.getUserAnalytics();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user analytics');
      }
      return response.responseData;
    },
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

/**
 * Hook to fetch user growth trend
 */
export function useUserGrowthTrend(days: number = 30) {
  return useQuery({
    queryKey: ['users', 'growth-trend', days],
    queryFn: async () => {
      const response = await UserService.getUserGrowthTrend(days);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user growth trend');
      }
      return response.responseData;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 120000, // Consider data stale after 2 minutes
  });
}

/**
 * Hook to fetch individual user activity
 */
export function useUserActivity(userId: string) {
  return useQuery({
    queryKey: ['users', userId, 'activity'],
    queryFn: async () => {
      const response = await UserService.getUserActivity(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user activity');
      }
      return response.responseData;
    },
    enabled: !!userId, // Only fetch if userId is provided
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch filtered and paginated user list
 */
export function useUserList(filters: UserListFilterDto) {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: async () => {
      console.log('[useUserList] Fetching with filters:', filters);
      const response = await UserService.getFilteredUserList(filters);
      console.log('[useUserList] Response:', response);
      if (!response.status) {
        console.error('[useUserList] API returned status false:', response.responseMessage);
        throw new Error(response.responseMessage || 'Failed to fetch user list');
      }
      console.log('[useUserList] Returning data:', response.responseData);
      return response.responseData;
    },
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

/**
 * Hook to fetch single user by ID
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await UserService.getByUserIdApi(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user');
      }
      return response.responseData;
    },
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 60000, // Consider data stale after 1 minute
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserDto> }) => {
      const response = await UserService.updateUser(userId, data);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to update user');
      }
      return response.responseData;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to create a user (admin)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      const response = await UserService.createUser(data);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to create user');
      }
      return response.responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const response = await UserService.deleteUser(userId, reason);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to delete user');
      }
      return response.responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const response = await UserService.suspendUser(userId, reason);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to suspend user');
      }
      return response.responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to activate a user
 */
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await UserService.activateUser(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to activate user');
      }
      return response.responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

/**
 * Hook to send email to user
 */
export function useSendEmail() {
  return useMutation({
    mutationFn: async ({ userId, subject, message }: { userId: string; subject: string; message: string }) => {
      const response = await UserService.sendEmail(userId, subject, message);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to send email');
      }
      return response.responseData;
    },
  });
}

/**
 * Hook to reset user password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await UserService.resetPassword(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to reset password');
      }
      return response.responseData;
    },
  });
}
