# Build and Publish monorepo package action

Build and Publish a package in a monorepo repo

## Inputs

### `package-path`

**Required** The path of the package to build and publish

## Outputs

### `version`

The version of the published package

### `published`

A boolean of the published status

## Example usage

```yaml
uses: actions/build-publish-monorepo-package-action
with:
  package-path: lib/icons
```
