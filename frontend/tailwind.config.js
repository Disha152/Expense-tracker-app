module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		backgroundImage: {
		  'grid': "url('/src/assets/grid.svg')", // Ensure this file exists
		},
	  },
	},
	plugins: [],
  };
  