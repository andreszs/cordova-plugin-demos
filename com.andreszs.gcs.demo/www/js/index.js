/* global cordova */

var app = {
	/* informative variables manually updated */
	PLUGIN_VERSION: '1.1.0',
	MAX_SCAN_RETRIES: 2,
	SCAN_RETRY_DELAY_MS: 2000,
	showStatus: function (lines, className) {
		var values = Array.isArray(lines) ? lines : [lines];
		var $status = $('#status').empty();

		$.each(values, function (index, value) {
			if (index > 0) {
				$status.append('<br />');
			}
			$status.append($('<span>').addClass(className).text(value));
		});
	},
	setScanBusy: function (busy) {
		$('#btnStartScan')
			.prop('disabled', busy)
			.attr('aria-busy', busy ? 'true' : 'false')
			.text(busy ? 'Preparing scanner…' : 'startScan');
	},
	normalizeScanError: function (error) {
		if (typeof error === 'object' && error !== null) {
			return {
				errorCode: typeof error.errorCode === 'number' ? error.errorCode : -1,
				errorName: error.errorName || 'UNKNOWN',
				message: error.message || 'Unknown scanner error.',
				retryable: error.retryable === true,
				canceled: error.canceled === true
			};
		}

		var message = String(error || 'Unknown scanner error.');
		return {
			errorCode: -1,
			errorName: message === 'Canceled' ? 'CODE_SCANNER_CANCELLED' : 'LEGACY_ERROR',
			message: message,
			retryable: message === 'Waiting for the Barcode UI module to be downloaded.',
			canceled: message === 'Canceled'
		};
	},
	getScanErrorMessage: function (error) {
		switch (error.errorName) {
			case 'CODE_SCANNER_UNAVAILABLE':
			case 'MODULE_CHECK_FAILED':
			case 'MODULE_INSTALL_FAILED':
			case 'MODULE_INSTALL_CANCELED':
				return 'The Barcode UI module is not ready yet.';
			case 'CODE_SCANNER_GOOGLE_PLAY_SERVICES_VERSION_TOO_OLD':
				return 'Google Play services must be updated before scanning.';
			case 'CODE_SCANNER_CAMERA_PERMISSION_NOT_GRANTED':
				return 'Google Play services does not have camera permission.';
			case 'CODE_SCANNER_TASK_IN_PROGRESS':
				return 'Another scan is already in progress.';
			case 'CODE_SCANNER_PIPELINE_INITIALIZATION_ERROR':
			case 'CODE_SCANNER_PIPELINE_INFERENCE_ERROR':
			case 'INTERNAL':
				return 'Google Play services could not start the scanner.';
			default:
				return error.message;
		}
	},
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
		app.showStatus('Device is ready', 'text-success');

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

			app.showStatus([
				'formatName: ' + formatName,
				'formatValue: ' + formatValue
			], 'text-success');
		};
		var onError = function (strError) {
			app.showStatus(String(strError), 'text-danger');
		};

		var options = {};
		options.barcodeFormat = $('#strBarcodeFormat').val();

		cordova.plugins.GoogleCodeScanner.getBarcodeConstant(onSuccess, onError, options);
	},
	startScan: function (retryCount) {
		retryCount = typeof retryCount === 'number' ? retryCount : 0;

		var options = {};
		options.barcodeFormats = $('#selBarcodeFormat').val();

		var txtBarcodeFormats = $('#txtBarcodeFormats').val();
		if (txtBarcodeFormats !== '' && isNaN(txtBarcodeFormats)) {
			app.showStatus('Barcode format must be an integer value.', 'text-danger');
			return;
		} else if (parseInt(txtBarcodeFormats, 10) > 0) {
			options.barcodeFormats = txtBarcodeFormats;
		}

		app.setScanBusy(true);
		app.showStatus('Preparing the Barcode UI module…', 'text-info');

		var onSuccess = function (jsonBarcode) {
			var rawValue = jsonBarcode.rawValue;
			var formatName = jsonBarcode.formatName;
			var formatValue = jsonBarcode.formatValue;
			var valueType = jsonBarcode.valueType;

			app.setScanBusy(false);
			app.showStatus([
				'rawValue: ' + rawValue,
				'formatName: ' + formatName,
				'formatValue: ' + formatValue,
				'valueType: ' + valueType
			], 'text-success');
		};
		var onError = function (scanError) {
			var error = app.normalizeScanError(scanError);

			if (error.canceled) {
				app.setScanBusy(false);
				app.showStatus('Scan canceled.', 'text-secondary');
				return;
			}

			if (error.retryable && retryCount < app.MAX_SCAN_RETRIES) {
				app.showStatus(
					app.getScanErrorMessage(error) + ' Retrying (' +
					(retryCount + 1) + '/' + app.MAX_SCAN_RETRIES + ')…',
					'text-info'
				);
				window.setTimeout(function () {
					app.startScan(retryCount + 1);
				}, app.SCAN_RETRY_DELAY_MS);
				return;
			}

			app.setScanBusy(false);
			app.showStatus([
				app.getScanErrorMessage(error),
				'Error: ' + error.errorName + ' (' + error.errorCode + ')'
			], 'text-danger');
		};

		cordova.plugins.GoogleCodeScanner.startScan(onSuccess, onError, options);
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);

