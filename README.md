# microfrontend-template

[![build status](https://github.com/spautz/microfrontend-template/workflows/CI/badge.svg)](https://github.com/spautz/microfrontend-template/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/microfrontend-template/main.svg)](https://coveralls.io/github/spautz/microfrontend-template?branch=main)
[![repo vulnerabilities](https://snyk.io/test/github/spautz/microfrontend-template/badge.svg)](https://snyk.io/test/github/spautz/microfrontend-template)

My opinionated template for a package-wrapped microfrontend.

Consumers use a SDK to interface with the microfrontend. This, along with some under-the-hood constraints and
safety nets, can solve every failure point that I've encountered within and between microfrontends at scale.

## About

_This is in active development._

There are 4 sub-projects in this repo, which are the main building blocks for a package-wrapped microfrontend:

1. The microfrontend app. This implements the functionality that needs to be shared or positioned in other apps:
    functions, components, UI patterns, background tasks, or whatever is needed for the behaviors it covers.
2. The contracts package. This defines the interfaces for functions, components, and other code exported by the
    microfrontend -- both past and present, spanning multiple versions.
3. The SDK package. This exposes bindings for the functions, components, and other code exported by the 
    microfrontend, and acquires their implementations from the microfrontend app at runtime.
    It also performs version negotiation when the microfrontend needs to move to a new major version of its contracts
    (if ever.)
4. Demo apps are host apps which use the SDK package to acquire and run the microfrontend's code.
    These are used for local dev and automated tests.

### Microfrontend App

Any technology or framework can be used to build a microfrontend app, so long as its build system outputs modern
native modules for the browser. This repo uses React-Router 7 in order to _also_ generate static html prerenders.

All modern build system for apps -- Vite, Webpack, etc -- have plugins which make this straightforward for
client-side assets. The module federation system makes your desired exports available to remote importers.

That covers client-side assets (i.e., Javascript running in the browser), but not server-side usage.
Dynamic remote Javascript must not be used server-side, because that's a form of remote code execution
(a potential security risk) and because updating the code requires hot module reloading in production
(since native modules are cached for the lifetime of the process.)

So for server-side rendering, the microfrontend is prerendered, and host apps pass through the static html
instead of running remote Javascript. This is done by layering a second app (with prerendering) on top of the 
plain client-side app for the microfrontend. This full setup is overkill for simple apps, but it can solve things
if new scenarios arise in the future that require parameterized pretenders.

### Contracts Package

_Technically_ the above module federation piece is all that's require for microfrontends: two teams can develop
and deploy independent features with decoupled deployments.

But it has no safety nets: one team could change things in a not-backwards-compatible way.
It also doesn't provide typings or autocomplete hints to consumers for the things that are expored
(not by default, at least: it's possible to configure that, but it requires some alignment across both the MFE
and all host apps, in a naive implementation.)

To solve thos problems, the team who owns the MFE app puts its typings into a npm package, along with any other
supporting utils that need to be aligned across the MFE app and host apps (such as validation, for example.)

A contracts package houses:

* Information about any params used to fetch the MFE -- both the original state and the current ones.
* Information about functions, components, values, and other bindings exposed by the MFE -- both the original state
  and the current ones.
* Unit tests to confirm the current state is backwards-compatible with the original state, and that the older states
  continue to work as expected with the latest typings and utilities.
* And the above are grouped into major versions: the contract package houses both "V1" and "V2", for cases where
  a not-backwards-compatible V2 was necessary.

The MFE and SDK package both import typings and common utils from the contracts package.

### SDK Package

In a typical module federation setup, each host app would _also_ need to use a module federation plugin in its
build system. That's where the code to actually resolv and bind to the microfrontend's exports comes from.

This can lead to build system coupling: host apps and microfrontends don't need to run the same build tools,
but they do need to run compatible federation plugins. That's a risk point long-term.

To avoid that, the code to resolve and bind to the microfrontend's exports can be put into a SDK package.
Then, module federation can happen through the package -- without needing a module-federation plugin on the
consumer side: the SDK works in a build-tool-agonostic way. The host app does not even know that there's a MFE
under the hood.

This also gives a place to put anything which doesn't need to be resolved at runtime; anything which doesn't have
to be in-sync across all host apps.

A SDK package is just a normal npm package, so it can provide anything you might want to put into a npm package.
Loading states, information about host requirements, backup copies of prerenders or live values, whatever makes sense.

### Demo Apps

All host apps install the SDK package as a dependency, and use it like any other dependency.

For local dev, the demo-apps in the workspace provide an easy and convenient way to test that integration locally.
This is also very useful for CI: you can ensure that changes to any part of the microfrontend setup --
the SDK package, its contracts, or the runtime code itself -- continue to work as expected in various environments
and frameworks.

So demo-apps ultimately provide three roles:

* A reference for how to use the microfrontend
* Local dev apps for making changes
* A base for automated testing

## Projects in This Repo

#### [Demo: Hello World](https://github.com/spautz/microfrontend-template/blob/main/demos/hello-world/README.md)

[![readme](https://img.shields.io/badge/-readme-informational)](https://github.com/spautz/microfrontend-template/blob/main/demos/hello-world/README.md)
[![test coverage](https://coveralls.io/repos/github/spautz/microfrontend-template/badge.svg?branch=x-cov-hello-world)](https://coveralls.io/github/spautz/microfrontend-template?branch=x-cov-hello-world)

A host app which utilizes the microfrontend.

#### [Microfrontend App](https://github.com/spautz/microfrontend-template/blob/main/microfrontend-app/README.md)

[![readme](https://img.shields.io/badge/-readme-informational)](https://github.com/spautz/microfrontend-template/blob/main/microfrontend-app/README.md)
[![test coverage](https://coveralls.io/repos/github/spautz/microfrontend-template/badge.svg?branch=x-cov-microfrontend-app)](https://coveralls.io/github/spautz/microfrontend-template?branch=x-cov-microfrontend-app)

The microfrontend itself.

#### [@spautz/microfrontend-sdk-template](https://github.com/spautz/microfrontend-template/blob/main/packages/microfrontend-sdk-template/README.md)

[![npm version](https://img.shields.io/npm/v/@spautz/microfrontend-sdk-template.svg)](https://www.npmjs.com/package/@spautz/microfrontend-sdk-template)
[![readme](https://img.shields.io/badge/-readme-informational)](https://github.com/spautz/microfrontend-template/blob/main/packages/microfrontend-sdk-template/README.md)
[![test coverage](https://coveralls.io/repos/github/spautz/microfrontend-template/badge.svg?branch=x-cov-microfrontend-sdk-template)](https://coveralls.io/github/spautz/microfrontend-template?branch=x-cov-microfrontend-sdk-template)
[![vulnerabilities](https://snyk.io/test/npm/@spautz/microfrontend-sdk-template/badge.svg)](https://snyk.io/test/npm/@spautz/microfrontend-sdk-template)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@spautz/microfrontend-sdk-template.svg)](https://bundlephobia.com/package/@spautz/microfrontend-sdk-template@latest)

Example package for interacting with the microfrontend.

#### [@spautz/microfrontend-internal-contracts-template](https://github.com/spautz/microfrontend-template/blob/main/packages/microfrontend-internal-contracts-template/README.md)

[![npm version](https://img.shields.io/npm/v/@spautz/microfrontend-internal-contracts-template.svg)](https://www.npmjs.com/package/@spautz/microfrontend-internal-contracts-template)
[![readme](https://img.shields.io/badge/-readme-informational)](https://github.com/spautz/microfrontend-template/blob/main/packages/microfrontend-internal-contracts-template/README.md)
[![test coverage](https://coveralls.io/repos/github/spautz/microfrontend-template/badge.svg?branch=x-cov-microfrontend-internal-contracts-template)](https://coveralls.io/github/spautz/microfrontend-template?branch=x-cov-microfrontend-internal-contracts-template)
[![vulnerabilities](https://snyk.io/test/npm/@spautz/microfrontend-internal-contracts-template/badge.svg)](https://snyk.io/test/npm/@spautz/microfrontend-internal-contracts-template)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@spautz/microfrontend-internal-contracts-template.svg)](https://bundlephobia.com/package/@spautz/microfrontend-internal-contracts-template@latest)

Internal bridge and typings between the host app and the microfrontend.
