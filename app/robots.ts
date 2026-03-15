import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: "/country-select/",
  },
  sitemap: "https://kadin.app/sitemap.xml",
});

export default robots;
