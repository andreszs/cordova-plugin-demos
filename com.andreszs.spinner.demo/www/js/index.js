/* global cordova */

var app = {
	/* informative variables manually updated */
	PLUGIN_VERSION: '1.1.4',
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

		$('#btnShow').on('click', app.show);
		$('#btnHide').on('click', app.hide);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/greybax/cordova-plugin-native-spinner', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-native-spinner-plugin-demo/', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	hide: function () {
		if ($("#wpStatusbar").is(':checked')) {
			var wpStatusbar = true;
		}

		window.SpinnerDialog.hide(wpStatusbar);
	},
	show: function () {
		// Plugin's method does not have success nor error callbacks, a PR to add them would be great.
//		var successCallback = function (strSuccess) {
//			$('#status').html('<span class="success">' + strSuccess + '</span>');
//		};
//		var errorCallback = function (strError) {
//			$('#status').html('<span class="error">' + strError + '</span>');
//		};
		var title = $('#txtTitle').val();
		if(title == '') title = null;

		var message = $('#txtMessage').val();
		if(message == '') message = null;

		var isNotCancellable = false;
		if ($("#isNotCancellable").is(':checked')) {
			isNotCancellable = true;
		}

		var durationMs = parseInt($('#selDuration').val() * 1000);

		window.SpinnerDialog.show(title, message, isNotCancellable);
		if (durationMs > 0) {
			window.setTimeout(function () {
				app.hide();
			}, durationMs);
		}

	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);

