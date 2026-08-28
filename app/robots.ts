import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://youknowme.example.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
