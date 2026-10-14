# Repository instructions for coding agents

## Scope and project model

These instructions apply to the entire repository. Each top-level demo directory is an independent, reproducible Cordova project. Select the requested demo by directory and work inside that directory; do not create a second Cordova project or copy the demo into another location.

Treat these files as the source of truth for every demo:

- `config.xml`: application identity and Cordova preferences.
- `package.json`: Android platform, plugins, plugin variables, and npm scripts.
- `package-lock.json`: reproducible dependency resolution.
- `www/`: application source and bundled web assets.
- `res/` and other explicitly tracked directories: native resources or documentation required by that demo.

Never edit generated files under `node_modules/`, `platforms/`, `plugins/`, `.gradle/`, or a build output directory. Never add generated APK or AAB files to Git.

## Standard Android build workflow

1. Read the selected demo's `package.json` and `config.xml` before running commands.
2. Use the JDK, Android SDK, Gradle, Node.js, and Cordova CLI versions compatible with the declared `cordova-android` version. Do not silently replace the declared platform version.
3. From the selected demo directory, restore the exact npm dependency tree:

   ```shell
   npm ci
   ```

4. On a fresh checkout, create the generated Android project from the saved metadata:

   ```shell
   cordova platform add android
   ```

   Cordova must restore the platform and plugins from `package.json`. Do not install plugins manually just to perform a normal build.

5. Verify the Android toolchain selected for that demo:

   ```shell
   cordova requirements android
   ```

   Resolve any missing JDK, Android SDK, target SDK, or Gradle requirement before compiling.

6. Build the debug application:

   ```shell
   cordova build android --debug
   ```

7. Only when deployment is requested, use one of:

   ```shell
   cordova run android --device --debug
   cordova run android --emulator --debug
   ```

Report preparation, compilation, and deployment failures separately. Include the failing demo name and the first actionable error rather than only the final nonzero exit code.

## Dependency and configuration changes

- Keep platform and plugin versions explicit and reproducible in `package.json`.
- Keep `devDependencies`, `cordova.platforms`, and `cordova.plugins` synchronized. Preserve the plugin ID recorded by the Cordova CLI even when it differs from the npm package name.
- Regenerate `package-lock.json` whenever dependencies change and verify it with `npm ci`.
- Do not commit local `file:` dependencies or machine-specific absolute paths. Public demos must resolve their dependencies from a public package registry or an intentional public repository URL.
- Store plugin installation variables in `cordova.plugins`; never hard-code secrets, private keys, credentials, or developer-specific endpoints.
- Modify `config.xml`, `package.json`, `package-lock.json`, `www/`, or tracked resources—not generated platform files.
- When adding a demo, follow the same self-contained structure and generic build workflow. Do not add case-specific build instructions to this file.

## Verification and repository hygiene

After changing a demo:

1. Run `npm ci` successfully.
2. Restore or prepare Android from the declared metadata.
3. Run a debug build.
4. Confirm `git status` does not include generated directories, caches, APKs, or AABs.
5. Confirm package files contain no local checkout paths.

Preserve unrelated user changes. Do not commit or push unless the user explicitly requests it.
