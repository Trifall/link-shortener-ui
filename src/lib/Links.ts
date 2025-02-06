export const Routes = {
	HOME: '/',
	DASHBOARD: '/dashboard',
	FRONTEND_REPO: 'https://github.com/Trifall/link-shortener-ui',
	BACKEND_REPO: 'https://github.com/Trifall/go-link-shortener',
	DOCS: 'https://links.trifall.com/docs/index.html'
} as const;

export type RouteType = (typeof Routes)[keyof typeof Routes];

export const PublicRoutes = [
	Routes.HOME,
	Routes.DASHBOARD,
	Routes.FRONTEND_REPO,
	Routes.BACKEND_REPO,
	Routes.DOCS
];
