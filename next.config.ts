import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
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
