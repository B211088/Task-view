export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      Nunito: "Nunito Sans",
      Montserrat: "Montserrat",
      Inter: "Inter",
    },
    colors: {
      "text-light": "#ffffff",
      "text-dark": {
        1000: "#000000",
        900: "#111111",
        800: "#222222",
        700: "#333333",
        600: "#444444",
        500: "#555555",
        400: "#666666",
        300: "#777777",
        200: "#888888",
        100: "#999999",
      },
      "color-dark": {
        1000: "#F7F7F7",
        900: "#EFEFEF",
        800: "#DEDEDE",
        700: "#CCCCCC",
        600: "#BDBDBD",
        500: "#AAAAAA",
        400: "#999999",
        300: "#888888",
        200: "#777777",
        100: "#666666",
      },
      "bg-window": "#EEEEEE",
      "bg-light": "#ffffff",
      "bg-header": "#000000",
      "cl-border": "#D9D9D9",
      "cl-btn": "",
      "bg-transparent ": "rgba(90, 123, 255, 0.9)",
      "bg-hover": "#dedede",
      unmake: "#ff3b3b",
      make: "#4cd62b",
      making: "#4cd62b",
      "bg-btn-add": "#00a311",
      "text-red": "#cc0404",
    },
  },
  plugins: [],
};
