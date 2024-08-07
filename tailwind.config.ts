import { light } from "@mui/material/styles/createPalette";
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
        3: "3px",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.black'),
          },
        },
        lg: {
          css: {
            lineHeight: '1.75rem', // Adjust the line height for prose-lg
          },
        },
      }),
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      center: true,
    },
    // https://www.k-state.edu/communications-marketing/documents/Brand-Guidelines.pdf
    colors: {
      purple: "#512888",
      white: "#FFFFFF",
      lightgray: "#eeeeee",
      gray: "#D1D1D1",
      darkgray: "#A7A7A7",
      black: "#000000",
      yellow: "#f0ad00",
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;

