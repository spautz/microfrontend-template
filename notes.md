Microfrontend: app+sdk together, or separate?

If together:

- Fewer things to run
- Fewer moving pieces

If separate:

- Easier to release independently. Can roll out app with APIv2 while keeping
- App's package.json can be App version, separate SDK version

=======

Use cases:

- Render a React component, get the microfrontend
  - sdk renders <script> + <div>, refs and useEffect to hook it up
  - need to configure "where to find assets_manifest"
  - need different preload options
- Different preload options
  - nothing
  - asset manifest
  - everything?
  - specific route?
  - staged progression through the above
  - should get an example using Remix's intent stuff
- Prerenders
  - baked into sdk?
    -- multiple versions?
    -- controlled by caller?
  - initial html from remote?
    -- multiple versions?

What if I want to ALSO make some things available in SDK?

- Constants

* put in API-contracts package

- Loading State

* for components in general, maybe pass-through SDK package?
