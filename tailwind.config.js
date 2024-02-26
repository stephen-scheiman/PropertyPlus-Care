/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.hbs"],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/img/background.jpg')"
      }
    },
  },
  plugins: [],
}

