/* global cordova, BTPrinter */
/* NOTICE this demo requires the cordova-plugin-x-toast plugin installed! */

var app = {
	/* informative variables manually updated */
	plugin_version: '0.1.0-dev',
	beepX1: function () {
		// Beeps 1 time for 9*50ms
		var bytes = '1B420109';
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
	},
	beepX3: function () {
		// Beeps 3 times for 9*50ms each time
		var bytes = '1B420309';
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
	},
	connect: function () {
		$('#btnConnect').prop('disabled', true);
		window.setTimeout(function () {
			/* Use timeout to properly update GUI first */
			var strPrinter = $('#btpPrinter option:selected').attr('data-name');
			BTPrinter.connect(function (data) {
				window.plugins.toast.showLongBottom(data);
				$('#status').html('<span class="success">' + data + '</span>');
				$('#btnConnect').prop('disabled', false);
			}, function (err) {
				window.plugins.toast.showLongBottom(err);
				$('#status').html('<span class="error">' + err + '</span>');
				$('#btnConnect').prop('disabled', false);
			}, strPrinter);
		}, 100);
	},
	connected: function () {
		BTPrinter.connected(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		});
	},
	disconnect: function () {
		BTPrinter.disconnect(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		});
	},
	fontDemo: function () {
		var TXT_UNDERL_OFF = '1b2d00'; // bluetooth printer underline OFF
		var TXT_UNDERL_ON = '1b2d01'; // bluetooth printer underline font 1-dot ON
		var TXT_UNDERL2_ON = '1b2d02'; // bluetooth printer underline font 2-dot ON
		var TXT_BOLD_OFF = '1b4500'; // bluetooth printer bold font OFF
		var TXT_BOLD_ON = '1b4501'; // bluetooth printer bold font ON
		var TXT_FONT_A = '1b4d48'; // bluetooth printer font type A
		var TXT_FONT_B = '1b4d01'; // bluetooth printer font type B

		$('#btnReset').click();
		$('#txtEncoding').val('ISO-8859-1');

		/* Print font types demo */
		$('#txtSample').val('>>> FONT DEMO');
		$('#btnPrintText').click();

		$('#txtPOS').val(TXT_UNDERL_ON);
		$('#btnPrintPOSCommand').click();
		$('#txtSample').val('Underline font 1-dot');
		$('#btnPrintText').click();
		$('#btnReset').click();

		$('#txtPOS').val(TXT_UNDERL2_ON);
		$('#btnPrintPOSCommand').click();
		$('#btnPrintPOSCommand').click();
		$('#txtSample').val('Underline font 2-dot');
		$('#btnPrintText').click();
		$('#btnReset').click();

		$('#txtPOS').val(TXT_BOLD_ON);
		$('#btnPrintPOSCommand').click();
		$('#txtSample').val('Bold font ON');
		$('#btnPrintText').click();
		$('#btnReset').click();

		$('#txtPOS').val(TXT_FONT_A);
		$('#btnPrintPOSCommand').click();
		$('#txtSample').val('Font type A');
		$('#btnPrintText').click();
		$('#btnReset').click();

		$('#txtPOS').val(TXT_FONT_B);
		$('#btnPrintPOSCommand').click();
		$('#txtSample').val('Font type B');
		$('#btnPrintText').click();

		$('#btnReset').click();
		$('#txtSample').val('>>> Sent POS:FEED+BEEP+RESET');
		$('#btnPrintText').click();

		$('#btnLineFeed').click();
		$('#btnBeepX3').click();
		$('#btnReset').click();
	},
	getVersion: function () {
		if (typeof (cordova.getAppVersion) != 'undefined') {
			// cordova-plugin-app-version present
			var onSuccess = function (version) {
				$('#app_version').html('App version: ' + version);
			};
			cordova.getAppVersion.getVersionNumber(onSuccess);
			$('#plugin_version').html('Plugin version ' + app.plugin_version);
			$('#cordova_android_version').html(app.cordova_android_version);
		} else {
			// cordova-plugin-app-version missing
			$('#versions').hide();
		}
	},
	init: function () {
		$('#status').html('<span class="success">Device ready. Use <strong>list</strong> to retrieve paired BT devices</span>');

		$('#btnList').on('click', app.list);
		$('#btnStatus').on('click', app.status);
		$('#btnConnected').on('click', app.connected);
		$('#btnConnect').on('click', app.connect);
		$('#btnDisconnect').on('click', app.disconnect);
		$('#btnPrintQRCode').on('click', app.printQRCode);
		$('#btnPrintBarcode').on('click', app.printBarcode);
		$('#btnSetEncoding').on('click', app.setEncoding);
		$('#btnPrintText').on('click', app.printText);
		$('#btnPrintTextSizeAlign').on('click', app.printTextSizeAlign);
		$('#btnPrintTitle').on('click', app.printTitle);
		$('#btnPrintPOSCommand').on('click', app.printPOSCommand);
		$('#btnPrintBase64').on('click', app.printBase64);
		$('#btnReset').on('click', app.reset);
		$('#btnLineFeed').on('click', app.lineFeed);
		$('#btnFontDemo').on('click', app.fontDemo);
		$('#btnSizeDemo').on('click', app.sizeDemo);
		$('#btnBeepX1').on('click', app.beepX1);
		$('#btnBeepX3').on('click', app.beepX3);
		$('#btnPrintGreek').on('click', app.printGreek);
		$('#btnEnableInverted').on('click', app.setInvertedOn);
		$('#btnDisableInverted').on('click', app.setInvertedOff);

		// Bind sample app own methods
		$('#btnGitHub').on('click', function () {
			window.open('https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter', '_system');
		});
		$('#btnWebsite').on('click', function () {
			$('#btnReset').click();
			$('#txtSample').val('Visit andreszsogon.com for source and more demo apps.');
			$('#btnPrintText').click();
			$('#btnLineFeed').click();
			$('#btnBeepX1').click();
			window.open('https://www.andreszsogon.com/cordova-bluetooth-printer-plugin-demo-app', '_system');
		});
		$('#btnPlayStore').on('click', function () {
			window.open('https://play.google.com/store/apps/details?id=com.andreszs.btprinter.demo', '_system');
		});
		$('#btnPluginDemos').on('click', function () {
			window.open('https://github.com/andreszs/cordova-plugin-demos', '_system');
		});

	},
	lineFeed: function () {
		var bytes = '0A';
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
	},
	list: function () {
		BTPrinter.list(function (data) {
			$('#btpPrinter').empty().prop('disabled', false);
			$.each(data, function (idx, value) {
				/* Add devices (array contains device name every 3 array elements) */
				if (idx % 3 === 0) {
					$('#btpPrinter').append('<option value="' + idx + '" data-name="' + data[idx] + '">' + data[idx] + ' (' + data[idx + 1] + ')</option>');
				}
			});
			$('#status').html('<span class="success">Select a paired printer and click <strong>connect</strong></span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
			$('#btpPrinter').empty().prop('disabled', true);
		});
	},
	printBarcode: function () {
		var system = $('#optBCSystem').val();
		var data = $('#txtBarcode').val();
		var align = $('#optAlign').val();
		var position = $('#optBCPosition').val();
		var font = $('#optBCFont').val();
		var height = $('#optBCHeight').val();
		BTPrinter.printBarcode(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, system, data, align, position, font, height);
		$('#btnLineFeed').click();
	},
	printBase64: function () {
		var printBase64 = $('#txtBase64').val();
		var strAlign = $('#optAlign option:selected').val();
		BTPrinter.printBase64(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, printBase64, strAlign);
		// Print extras
		$('#txtSample').val('>>> Sent POS:FEED+BEEP');
		$('#btnPrintText').click();
		$('#btnLineFeed').click();
		$('#btnBeepX3').click();
	},
	printGreek: function () {
		// Greek sample text
		$('#txtEncoding').val('ISO-8859-7');
		$('#txtSample').val('>>> Set Encoding: ISO-8859-7');
		$('#btnSetEncoding').click();
		$('#btnPrintText').click(); // print performed action

		/* Greek character tables modes test with ISO-8859-7 encoding */
		app.testCP(11);
		app.testCP(14);
		app.testCP(15);
		app.testCP(38);
		app.testCP(47);

		$('#btnLineFeed').click();
		$('#btnBeepX3').click();
	},
	printPOSCommand: function () {
		var printPOS = $('#txtPOS').val();
		BTPrinter.printPOSCommand(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, printPOS);
	},
	printQRCode: function () {
		var data = $('#txtQRData').val();
		var align = $('#optAlign').val();
		var model = $('#optQRModel').val();
		var size = $('#optQRSize').val();
		var eclevel = $('#optQREclevel').val();
		BTPrinter.printQRCode(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, data, align, model, size, eclevel);
		$('#btnLineFeed').click();
	},
	printText: function () {
		var strText = $('#txtSample').val() + "\n";
		BTPrinter.printText(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, strText);
	},
	printTextSizeAlign: function () {
		var strText = $('#txtSample').val();
		var strSize = $('#optSize option:selected').val();
		var strAlign = $('#optAlign option:selected').val();
		BTPrinter.printTextSizeAlign(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, strText, strSize, strAlign);
	},
	printTitle: function () {
		var strText = $('#txtSample').val();
		var strSize = $('#optSize option:selected').val();
		var strAlign = $('#optAlign option:selected').val();
		BTPrinter.printTitle(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, strText, strSize, strAlign);
	},
	reset: function () {
		// Clear data in buffer and reset modes
		var bytes = '1B40'; /* Initialize printer: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=192 */
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
		// Reset GUI
		$('#txtSample').val("» BTPrinter Plugin Demo\n» ©2020 Andrés Zsögön");
		$('#optAlign').val(0);
		$('#optSize').val('00');
		$('#invertedIcon').hide();
	},
	sizeDemo: function () {
		$('#btnReset').click();
		$('#txtEncoding').val('ISO-8859-1');

		/* Print font sizes demo */
		$('#txtSample').val('>>> SIZE DEMO');
		$('#btnPrintText').click();

		$('#optSize').val('00');
		$('#txtSample').val('00 Normal Size');
		$('#btnPrintTextSizeAlign').click();

		$('#optSize').val('01');
		$('#txtSample').val('01 Reduced Size');
		$('#btnPrintTextSizeAlign').click();

		$('#optSize').val('10');
		$('#txtSample').val('10 Double Height');
		$('#btnPrintTextSizeAlign').click();

		$('#optSize').val('20');
		$('#txtSample').val('20 Double Width');
		$('#btnPrintTextSizeAlign').click();

		$('#optSize').val('30');
		$('#txtSample').val('30 Quad Area');
		$('#btnPrintTextSizeAlign').click();

		$('#btnReset').click();
		$('#txtSample').val('>>> Sent POS:FEED+BEEP+RESET');
		$('#btnPrintText').click();

		$('#btnLineFeed').click();
		$('#btnBeepX3').click();
		$('#btnReset').click();
	},
	setEncoding: function () {
		var strEncoding = $('#txtEncoding').val();
		BTPrinter.setEncoding(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		}, strEncoding);
	},
	setInvertedOff: function () {
		var bytes = '1D4200';
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
		$('#invertedIcon').fadeOut();
		$('#txtSample').val('< Inverted Mode OFF >');
		$('#optAlign').val(1);
		$('#btnPrintTitle').click();
		$('#optAlign').val(0);
		$('#btnLineFeed').click();
		$('#btnBeepX1').click();
	},
	setInvertedOn: function () {
		var bytes = '1D4201';
		$('#txtPOS').val(bytes);
		$('#btnPrintPOSCommand').click();
		$('#invertedIcon').fadeIn();
		$('#txtSample').val('< Inverted Mode ON >');
		$('#optAlign').val(1);
		$('#btnPrintTitle').click();
		$('#optAlign').val(0);
		$('#btnLineFeed').click();
		$('#btnBeepX1').click();
	},
	status: function () {
		BTPrinter.status(function (data) {
			window.plugins.toast.showLongBottom(data);
			$('#status').html('<span class="success">' + data + '</span>');
		}, function (err) {
			window.plugins.toast.showLongBottom(err);
			$('#status').html('<span class="error">' + err + '</span>');
		});
	},
	testCP: function (table) {
		// Convert table from decimal to hex
		var hexa = table.toString(16);
		hexa = hexa.toUpperCase();
		if (hexa.length == 1) {
			hexa = '0' + hexa;
		}
		// Run POS command ESC + t + table_hex
		var pos = '1B74' + hexa;
		$('#txtPOS').val(pos);
		$('#btnPrintPOSCommand').click();
		// Create sample text
		$('#txtSample').val('#' + table + ' POS ' + pos + ' ΑαΒβΓγΔδΕε');
		$('#btnPrintText').click();
	}
};

/* Cordova has been loaded. Perform any initialization that requires Cordova here. */
document.addEventListener('deviceready', function () {
	app.init();
	app.getVersion();
}, false);