'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Building2, Phone, Clock, FileText, Tag, CheckCircle, AlertCircle,
  Loader, MapPin, User, GraduationCap, Mail, Briefcase, Plus, Trash2,
  Pencil, X, IndianRupee,
} from 'lucide-react';
import type { Clinic } from '@/lib/types';
import { AVAILABLE_SERVICES } from '@/lib/constants';

interface EditableClinicFields {
  doctor: string;
  qualification: string;
  experience: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  timings: string;
  tagline: string;
  about: string;
  languages: string;
  specializations: string;
}

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  duration: string;
  price_from: number;
  price_to: number | null;
}

interface ServiceForm {
  name: string;
  description: string;
  duration: string;
  price_from: string;
  price_to: string;
}

const EMPTY_SERVICE_FORM: ServiceForm = {
  name: '', description: '', duration: '', price_from: '', price_to: '',
};

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

function inputClass(error?: boolean) {
  return `w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2
    ${error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-stone-200 focus:border-teal-400 focus:ring-teal-100'}`;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-stone-700 mb-1.5">{children}</label>;
}

export default function ClinicPortalClinicPage() {
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [fields, setFields] = useState<EditableClinicFields>({
    doctor: '', qualification: '', experience: '',
    city: '', area: '', address: '',
    phone: '', email: '',
    timings: '', tagline: '', about: '',
    languages: '', specializations: '',
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Services state
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRow | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(EMPTY_SERVICE_FORM);
  const [serviceFormError, setServiceFormError] = useState<string | null>(null);
  const [serviceSubmitting, setServiceSubmitting] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/clinic-portal/clinic')
      .then((r) => (r.ok ? r.json() : r.json().then((e: { error: string }) => Promise.reject(e.error))))
      .then(({ data }: { data: Clinic }) => {
        setClinic(data);
        setFields({
          doctor: data.doctor ?? '',
          qualification: data.qualification ?? '',
          experience: data.experience != null ? String(data.experience) : '',
          city: data.city ?? '',
          area: data.area ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          timings: data.timings ?? '',
          tagline: data.tagline ?? '',
          about: data.about ?? '',
          languages: Array.isArray(data.languages) ? data.languages.join(', ') : '',
          specializations: Array.isArray(data.specializations) ? data.specializations.join(', ') : '',
        });
      })
      .catch((err: string) =>
        setFetchError(typeof err === 'string' ? err : 'Failed to load clinic details.')
      )
      .finally(() => setLoading(false));
  }, []);

  const fetchServices = useCallback(async () => {
    setServicesLoading(true);
    try {
      const res = await fetch('/api/clinic-portal/services');
      const json = await res.json();
      setServices(Array.isArray(json.data) ? json.data : []);
    } catch {
      // non-fatal
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (saveStatus !== 'idle') setSaveStatus('idle');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    setSaveMessage('');

    const payload = {
      ...fields,
      experience: fields.experience ? parseInt(fields.experience, 10) : 0,
      languages: fields.languages
        ? fields.languages.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      specializations: fields.specializations
        ? fields.specializations.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      const res = await fetch('/api/clinic-portal/clinic', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save changes');
      setClinic(json.data as Clinic);
      setSaveStatus('success');
      setSaveMessage('Changes saved successfully.');
    } catch (err) {
      setSaveStatus('error');
      setSaveMessage(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    }
  };

  // ── Service handlers ──────────────────────────────────────────────────────

  const openAddService = () => {
    setEditingService(null);
    setServiceForm(EMPTY_SERVICE_FORM);
    setServiceFormError(null);
    setShowServiceForm(true);
  };

  const openEditService = (svc: ServiceRow) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name,
      description: svc.description ?? '',
      duration: svc.duration ?? '',
      price_from: String(svc.price_from),
      price_to: svc.price_to != null ? String(svc.price_to) : '',
    });
    setServiceFormError(null);
    setShowServiceForm(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceFormError(null);

    if (!serviceForm.name.trim()) {
      setServiceFormError('Service name is required');
      return;
    }
    const priceFrom = parseFloat(serviceForm.price_from);
    if (!serviceForm.price_from || isNaN(priceFrom) || priceFrom < 0) {
      setServiceFormError('Starting price must be a valid number');
      return;
    }

    setServiceSubmitting(true);
    const body = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      duration: serviceForm.duration.trim(),
      price_from: priceFrom,
      price_to: serviceForm.price_to ? parseFloat(serviceForm.price_to) : null,
    };

    try {
      const url = editingService
        ? `/api/clinic-portal/services/${editingService.id}`
        : '/api/clinic-portal/services';
      const res = await fetch(url, {
        method: editingService ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save service');
      setShowServiceForm(false);
      await fetchServices();
    } catch (err) {
      setServiceFormError(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setServiceSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    setDeletingServiceId(id);
    try {
      await fetch(`/api/clinic-portal/services/${id}`, { method: 'DELETE' });
      await fetchServices();
    } finally {
      setDeletingServiceId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={32} className="animate-spin text-teal-600" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
        <p className="text-red-800">{fetchError}</p>
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-1">My Clinic</h1>
        <p className="text-stone-500 text-sm">Manage your clinic profile and services</p>
      </div>

      {/* Clinic name — read only */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 flex items-center gap-3">
        <Building2 size={18} className="text-teal-600 flex-shrink-0" />
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide font-semibold">Clinic Name</p>
          <p className="font-semibold text-stone-900">{clinic.name}</p>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} noValidate>
        {/* Doctor Info */}
        <Section title="Doctor Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label><span className="flex items-center gap-1.5"><User size={13} />Doctor Name</span></Label>
              <input name="doctor" value={fields.doctor} onChange={handleChange}
                placeholder="Dr. Full Name" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><GraduationCap size={13} />Qualification</span></Label>
              <input name="qualification" value={fields.qualification} onChange={handleChange}
                placeholder="e.g. BDS, MDS" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><Briefcase size={13} />Years of Experience</span></Label>
              <input name="experience" type="number" min="0" value={fields.experience} onChange={handleChange}
                placeholder="e.g. 10" className={inputClass()} />
            </div>
          </div>
        </Section>

        {/* Contact & Location */}
        <Section title="Contact & Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label><span className="flex items-center gap-1.5"><Phone size={13} />Phone</span></Label>
              <input name="phone" type="tel" value={fields.phone} onChange={handleChange}
                placeholder="+91 98765 43210" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><Mail size={13} />Email</span></Label>
              <input name="email" type="email" value={fields.email} onChange={handleChange}
                placeholder="clinic@example.com" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><MapPin size={13} />City</span></Label>
              <input name="city" value={fields.city} onChange={handleChange}
                placeholder="e.g. Bangalore" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><MapPin size={13} />Area</span></Label>
              <input name="area" value={fields.area} onChange={handleChange}
                placeholder="e.g. Koramangala" className={inputClass()} />
            </div>
            <div className="sm:col-span-2">
              <Label><span className="flex items-center gap-1.5"><MapPin size={13} />Full Address</span></Label>
              <input name="address" value={fields.address} onChange={handleChange}
                placeholder="Street address" className={inputClass()} />
            </div>
          </div>
        </Section>

        {/* Clinic Details */}
        <Section title="Clinic Details">
          <div className="space-y-4">
            <div>
              <Label><span className="flex items-center gap-1.5"><Clock size={13} />Timings</span></Label>
              <input name="timings" value={fields.timings} onChange={handleChange}
                placeholder="e.g. Mon-Sat: 9am-7pm, Sun: Closed" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><Tag size={13} />Tagline</span></Label>
              <input name="tagline" value={fields.tagline} onChange={handleChange}
                placeholder="e.g. Your smile, our priority" className={inputClass()} />
            </div>
            <div>
              <Label><span className="flex items-center gap-1.5"><FileText size={13} />About</span></Label>
              <textarea name="about" rows={4} value={fields.about} onChange={handleChange}
                placeholder="Describe your clinic and what makes you unique..."
                className={`${inputClass()} resize-y`} />
            </div>
            <div>
              <Label>Languages Spoken <span className="text-stone-400 font-normal">(comma-separated)</span></Label>
              <input name="languages" value={fields.languages} onChange={handleChange}
                placeholder="e.g. English, Hindi, Kannada" className={inputClass()} />
            </div>
            <div>
              <Label>Specializations <span className="text-stone-400 font-normal">(comma-separated)</span></Label>
              <input name="specializations" value={fields.specializations} onChange={handleChange}
                placeholder="e.g. Orthodontics, Implants, Root Canal" className={inputClass()} />
            </div>
          </div>
        </Section>

        {/* Save feedback */}
        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            <CheckCircle size={16} />{saveMessage}
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <AlertCircle size={16} />{saveMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={saveStatus === 'saving'}
          className="w-full sm:w-auto px-8 py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {saveStatus === 'saving' ? (
            <span className="flex items-center gap-2"><Loader size={16} className="animate-spin" />Saving...</span>
          ) : 'Save Changes'}
        </button>
      </form>

      {/* Services */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-semibold text-stone-800">Services</h2>
            <p className="text-xs text-stone-400 mt-0.5">Services visible to patients when booking</p>
          </div>
          <button
            onClick={openAddService}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <Plus size={14} />Add Service
          </button>
        </div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader size={24} className="animate-spin text-stone-400" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            <p className="font-medium">No services added yet</p>
            <p className="text-xs mt-1">Add services so patients can book appointments</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {services.map((svc) => (
              <div key={svc.id} className="flex items-start justify-between gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900">{svc.name}</p>
                  {svc.description && <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">{svc.description}</p>}
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-stone-500">
                    {svc.duration && <span className="flex items-center gap-1"><Clock size={11} />{svc.duration}</span>}
                    <span className="flex items-center gap-1">
                      <IndianRupee size={11} />
                      {svc.price_from}{svc.price_to ? ` – ${svc.price_to}` : '+'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEditService(svc)}
                    className="p-1.5 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDeleteService(svc.id)}
                    disabled={deletingServiceId === svc.id}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50">
                    {deletingServiceId === svc.id
                      ? <Loader size={15} className="animate-spin" />
                      : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service form modal */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-900">
                {editingService ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setShowServiceForm(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleServiceSubmit} noValidate>
              <div className="px-6 py-5 space-y-4">
                {serviceFormError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    <AlertCircle size={14} />{serviceFormError}
                  </div>
                )}
                <div>
                  <Label>Service Name <span className="text-red-500">*</span></Label>
                  <select
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm(p => ({ ...p, name: e.target.value }))}
                    className={`${inputClass()} bg-white`}
                  >
                    <option value="">Select a service</option>
                    {AVAILABLE_SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea rows={2} value={serviceForm.description} onChange={(e) => setServiceForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of the service"
                    className={`${inputClass()} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Duration</Label>
                    <input value={serviceForm.duration} onChange={(e) => setServiceForm(p => ({ ...p, duration: e.target.value }))}
                      placeholder="e.g. 30 mins" className={inputClass()} />
                  </div>
                  <div>
                    <Label>Price From (₹) <span className="text-red-500">*</span></Label>
                    <input type="number" min="0" value={serviceForm.price_from} onChange={(e) => setServiceForm(p => ({ ...p, price_from: e.target.value }))}
                      placeholder="500" className={inputClass()} />
                  </div>
                </div>
                <div>
                  <Label>Price To (₹) <span className="text-stone-400 font-normal">optional</span></Label>
                  <input type="number" min="0" value={serviceForm.price_to} onChange={(e) => setServiceForm(p => ({ ...p, price_to: e.target.value }))}
                    placeholder="Leave blank if fixed price" className={inputClass()} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50">
                <button type="button" onClick={() => setShowServiceForm(false)}
                  className="px-4 py-2 text-sm text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-100 transition">
                  Cancel
                </button>
                <button type="submit" disabled={serviceSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 transition">
                  {serviceSubmitting ? <><Loader size={14} className="animate-spin" />Saving...</> : editingService ? 'Update' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
      <h2 className="font-semibold text-stone-700 text-sm uppercase tracking-wide mb-4">{title}</h2>
      {children}
    </div>
  );
}
