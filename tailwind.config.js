/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        surface: "#121B2E",
        "surface-2": "#1A2540",
        line: "#24314F",
        ink: "#E8EEF9",
        muted: "#8C9BB8",
        accent: "#2DD4BF",
        "accent-2": "#38BDF8",
        warn: "#F59E0B",
        danger: "#F43F5E",
      },
      fontFamily: { sans: ['"Inter"', "system-ui", "sans-serif"], display: ['"Sora"', '"Inter"', "sans-serif"] },
      keyframes: {
        "fade-up": { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { "fade-up": "fade-up .45s cubic-bezier(.2,.7,.2,1) both" },
    },
  },
  plugins: [],
};
