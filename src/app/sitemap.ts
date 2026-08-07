import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const BASE = "https://mcebral.com";

/**
 * Every page the site actually wants found. /articles is left out on purpose:
 * it redirects to /projects now, and listing a redirect asks a crawler to
 * spend a visit learning nothing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const paginas: MetadataRoute.Sitemap = [
        { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
        { url: `${BASE}/projects`, changeFrequency: "monthly", priority: 0.9 },
        { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.8 },
        { url: `${BASE}/about/cv`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE}/about/experiences`, changeFrequency: "yearly", priority: 0.6 },
        { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ];

    // The article pipeline is dormant, so this adds nothing today. It is here
    // so the first published piece is listed without anybody remembering to.
    const articulos = await getAllArticles();
    for (const a of articulos) {
        paginas.push({
            url: `${BASE}/articles/${a.slug}`,
            changeFrequency: "yearly",
            priority: 0.7,
        });
    }

    return paginas;
}
