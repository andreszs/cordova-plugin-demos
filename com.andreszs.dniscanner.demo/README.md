# DNI Scanner Demo

Cordova Android and iOS demo for [`cordova-plugin-dni-scanner`](https://github.com/andreszs/cordova-plugin-dni-scanner), an offline automatic or manual scanner for Argentine identity cards and generic ID-1 cards.

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

The project uses Cordova Android 15 and Cordova iOS 8.1. The scanner plugin is pinned to version 0.3.0 from npm. A fresh checkout does not require a local plugin repository.

## Demo features

The app can scan either side of a DNI or a generic credit/debit, license, or ID-1-style card in portrait, landscape, or automatic orientation. It exposes every configurable scanner option, including automatic/manual mode, preferred native capture size, maximum output size, minimum effective document resolution, final-photo sharpness variance, timeout, beep, native controls, all quality checks, and the `off`, `advisory`, and `strict` DNI side-validation policies. A successful scan displays the corrected JPEG plus a visible resolution label with RAW dimensions, effective document pixels, final dimensions, and measured sharpness, followed by the complete metadata response.
