import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "status-in": {
          DEFAULT: "hsl(var(--status-in))",
          foreground: "hsl(var(--status-in-foreground))",
        },
        "status-forecast": {
          DEFAULT: "hsl(var(--status-forecast))",
          foreground: "hsl(var(--status-forecast-foreground))",
        },
        "status-exception": {
          DEFAULT: "hsl(var(--status-exception))",
          foreground: "hsl(var(--status-exception-foreground))",
        },
        "status-multicuenta": {
          DEFAULT: "hsl(var(--status-multicuenta))",
          foreground: "hsl(var(--status-multicuenta-foreground))",
        },
        ubits: {
          navy: "hsl(var(--ubits-navy))",
          blue: "hsl(var(--ubits-blue))",
          deep: "hsl(var(--ubits-deep))",
          cyan: "hsl(var(--ubits-cyan))",
          "mid-blue": "hsl(var(--ubits-mid-blue))",
          red: "hsl(var(--ubits-red))",
          yellow: "hsl(var(--ubits-yellow))",
          green: "hsl(var(--ubits-green))",
        },
        risk: {
          approved: "hsl(var(--risk-approved))",
          alert: "hsl(var(--risk-alert))",
          review: "hsl(var(--risk-review))",
          jurisdiction: "hsl(var(--risk-jurisdiction))",
          rejected: "hsl(var(--risk-rejected))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
