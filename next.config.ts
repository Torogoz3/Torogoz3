import type { NextConfig } from "next";

const nextConfig: NextConfig = {  
  basePath: '/Torogoz3', // Reemplaza con el nombre de tu repositorio
  output: 'export', // Genera un sitio estático
  images: {
    unoptimized: true, // Necesario si usas imágenes en Next.js
  },
};

export default nextConfig;
