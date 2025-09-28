/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  // Add the forms plugin here
  plugins: [
    require('@tailwindcss/forms'),
  ],
}