import { transform } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spin: "spin 1500ms linear infinite",
        "loading-effect": "loading-effect 3s linear infinite",
      },
      keyframes: {
        "loading-effect": {
          "0%": {
            backgroundImage: "linear-gradient(to right, #d9d9d9 0%, rgba(0,0,0,0.05), 20%, #d9d9d9 40%, #d9d9d9 100%)",
            backgroundPosition: '-450px 0'
          },
          "100%": {
            backgroundImage: "linear-gradient(to right, #d9d9d9 0%, rgba(0,0,0,0.05), 20%, #d9d9d9 40%, #d9d9d9 100%)",
            backgroundPosition: '450px 0'
          },
        },
      },
    },
  },
  plugins: [],
};
