"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Plus, Pencil, Trash2, Search, MapPin, Users } from "lucide-react";
import { getAdminClinics, deleteClinic, initializeAdminClinics, CLINICS } from "@/lib/adminData";
import type { Clinic } from "@/lib/types";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function ClinicsPageContent() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with default clinics if empty
    initializeAdminClinics(CLINICS);
    const adminClinics = getAdminClinics();
    setClinics(adminClinics);
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteClinic(id);
    setClinics(clinics.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  // Filter and search
  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === "all" || clinic.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(clinics.map(c => c.city))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-900 flex items-center gap-3 mb-2">
            <Building2 size={32} className="text-teal-600" />
            Clinics Management
          </h1>
          <p className="text-stone-600">Manage and configure your dental clinics</p>
        </div>
        <Link
          href="/admin/clinics/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} />
          Add New Clinic
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search by clinic or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="px-4 py-2.5 border border-stone-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
        >
          <option value="all">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Clinics Grid */}
      {filteredClinics.length === 0 ? (
        <div className="text-center py-16">
          <Building2 size={48} className="text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">
            {clinics.length === 0
              ? "No clinics yet. Add your first clinic!"
              : "No clinics match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              {/* Clinic Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{clinic.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-900 text-lg">{clinic.name}</h3>
                  <p className="text-sm text-stone-600 mb-2">{clinic.doctor}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      <MapPin size={12} />
                      {clinic.city}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-600 text-xs font-medium rounded-full">
                      <Users size={12} />
                      {clinic.services.length} services
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-stone-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
                <p className="text-stone-600">
                  <span className="font-medium text-stone-900">Experience:</span> {clinic.experience} years
                </p>
                <p className="text-stone-600">
                  <span className="font-medium text-stone-900">Rating:</span> ⭐ {clinic.rating} ({clinic.reviewCount} reviews)
                </p>
                <p className="text-stone-600">
                  <span className="font-medium text-stone-900">Specializations:</span> {clinic.specializations.join(", ")}
                </p>
              </div>

              {/* Services Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-stone-600 uppercase tracking-wide mb-2">Top Services</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.services.slice(0, 3).map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-200"
                    >
                      {service.name}
                    </span>
                  ))}
                  {clinic.services.length > 3 && (
                    <span className="px-2.5 py-1.5 text-stone-500 text-xs">+{clinic.services.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/clinics/${clinic.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteConfirm(clinic.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === clinic.id && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-sm">
                    <p className="text-stone-900 font-semibold mb-2">Delete Clinic?</p>
                    <p className="text-stone-600 text-sm mb-6">
                      Are you sure you want to delete <strong>{clinic.name}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(clinic.id)}
                        className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-sm text-stone-600">
          Showing <strong>{filteredClinics.length}</strong> of <strong>{clinics.length}</strong> clinics across{" "}
          <strong>{uniqueCities.length}</strong> {uniqueCities.length === 1 ? "city" : "cities"} with{" "}
          <strong>{clinics.reduce((sum, c) => sum + c.services.length, 0)}</strong> total services
        </p>
      </div>
    </div>
  );
}

export default function ClinicsPage() {
  return (
    <ProtectedRoute>
      <ClinicsPageContent />
    </ProtectedRoute>
  );
}
