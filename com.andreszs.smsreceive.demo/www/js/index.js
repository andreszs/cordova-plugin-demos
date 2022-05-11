/* global cordova */

var app = {
	/* informative variables manually updated */
	plugin_version: '2.0.0',
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

		// Initialize incoming SMS event listener
		document.addEventListener('onSMSArrive', app.onSMSArrive);

		$('#startWatch').on('click', app.startWatch);
		$('#stopWatch').on('click', app.stopWatch);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-sms-receive', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	onSMSArrive: function (message) {
		//var IncomingSMS = message.data; /* plugin 1.x */
		var IncomingSMS = message; /* plugin 2.x */
		// Show received SMS contents
		$('#event').html('SMS from: ' + IncomingSMS.address + '<br />Received on: ' + IncomingSMS.date + '<br />Body: ' + IncomingSMS.body);
	},
	startWatch: function () {
		cordova.plugins.SMSReceive.startWatch(function (strSuccess) {
			$('#status').html('<span class="success">' + strSuccess + '</span>');
		}, function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		});
	},
	stopWatch: function () {
		cordova.plugins.SMSReceive.stopWatch(function (strSuccess) {
			$('#status').html('<span class="success">' + strSuccess + '</span>');
		}, function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		});
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);
