import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Cambia esto por los dominios que uses para imágenes externas
  },
};

export default nextConfig;
