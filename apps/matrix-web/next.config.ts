import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/dashboard/modules', destination: '/dashboard', permanent: false },
      { source: '/dashboard/connections', destination: '/dashboard/integrations', permanent: false },
      { source: '/dashboard/users', destination: '/dashboard/team', permanent: false },
      { source: '/dashboard/businesses', destination: '/dashboard/settings', permanent: false },
    ];
  },
};

export default nextConfig;
