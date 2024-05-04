# API Planning

## Overall philosophy

The caller (host) must set the baseUrl where everything will be found.

From there, we can support sync access for 'expected location' (URLs) and async for actual content. Content

## Loading

Prerendered static html:

- Raw URL of content
- Function that returns html content as string

JS chunks

- Raw URL of js entry point
- Raw URL of assets json
- Raw URL of asset-include.html
- Function that preloads initial entry
  - Immediate mode vs background mode?
- Function that preloads everything
  - Immediate mode vs background mode?

--

- Versioned loading methods: dependent on baseUrl and manifest-version. Address the case where `asset-manifest.json` changes to `maniest.json`
- Include prerendered html on the server. Both assets and UI. Support multiple views/entry points.
- API version negotiation. Strong typings for options and events, state and callbacks.
- Automated testing against multiple API contract versions.
