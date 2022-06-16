/* global cordova */

var app = {
	/* informative variables manually updated */
	PLUGIN_VERSION: '1.0.1',
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

		$('#btnStartScan').on('click', app.startScan);
		$('#btnGetBarcodeConstant').on('click', app.getBarcodeConstant);

		// Populate barcode formats select
		$.each(cordova.plugins.GoogleCodeScanner.BarcodeFormat, function (key, value) {
			if (value > -1) {
				$('#selBarcodeFormat').append('<option value="' + value + '">' + key + '</option>');
			}
		});

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-google-code-scanner', '_system');
		});
		$('#btnWebsite').on('click', function () {
			window.open('https://www.andreszsogon.com/cordova-google-code-scanner-plugin-demo/', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});
	},
	getBarcodeConstant: function () {
		var onSuccess = function (jsonBarcode) {
			var formatName = jsonBarcode.formatName;
			var formatValue = jsonBarcode.formatValue;

			$('#status').html('<span class="success">formatName: ' + formatName + '</span>');
			$('#status').append('<br /><span class="success">formatValue: ' + formatValue + '</span>');
		};
		var onError = function (strError) {
			$('#status').html('<span class="error">' + strError + '</span>');
		};

		var options = {};
		options.barcodeFormat = $('#strBarcodeFormat').val();

		cordova.plugins.GoogleCodeScanner.getBarcodeConstant(onSuccess, onError, options);
	},
	startScan: function () {
		var onSuccess = function (jsonBarcode) {
			var rawValue = jsonBarcode.rawValue;
			var formatName = jsonBarcode.formatName;
			var formatValue = jsonBarcode.formatValue;
			var valueType = jsonBarcode.valueType;

			$('#status').html('<span class="success">rawValue: ' + rawValue + '</span>');
			$('#status').append('<br /><span class="success">formatName: ' + formatName + '</span>');
			$('#status').append('<br /><span class="success">formatValue: ' + formatValue + '</span>');
			$('#status').append('<br /><span class="success">valueType: ' + valueType + '</span>');
		};
		var onError = function (strError) {
			if (strError == 'Waiting for the Barcode UI module to be downloaded.') {
				// Downloading barcode UI: consider showing a full-screen spinner, and auto-retry scan in a few seconds.
			}
			$('#status').html('<span class="error">' + strError + '</span>');
		};

		var options = {};
		options.barcodeFormats = $('#selBarcodeFormat').val();

		var txtBarcodeFormats = $('#txtBarcodeFormats').val();
		if (txtBarcodeFormats != '' && isNaN(txtBarcodeFormats)) {
			$('#status').html('<span class="error">Barcode format must be an integer value.</span>');
		} else if (parseInt(txtBarcodeFormats) > 0) {
			options.barcodeFormats = txtBarcodeFormats;
		}

		cordova.plugins.GoogleCodeScanner.startScan(onSuccess, onError, options);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);

