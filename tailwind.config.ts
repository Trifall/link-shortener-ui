import typography from '@tailwindcss/typography';
import flowbitePlugin from 'flowbite/plugin';
import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			screens: {
				xs: '480px'
			},
			keyframes: {
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				gradient: {
					to: {
						backgroundPosition: 'var(--bg-size) 0'
					}
				}
			},
			animation: {
				'spin-slow': 'spin 10s linear infinite',
				gradient: 'gradient 8s linear infinite'
			}
		}
	},
	plugins: [typography, flowbitePlugin],
	darkMode: 'class'
} satisfies Config;
