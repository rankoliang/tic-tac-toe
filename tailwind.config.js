module.exports = {
  purge: {
    enabled: true,
    preserveHtmlElements: false,
    content: ["index.html", "./public//javascript//*.js"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      visibility: ["hover"],
    },
  },
  plugins: [],
};
