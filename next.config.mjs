/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["www.datocms-assets.com"],
  },
  // output: "standalone",
  webpack: (config, context) => {
    // Enable polling based on env variable being set
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
