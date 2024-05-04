# Overview

This repo defines an example microfrontend setup. It's advertised as a
"package-wrapped app" to distinguish it from traditional microfrontends.

The host app uses a npm package to mount the microfrontend, instead of doing
it manually.

## Projects and Scope

### Host apps: `host-app-vite`, `host-app-remix`

Example apps which mount the microfrontend. One is a traditional SPA, the other
is an SSR app with rehydration.

Both use the SDK package to initialize and interact with the microfrontend.

### Microfrontend: `microfrontend-app`

Example UI and/or API functionality, deployed independently of the host app.

### SDK package: `microfrontend-sdk`

Interface for loading, mounting, and interacting with the microfrontend.

The idea is that the host apps _only_ interact with the SDK, and not with
individual assets or global variables.

### API contracts: `microfrontend-api-contract`

Constants, shared typings, and strictly-versioned touchpoints for the interface
between the host app and the microfrontend.

The microfrontend and the SDK package both use this to mediate their interactions,
instead of referencing or relying on each other directly.

### Tools and utils: `@spautz/microfrontend-utils`

Independent package, published to npm, that provides standard utils for the SDK and
API-contract packages.

## Intended/Future Features

- Versioned loading methods: dependent on baseUrl and manifest-version. Address the case where `asset-manifest.json` changes to `maniest.json`
- Include prerendered html on the server. Both assets and UI. Support multiple views/entry points.
- API version negotiation. Strong typings for options and events, state and callbacks.
- Automated testing against multiple API contract versions.
