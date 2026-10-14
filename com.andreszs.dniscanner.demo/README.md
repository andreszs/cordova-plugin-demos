# DNI Scanner Demo

Cordova Android demo for [`cordova-plugin-dni-scanner`](https://github.com/andreszs/cordova-plugin-dni-scanner), an offline automatic scanner for Argentine identity cards.

## Requirements

- Node.js and the Cordova CLI.
- JDK 17.
- Android SDK 36.
- An Android device with a rear camera.

## Setup

```shell
npm ci
cordova platform add android
```

## Build and run

```shell
npm run build:android
npm run run:android
```

The project uses Cordova Android 15 and installs version 0.1.1 of the scanner plugin from npm.

## Demo features

The app can scan either side of a DNI in portrait or landscape orientation. It exposes the scanner controls and quality checks, including output size, guide margin, focus, brightness, glare, shadows, edge occlusion, requested-side confirmation, and optional moiré rejection. A successful scan displays the corrected JPEG, detected side and variant, confidence, dimensions, and the complete metadata response.
