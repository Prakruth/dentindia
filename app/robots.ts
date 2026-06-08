import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/clinic-portal/", "/api/", "/booking/", "/booking-confirmation/"],
      },
    ],
    sitemap: "https://dentobook.in/sitemap.xml",
    host: "https://dentobook.in",
  };
}
