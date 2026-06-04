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
      { source: '/article/geo-generative-engine-optimization-complete-guide-2026', destination: '/article/geo-guide', permanent: true },
      { source: '/article/chatgpt-gemini-claude-manus-perplexity-comparison-2026', destination: '/article/ai-tool-compare', permanent: true },
      { source: '/article/ulthera-shrink-doublo-inmode-lifting-comparison-2026', destination: '/article/lifting-compare', permanent: true },
      { source: '/article/early-study-abroad-boarding-school-guide-2026', destination: '/article/boarding-school', permanent: true },
      { source: '/article/seoul-fine-dining-reservation-guide-2026', destination: '/article/fine-dining-book', permanent: true },
      { source: '/article/comprehensive-income-tax-filing-guide-2026', destination: '/article/income-tax-filing', permanent: true },
      { source: '/article/glp1-obesity-drug-complete-guide-2026', destination: '/article/glp1-guide', permanent: true },
      { source: '/article/menopause-hrt-complete-guide-2026', destination: '/article/menopause-hrt', permanent: true },
      { source: '/article/seo-aieo-complete-guide-2026', destination: '/article/seo-aieo', permanent: true },
      { source: '/article/international-school-korea-2026', destination: '/article/intl-school-kr', permanent: true },
      { source: '/article/clean-beauty-revolution-2026', destination: '/article/clean-beauty', permanent: true },
      { source: '/article/global-asset-management-2026', destination: '/article/global-assets', permanent: true },
      { source: '/article/ivy-league-admission-2026', destination: '/article/ivy-admission', permanent: true },
      { source: '/article/natural-wine-guide-2026', destination: '/article/natural-wine', permanent: true },
      { source: '/article/michelin-seoul-food-2026', destination: '/article/michelin-food', permanent: true },
      { source: '/article/future-of-anti-aging-2026', destination: '/article/anti-aging-future', permanent: true },
      { source: '/article/seoul-luxury-spa-wellness', destination: '/article/seoul-spa', permanent: true },
      { source: '/article/seoul-premium-dermatology-2026', destination: '/article/seoul-derma', permanent: true },
      { source: '/article/seoul-fashion-trend-2026', destination: '/article/seoul-fashion', permanent: true },
      { source: '/article/us-iran-war-korea-economy-2026', destination: '/article/iran-war-impact', permanent: true },
      { source: '/article/pregnancy-week-calculator', destination: '/article/pregnancy-calc', permanent: true },
      { source: '/article/tax-vat-calculator-complete-2026', destination: '/article/tax-vat-calc', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.pageoneworks.com' },
    ],
  },
};
module.exports = nextConfig;