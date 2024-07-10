import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        pri: { 
          DEFAULT: "#3b82f6",
          dark: "#60a5fa"
        },
        sec: {
          DEFAULT: "#f43f5e",
          dark: "#fb7185"
        },
        ter: {
          DEFAULT: "#f0f0f0",
          dark: "#fefefe"
        },
        red: {
          DEFAULT: "#dc2626",
          dark: "#f87171"
        },
        green: {
          DEFAULT: "#0d9488",
          dark: "#2dd4bf"
        },
        amber: {
          DEFAULT: "#d97706",
          dark: "#fbbf24"
        },
        highlight: {
          DEFAULT: "#f3f4f6",
          dark: "#11181c"
        },
        border: {
          DEFAULT: "#d1d5db",
          dark: "#374151"
        }
      }
    }
  },
  plugins: [],
};
export default config;
