import type { NextConfig } from "next";
import path from "path";
import config from "./config/config";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins:['172.22.0.1'],
  turbopack: {
    root: path.join(__dirname, "..")
  },
  images: {
    unoptimized: config.isDEV
  }
};

export default nextConfig;