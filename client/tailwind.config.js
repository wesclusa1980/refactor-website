// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Adding custom utilities
      textStrokeWidth: {
        '1': '1px',
        '2': '2px',
        // Add more as needed
      },
      textStrokeColor: {
        'black': 'black',
        // Add more colors as needed
      },
    },
  },
  plugins: [],
};
