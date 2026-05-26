import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        layer1: "#111111",
        layer2: "#1A1A1A",
        layer3: "#232323",
        line: "#262626",
        gold: "#E8B863",
        goldhi: "#F2D69B",
        golddim: "#8A6B36",
        mute: "#8A8580",
        paper: "#F4EFE6"
      },
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas"]
      },
      boxShadow: {
        gold: "0 20px 60px -30px rgba(232, 184, 99, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
