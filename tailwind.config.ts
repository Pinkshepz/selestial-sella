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
        base: {
          DEFAULT: "#000",
          dark: "#fff"
        },
        pri: { 
          DEFAULT: "#3b82f6",
          dark: "#60a5fa"
        },
        sec: {
          DEFAULT: "#db2777",
          dark: "#f472b6"
        },
        ter: {
          DEFAULT: "#cbd5e1",
          dark: "#475569"
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
        card: {
          DEFAULT: "#f1f5f9",
          dark: "#1a1c21"
        },
        border: {
          DEFAULT: "#e2e8f0",
          dark: "#828d9f"
        }
      }
    }
  },
  plugins: [],
};
export default config;
