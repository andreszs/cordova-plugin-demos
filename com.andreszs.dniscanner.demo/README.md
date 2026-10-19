# DNI Scanner Demo

Cordova Android and iOS demo for [`cordova-plugin-dni-scanner`](https://github.com/andreszs/cordova-plugin-dni-scanner), an offline automatic scanner for Argentine identity cards and generic ID-1 cards.

## Requirements

- Node.js and the Cordova CLI.
- For Android: JDK 17, Android SDK 36, and a device with a rear camera.
- For iOS: macOS, Xcode, and an iPhone with a rear camera.

## Setup

```shell
npm ci
cordova platform add android
# On macOS, add iOS instead or add both platforms:
cordova platform add ios
```

## Build and run

```shell
npm run build:android
npm run run:android

# macOS only
npm run build:ios
npm run run:ios
```

The project uses Cordova Android 15 and Cordova iOS 8.1. The scanner plugin is pinned to the public GitHub commit for version 0.2.1, so a fresh checkout does not require a local plugin repository.

## Demo features

The app can scan either side of a DNI or a generic credit/debit, license, or ID-1-style card in portrait, landscape, or automatic orientation. It exposes the scanner controls and quality checks, including output size, guide margin, focus, brightness, glare, shadows, edge occlusion, and the `off`, `advisory`, and `strict` DNI side-validation policies. A successful scan displays the corrected JPEG, geometric confidence, OCR usability, non-blocking quality warnings, dimensions, and the complete metadata response.
