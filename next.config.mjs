/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  images: {
    remotePatterns: [
      { 
        protocol: "https",
        hostname: "www.ksu.edu",
      },
      { 
        protocol: "https",
        hostname: "www.k-state.edu",
      },
      {
        protocol: "https",
        hostname: "kdd-wiki-website.azurewebsites.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "www.kddresearch.org",
      }
    ],
  },
  webpack: (config, context) => {
    if(process.env.NEXT_WEBPACK_USEPOLLING) {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 300
      }
    }
    return config
  },
  experimental: {
    turbo: {
      
    }
  }
};

export default nextConfig;



// set HOST=7nk0jl3t-3000.usw3.devtunnels.ms
