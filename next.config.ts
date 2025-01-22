import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Genera un sitio estático
  basePath: '/Torogoz3', // Reemplaza con el nombre de tu repositorio
  images: {
    unoptimized: true, // Necesario si usas imágenes en Next.js
  },
};

export default nextConfig;
