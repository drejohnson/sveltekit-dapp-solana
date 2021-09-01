const colors = require('tailwindcss/colors');

const config = {
	mode: 'jit',
	purge: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		fontFamily: {
			display: ['DM Sans', 'sans-serif'],
			sans: ['Poppins', 'sans-serif'],
			body: ['Poppins', 'sans-serif']
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			gray: colors.trueGray,
			red: colors.red,
			yellow: colors.amber,
			blue: colors.blue,
			green: colors.green,
			indigo: colors.indigo
		},
		extend: {
			backgroundImage: (theme) => ({
				blurred: "url('/assets/bg-blurred.webp')"
			}),
			gridTemplateColumns: {
				'nav-bar': 'auto 1fr auto',
				'auto-1fr-auto': 'auto 1fr auto'
			},
			width: {
				'100px': '100px',
				'150px': '150px',
				'200px': '200px',
				'300px': '300px',
				'400px': '400px',
				'500px': '500px'
			},
			minHeight: {
				'150px': '150px',
				'175px': '175px',
				'200px': '200px'
			},
			height: {
				'100px': '100px',
				'200px': '200px',
				'300px': '300px',
				'400px': '400px',
				'500px': '500px'
			},
			zIndex: {
				negative: '-1'
			},
			borderWidth: {
				50: '50px',
				100: '100px'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};

module.exports = config;
