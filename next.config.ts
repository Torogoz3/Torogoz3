import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Modo estricto para encontrar problemas potenciales
  reactStrictMode: true,

  // Configuración para el soporte de imágenes.
  images: {
    domains: ["example.com"], 
    unoptimized: false, // Cambiar a true solo si se exporta a estatico
  },

  
  webpack: (config) => {
    
    return config;
  },

  // Internacionalización
  i18n: {
    locales: ["en", "es"], // Idiomas soportados
    defaultLocale: "en", // Idioma por defecto
  },

};

export default nextConfig;
