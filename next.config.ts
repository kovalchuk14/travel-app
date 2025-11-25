import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // FTP GoIT
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/img/**", // дозволяє завантажувати всі зображення з /img/
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
