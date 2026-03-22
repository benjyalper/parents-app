/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external image domains (add Cloudinary/Supabase domains here later)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ready for future Cloudinary integration
      },
    ],
  },
};

module.exports = nextConfig;
