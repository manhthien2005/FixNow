import type { Config } from "tailwindcss";

/**
 * FixNow design system — Material Design 3 "tech-lab" theme.
 * Colors are single-source-of-truth CSS variables (RGB triplets) defined in
 * app/globals.css, exposed here so Tailwind opacity modifiers (e.g. bg-secondary/10)
 * keep working. shadcn semantic names (background/foreground/card/primary/...) are
 * mapped onto the same MD3 tokens so primitives in components/ui/* stay on-theme.
 */
const md = (token: string) => `rgb(var(${token}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        // MD3 type-role families (mockup-faithful aliases)
        "display-lg": ["var(--font-inter)", "system-ui", "sans-serif"],
        "display-lg-mobile": ["var(--font-inter)", "system-ui", "sans-serif"],
        "headline-md": ["var(--font-inter)", "system-ui", "sans-serif"],
        "headline-sm": ["var(--font-inter)", "system-ui", "sans-serif"],
        "body-md": ["var(--font-inter)", "system-ui", "sans-serif"],
        "body-lg": ["var(--font-inter)", "system-ui", "sans-serif"],
        "label-sm": ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
        "label-md": ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // MD3 type scale used across the landing page
        "display-lg": [
          "64px",
          { lineHeight: "72px", letterSpacing: "0", fontWeight: "800" },
        ],
        "display-lg-mobile": [
          "40px",
          { lineHeight: "48px", letterSpacing: "0", fontWeight: "800" },
        ],
        "headline-md": [
          "30px",
          { lineHeight: "38px", letterSpacing: "0", fontWeight: "600" },
        ],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
        "label-sm": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
      },
      spacing: {
        "margin-mobile": "20px",
        "margin-desktop": "64px",
        gutter: "24px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      colors: {
        // shadcn semantic tokens (consumed by components/ui/*)
        border: md("--md-outline-variant"),
        input: md("--md-outline-variant"),
        ring: md("--md-secondary"),
        background: md("--md-background"),
        foreground: md("--md-on-surface"),
        primary: {
          DEFAULT: md("--md-primary"),
          foreground: md("--md-on-primary"),
        },
        secondary: {
          DEFAULT: md("--md-secondary"),
          foreground: md("--md-on-secondary"),
        },
        tertiary: {
          DEFAULT: md("--md-tertiary"),
          foreground: md("--md-on-tertiary"),
        },
        destructive: {
          DEFAULT: md("--md-destructive"),
          foreground: md("--md-on-destructive"),
        },
        muted: {
          DEFAULT: md("--md-surface-container-low"),
          foreground: md("--md-on-surface-variant"),
        },
        accent: {
          DEFAULT: md("--md-surface-container-high"),
          foreground: md("--md-on-surface"),
        },
        warning: {
          DEFAULT: md("--md-warning"),
          foreground: md("--md-on-warning"),
        },
        popover: {
          DEFAULT: md("--md-surface-container-low"),
          foreground: md("--md-on-surface"),
        },
        card: {
          DEFAULT: md("--md-surface-container"),
          foreground: md("--md-on-surface"),
        },
        // MD3 surface roles (landing-page tokens)
        surface: {
          DEFAULT: md("--md-surface"),
          container: md("--md-surface-container"),
          "container-lowest": md("--md-surface-container-lowest"),
          "container-low": md("--md-surface-container-low"),
          "container-high": md("--md-surface-container-high"),
          "container-highest": md("--md-surface-container-highest"),
        },
        "on-surface": {
          DEFAULT: md("--md-on-surface"),
          variant: md("--md-on-surface-variant"),
        },
        outline: {
          DEFAULT: md("--md-outline"),
          variant: md("--md-outline-variant"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(1deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(10px, -15px)" },
          "50%": { transform: "translate(20px, 0)" },
          "75%": { transform: "translate(10px, 15px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        drift: "drift 15s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
