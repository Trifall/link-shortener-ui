import { PUBLIC_API_URL as API_URL } from '$env/static/public';

export const Links = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	FRONTEND_REPO: 'https://github.com/Trifall/link-shortener-ui',
	BACKEND_REPO: 'https://github.com/Trifall/go-link-shortener',
	DOCS: `${API_URL}/docs/index.html`
} as const;

export type LinkType = (typeof Links)[keyof typeof Links];
