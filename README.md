# Apache Cordova plugin demos

![GitHub code size](https://img.shields.io/github/languages/code-size/andreszs/cordova-plugin-demos) ![GitHub top language](https://img.shields.io/github/languages/top/andreszs/cordova-plugin-demos) ![GitHub license](https://img.shields.io/github/license/andreszs/cordova-plugin-demos) ![GitHub last commit](https://img.shields.io/github/last-commit/andreszs/cordova-plugin-demos)

A collection of reproducible Apache Cordova plugin demo apps by Andrés Zsögön. Every demo directory is a self-contained project with its source, configuration, and pinned npm dependencies.

Visit the [Cordova plugin demo apps](https://www.andreszsogon.com/category/plugin-demo-apps/) page for usage guides and compiled APK downloads.

> [!NOTE]
> Most legacy demos bundle jQuery 3.6.0. Newer demos use plain JavaScript when no additional library is required.

## Contents

- [Building a demo app](#building-a-demo-app)
- [Included demo apps](#included-demo-apps)
- [Contribute](#contribute)
- [Changes Log](#changes-log)

## Building a demo app

Each demo directory is a complete Cordova project. You do not need to create another project, copy its `www` directory, or install its plugins individually.

Before building, install Node.js and the Cordova CLI. Android builds require the Android SDK plus the JDK and Gradle versions expected by `cordova-android`; iOS builds require macOS, Xcode, and CocoaPods. Use only a platform shown next to the demonstrated plugin below.

Open a terminal in the demo directory and restore its exact npm dependencies:

```shell
npm ci
```

On the first build after cloning the repository, add the desired supported platform:

```shell
cordova platform add android
# or, on macOS
cordova platform add ios
```

Cordova reads `package.json` and restores the declared platform version, demonstrated plugin, auxiliary plugins, and installation variables.

Before compiling, verify the selected platform's native requirements:

```shell
cordova requirements android
# or, on macOS
cordova requirements ios
```

Then build the selected platform:

```shell
cordova build android --debug
# or, on macOS
cordova build ios --debug
```

To build and deploy directly, connect a compatible device or start an emulator/simulator, then run:

```shell
cordova run android --device --debug
# or, on macOS
cordova run ios --device --debug
# emulator examples
cordova run android --emulator --debug
cordova run ios --emulator --debug
```

Platform-specific npm scripts are available when declared by the selected demo. Some demos may still require runtime input such as a service URL, site key, paired peripheral, or supported device capability; those values are not build dependencies and are never stored as repository secrets.

## Included demo apps

The icons beside each plugin indicate its native mobile-platform support, independently of which generated platform was used most recently for testing: <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16"> Android and <img src="https://cdn.simpleicons.org/apple/000000" alt="iOS" title="iOS" width="16" height="16"> iOS.

### [`com.andreszs.biometric.auth.demo`](com.andreszs.biometric.auth.demo/)

<img src="com.andreszs.biometric.auth.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Biometric authentication demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-biometric-auth](https://github.com/andreszs/cordova-plugin-biometric-auth) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Libraries:** [KeyguardManager](https://developer.android.com/reference/android/app/KeyguardManager) and [BiometricManager](https://developer.android.com/reference/android/hardware/biometrics/BiometricManager)
- **Purpose:** Authenticate users with biometrics or a fallback PIN, pattern, or password.

### [`com.andreszs.btprinter.demo`](com.andreszs.btprinter.demo/)

<img src="com.andreszs.btprinter.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Bluetooth printer demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-btprinter](https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Purpose:** Print text, images, barcodes, and QR codes using a paired Bluetooth printer.

### [`com.andreszs.camera.preview.demo`](com.andreszs.camera.preview.demo/)

<img src="com.andreszs.camera.preview.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Camera Preview demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-camera-preview](https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16"> <img src="https://cdn.simpleicons.org/apple/000000" alt="iOS" title="iOS" width="16" height="16">
- **Purpose:** Interact directly with the camera from JavaScript and HTML.

### [`com.andreszs.dniscanner.demo`](com.andreszs.dniscanner.demo/)

<img src="com.andreszs.dniscanner.demo/www/img/logo.png" alt="DNI Scanner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-dni-scanner](https://github.com/andreszs/cordova-plugin-dni-scanner) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16"> <img src="https://cdn.simpleicons.org/apple/000000" alt="iOS" title="iOS" width="16" height="16">
- **Documentation:** [Demo files and setup instructions](com.andreszs.dniscanner.demo/)
- **Purpose:** Automatically capture, validate, crop, and correct Argentine DNI images entirely on-device.

### [`com.andreszs.gcs.demo`](com.andreszs.gcs.demo/)

<img src="com.andreszs.gcs.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Google Code Scanner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-google-code-scanner](https://github.com/andreszs/cordova-plugin-google-code-scanner) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [Google Code Scanner](https://developers.google.com/ml-kit/vision/barcode-scanning/code-scanner)
- **Purpose:** Scan codes without requesting camera permission while preserving user privacy.

### [`com.andreszs.grecaptcha.demo`](com.andreszs.grecaptcha.demo/)

<img src="com.andreszs.grecaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="reCAPTCHA Enterprise demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-recaptcha-enterprise](https://github.com/andreszs/cordova-plugin-recaptcha-enterprise) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/overview)
- **Purpose:** Retrieve tokens for reCAPTCHA Enterprise risk assessments.

### [`com.andreszs.hcaptcha.demo`](com.andreszs.hcaptcha.demo/)

<img src="com.andreszs.hcaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="hCaptcha demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-hcaptcha](https://github.com/andreszs/cordova-plugin-hcaptcha) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Libraries:** [hCaptcha Android SDK](https://github.com/hCaptcha/hcaptcha-android-sdk) and [browser API](https://docs.hcaptcha.com/invisible)
- **Purpose:** Protect applications from bots, spam, and other forms of automated abuse.

### [`com.andreszs.inappupdate.demo`](com.andreszs.inappupdate.demo/)

<img src="com.andreszs.inappupdate.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="In-app updates demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-in-app-updates](https://github.com/andreszs/cordova-plugin-in-app-updates) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [Google Play In-App Updates](https://developer.android.com/guide/playcore/in-app-updates)
- **Purpose:** Prompt active users to update an Android app through Google Play.

### [`com.andreszs.mlkit.suite.demo`](com.andreszs.mlkit.suite.demo/)

<img src="com.andreszs.mlkit.suite.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="ML Kit Suite demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-mlkit-suite](https://github.com/andreszs/cordova-plugin-mlkit-suite) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16"> <img src="https://cdn.simpleicons.org/apple/000000" alt="iOS" title="iOS" width="16" height="16">
- **Documentation:** [Demo files and setup instructions](com.andreszs.mlkit.suite.demo/)
- **Purpose:** Test Barcode scanning, Face detection, Image labeling, Text recognition v2, and ML Kit delivery modes on Android and iOS, plus Document scanner and Subject segmentation on Android.

### [`com.andreszs.recaptcha.v2.demo`](com.andreszs.recaptcha.v2.demo/)

<img src="com.andreszs.recaptcha.v2.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SafetyNet reCAPTCHA demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-recaptcha-v2](https://github.com/andreszs/cordova-plugin-recaptcha-v2) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [SafetyNet reCAPTCHA](https://developer.android.com/privacy-and-security/safetynet/recaptcha)
- **Purpose:** Protect applications from malicious traffic with the SafetyNet reCAPTCHA API.

### [`com.andreszs.smsreceive.demo`](com.andreszs.smsreceive.demo/)

<img src="com.andreszs.smsreceive.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SMS Receive demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-sms-receive](https://github.com/andreszs/cordova-plugin-sms-receive) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [Telephony](https://developer.android.com/reference/android/provider/Telephony)
- **Purpose:** Receive and read SMS messages using the Android Telephony API.

### [`com.andreszs.smsretriever.demo`](com.andreszs.smsretriever.demo/)

<img src="com.andreszs.smsretriever.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SMS Retriever demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-sms-retriever](https://github.com/andreszs/cordova-plugin-sms-retriever) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [SMS Retriever](https://developers.google.com/identity/sms-retriever/overview)
- **Purpose:** Receive and read SMS verification messages without requesting SMS permissions.

### [`com.andreszs.spinner.demo`](com.andreszs.spinner.demo/)

<img src="com.andreszs.spinner.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Native Spinner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-native-spinner](https://github.com/greybax/cordova-plugin-native-spinner) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16"> <img src="https://cdn.simpleicons.org/apple/000000" alt="iOS" title="iOS" width="16" height="16">
- **Purpose:** Display a platform-native spinner or message during blocking operations.

### [`com.andreszs.turnstile.demo`](com.andreszs.turnstile.demo/)

<img src="com.andreszs.turnstile.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Cloudflare Turnstile demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-turnstile](https://github.com/andreszs/cordova-plugin-turnstile) <img src="https://cdn.simpleicons.org/android/3DDC84" alt="Android" title="Android" width="16" height="16">
- **Library:** [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- **Documentation:** [Demo files and setup instructions](com.andreszs.turnstile.demo/)
- **Purpose:** Run a Turnstile challenge from a developer-hosted HTTPS page, return its token to the Cordova application, and validate it with a separate backend handler.

## Contribute

> [!NOTE]
> To keep the apps simple, some demos do not implement every function exposed by their plugins.

Contributions are always welcome. If you find a bug, want to add a missing feature, or have an improvement in mind, please [open an issue](https://github.com/andreszs/cordova-plugin-demos/issues) or [submit a pull request](https://github.com/andreszs/cordova-plugin-demos/pulls). Every bit of feedback helps keep the demo apps useful and reliable.

💙 If these demo apps save you time, you can support their continued development and maintenance through PayPal.

[Support the project via PayPal](https://www.paypal.com/ncp/payment/GEEM324PDD9NC)

⭐ If financial support is not an option, [star this repository](https://github.com/andreszs/cordova-plugin-demos) or share it with other Cordova developers—both make a difference.

## Changes Log

### 2026-10-20

- Added the `cordova-plugin-mlkit-suite` demo for Barcode scanning, Document scanner, Face detection, and Text recognition v2.

### 2026-10-15

- Updated the DNI Scanner demo to version 1.0.2 with Android and iOS metadata, plugin 0.2.0, and automatic orientation controls.

### 2026-10-13

- Added the `cordova-plugin-dni-scanner` Android demo app with configurable capture and quality controls.
- Converted every demo directory into a reproducible Cordova project with pinned npm dependencies.
- Added repository-wide exclusions for generated Cordova, npm, Android, and Gradle files.
- Removed precompiled APK artifacts from the source repository.

### 2026-08-27

- Refreshed the legacy demo app interfaces with Bootstrap 4.6.2 styling.
- Replaced the custom `index.css` files with local `bootstrap.min.css` files.
- Updated the HTML markup and JavaScript-generated elements for consistent, responsive layouts.
- Improved the repository documentation, navigation, and build instructions.

### 2026-08-26

- Added the `cordova-plugin-turnstile` demo app, including its source files and setup instructions.
