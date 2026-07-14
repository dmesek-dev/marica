/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project (a stray lockfile exists in a parent dir).
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
