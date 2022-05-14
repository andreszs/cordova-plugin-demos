/* global cordova, Fingerprint */

var app = {
	/* informative variables manually updated */
	plugin_version: '5.0.1',
	disableBackup: function () {
		if ($("#disableBackup").is(':checked')) {
			$('#txtDescription').val('disableBackup=true');
		} else {
			$('#txtDescription').val('disableBackup=false');
		}
	},
	getVersion: function () {
		if (typeof (cordova.getAppVersion) != 'undefined') {
			// cordova-plugin-app-version present
			var onSuccess = function (version) {
				$('#app_version').html('App version: ' + version);
			};
			cordova.getAppVersion.getVersionNumber(onSuccess);
			$('#plugin_version').html('Plugin version ' + app.plugin_version);
		} else {
			// cordova-plugin-app-version missing
			$('#versions').hide();
		}
	},
	init: function () {
		$('#status').html('<span class="success">Device is ready</span>');

		$('#btnIsAvailable').on('click', app.isAvailable);
		$('#btnShow').on('click', app.show);
		$('#disableBackup').on('click', app.disableBackup);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/NiklasMerz/cordova-plugin-fingerprint-aio', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-fingerprint-plugin-demo/', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	isAvailable: function () {
		var isAvailableSuccess = function (result) {
			/* result depends on device and os.
			 *  iPhone X will return 'face'
			 *  other Android or iOS devices will return 'finger'
			 *  Android P+ will return 'biometric' */
			$('#status').html('<span class="success">' + result + '</span>');
		};
		var isAvailableError = function (error) {
			/* 'error' will be an object with an error code and message */
			$('#status').html('<span class="error">' + error.message + '</span>');
		};
		var optionalParams = {allowBackup: true};
		Fingerprint.isAvailable(isAvailableSuccess, isAvailableError, optionalParams);
	},
	show: function () {
		var successCallback = function (str) {
			$('#status').html('<span class="success">' + str + '</span>');
			//$('#status').html('<span class="success">Authentication successful</span>');
		};
		var errorCallback = function (error) {
			console.log(error);
			$('#status').html('<span class="error">' + error.message + '</span>');
		};

		var options = {};
		options.title = $('#txtTitle').val();
		if (options.title == '') {
			delete(options.title);
		}
		options.subtitle = $('#txtSubtitle').val();
		if (options.subtitle.length == 0) {
			delete(options.subtitle);
		}
		options.description = $('#txtDescription').val();
		if (options.description.length == 0) {
			delete(options.description);
		}
		options.fallbackButtonTitle = $('#txtFallbackButtonTitle').val();
		options.cancelButtonTitle = $('#txtCancelButtonTitle').val();
		if ($("#disableBackup").is(':checked')) {
			options.disableBackup = true;
		} else {
			options.disableBackup = false;
		}
		if ($("#confirmationRequired ").is(':checked')) {
			options.confirmationRequired = true;
		} else {
			options.confirmationRequired = false;
		}
		Fingerprint.show(options, successCallback, errorCallback);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);

