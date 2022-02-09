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
          offset: "var(--color-background-offset)",
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
        opacityFadeIn: "opacityFadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUp: "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightDrawer:
          "slideRightDrawer 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftDrawer: "slideLeftDrawer 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        spinner: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        opacityFadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(4px)" },
          "100%": { transform: "translateY(0)" },
        },
        contentShow: {
          "0%": { opacity: 0, transform: "translate(-50%, -48%)" },
          "100%": { opacity: 1, transform: "translate(-50%, -50%)" },
        },
        slideRightDrawer: {
          "0%": { transform: "translateX(-100px)" },
          "100%": { transform: "translateX(0)" },
        },
        slideLeftDrawer: {
          "0%": { transform: "translateX(100px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
