/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: "ksu.edu",
      },
      { 
        protocol: "https",
        hostname: "k-state.edu",
      },
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
};

export default nextConfig;



// set HOST=7nk0jl3t-3000.usw3.devtunnels.ms
