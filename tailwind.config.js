module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      textColor: {
        skin: {
          base: "var(--color-text-base)",
          muted: "var(--color-text-muted)",
        },
      },
      borderColor: {
        skin: {
          base: "var(--color-border-base)",
        },
      },

      backgroundColor: {
        skin: {
          base: "var(--color-background-base)",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
        ],
        logo: ["Noto Sans", "ui-sans-serif"],
      },

      animation: {
        spinner: "spinner 1.5s linear infinite",
      },
      keyframes: {
        spinner: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
