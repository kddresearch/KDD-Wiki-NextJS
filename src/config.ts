const config_str = process.env.config;

if (!config_str) {
  throw new Error("config.ts: process.env.config is not set");
}

const config = JSON.parse(config_str);

export default config;