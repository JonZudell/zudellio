import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // The deployment target is a container running `node server.js`.
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
