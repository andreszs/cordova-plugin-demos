![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/andreszs/cordova-plugin-demos) ![GitHub top language](https://img.shields.io/github/languages/top/andreszs/cordova-plugin-demos) ![GitHub](https://img.shields.io/github/license/andreszs/cordova-plugin-demos) ![GitHub last commit](https://img.shields.io/github/last-commit/andreszs/cordova-plugin-demos)

# Apache Cordova plugin demos

Source code for the **www** and **res** folders of some plugin demo apps by Andrés Zsögön. Refer to the [individual page for each demo app](https://www.andreszsogon.com/category/plugin-demo-apps/ "individual page for each demo app") for usage reference and compiled APK downloads.

:warning: To shorten the source code, all demos implement jQuery 3.6.0 which is included in the js folder.

# Building demo apps

To build and test a demo app, create a new Cordova project and add the **www** and **res** folders provided. The included **config.xml** can be ignored, since it does not provide critical information apart from the drawer icons, app name, version and the minSdkVersion number.

:heavy_exclamation_mark: Remember to add the relevant plugin from npm or GitHub into your app.

# Contributing

:information_source: To keep apps simple, certain demos do not include all of the plugin's functions. To add missing features or fix errors, kindly sent a PR and it will be merged asap.

# Demo apps included

## com.andreszs.biometric.auth.demo

Sample app for my [cordova-plugin-biometric-auth](https://github.com/andreszs/cordova-plugin-biometric-auth) Cordova plugin, which allows to authenticate users with biometrics or fallback PIN, pattern or password.

**Plugin platforms**: android, browser (filler platform)

## com.andreszs.btprinter.demo

Sample app for the [cordova-plugin-btprinter](https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter) Cordova plugin, which allows to print text, images, barcodes and QR codes to any bluetooth-paired printer.

**Plugin platforms**: android.

## com.andreszs.camera.preview.demo

Sample app for the [cordova-plugin-camera-preview](https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview) Cordova plugin, which allows direct camera interaction from Javascript and HTML.

**Plugin platforms**: android, ios.

## com.andreszs.fingerprint.demo

Sample app for the [cordova-plugin-fingerprint-aio](https://github.com/NiklasMerz/cordova-plugin-fingerprint-aio) Cordova plugin, which allows to use biometric validation in Android using the deprecated Fingerprint Manager API.

**Plugin platforms**: android, ios.

## com.andreszs.gcs.demo

Sample app for my [cordova-plugin-google-code-scanner](https://github.com/andreszs/cordova-plugin-google-code-scanner) Cordova plugin, which allows scanning of codes without requesting camera permissions using the new Google Play Services barcode API.

**Plugin platforms**: android, browser (filler platform with manual code input).

## com.andreszs.inappupdate.demo

Sample app for my [cordova-plugin-in-app-updates](https://github.com/andreszs/cordova-plugin-in-app-updates) Cordova plugin, which allows to check for and install updates from Play Store using the native in-app updates library.

**Plugin platforms**: android, browser (filler platform).

## com.andreszs.smsreceive.demo

Sample app for my [cordova-plugin-sms-receive](https://github.com/andreszs/cordova-plugin-sms-receive) Cordova plugin, which allows to receive and read SMS messages using the Telephony API provided by Android.

**Plugin platforms**: android.

## com.andreszs.smsretriever.demo

Sample app for my [cordova-plugin-sms-retriever](https://github.com/andreszs/cordova-plugin-sms-retriever) Cordova plugin, which allows to receive and read SMS messages using the SMS Verification APIs provided by Android.

**Plugin platforms**: android.

## com.andreszs.spinner.demo

Sample app for the the [cordova-plugin-native-spinner](https://github.com/greybax/cordova-plugin-native-spinner), which allows to show a platform's native spinner and/or message for preventing user interaction during blocking operations.

**Plugin platforms**: android, browser, ios, windows, wp.