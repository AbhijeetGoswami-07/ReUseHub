import React, { useState, useMemo } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ConfirmActionModal } from '@/components/admin/ConfirmActionModal';
import { AdminUser, UserProfile } from '@/types';
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  Award,
} from 'lucide-react';

export interface AdminUsersViewProps {
  users: AdminUser[];
  currentAdmin: UserProfile;
  onUpdateRole: (userId: string, newRole: 'user' | 'admin') => Promise<void>;
  onToggleStatus: (userId: string, newStatus: 'active' | 'suspended', reason: string) => Promise<void>;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  currentAdmin,
  onUpdateRole,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'role' | 'status';
    targetUser: AdminUser | null;
    targetRole?: 'user' | 'admin';
    targetStatus?: 'active' | 'suspended';
    reason?: string;
  }>({
    isOpen: false,
    type: 'role',
    targetUser: null,
  });

  const [actionReason, setActionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenRoleModal = (user: AdminUser, newRole: 'user' | 'admin') => {
    setConfirmModal({
      isOpen: true,
      type: 'role',
      targetUser: user,
      targetRole: newRole,
    });
  };

  const handleOpenStatusModal = (user: AdminUser, newStatus: 'active' | 'suspended') => {
    setActionReason('');
    setConfirmModal({
      isOpen: true,
      type: 'status',
      targetUser: user,
      targetStatus: newStatus,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.targetUser) return;
    setIsSubmitting(true);
    try {
      if (confirmModal.type === 'role' && confirmModal.targetRole) {
        await onUpdateRole(confirmModal.targetUser.id, confirmModal.targetRole);
      } else if (confirmModal.type === 'status' && confirmModal.targetStatus) {
        await onToggleStatus(
          confirmModal.targetUser.id,
          confirmModal.targetStatus,
          actionReason || 'Administrative decision'
        );
      }
      setConfirmModal({ isOpen: false, type: 'role', targetUser: null });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Identity & Access Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-forest-900">
            Registered Users ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            Manage user roles, verify EcoScore points, and govern security status across accounts.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="bordered" className="p-4 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-forest-50/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Standard Users</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card variant="bordered" className="bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-50/60 border-b border-forest-100 text-forest-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">EcoScore</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-dark-muted">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = user.id === currentAdmin.id;
                  const isAdmin = user.role === 'admin';
                  const isSuspended = user.status === 'suspended';

                  return (
                    <tr key={user.id} className="hover:bg-forest-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs uppercase border border-forest-200">
                            {user.fullName ? user.fullName.charAt(0) : user.email.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-forest-900 flex items-center gap-1.5">
                              <span>{user.fullName || 'Anonymous Maker'}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-forest-200 text-forest-800">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-dark-subtle">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-forest-100/70 text-forest-800">
                            <Shield className="w-3 h-3 text-forest-500" />
                            User
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-dark-muted">
                        {user.city && user.state ? `${user.city}, ${user.state}` : user.city || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 font-semibold text-forest-900">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{user.metrics?.communityPoints || 0} pts</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-dark-subtle text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Role Toggle */}
                          {!isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[11px] px-2 py-1 h-7 text-forest-700 hover:text-forest-900"
                              onClick={() => handleOpenRoleModal(user, isAdmin ? 'user' : 'admin')}
                            >
                              {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                            </Button>
                          )}

                          {/* Status Toggle */}
                          {!isCurrent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`text-[11px] px-2 py-1 h-7 ${
                                isSuspended
                                  ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
                                  : 'text-red-700 hover:text-red-800 hover:bg-red-50'
                              }`}
                              onClick={() => handleOpenStatusModal(user, isSuspended ? 'active' : 'suspended')}
                              leftIcon={isSuspended ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            >
                              {isSuspended ? 'Reactivate' : 'Suspend'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog for Destructive Actions */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        isLoading={isSubmitting}
        title={
          confirmModal.type === 'role'
            ? `Change Role for ${confirmModal.targetUser?.fullName || confirmModal.targetUser?.email}`
            : `${confirmModal.targetStatus === 'suspended' ? 'Suspend' : 'Reactivate'} Account`
        }
        description={
          confirmModal.type === 'role'
            ? `Are you sure you want to change this user's role to ${confirmModal.targetRole?.toUpperCase()}? Administrators gain access to all moderation tools and database settings.`
            : `Are you sure you want to mark this account as ${confirmModal.targetStatus?.toUpperCase()}? Suspended users cannot post new listings or create community blueprints.`
        }
        confirmLabel={
          confirmModal.type === 'role'
            ? `Change to ${confirmModal.targetRole?.toUpperCase()}`
            : confirmModal.targetStatus === 'suspended'
            ? 'Suspend Account'
            : 'Reactivate Account'
        }
        isDestructive={
          confirmModal.type === 'role'
            ? confirmModal.targetRole === 'user'
            : confirmModal.targetStatus === 'suspended'
        }
        additionalInput={
          confirmModal.type === 'status' ? (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-forest-900">
                Administrative Reason (Logged in Audit Trail)
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter mandatory reason (e.g., spam promotional activity, violation of terms)..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-forest-200 text-xs focus:ring-2 focus:ring-forest-500/20"
                required
              />
            </div>
          ) : undefined
        }
      />
    </div>
  );
};
