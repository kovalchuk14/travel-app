// 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
    // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },

      // ftp.goit.study
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
