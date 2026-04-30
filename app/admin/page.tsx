"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Stethoscope, ArrowRight } from "lucide-react";
import { getStats, getAdminClinics, initializeAdminClinics, CLINICS } from "@/lib/adminData";
import type { Clinic } from "@/lib/types";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function AdminDashboardContent() {
  const [stats, setStats] = useState({ totalClinics: 0, totalCities: 0, totalServices: 0 });
  const [recentClinics, setRecentClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    initializeAdminClinics(CLINICS);
    const newStats = getStats();
    setStats(newStats);

    const clinics = getAdminClinics();
    setRecentClinics(clinics.slice(-3).reverse());
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
        <p className="text-stone-600">Welcome to DentIndia Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            label: "Total Clinics",
            value: stats.totalClinics,
            icon: Building2,
            color: "blue",
          },
          {
            label: "Cities",
            value: stats.totalCities,
            icon: MapPin,
            color: "teal",
          },
          {
            label: "Services",
            value: stats.totalServices,
            icon: Stethoscope,
            color: "green",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-50 border-blue-200",
            teal: "bg-teal-50 border-teal-200",
            green: "bg-green-50 border-green-200",
          };
          return (
            <div
              key={idx}
              className={`${colorClasses[stat.color as keyof typeof colorClasses]} border-2 rounded-2xl p-6`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-600 mb-1">{stat.label}</p>
                  <p className="font-display text-4xl font-bold text-stone-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} className="text-stone-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <Link
          href="/admin/clinics"
          className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">Manage Clinics</h3>
              <p className="text-sm text-stone-600">Add, edit, or delete clinic information</p>
            </div>
            <ArrowRight size={20} className="text-stone-400 group-hover:text-blue-600 transition" />
          </div>
        </Link>
        <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 opacity-50 cursor-not-allowed">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">View Bookings</h3>
              <p className="text-sm text-stone-600">Coming soon...</p>
            </div>
            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded">Soon</span>
          </div>
        </div>
      </div>

      {/* Recent Clinics */}
      {recentClinics.length > 0 && (
        <div>
          <h2 className="font-semibold text-stone-900 text-lg mb-4">Recent Clinics</h2>
          <div className="space-y-3">
            {recentClinics.map((clinic: any, idx) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-lg p-4 hover:border-blue-300 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{clinic.image}</span>
                    <div>
                      <p className="font-medium text-stone-900">{clinic.name}</p>
                      <p className="text-sm text-stone-600">{clinic.doctor} • {clinic.city}</p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/clinics/${clinic.id}/edit`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
