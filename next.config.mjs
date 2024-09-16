/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/lib/devtools/elora-devtools',
        destination: '/lib/devtools/elora-devtools.html',
      },
    ];
  },
};

export default nextConfig;
