/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 180,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pageoneworks.vercel.app' }],
        destination: 'https://www.pageoneworks.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.pageoneworks.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'ezzwvqzpxvqecyxvxsav.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
