import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 24px 80px rgba(197, 102, 52, 0.16)",
      },
      colors: {
        alba: {
          clay: "#c56634",
          cream: "#f7f1e5",
          forest: "#1f5c50",
          gold: "#d7ae4d",
          ink: "#1d3029",
          mist: "#efe7d8",
          rose: "#f4d8ca",
        },
      },
    },
  },
  plugins: [],
};

export default config;
