"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import type { Clinic, Service, ServiceVariant } from "@/lib/data";

const AVAILABLE_SERVICES = [
  "Consultation",
  "Root Canal Treatment",
  "Extraction",
  "Dental Implants",
  "Cleaning",
  "Braces & Aligners",
  "Braces",
  "Teeth Whitening",
  "Crown & Bridge",
  "Scaling",
  "Fillings",
  "Dentures"
];

interface ClinicFormProps {
  initialClinic?: Clinic;
  onSubmit: (clinic: Clinic) => void;
  isLoading?: boolean;
}

export default function ClinicForm({ initialClinic, onSubmit, isLoading = false }: ClinicFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Clinic>(
    initialClinic || {
      id: "",
      name: "",
      doctor: "",
      qualification: "",
      city: "Bengaluru",
      area: "",
      address: "",
      phone: "",
      email: "",
      rating: 4.5,
      reviewCount: 0,
      experience: 0,
      tagline: "",
      about: "",
      languages: [],
      timings: "Mon–Sat: 9 AM – 7 PM",
      services: [],
      specializations: [],
      image: "🦷",
    }
  );

  const [services, setServices] = useState<Service[]>(initialClinic?.services || []);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "Clinic name required (min 3 chars)";
    }
    if (!formData.doctor.trim() || formData.doctor.length < 3) {
      newErrors.doctor = "Doctor name required (min 3 chars)";
    }
    if (!formData.address.trim() || formData.address.length < 10) {
      newErrors.address = "Address required (min 10 chars)";
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Valid email required";
    }
    if (services.length === 0) {
      newErrors.services = "Add at least 1 service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const clinicToSubmit = {
      ...formData,
      id: formData.id || `clinic-${Date.now()}`,
      services,
    };

    onSubmit(clinicToSubmit);
  };

  const handleAddService = () => {
    setCurrentService({
      name: "",
      description: "",
      duration: "",
      priceFrom: 0,
      rating: 4.5,
      reviewCount: 0,
    });
    setShowServiceForm(true);
  };

  const handleEditService = (service: Service) => {
    setCurrentService(service);
    setShowServiceForm(true);
  };

  const handleSaveService = () => {
    if (!currentService || !currentService.name.trim()) {
      setErrors({ ...errors, serviceName: "Service name required" });
      return;
    }

    // Check if service with same name already exists (excluding current edit)
    const isNewService = !services.some(s => s.name === currentService.name);
    const isDuplicate = services.some(s => s.name === currentService.name && s.name !== currentService.name);

    if (isDuplicate) {
      setErrors({ ...errors, serviceName: "Service already exists" });
      return;
    }

    // If editing, replace. If adding, append.
    if (isNewService) {
      setServices([...services, currentService]);
    } else {
      setServices(services.map(s => s.name === currentService.name ? currentService : s));
    }

    setShowServiceForm(false);
    setCurrentService(null);
    setErrors({});
  };

  const handleDeleteService = (name: string) => {
    setServices(services.filter(s => s.name !== name));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="font-display text-3xl font-bold text-stone-900">
            {initialClinic ? "Edit Clinic" : "Add New Clinic"}
          </h1>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-semibold text-stone-900 text-lg">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Clinic Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Clinic name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.name ? "border-red-500" : "border-stone-200"
                }`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Doctor Name *</label>
              <input
                type="text"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Dr. Name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.doctor ? "border-red-500" : "border-stone-200"
                }`}
              />
              {errors.doctor && <p className="text-red-600 text-sm mt-1">{errors.doctor}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Qualification</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="BDS, MDS..."
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h2 className="font-semibold text-stone-900 text-lg">Location Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">City *</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="Area/Locality"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Full Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street, area, city, pincode"
              className={`w-full px-4 py-2.5 border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                errors.address ? "border-red-500" : "border-stone-200"
              }`}
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="clinic@email.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.email ? "border-red-500" : "border-stone-200"
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900 text-lg">Services ({services.length})</h2>
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>

          {errors.services && <p className="text-red-600 text-sm">{errors.services}</p>}

          {services.length > 0 && (
            <div className="space-y-3">
              {services.map((service, idx) => (
                <div key={idx} className="bg-stone-50 p-4 rounded-lg flex items-start justify-between group hover:bg-stone-100 transition">
                  <div className="flex-1 cursor-pointer" onClick={() => handleEditService(service)}>
                    <p className="font-medium text-stone-900">{service.name}</p>
                    <p className="text-sm text-stone-600">₹{service.priceFrom.toLocaleString()}{service.priceTo && service.priceTo > service.priceFrom ? ` – ₹${service.priceTo.toLocaleString()}` : ""}</p>
                    {service.variants && service.variants.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">{service.variants.length} variants</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(service.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showServiceForm && (
            <ServiceFormModal
              service={currentService}
              onChange={setCurrentService}
              onSave={handleSaveService}
              onClose={() => {
                setShowServiceForm(false);
                setCurrentService(null);
              }}
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-6 border-t border-stone-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition ${
              isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Saving..." : initialClinic ? "Save Changes" : "Add Clinic"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ServiceFormModalProps {
  service: Service | null;
  onChange: (service: Service) => void;
  onSave: () => void;
  onClose: () => void;
}

function ServiceFormModal({ service, onChange, onSave, onClose }: ServiceFormModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-stone-900 text-lg">Add Service</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Service Name *</label>
            <select
              value={service.name}
              onChange={(e) => onChange({ ...service, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
            >
              <option value="">Select a service</option>
              {AVAILABLE_SERVICES.map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
            <textarea
              value={service.description}
              onChange={(e) => onChange({ ...service, description: e.target.value })}
              placeholder="Service details..."
              rows={2}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Duration *</label>
            <input
              type="text"
              value={service.duration}
              onChange={(e) => onChange({ ...service, duration: e.target.value })}
              placeholder="e.g., 60 min or 2-3 sittings"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Price From *</label>
              <input
                type="number"
                value={service.priceFrom}
                onChange={(e) => onChange({ ...service, priceFrom: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Price To (Optional)</label>
              <input
                type="number"
                value={service.priceTo || ""}
                onChange={(e) => onChange({ ...service, priceTo: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
