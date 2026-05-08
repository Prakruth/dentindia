'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Users,
  AlertCircle,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { ClinicUser } from '@/lib/types';

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ClinicUser['status'] }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle size={12} />
        Approved
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle size={12} />
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Clock size={12} />
      Pending
    </span>
  );
}

function RoleBadge({ role }: { role: ClinicUser['role'] }) {
  const labels: Record<ClinicUser['role'], string> = {
    super_admin: 'Super Admin',
    clinic_admin: 'Clinic Admin',
    clinic_staff: 'Clinic Staff',
  };
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
      {labels[role]}
    </span>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClinicOption {
  id: string;
  name: string;
}

interface AddUserForm {
  clinic_id: string;
  email: string;
  password: string;
  role: 'clinic_admin' | 'clinic_staff' | '';
}

interface FormErrors {
  clinic_id?: string;
  email?: string;
  password?: string;
  role?: string;
}

const EMPTY_FORM: AddUserForm = {
  clinic_id: '',
  email: '',
  password: '',
  role: '',
};

// ─── Add User Modal ───────────────────────────────────────────────────────────

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [form, setForm] = useState<AddUserForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [clinicsError, setClinicsError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);

  // Fetch clinic list on open
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setClinicsLoading(true);
        setClinicsError(null);
        const res = await fetch('/api/admin/clinics-list');
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Failed to load clinics');
        }
        const { data }: { data: ClinicOption[] } = await res.json();
        setClinics(data);
      } catch (err) {
        setClinicsError(err instanceof Error ? err.message : 'Failed to load clinics');
      } finally {
        setClinicsLoading(false);
      }
    };
    fetchClinics();
  }, []);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!form.clinic_id) {
      errors.clinic_id = 'Please select a clinic';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      errors.password = 'Password is required';
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!form.role) {
      errors.role = 'Please select a role';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setSubmitLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          clinic_id: form.clinic_id,
          role: form.role,
        }),
      });

      if (res.status === 201) {
        onSuccess();
        return;
      }

      const body = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setSubmitError('An account with this email already exists');
      } else {
        setSubmitError(body.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (field: keyof AddUserForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputBase =
    'w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition';
  const inputNormal = `${inputBase} border-stone-300`;
  const inputError = `${inputBase} border-red-400 focus:ring-red-400`;

  return (
    /* Backdrop */
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="add-user-modal-title"
    >
      {/* Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2
            id="add-user-modal-title"
            className="font-display text-xl font-bold text-stone-900 flex items-center gap-2"
          >
            <UserPlus size={20} className="text-teal-600" />
            Add User
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">
            {/* Submit error banner */}
            {submitError && (
              <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{submitError}</p>
              </div>
            )}

            {/* Clinic field */}
            <div>
              <label
                htmlFor="add-user-clinic"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Clinic <span className="text-red-500">*</span>
              </label>
              {clinicsLoading ? (
                <div className="flex items-center gap-2 px-3 py-2.5 border border-stone-300 rounded-lg bg-stone-50 text-sm text-stone-500">
                  <Loader size={14} className="animate-spin" />
                  Loading clinics...
                </div>
              ) : clinicsError ? (
                <div className="flex items-center gap-2 px-3 py-2.5 border border-red-300 rounded-lg bg-red-50 text-sm text-red-700">
                  <AlertCircle size={14} />
                  {clinicsError}
                </div>
              ) : (
                <select
                  id="add-user-clinic"
                  value={form.clinic_id}
                  onChange={(e) => handleChange('clinic_id', e.target.value)}
                  className={formErrors.clinic_id ? inputError : inputNormal}
                  disabled={submitLoading}
                >
                  <option value="">Select a clinic</option>
                  {clinics.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
              {formErrors.clinic_id && (
                <p className="mt-1 text-xs text-red-600">{formErrors.clinic_id}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="add-user-email"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="add-user-email"
                type="email"
                autoComplete="off"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="clinic@example.com"
                className={formErrors.email ? inputError : inputNormal}
                disabled={submitLoading}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="add-user-password"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="add-user-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${formErrors.password ? inputError : inputNormal} pr-10`}
                  disabled={submitLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus:outline-none focus:text-stone-700 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
              )}
            </div>

            {/* Role field */}
            <div>
              <label
                htmlFor="add-user-role"
                className="block text-sm font-medium text-stone-700 mb-1.5"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="add-user-role"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={formErrors.role ? inputError : inputNormal}
                disabled={submitLoading}
              >
                <option value="">Select a role</option>
                <option value="clinic_admin">Clinic Admin</option>
                <option value="clinic_staff">Clinic Staff</option>
              </select>
              {formErrors.role && (
                <p className="mt-1 text-xs text-red-600">{formErrors.role}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
            <button
              type="button"
              onClick={onClose}
              disabled={submitLoading}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || clinicsLoading || !!clinicsError}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {submitLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<ClinicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load users');
      }
      const { data }: { data: ClinicUser[] } = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActioning(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Action failed');
      }
      // Refresh the list to reflect the change
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed. Please try again.');
    } finally {
      setActioning(null);
    }
  };

  const handleModalSuccess = async () => {
    setShowAddModal(false);
    setSuccessMessage('User created successfully. Share the login credentials with the clinic.');
    await fetchUsers();
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 flex items-center gap-3 mb-2">
            <Users size={32} className="text-teal-600" />
            Clinic Users
          </h1>
          <p className="text-stone-600">Manage clinic registrations and access</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shrink-0"
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" />
          <p className="text-green-800 text-sm flex-1">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            aria-label="Dismiss success message"
            className="text-green-600 hover:text-green-800 transition focus:outline-none"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={fetchUsers}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-stone-600">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
          <Users size={48} className="text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg font-medium">No clinic registrations yet</p>
          <p className="text-stone-400 text-sm mt-1">New registrations will appear here for approval.</p>
        </div>
      ) : (
        /* Table */
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Clinic Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Role</th>
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Registered</th>
                  <th className="text-left px-6 py-4 font-semibold text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-900">
                        {user.clinic_name || <span className="text-stone-400 italic">No clinic</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {user.email || <span className="text-stone-400 italic">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction(user.id, 'approved')}
                            disabled={actioning === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {actioning === user.id ? (
                              <Loader size={12} className="animate-spin" />
                            ) : (
                              <CheckCircle size={12} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(user.id, 'rejected')}
                            disabled={actioning === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            {actioning === user.id ? (
                              <Loader size={12} className="animate-spin" />
                            ) : (
                              <XCircle size={12} />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-stone-100">
            {users.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-stone-900">
                      {user.clinic_name || <span className="text-stone-400 italic">No clinic</span>}
                    </p>
                    <p className="text-sm text-stone-600 mt-0.5">
                      {user.email || '—'}
                    </p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center gap-3">
                  <RoleBadge role={user.role} />
                  <span className="text-xs text-stone-500">{formatDate(user.created_at)}</span>
                </div>
                {user.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAction(user.id, 'approved')}
                      disabled={actioning === user.id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {actioning === user.id ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(user.id, 'rejected')}
                      disabled={actioning === user.id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {actioning === user.id ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <XCircle size={14} />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div className="px-6 py-4 border-t border-stone-100 bg-stone-50">
            <p className="text-sm text-stone-600">
              <strong>{users.length}</strong> total registration{users.length !== 1 ? 's' : ''} —{' '}
              <strong className="text-yellow-700">{users.filter(u => u.status === 'pending').length}</strong> pending,{' '}
              <strong className="text-green-700">{users.filter(u => u.status === 'approved').length}</strong> approved,{' '}
              <strong className="text-red-700">{users.filter(u => u.status === 'rejected').length}</strong> rejected
            </p>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
