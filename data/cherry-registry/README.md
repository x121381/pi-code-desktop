# Cherry Studio provider registry

Bundled copies of Cherry Studio's model catalog, used to fill custom-model
metadata (name, context window, max tokens, vision/reasoning, pricing).

Source:

- https://github.com/CherryHQ/cherry-studio
- `packages/provider-registry/data/models.json`
- `packages/provider-registry/data/provider-models.json`

At runtime the desktop app may overlay a newer copy from Cherry's `x-files`
branch (`provider-registry/v1/`). `providers.json` is intentionally not
vendored or remotely updated.
