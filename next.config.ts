import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // The photo wall is the heaviest thing the site serves. AVIF lands about a
        // third smaller than WebP on these, and Next falls back on its own for the
        // browsers that cannot read it.
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async headers() {
        return [
            {
                // Android hands a download to the installer by its type. Sent as
                // a generic file, some phones save the APK and then cannot open
                // it from the notification.
                source: '/downloads/:file(.*\\.apk)',
                headers: [
                    { key: 'Content-Type', value: 'application/vnd.android.package-archive' },
                    { key: 'Content-Disposition', value: 'attachment' },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                // The projects gallery lived at /articles, which said one thing
                // while the page showed another and the menu said a third.
                // Permanent, so the address that is already out there keeps its
                // weight instead of losing it.
                source: '/articles',
                destination: '/projects',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
