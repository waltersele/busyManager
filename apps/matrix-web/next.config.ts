import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/dashboard/modules', destination: '/dashboard', permanent: false },
      { source: '/dashboard/connections', destination: '/dashboard/settings/integrations', permanent: false },
      { source: '/dashboard/users', destination: '/dashboard/settings/team', permanent: false },
      { source: '/dashboard/businesses', destination: '/dashboard/settings/business', permanent: false },
      { source: '/dashboard/catalog', destination: '/dashboard/settings/apps', permanent: false },
      { source: '/dashboard/catalog/:path*', destination: '/dashboard/settings/apps', permanent: false },
      { source: '/dashboard/integrations', destination: '/dashboard/settings/integrations', permanent: false },
      { source: '/dashboard/team', destination: '/dashboard/settings/team', permanent: false },
      { source: '/dashboard/tokens', destination: '/dashboard/settings/tokens', permanent: false },
    ];
  },
};

export default nextConfig;
