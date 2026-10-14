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

Before building, install Node.js, the Cordova CLI, the Android SDK, and the JDK and Gradle versions required by the `cordova-android` version declared in the selected demo's `package.json`.

Open a terminal in the demo directory and restore its exact npm dependencies:

```shell
npm ci
```

On the first build after cloning the repository, add the generated Android platform:

```shell
cordova platform add android
```

Cordova reads `package.json` and automatically restores the declared Android version, demonstrated plugin, auxiliary plugins, and installation variables.

Before compiling, you can verify that the required JDK, Android SDK, target SDK, and Gradle installation are available:

```shell
cordova requirements android
```

Then build the debug APK with:

```shell
cordova build android --debug
```

To build and deploy directly, connect an Android device with USB debugging enabled or start an emulator, then run:

```shell
cordova run android --device --debug
# or
cordova run android --emulator --debug
```

The build and device-deployment commands are also available through `npm run build:android` and `npm run run:android`. Some demos may still require runtime input such as a service URL, site key, paired peripheral, or supported device capability; those values are not build dependencies and are never stored as repository secrets.

## Included demo apps

### [`com.andreszs.biometric.auth.demo`](com.andreszs.biometric.auth.demo/)

<img src="com.andreszs.biometric.auth.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Biometric authentication demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-biometric-auth](https://github.com/andreszs/cordova-plugin-biometric-auth)
- **Libraries:** [KeyguardManager](https://developer.android.com/reference/android/app/KeyguardManager) and [BiometricManager](https://developer.android.com/reference/android/hardware/biometrics/BiometricManager)
- **Purpose:** Authenticate users with biometrics or a fallback PIN, pattern, or password.

### [`com.andreszs.btprinter.demo`](com.andreszs.btprinter.demo/)

<img src="com.andreszs.btprinter.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Bluetooth printer demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-btprinter](https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter)
- **Purpose:** Print text, images, barcodes, and QR codes using a paired Bluetooth printer.

### [`com.andreszs.camera.preview.demo`](com.andreszs.camera.preview.demo/)

<img src="com.andreszs.camera.preview.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Camera Preview demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-camera-preview](https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview)
- **Purpose:** Interact directly with the camera from JavaScript and HTML.

### [`com.andreszs.dniscanner.demo`](com.andreszs.dniscanner.demo/)

<img src="com.andreszs.dniscanner.demo/www/img/logo.png" alt="DNI Scanner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-dni-scanner](https://github.com/andreszs/cordova-plugin-dni-scanner)
- **Documentation:** [Demo files and setup instructions](com.andreszs.dniscanner.demo/)
- **Purpose:** Automatically capture, validate, crop, and correct Argentine DNI images entirely on-device.

### [`com.andreszs.fingerprint.demo`](com.andreszs.fingerprint.demo/)

<img src="com.andreszs.fingerprint.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Fingerprint demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-fingerprint-aio](https://github.com/NiklasMerz/cordova-plugin-fingerprint-aio)
- **Library:** [FingerprintManager](https://developer.android.com/reference/android/hardware/fingerprint/FingerprintManager) (deprecated)
- **Purpose:** Authenticate users with fingerprint validation.

### [`com.andreszs.gcs.demo`](com.andreszs.gcs.demo/)

<img src="com.andreszs.gcs.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Google Code Scanner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-google-code-scanner](https://github.com/andreszs/cordova-plugin-google-code-scanner)
- **Library:** [Google Code Scanner](https://developers.google.com/ml-kit/vision/barcode-scanning/code-scanner)
- **Purpose:** Scan codes without requesting camera permission while preserving user privacy.

### [`com.andreszs.grecaptcha.demo`](com.andreszs.grecaptcha.demo/)

<img src="com.andreszs.grecaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="reCAPTCHA Enterprise demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-recaptcha-enterprise](https://github.com/andreszs/cordova-plugin-recaptcha-enterprise)
- **Library:** [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/overview)
- **Purpose:** Retrieve tokens for reCAPTCHA Enterprise risk assessments.

### [`com.andreszs.hcaptcha.demo`](com.andreszs.hcaptcha.demo/)

<img src="com.andreszs.hcaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="hCaptcha demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-hcaptcha](https://github.com/andreszs/cordova-plugin-hcaptcha)
- **Libraries:** [hCaptcha Android SDK](https://github.com/hCaptcha/hcaptcha-android-sdk) and [browser API](https://docs.hcaptcha.com/invisible)
- **Purpose:** Protect applications from bots, spam, and other forms of automated abuse.

### [`com.andreszs.inappupdate.demo`](com.andreszs.inappupdate.demo/)

<img src="com.andreszs.inappupdate.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="In-app updates demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-in-app-updates](https://github.com/andreszs/cordova-plugin-in-app-updates)
- **Library:** [Google Play In-App Updates](https://developer.android.com/guide/playcore/in-app-updates)
- **Purpose:** Prompt active users to update an Android app through Google Play.

### [`com.andreszs.recaptcha.v2.demo`](com.andreszs.recaptcha.v2.demo/)

<img src="com.andreszs.recaptcha.v2.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SafetyNet reCAPTCHA demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-recaptcha-v2](https://github.com/andreszs/cordova-plugin-recaptcha-v2)
- **Library:** [SafetyNet reCAPTCHA](https://developer.android.com/privacy-and-security/safetynet/recaptcha)
- **Purpose:** Protect applications from malicious traffic with the SafetyNet reCAPTCHA API.

### [`com.andreszs.smsreceive.demo`](com.andreszs.smsreceive.demo/)

<img src="com.andreszs.smsreceive.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SMS Receive demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-sms-receive](https://github.com/andreszs/cordova-plugin-sms-receive)
- **Library:** [Telephony](https://developer.android.com/reference/android/provider/Telephony)
- **Purpose:** Receive and read SMS messages using the Android Telephony API.

### [`com.andreszs.smsretriever.demo`](com.andreszs.smsretriever.demo/)

<img src="com.andreszs.smsretriever.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="SMS Retriever demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-sms-retriever](https://github.com/andreszs/cordova-plugin-sms-retriever)
- **Library:** [SMS Retriever](https://developers.google.com/identity/sms-retriever/overview)
- **Purpose:** Receive and read SMS verification messages without requesting SMS permissions.

### [`com.andreszs.spinner.demo`](com.andreszs.spinner.demo/)

<img src="com.andreszs.spinner.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Native Spinner demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-native-spinner](https://github.com/greybax/cordova-plugin-native-spinner)
- **Purpose:** Display a platform-native spinner or message during blocking operations.

### [`com.andreszs.turnstile.demo`](com.andreszs.turnstile.demo/)

<img src="com.andreszs.turnstile.demo/res/icons/android/mipmap-mdpi/ic_launcher.png" alt="Cloudflare Turnstile demo icon" align="right" width="36" height="36">

- **Plugin:** [cordova-plugin-turnstile](https://github.com/andreszs/cordova-plugin-turnstile)
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
