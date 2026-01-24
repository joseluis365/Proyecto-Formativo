/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#13ecb6",
        "background-light": "#f6f8f8",
        "background-dark": "#10221d",
        "primary-green": "#2D8A6E",
        "accent-teal": "#40919E",
        "neutral-gray-text": "#6B7280",
        "neutral-gray-border": "#D1D5DB",
        "soft-red": "#EF4444",
        "soft-blue": "#3B82F6",
        "soft-orange": "#F97316",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
