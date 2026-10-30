# ML Kit Suite Demo

Android demo for [`cordova-plugin-mlkit-suite`](https://github.com/andreszs/cordova-plugin-mlkit-suite).

> [!WARNING]
> The plugin and this demo are in active development. APIs and native behavior may change before a stable release.

Bootstrap 4.6.2 and jQuery 3.6.0 are bundled locally so the demo UI works without an internet connection.

## Requirements

- Node.js 20 and Cordova CLI 12.
- JDK 17, Gradle 8.14.2, and Android SDK 36.
- Android 7.0 / API 24 or newer with a front and rear camera.
- At least 1.7 GB of total RAM and Google Play services for document scanning.

## Setup

```shell
npm ci
cordova platform add android
```

The project uses Cordova Android 15.1.0 and pins the plugin to an exact GitHub commit.

## Build and run

```shell
npm run build:android
npm run run:android
```

## Demo features

- Reads and displays `MlKit.getCapabilities()`.
- Opens the native document scanner with configurable page count, import, output, and editing mode.
- Checks and prepares the on-demand scanner module, showing a native spinner only when preparation takes longer than a brief availability check.
- Previews scanned JPEG pages and displays PDF metadata.
- Demonstrates Text recognition v2 with gallery images or the last scanned document page.
- Demonstrates Barcode scanning from either the live camera or a gallery image.
- Demonstrates Image labeling from a newly captured photo, gallery image, or the last scanned document page, with ML Kit's default model and a configurable confidence threshold.
- Demonstrates Android Subject segmentation from a newly captured photo, gallery image, or the last scanned document page, including first-use module delivery and transparent PNG output.
- Lets you test automatic, English, and Spanish native plugin localization at runtime.
- Exercises every public face-capture option and quality-check switch.
- Displays the captured JPEG and complete native result.
- Exercises all 13 barcode formats supported by ML Kit.
- Allows selecting any subset of barcode formats and configuring the native instruction, close button, torch button, and timeout.
- Displays the exact decoded `text`, `format`, cancellation, and structured errors.
