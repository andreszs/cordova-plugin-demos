"use strict";
var exec = require('cordova/exec');

var BiometricAuth = {
	isAvailable: function (successCallback, errorCallback, args) {
		exec(successCallback, errorCallback, "BiometricAuth", "isAvailable", [args]);
	},
	authenticate: function (successCallback, errorCallback, args) {
		exec(successCallback, errorCallback, "BiometricAuth", "authenticate", [args]);
	}
};

module.exports = BiometricAuth;
