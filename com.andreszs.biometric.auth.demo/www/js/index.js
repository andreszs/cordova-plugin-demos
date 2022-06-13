/* global cordova */

var Authenticators = {
	KEYGUARD_MANAGER: 1,
	BIOMETRIC_STRONG: 15,
	BIOMETRIC_WEAK: 255,
	DEVICE_CREDENTIAL: 32768
};

var app = {
	/* informative variables manually updated */
	PLUGIN_VERSION: '1.0.0',
	getVersion: function () {
		if (typeof (cordova.getAppVersion) != 'undefined') {
			// cordova-plugin-app-version present
			var onSuccess = function (version) {
				$('#app_version').html('App version: ' + version);
			};
			cordova.getAppVersion.getVersionNumber(onSuccess);
			$('#plugin_version').html('Plugin version ' + app.PLUGIN_VERSION);
		} else {
			// cordova-plugin-app-version missing
			$('#versions').hide();
		}
	},
	init: function () {
		$('#status').html('<span class="success">Device is ready</span>');

		// Check if user can authenticate
		$('#btnIsAvailable').on('click', app.isAvailable);

		// Authenticate with any available method
		$('#btnAuthenticate').on('click', app.authenticate);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-biometric-auth', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-biometric-auth-plugin-demo/', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	isAvailable: function () {
		var onSuccess = function (strSuccess) {
			$('#status').html('<span class="success">' + strSuccess + '</span>');
		};
		var onError = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		};
		optionalParams = {
			authenticators: $('#selAuthenticators').val()
		};
		cordova.plugins.BiometricAuth.isAvailable(onSuccess, onError, optionalParams);

	},
	authenticate: function () {
		var onSuccess = function (strSuccess) {
			$('#status').html('<span class="success">' + strSuccess + '</span>');
		};
		var onError = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		};

		var optionalParams = {};
		optionalParams.title = $('#txtTitle').val();
		if (optionalParams.title == '') {
			delete(optionalParams.title);
		}
		optionalParams.subtitle = $('#txtSubtitle').val();
		if (optionalParams.subtitle.length == 0) {
			delete(optionalParams.subtitle);
		}
		optionalParams.negativeButtonText = $('#negativeButtonText').val();
		optionalParams.disableBackup = ($("#disableBackup").is(':checked'));
		optionalParams.authenticators = $('#selAuthenticators').val();

		cordova.plugins.BiometricAuth.authenticate(onSuccess, onError, optionalParams);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);

