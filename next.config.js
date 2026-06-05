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
