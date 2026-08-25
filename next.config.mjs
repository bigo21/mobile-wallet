/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Si tu as des images optimisées (next/image), ajoute ceci pour le mode statique :
  images: {
    unoptimized: true,
  },
  transpilePackages: ["geist"],
};

export default nextConfig;
