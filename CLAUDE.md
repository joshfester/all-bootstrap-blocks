# Overview

This is a Wordpress plugin that adds custom blocks to the Gutenberg editor. There are blocks for every Bootstrap element/component. It also gives the option to include the Bootstrap css/js.

# Release process

1. Bump the version (`X.Y.Z`) in:
   - `areoi.php` — `@version`, `Version:` header, and `$areoi_version`
   - `readme.txt` — `Stable tag:`
   - Leave `package.json` alone (intentionally `0.0.0`).
2. Add a changelog entry to `readme.txt` under `== Changelog ==`:
   ```
   = X.Y.Z =
   * FEATURE / FIX / UPDATE: ...
   ```
3. Stage release files, then commit as `Release X.Y.Z`.
4. Tag and push:
   ```
   git tag vX.Y.Z
   git push origin main
   git push origin vX.Y.Z
   ```

Semver: major for breaking changes (e.g. changing the default Bootstrap version), minor for new opt-in features, patch for fixes.
