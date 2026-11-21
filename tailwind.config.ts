import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#F9F4EB",
        "bg-secondary": "#EFE6D8",
        "surface-white": "#FFFFFF",
        "brand-primary": "#683B1E",
        "brand-primary-hover": "#4F2B14",
        "brand-accent": "#B5895A",
        "text-primary": "#2A1D15",
        "text-secondary": "#6F5E53",
        "border-subtle": "#E2D6C5",
        "badge-sale": "#9E2A2B",
      },
      fontFamily: {
        sans: ["var(--active-font-sans)"],
        serif: ["var(--active-font-display)"],
        display: ["var(--active-font-display)"],
        brand: ["var(--active-font-brand)"],
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(104, 59, 30, 0.06)",
        "editorial-lg": "0 12px 32px -4px rgba(104, 59, 30, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
