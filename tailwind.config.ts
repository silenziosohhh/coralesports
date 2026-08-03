import type { Config } from "tailwindcss";

const fullOpacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, step) => [String(step), String(step / 100)]),
);

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      opacity: fullOpacityScale,
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--bg-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--bg-primary)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--bg-primary)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        navy: "var(--bg-primary)",
        "slate-dark": "var(--bg-secondary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "discord-blue": "var(--discord-blue)",
        cyan: {
          DEFAULT: "var(--color-primary)",
          100: "var(--cyan-100)",
          200: "var(--cyan-200)",
          300: "var(--cyan-300)",
        },
        blue: {
          DEFAULT: "var(--blue-200)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
        },
        purple: {
          DEFAULT: "var(--purple-200)",
          100: "var(--purple-100)",
          200: "var(--purple-200)",
        },
        green: {
          DEFAULT: "var(--green-200)",
          100: "var(--green-100)",
          200: "var(--green-200)",
          300: "var(--green-300)",
        },
        yellow: {
          DEFAULT: "var(--yellow-200)",
          100: "var(--yellow-100)",
          200: "var(--yellow-200)",
          300: "var(--yellow-300)",
        },
        orange: {
          DEFAULT: "var(--orange-200)",
          100: "var(--orange-100)",
          200: "var(--orange-200)",
          300: "var(--orange-300)",
        },
        red: {
          DEFAULT: "var(--red-100)",
          100: "var(--red-100)",
          200: "var(--red-200)",
        },
        gray: {
          DEFAULT: "var(--gray-300)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
        },
        dark: {
          DEFAULT: "var(--dark-100)",
          100: "var(--dark-100)",
          200: "var(--dark-200)",
          300: "var(--dark-300)",
        },
        white: {
          DEFAULT: "rgb(255 255 255 / <alpha-value>)",
          100: "var(--white-100)",
          200: "var(--white-200)",
          300: "var(--white-300)",
          400: "var(--white-400)",
          500: "var(--white-500)",
          600: "var(--white-600)",
          700: "var(--white-700)",
        },
        black: {
          DEFAULT: "rgb(0 0 0 / <alpha-value>)",
          100: "var(--black-100)",
          200: "var(--black-200)",
          300: "var(--black-300)",
          400: "var(--black-400)",
          500: "var(--black-500)",
          600: "var(--black-600)",
          700: "var(--black-700)",
          800: "var(--black-800)",
          900: "var(--black-900)",
          1000: "var(--black-1000)",
        },
        darkslategray: {
          DEFAULT: "var(--darkslategray-100)",
          100: "var(--darkslategray-100)",
          200: "var(--darkslategray-200)",
          300: "var(--darkslategray-300)",
          400: "var(--darkslategray-400)",
          500: "var(--darkslategray-500)",
        },
        deepskyblue: {
          DEFAULT: "var(--deepskyblue-100)",
          100: "var(--deepskyblue-100)",
          200: "var(--deepskyblue-200)",
          300: "var(--deepskyblue-300)",
          400: "var(--deepskyblue-400)",
          500: "var(--deepskyblue-500)",
          600: "var(--deepskyblue-600)",
          700: "var(--deepskyblue-700)",
          800: "var(--deepskyblue-800)",
        },
        crimson: {
          DEFAULT: "var(--crimson-100)",
          100: "var(--crimson-100)",
          200: "var(--crimson-200)",
        },
        darkorchid: {
          DEFAULT: "var(--darkorchid-100)",
          100: "var(--darkorchid-100)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(39, 211, 203, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(39, 211, 203, 0.6)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(39, 211, 203, 0.3), 0 0 40px rgba(39, 211, 203, 0.1)",
            opacity: "1"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(39, 211, 203, 0.5), 0 0 60px rgba(39, 211, 203, 0.2)",
            opacity: "0.9"
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        glow: "glow 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
