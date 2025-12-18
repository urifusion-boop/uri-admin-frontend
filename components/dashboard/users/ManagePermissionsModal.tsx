'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check, AlertCircle, Search, Filter } from 'lucide-react';
import {
  useUserPermissions,
  useAssignPermissions,
  useRevokePermissions,
  useApplyPermissionTemplate,
  useClearCustomPermissions,
} from '@/hooks/usePermissions';
import { PermissionEnum, PermissionTemplateEnum, RoleEnum } from '@/lib/api/permission-service';

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

// Permission categories with labels
type PermissionCategory = {
  label: string;
  icon: string;
  permissions: PermissionEnum[];
};

const PERMISSION_CATEGORIES: Record<string, PermissionCategory> = {
  USER_MANAGEMENT: {
    label: 'User Management',
    icon: '👥',
    permissions: [
      PermissionEnum.USERS_VIEW,
      PermissionEnum.USERS_CREATE,
      PermissionEnum.USERS_EDIT,
      PermissionEnum.USERS_DELETE,
      PermissionEnum.USERS_ASSIGN_ROLES,
      PermissionEnum.USERS_MANAGE_ADMINS,
      PermissionEnum.USERS_VIEW_SENSITIVE,
      PermissionEnum.USERS_EXPORT,
      PermissionEnum.USERS_BULK_OPERATIONS,
    ],
  },
  ROLE_MANAGEMENT: {
    label: 'Role Management',
    icon: '🎭',
    permissions: [
      PermissionEnum.ROLES_VIEW,
      PermissionEnum.ROLES_CREATE,
      PermissionEnum.ROLES_EDIT,
      PermissionEnum.ROLES_DELETE,
      PermissionEnum.ROLES_ASSIGN,
      PermissionEnum.ROLES_MANAGE_PERMISSIONS,
    ],
  },
  PERMISSION_MANAGEMENT: {
    label: 'Permission Management',
    icon: '🔐',
    permissions: [
      PermissionEnum.PERMISSIONS_VIEW,
      PermissionEnum.PERMISSIONS_ASSIGN,
      PermissionEnum.PERMISSIONS_REVOKE,
      PermissionEnum.PERMISSIONS_VIEW_ALL,
    ],
  },
  DASHBOARD: {
    label: 'Dashboard',
    icon: '📊',
    permissions: [
      PermissionEnum.DASHBOARD_VIEW,
      PermissionEnum.DASHBOARD_VIEW_METRICS,
      PermissionEnum.DASHBOARD_VIEW_ANALYTICS,
      PermissionEnum.DASHBOARD_VIEW_REPORTS,
      PermissionEnum.DASHBOARD_EXPORT,
    ],
  },
  FINANCE: {
    label: 'Finance',
    icon: '💰',
    permissions: [
      PermissionEnum.FINANCE_VIEW,
      PermissionEnum.FINANCE_VIEW_REVENUE,
      PermissionEnum.FINANCE_VIEW_TRANSACTIONS,
      PermissionEnum.FINANCE_MANAGE_SUBSCRIPTIONS,
      PermissionEnum.FINANCE_MANAGE_REFUNDS,
      PermissionEnum.FINANCE_EXPORT,
    ],
  },
  LEADS: {
    label: 'Leads',
    icon: '🎯',
    permissions: [
      PermissionEnum.LEADS_VIEW,
      PermissionEnum.LEADS_VIEW_ALL,
      PermissionEnum.LEADS_EDIT,
      PermissionEnum.LEADS_DELETE,
      PermissionEnum.LEADS_EXPORT,
      PermissionEnum.LEADS_VIEW_ANALYTICS,
    ],
  },
  CONTENT: {
    label: 'Content',
    icon: '📝',
    permissions: [
      PermissionEnum.CONTENT_VIEW,
      PermissionEnum.CONTENT_CREATE,
      PermissionEnum.CONTENT_EDIT,
      PermissionEnum.CONTENT_DELETE,
      PermissionEnum.CONTENT_PUBLISH,
      PermissionEnum.CONTENT_MODERATE,
    ],
  },
  AUDIT_LOGS: {
    label: 'Audit Logs',
    icon: '📜',
    permissions: [
      PermissionEnum.AUDIT_VIEW,
      PermissionEnum.AUDIT_VIEW_ALL,
      PermissionEnum.AUDIT_EXPORT,
    ],
  },
  SYSTEM_MONITORING: {
    label: 'System Monitoring',
    icon: '🖥️',
    permissions: [
      PermissionEnum.SYSTEM_VIEW,
      PermissionEnum.SYSTEM_VIEW_LOGS,
      PermissionEnum.SYSTEM_MANAGE_HEALTH,
      PermissionEnum.SYSTEM_MANAGE_CACHE,
    ],
  },
  SUPPORT: {
    label: 'Support',
    icon: '🎧',
    permissions: [
      PermissionEnum.SUPPORT_VIEW,
      PermissionEnum.SUPPORT_MANAGE,
      PermissionEnum.SUPPORT_VIEW_TICKETS,
      PermissionEnum.SUPPORT_RESPOND,
    ],
  },
  ANALYTICS: {
    label: 'Analytics',
    icon: '📈',
    permissions: [
      PermissionEnum.ANALYTICS_VIEW,
      PermissionEnum.ANALYTICS_VIEW_USER,
      PermissionEnum.ANALYTICS_VIEW_FINANCE,
      PermissionEnum.ANALYTICS_VIEW_CONTENT,
      PermissionEnum.ANALYTICS_EXPORT,
    ],
  },
};

const PERMISSION_TEMPLATES = [
  { value: PermissionTemplateEnum.USER_MANAGER, label: 'User Manager', description: 'Full user management access' },
  { value: PermissionTemplateEnum.LEAD_MANAGER, label: 'Lead Manager', description: 'Lead management and analytics' },
  { value: PermissionTemplateEnum.FINANCE_VIEWER, label: 'Finance Viewer', description: 'View financial data and reports' },
  { value: PermissionTemplateEnum.CONTENT_MODERATOR, label: 'Content Moderator', description: 'Moderate and manage content' },
  { value: PermissionTemplateEnum.SUPPORT_AGENT, label: 'Support Agent', description: 'Handle support tickets' },
  { value: PermissionTemplateEnum.ANALYTICS_VIEWER, label: 'Analytics Viewer', description: 'View analytics and reports' },
  { value: PermissionTemplateEnum.SYSTEM_MONITOR, label: 'System Monitor', description: 'Monitor system health' },
];

function formatPermissionLabel(permission: string): string {
  return permission
    .split(':')[1]
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ManagePermissionsModal({
  isOpen,
  onClose,
  userId,
  userName,
}: ManagePermissionsModalProps) {
  const [activeTab, setActiveTab] = useState<string>('USER_MANAGEMENT');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<PermissionEnum>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const { data: userPermissions, isLoading } = useUserPermissions(userId, isOpen);
  const assignPermissions = useAssignPermissions();
  const revokePermissions = useRevokePermissions();
  const applyTemplate = useApplyPermissionTemplate();
  const clearCustomPermissions = useClearCustomPermissions();

  // Initialize selected permissions when data loads
  useMemo(() => {
    if (userPermissions?.customPermissions) {
      setSelectedPermissions(new Set(userPermissions.customPermissions));
    }
  }, [userPermissions]);

  const handleTogglePermission = (permission: PermissionEnum) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permission)) {
      newSelected.delete(permission);
    } else {
      newSelected.add(permission);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSavePermissions = async () => {
    const currentCustom = new Set(userPermissions?.customPermissions || []);
    const toAdd = Array.from(selectedPermissions).filter((p) => !currentCustom.has(p));
    const toRemove = Array.from(currentCustom).filter((p) => !selectedPermissions.has(p));

    try {
      if (toAdd.length > 0) {
        await assignPermissions.mutateAsync({ userId, permissions: toAdd });
      }
      if (toRemove.length > 0) {
        await revokePermissions.mutateAsync({ userId, permissions: toRemove });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  };

  const handleApplyTemplate = async (template: PermissionTemplateEnum) => {
    try {
      await applyTemplate.mutateAsync({ userId, template });
      onClose();
    } catch (error) {
      console.error('Failed to apply template:', error);
    }
  };

  const handleClearCustom = async () => {
    if (confirm('Are you sure you want to clear all custom permissions?')) {
      try {
        await clearCustomPermissions.mutateAsync(userId);
        setSelectedPermissions(new Set());
      } catch (error) {
        console.error('Failed to clear permissions:', error);
      }
    }
  };

  const filteredCategories: Record<string, PermissionCategory> = useMemo(() => {
    if (!searchQuery) return PERMISSION_CATEGORIES;

    const filtered: Record<string, PermissionCategory> = {};
    Object.entries(PERMISSION_CATEGORIES).forEach(([key, category]) => {
      const matchingPermissions = category.permissions.filter((p) =>
        formatPermissionLabel(p).toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchingPermissions.length > 0) {
        filtered[key] = { ...category, permissions: matchingPermissions };
      }
    });
    return filtered;
  }, [searchQuery]);

  const roleBasedPermissions = userPermissions?.rolePermissions || [];
  const customPermissions = userPermissions?.customPermissions || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Manage Permissions</h2>
                  <p className="text-sm text-gray-600">{userName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <>
                {/* Role & Summary */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Role</p>
                        <p className="text-lg font-bold text-indigo-900">{userPermissions?.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Role Permissions</p>
                        <p className="text-lg font-bold text-indigo-900">{roleBasedPermissions.length}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Custom Permissions</p>
                        <p className="text-lg font-bold text-purple-900">{customPermissions.length}</p>
                      </div>
                    </div>
                    {customPermissions.length > 0 && (
                      <button
                        onClick={handleClearCustom}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Clear Custom
                      </button>
                    )}
                  </div>
                </div>

                {/* Templates */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Apply Templates</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {PERMISSION_TEMPLATES.map((template) => (
                      <button
                        key={template.value}
                        onClick={() => handleApplyTemplate(template.value)}
                        className="p-3 text-xs font-medium text-center bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all border border-indigo-200"
                        title={template.description}
                      >
                        {template.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search permissions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                  {/* Category Tabs */}
                  <div className="w-64 border-r border-gray-200 overflow-y-auto">
                    {Object.entries(filteredCategories).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          activeTab === key
                            ? 'bg-indigo-50 border-r-2 border-indigo-600 text-indigo-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm">{category.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Permissions List */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {filteredCategories[activeTab] && (
                      <div className="space-y-2">
                        {filteredCategories[activeTab].permissions.map((permission: PermissionEnum) => {
                          const isRoleBased = roleBasedPermissions.includes(permission);
                          const isCustom = selectedPermissions.has(permission);
                          const isSelected = isRoleBased || isCustom;

                          return (
                            <motion.div
                              key={permission}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-indigo-50 border-indigo-200'
                                  : 'bg-white border-gray-200 hover:border-indigo-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                                    isSelected
                                      ? 'bg-indigo-600 border-indigo-600'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{formatPermissionLabel(permission)}</p>
                                  <p className="text-xs text-gray-500">{permission}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isRoleBased && (
                                  <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded">
                                    Role
                                  </span>
                                )}
                                {isCustom && !isRoleBased && (
                                  <span className="px-2 py-1 text-xs font-medium bg-purple-200 text-purple-700 rounded">
                                    Custom
                                  </span>
                                )}
                                <button
                                  onClick={() => handleTogglePermission(permission)}
                                  disabled={isRoleBased}
                                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                    isRoleBased
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : isCustom
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                  }`}
                                >
                                  {isRoleBased ? 'From Role' : isCustom ? 'Remove' : 'Add'}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Changes will take effect immediately</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePermissions}
                      disabled={assignPermissions.isPending || revokePermissions.isPending}
                      className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {assignPermissions.isPending || revokePermissions.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
