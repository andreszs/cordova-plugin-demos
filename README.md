# Apache Cordova plugin demos

Source code for the **www** and **res** folders of some plugin demo apps by Andrés Zsögön. Refer to the [individual page for each demo app](https://www.andreszsogon.com/category/plugin-demo-apps/ "individual page for each demo app") for usage reference and compiled APK downloads.

:warning: To shorten the source code, all demos implement jQuery 3.6.0 which is included in the js folder.

# Building demo apps

To build and test a demo app, create a new Cordova project and add the **www** and **res** folders provided. The included **config.xml** can be ignored, since it does not provide critical information apart from the drawer icons, app name, version and the minSdkVersion number.

:heavy_exclamation_mark: Remember to add the relevant plugin from npm or GitHub into your app.

# Contributing

:information_source: To keep apps simple, certain demos do not include all of the plugin's functions. To add missing features or fix errors, kindly sent a PR and it will be merged asap.