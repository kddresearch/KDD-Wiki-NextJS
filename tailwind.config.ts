import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      textDecorationThickness: {
        3: '3px',
      }
    },
    container: {
      center: true,
      // padding: "1rem",
    },
    colors: {
      'purple': '#512888',
      'white': '#ffffff',
      'gray': '#eeeeee',
      'black': '#000000',
      'yellow': '#f0ad00',
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
export default config;
