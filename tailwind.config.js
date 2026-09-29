/** @type {import('tailwindcss').Config} */

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  const flattenColorPalette =
    /** @param {Record<string, unknown>} colors */
    function flatten(colors, prefix = "") {
      return Object.entries(colors).reduce((acc, [key, val]) => {
        const newKey = prefix ? `${prefix}-${key}` : key;
        if (typeof val === "object" && val !== null) {
          Object.assign(acc, flatten(val, newKey));
        } else {
          acc[newKey] = val;
        }
        return acc;
      }, {});
    };

  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        xp: ["Tahoma", "Arial", "sans-serif"],
      },
      colors: {
        "xp-blue-dark": "#0A246A",
        "xp-blue-mid": "#2048C8",
        "xp-blue-title": "#0054E3",
        "xp-taskbar": "#245EDC",
        "xp-start-green": "#3C9B3C",
        "xp-window-bg": "#ECE9D8",
        "xp-window-border": "#0054E3",
        "xp-btn-face": "#EFF0F1",
        "xp-selected": "#2F6FBF",
        "xp-tooltip-bg": "#FFFFE1",
        "xp-desktop-bg": "#5A7EBF",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};
