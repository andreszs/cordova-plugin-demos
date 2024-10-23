/* global cordova */

var app = {
	RETRIEVER_STARTED: false,
	/* informative variables manually updated */
	plugin_version: '2.0.0',
	getHashString: function () {
		if (app.RETRIEVER_STARTED === true) {
			$('#status').html('Blocked action: You must NOT call this method after a retriever is started, otherwise the SMS will be ignored!');
		} else {
			var onSuccess = function (strSuccess) {
				$('#status').html('<span class="success">' + strSuccess + '</span>');
				$('#txtMessage').val('AZC123 is your code for andreszsogon.com SMS Retriever Demo App. ' + strSuccess);
				app.RETRIEVER_STARTED = false;
			};
			var onFail = function (strError) {
				$('#status').html('<span class="error">' + strError + '</span>');
				app.RETRIEVER_STARTED = false;
			};
			cordova.plugins.SMSRetriever.getHashString(onSuccess, onFail);
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

		// Initialize incoming SMS event listener
		document.addEventListener('onSMSArrive', function (args) {
			app.onSMSArrive(args);
		});

		// Bind startWatch method
		$('#startWatch').on('click', app.startWatch);

		// Bind getHashString method
		$('#getHashString').on('click', app.getHashString);
		
		// Bind getPhoneNumber method
		$('#getPhoneNumber').on('click', app.getPhoneNumber);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('http://github.com/andreszs/cordova-plugin-sms-retriever', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-sms-retriever-plugin-demo-app/', '_system');
		});
		$('#btnPlayStore').on('click', function () {
			window.open('https://play.google.com/store/apps/details?id=com.andreszs.smsretriever.demo', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	getPhoneNumber: function () {
        var onSuccess = function (strSuccess) {
            $('#status').html('<span class="success">' + strSuccess + '</span>');
        };
        var onFail = function (strError) {
            $('#status').html('<span class="error">' + strError + '</span>');
        };
        cordova.plugins.SMSRetriever.getPhoneNumber(onSuccess, onFail);
    },
	startWatch: function () {
		var onSuccess = function (strSuccess) {
			$('#status').html('<span class="success">' + strSuccess + '</span>');
			if (strSuccess == 'SMS_RETRIEVER_DONE') {
				app.RETRIEVER_STARTED = false;
			} else {
				app.RETRIEVER_STARTED = true;
			}
		};
		var onFail = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
			app.RETRIEVER_STARTED = false;
		};
		cordova.plugins.SMSRetriever.startWatch(onSuccess, onFail);
	},
	onSMSArrive: function (args) {
		$('#event').html('onSMSArrive: ' + args.message);
		app.RETRIEVER_STARTED = false;
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);