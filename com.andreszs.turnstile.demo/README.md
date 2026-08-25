# Turnstile demo

This directory contains the source files for the `cordova-plugin-turnstile` demo and a precompiled Android APK ready for testing.

## Precompiled APK

Download and install [`com.andreszs.turnstile.demo.apk`](com.andreszs.turnstile.demo.apk). It is a debug build intended only for testing and is preconfigured to use the plugin project's public Turnstile demo service. That service combines the challenge and validation routes for this public test only; production applications should keep their challenge page and protected backend handler separate.

SHA-256:

```text
641C6D0CF85EDAC19628FE92D167A5AE2C73B12039E96B07DD247F39C33FB39D
```

Install it on a connected Android device with:

```shell
adb install -r com.andreszs.turnstile.demo.apk
```

## Build from source

The source deliberately contains no preconfigured endpoint URLs or Turnstile keys. After building and opening the app, enter:

1. The **Challenge URL** of the hosted page that renders Turnstile with the public site key. Its `action` query parameter must match the Action field.
2. The matching **Action** expected by the challenge page and backend.
3. The separate **Backend URL** that accepts the returned token, validates it with Cloudflare Siteverify, and performs the protected operation.

The backend must allow the Cordova app's exact origin, normally `https://localhost`, respond to CORS preflight `OPTIONS`, and accept the JSON request contract documented by the [plugin server examples](https://github.com/andreszs/cordova-plugin-turnstile/tree/main/server).

Because this interactive demo accepts arbitrary HTTPS URLs, its `config.xml` and CSP allow HTTPS connections broadly. A production app should replace those wildcards with its exact backend origin as documented by the plugin README.

To create the project with cordova-android 14:

```shell
cordova create com.andreszs.turnstile.demo com.andreszs.turnstile.demo "Turnstile Demo"
cd com.andreszs.turnstile.demo
cordova platform add android@14
cordova plugin add https://github.com/andreszs/cordova-plugin-turnstile.git
cordova plugin add cordova-plugin-app-version
```

Replace the generated `www` directory and `config.xml` with the files from this directory, then build:

```shell
cordova build android
```

The demo uses the local minified Bootstrap 4 CSS file. It does not load Bootstrap from a CDN and does not include Bootstrap JavaScript or custom CSS.

## Screenshots

<p align="center">
  <img src="screenshots/android/turnstile-collage.png" width="960" alt="Turnstile demo ready, challenge, and successful validation on a Samsung Galaxy S7">
</p>
