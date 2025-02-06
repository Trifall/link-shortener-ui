# Link Shortener UI

This is a Svelte 5 project that uses Tailwind and TypeScript to be a web UI for [go-link-shortener](https://github.com/jerren/go-link-shortener).

The dashboard makes calls to the [go-link-shortener](https://github.com/jerren/go-link-shortener) API, so you will need to have that sorted for the app to really be functional.

## Developing

Install dependencies with `pnpm install`

To start a development server:

```bash
pnpm dev
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
