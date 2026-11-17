import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bfd3ff",
          300: "#92b5ff",
          400: "#5d8fff",
          500: "#396eea",
          600: "#2a57c8",
          700: "#2245a0",
          800: "#203d82",
          900: "#203668"
        }
      },
      boxShadow: {
        glass: "0 12px 35px rgba(16, 26, 54, 0.14)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top, rgba(57, 110, 234, 0.14), transparent 36%), radial-gradient(circle at 90% 0%, rgba(115, 103, 240, 0.18), transparent 22%), linear-gradient(180deg, #f9fbff, #edf1fb 45%, #f9fbff)"
      }
    }
  },
  plugins: []
} satisfies Config;
