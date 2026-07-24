import type { NextConfig } from "next";
import path from "path";
import config from "./config/config";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.20'],
  /* config options here */
  turbopack: {
    root: path.join(__dirname, "..")
  },
  images: {
     unoptimized: config.isDEV
  }
};

export default nextConfig;