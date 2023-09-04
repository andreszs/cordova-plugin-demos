/* global cordova */

var app = {
	/* informative variables manually updated */
	plugin_version: '2.1.0',
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
		$('#status').prepend('Device is ready' + '\r\n');

		$('#getUpdateAvailability').on('click', app.getUpdateAvailability);
		$('#setSnackbarOptions').on('click', app.setSnackbarOptions);
		$('#updateFlexible').on('click', app.updateFlexible);
		$('#updateImmediate').on('click', app.updateImmediate);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('http://github.com/andreszs/cordova-plugin-in-app-updates', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-in-app-update-plugin-demo-app/', '_system');
		});
		$('#btnPlayStore').on('click', function () {
			window.open('https://play.google.com/store/apps/details?id=com.andreszs.inappupdate.demo', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	getUpdateAvailability: function () {
		$('#status').html('getUpdateAvailability\r\n');

		var onSuccess = function (strSuccess) {
			$('#status').prepend('onSuccess:' + strSuccess + '\r\n');
		};
		var onFail = function (strError) {
			$('#status').prepend('onError:' + strError + '\r\n');
		};
		cordova.plugins.InAppUpdate.getUpdateAvailability(onSuccess, onFail);
	},
	setSnackbarOptions: function () {
		$('#status').html('setSnackbarOptions\r\n');

		var onSuccess = function (strSuccess) {
			$('#status').prepend('onSuccess:' + strSuccess + '\r\n');
		};
		var onFail = function (strError) {
			$('#status').prepend('onError:' + strError + '\r\n');
		};
		var snackbarText = $('#snackbarText').val();
		var snackbarButton = $('#snackbarButton').val();
		var snackbarButtonColor = $('#snackbarButtonColor').val();
		cordova.plugins.InAppUpdate.setSnackbarOptions(onSuccess, onFail, snackbarText, snackbarButton, snackbarButtonColor);
	},
	updateFlexible: function () {
		$('#status').html('updateFlexible\r\n');

		var onSuccess = function (strSuccess) {
			$('#status').prepend('onSuccess:' + strSuccess + '\r\n');
		};
		var onFail = function (strError) {
			$('#status').prepend('onError:' + strError + '\r\n');
		};
		cordova.plugins.InAppUpdate.updateFlexible(onSuccess, onFail);
	},
	updateImmediate: function () {
		$('#status').html('updateImmediate\r\n');

		var onSuccess = function (strSuccess) {
			$('#status').prepend('onSuccess:' + strSuccess + '\r\n');
		};
		var onFail = function (strError) {
			$('#status').prepend('onError:' + strError + '\r\n');
		};
		cordova.plugins.InAppUpdate.updateImmediate(onSuccess, onFail);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);