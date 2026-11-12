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
                // The Sample Newsroom demo runs in WordPress Playground, which
                // downloads its blueprint and two zip files from here. That
                // page lives on another site, so the browser needs to be told
                // it may read them.
                source: '/newsroom/playground/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                ],
            },
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
    async rewrites() {
        return [
            {
                // Sample Newsroom is a static copy of a WordPress site kept in
                // public/newsroom. Next does not serve the index of a public
                // folder by itself, so the address is pointed at the file.
                source: '/newsroom',
                destination: '/newsroom/index.html',
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
