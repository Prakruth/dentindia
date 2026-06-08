import { MetadataRoute } from "next";
import { getAllClinics, getAllServices } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [clinics, services] = await Promise.all([getAllClinics(), getAllServices()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://dentobook.in",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://dentobook.in/clinic-directory",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const clinicRoutes: MetadataRoute.Sitemap = clinics.map((clinic) => ({
    url: `https://dentobook.in/clinic/${clinic.id}`,
    lastModified: new Date(clinic.updated_at || clinic.created_at || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `https://dentobook.in/services/${encodeURIComponent(service)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...clinicRoutes, ...serviceRoutes];
}
