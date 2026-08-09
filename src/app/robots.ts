import type { MetadataRoute } from "next";

/**
 * Without this the site answered 404 to /robots.txt. Crawlers cope, but they
 * have no way to find the sitemap, so every page has to be discovered by
 * following a link from another one.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: "https://mcebral.com/sitemap.xml",
        host: "https://mcebral.com",
    };
}
