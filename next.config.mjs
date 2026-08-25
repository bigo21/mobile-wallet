/** @type {import('next').NextConfig} */
const nextConfig = {
  // Déploiement Vercel : app Next.js complète (routes API serverless).
  // (Plus de `output: 'export'` — c'était pour l'hébergement statique WordPress.)
  images: {
    unoptimized: true,
  },
  transpilePackages: ["geist"],
};

export default nextConfig;
