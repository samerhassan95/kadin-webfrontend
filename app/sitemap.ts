import { MetadataRoute } from "next";

export default (): MetadataRoute.Sitemap => [
  {
    url: "https://kadin.app",
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 1,
  },
  {
    url: "https://kadin.app/main",
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: "https://kadin.app/blogs",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  },
];
