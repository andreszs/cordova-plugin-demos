/* global cordova, device */

var app = {
	PLUGIN_VERSION: '1.0.0',
	URL_PLUGIN: 'https://github.com/andreszs/cordova-plugin-hcaptcha',
	URL_DEMO: 'https://www.andreszsogon.com/com-andreszs-hcaptcha-demo/',
	URL_DEMOS: 'https://github.com/andreszs/cordova-plugin-demos',
	getVersion: function () {
		if (typeof (cordova.getAppVersion) != 'undefined') {
			var onSuccess = function (version) {
				$('#app_version').html('App version: ' + version);
			};
			cordova.getAppVersion.getVersionNumber(onSuccess);
			$('#plugin_version').html('Plugin version ' + app.PLUGIN_VERSION);
		} else {
			$('#versions').hide();
		}
	},
	init: function () {
		$('#status').html('<span class="success">Device is ready</span>');

		$('#btnVerify').on('click', app.verify);

		$('#btnGitHub').on('click', function () {
			window.open(app.URL_PLUGIN, '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open(app.URL_DEMO, '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open(app.URL_DEMOS, '_system');
		});
	},
	verify: function () {
		var onSuccess = function (strToken) {
			$('#token').html(strToken);
			$('#status').html('<span class="success">You have to verify the response token as explained in Verify the User Response Server Side</span>');
		};

		var onError = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		};

		var args = {
			siteKey: $('#siteKey').val(),
			locale: $('#locale').val(),
			loading: ($('#loading').val().toLowerCase() === "true"),
			tokenExpiration: parseInt($('#tokenExpiration').val())
		};
		$('#token').empty();
		$('#status').html('<span class="info">Requesting hCaptcha challenge...</span>');

		cordova.plugins.Hcaptcha.verify(onSuccess, onError, args);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);
