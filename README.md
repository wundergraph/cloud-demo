# WunderGraph Cloud Demo

This starter combines [WunderGraph](https://wundergraph.com/) Cloud with [Turborepo](https://github.com/vercel/turbo) to create an optimized monorepo experience for your WunderGraph application.

It contains 2 applications:

1. `api + web` is a typing speed test built with wundergraph + nextjs + postgres
   - Frontend hosted at https://speedtest.wundergraph.app
   - WunderNode hosted at https://speedtest-api.wundergraph.app
2. `api-federation + web-federation` demonstrates wundergraph with apollo federation
   - Frontend hosted at https://apollo-federation-cloud-demo.vercel.app
   - WunderNode hosted at https://apollo-federation-nextjs.wundergraph.dev

### Getting started locally

```shell
npm install
npm run start:services #optional
npm run build
npm run dev
```

### Learn More

Read the [Docs](https://wundergraph.com/docs).

### Contributing

Feel free to contribute or improve the demo as you like by raising a PR.
