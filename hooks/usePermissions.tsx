'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PermissionService,
  UserPermissionsResponse,
  AssignPermissionsDto,
  RevokePermissionsDto,
  AssignRoleDto,
  ApplyPermissionTemplateDto,
  BulkAssignPermissionsDto,
} from '@/lib/api/permission-service';
import { toast } from 'sonner';

/**
 * Hook to get user's permissions
 */
export function useUserPermissions(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: async () => {
      const response = await PermissionService.getUserPermissions(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch user permissions');
      }
      return response.responseData;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to check if user has a specific permission
 */
export function useCheckPermission(userId: string, permission: string) {
  return useQuery({
    queryKey: ['checkPermission', userId, permission],
    queryFn: async () => {
      const response = await PermissionService.checkUserPermission(
        userId,
        permission as any
      );
      if (!response.status) {
        return false;
      }
      return response.responseData?.hasPermission || false;
    },
    enabled: !!userId && !!permission,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get all users with custom permissions
 */
export function useAllUsersWithCustomPermissions() {
  return useQuery({
    queryKey: ['usersWithCustomPermissions'],
    queryFn: async () => {
      const response = await PermissionService.getAllUsersWithCustomPermissions();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to fetch users with custom permissions');
      }
      return response.responseData || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to assign permissions to a user
 */
export function useAssignPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AssignPermissionsDto) => {
      const response = await PermissionService.assignPermissions(dto);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to assign permissions');
      }
      return response.responseData;
    },
    onSuccess: (data, variables) => {
      toast.success('Permissions assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign permissions');
    },
  });
}

/**
 * Hook to revoke permissions from a user
 */
export function useRevokePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: RevokePermissionsDto) => {
      const response = await PermissionService.revokePermissions(dto);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to revoke permissions');
      }
      return response.responseData;
    },
    onSuccess: (data, variables) => {
      toast.success('Permissions revoked successfully');
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke permissions');
    },
  });
}

/**
 * Hook to assign a role to a user
 */
export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: AssignRoleDto) => {
      const response = await PermissionService.assignRole(dto);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to assign role');
      }
      return response.responseData;
    },
    onSuccess: (data, variables) => {
      toast.success('Role assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign role');
    },
  });
}

/**
 * Hook to apply a permission template to a user
 */
export function useApplyPermissionTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ApplyPermissionTemplateDto) => {
      const response = await PermissionService.applyPermissionTemplate(dto);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to apply permission template');
      }
      return response.responseData;
    },
    onSuccess: (data, variables) => {
      toast.success('Permission template applied successfully');
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to apply permission template');
    },
  });
}

/**
 * Hook to bulk assign permissions to multiple users
 */
export function useBulkAssignPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: BulkAssignPermissionsDto) => {
      const response = await PermissionService.bulkAssignPermissions(dto);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to bulk assign permissions');
      }
      return response.responseData;
    },
    onSuccess: (data, variables) => {
      toast.success(`Permissions assigned to ${variables.userIds.length} users`);
      variables.userIds.forEach((userId) => {
        queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      });
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to bulk assign permissions');
    },
  });
}

/**
 * Hook to clear all custom permissions from a user
 */
export function useClearCustomPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await PermissionService.clearCustomPermissions(userId);
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to clear custom permissions');
      }
      return response.responseData;
    },
    onSuccess: (data, userId) => {
      toast.success('Custom permissions cleared successfully');
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to clear custom permissions');
    },
  });
}

/**
 * Hook to cleanup expired permissions
 */
export function useCleanupExpiredPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await PermissionService.cleanupExpiredPermissions();
      if (!response.status) {
        throw new Error(response.responseMessage || 'Failed to cleanup expired permissions');
      }
      return response.responseData;
    },
    onSuccess: (data) => {
      toast.success(`Cleaned up ${data.count} expired permissions`);
      queryClient.invalidateQueries({ queryKey: ['usersWithCustomPermissions'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cleanup expired permissions');
    },
  });
}
