![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/andreszs/cordova-plugin-demos) ![GitHub top language](https://img.shields.io/github/languages/top/andreszs/cordova-plugin-demos) ![GitHub](https://img.shields.io/github/license/andreszs/cordova-plugin-demos) ![GitHub last commit](https://img.shields.io/github/last-commit/andreszs/cordova-plugin-demos)

# Apache Cordova plugin demos

Source code for the **www** and **res** folders of some plugin demo apps by Andrés Zsögön. Refer to the [individual page for each demo app](https://www.andreszsogon.com/category/plugin-demo-apps/ "individual page for each demo app") for usage reference and compiled APK downloads.

:warning: To shorten the source code, all demos implement jQuery 3.6.0 which is included in the js folder.

# Building demo apps

To build and test a demo app with the provided source code:

1. [Create a new Cordova project](https://cordova.apache.org/docs/en/dev/reference/cordova-cli/index.html#cordova-create-command "Create a new Cordova project") using the provided package name (com.andreszs.[...].demo)
2. Add the **www** folder provided
3. Add the **res** folder and **config.xml** if you want to include the demo app icons.
4. Install the **cordova-plugin-app-version** plugin (used to retrieve app's version)
5. Install the **cordova-plugin-device** plugin (used in some demos that provide both android and browser platform)
6. Install the relevant plugin from either NPM or GitHub. In general, they are the same versions.

:warning: Some older demos may wrongly include *minSdkVersion* and *targetSdkVersion* variables inside config.xml. Kindly remove them because those values depend on your **cordova-android** platform version. Sorry about that.

# Contributing

:information_source: To keep apps simple, certain demos do not include all of the plugin's functions. To add missing features or fix errors, kindly sent a PR and it will be merged asap.

# Demo apps included

## com.andreszs.biometric.auth.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.biometric.auth.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-biometric-auth](https://github.com/andreszs/cordova-plugin-biometric-auth)
- Library: [KeyguardManager](https://developer.android.com/reference/android/app/KeyguardManager) & [BiometricManager](https://developer.android.com/reference/android/hardware/biometrics/BiometricManager)
- Authenticate device users with biometrics or fallback PIN, pattern or password.

## com.andreszs.btprinter.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.btprinter.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-btprinter](https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter)
- Bluetooth printer implementation to print text, images, barcodes and QR codes to any bluetooth-paired printer.

## com.andreszs.camera.preview.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.camera.preview.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-camera-preview](https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview) 
- Direct camera interaction from Javascript and HTML.

## com.andreszs.fingerprint.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.fingerprint.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-fingerprint-aio](https://github.com/NiklasMerz/cordova-plugin-fingerprint-aio)
- Library: [FingerprintManager](https://developer.android.com/reference/android/hardware/fingerprint/FingerprintManager) (deprecated)
- Authenticate users with biometric validation.

## com.andreszs.gcs.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.gcs.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-google-code-scanner](https://github.com/andreszs/cordova-plugin-google-code-scanner)
- Library: [Google code scanner](https://developers.google.com/ml-kit/vision/barcode-scanning/code-scanner)
- Complete solution for scanning code without requiring your app to request camera permission, while preserving user privacy.

## com.andreszs.grecaptcha.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.grecaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-recaptcha-enterprise](https://github.com/andreszs/cordova-plugin-recaptcha-enterprise)
- Library: [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs/overview)
- Google reCAPTCHA implementation for retrieving tokens used in risk score assessments.

## com.andreszs.hcaptcha.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.hcaptcha.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-hcaptcha](https://github.com/andreszs/cordova-plugin-hcaptcha)
- Library: [hcaptcha-android-sdk](https://github.com/hCaptcha/hcaptcha-android-sdk) and [browser API](https://docs.hcaptcha.com/invisible)
- The hCaptcha widget can protect your applications from bots, spam, and other forms of automated abuse.

## com.andreszs.inappupdate.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.inappupdate.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-in-app-updates](https://github.com/andreszs/cordova-plugin-in-app-updates)
- Library: [In-app updates](https://developer.android.com/guide/playcore/in-app-updates)
- A Google Play Core libraries feature that prompts active users to update your app.

## com.andreszs.recaptcha.v2.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.recaptcha.v2.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-recaptcha-v2](https://github.com/andreszs/cordova-plugin-recaptcha-v2)
- Library: [SafetyNet reCAPTCHA](https://developer.android.com/privacy-and-security/safetynet/recaptcha)
- The SafetyNet service includes a reCAPTCHA API that you can use to protect your app from malicious traffic.

## com.andreszs.smsreceive.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.smsreceive.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-sms-receive](https://github.com/andreszs/cordova-plugin-sms-receive)
- Library: [Telephony](https://developer.android.com/reference/android/provider/Telephony)
- Receive and read SMS messages using the Telephony API provided by Android.

## com.andreszs.smsretriever.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.smsretriever.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-sms-retriever](https://github.com/andreszs/cordova-plugin-sms-retriever)
- Library: [SMS Retriever](https://developers.google.com/identity/sms-retriever/overview)
- Receive and read SMS verification messages without requesting SMS permissions.

## com.andreszs.spinner.demo
<img src="https://github.com/andreszs/cordova-plugin-demos/blob/main/com.andreszs.spinner.demo/res/icons/android/mipmap-mdpi/ic_launcher.png?raw=true" align="right" width="36px" height="36px">

- Plugin: [cordova-plugin-native-spinner](https://github.com/greybax/cordova-plugin-native-spinner)
- Show a platform's native spinner and/or message for preventing user interaction during blocking operations.