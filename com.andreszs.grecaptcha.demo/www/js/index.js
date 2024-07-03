/* global cordova, device */

var app = {
	PLUGIN_VERSION: '1.0.0',
	URL_PLUGIN: 'https://github.com/andreszs/cordova-plugin-recaptcha-enterprise',
	URL_DEMO: 'https://www.andreszsogon.com/cordova-plugin-recaptcha-enterprise-demo/',
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
	getUserAgent: function () {
		/* Helper function to get user agent */
		$('#userAgent').val(navigator.userAgent);
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
		var onSuccess = function (token) {
			$('#token').html(token);
			$('#status').html('<span class="success">You have 2 minutes to create an assessment with this token</span>');
		};

		var onFailure = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		};

		var args = {
			sitekeyAndroid: $('#sitekeyAndroid').val(),
			sitekeyWeb: $('#sitekeyWeb').val()
		};

		$('#token').empty();
		$('#status').html('<span class="info">Requesting reCAPTCHA challenge...</span>');

		cordova.plugins.Recaptcha.verify(onSuccess, onFailure, args);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
	app.getUserAgent();
}, false);

