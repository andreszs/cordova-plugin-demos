/* global cordova */

(function () {
    'use strict';

    var PLUGIN_URL = 'https://github.com/andreszs/cordova-plugin-turnstile';
    var DEMOS_URL = 'https://github.com/andreszs/cordova-plugin-demos';
    var elements = {};

    var errorMessages = {
        already_running: 'Another verification is already running.',
        cancel: 'Verification was cancelled.',
        challenge_error: 'Cloudflare could not complete the challenge.',
        expired: 'The challenge expired. Try again.',
        invalid_options: 'The challenge URL, backend URL, or action is invalid.',
        invalid_response: 'The hosted page returned an invalid response.',
        invalid_token: 'The hosted page returned an invalid token.',
        load_error: 'The verification page could not be loaded.',
        ssl_error: 'The verification page failed the TLS certificate check.',
        timeout: 'Verification timed out.'
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function plugin() {
        return window.cordova && cordova.plugins
            ? cordova.plugins.turnstile
            : null;
    }

    function setStatus(message, kind) {
        var variants = {
            error: 'danger',
            info: 'info',
            success: 'success'
        };
        elements.status.textContent = message;
        elements.status.className = 'alert alert-' + (variants[kind] || 'secondary') + ' mb-0';
    }

    function setRunning(value) {
        elements.verifyButton.disabled = value;
        elements.cancelButton.disabled = !value;
    }

    function readOptions() {
        var challengeValue = elements.challengeUrl.value.trim();
        var backendValue = elements.backendUrl.value.trim();
        var action = elements.action.value.trim();
        var challengeUrl;
        var backendUrl;

        if (!/^[A-Za-z0-9_-]{1,32}$/.test(action)) {
            throw new Error('Action must contain 1-32 letters, numbers, underscores, or hyphens.');
        }

        try {
            challengeUrl = new URL(challengeValue);
        } catch (ignore) {
            throw new Error('Enter a valid Challenge URL.');
        }

        if (challengeUrl.protocol !== 'https:' || challengeUrl.pathname === '/') {
            throw new Error('The Challenge URL must use HTTPS and include a path.');
        }

        if (challengeUrl.searchParams.get('action') !== action) {
            throw new Error('The Challenge URL action parameter must match the Action field.');
        }

        try {
            backendUrl = new URL(backendValue);
        } catch (ignoreBackend) {
            throw new Error('Enter a valid Backend URL.');
        }

        if (backendUrl.protocol !== 'https:' || backendUrl.pathname === '/') {
            throw new Error('The Backend URL must use HTTPS and include a path.');
        }

        return {
            challenge: {url: challengeUrl.href, action: action},
            backendUrl: backendUrl.href
        };
    }

    function verify() {
        var turnstile = plugin();
        var options;

        if (!turnstile || typeof turnstile.verify !== 'function') {
            setStatus('cordova-plugin-turnstile is not available.', 'error');
            return;
        }

        try {
            options = readOptions();
        } catch (error) {
            setStatus(error.message, 'error');
            return;
        }

        elements.token.value = '';
        elements.copyButton.disabled = true;
        setRunning(true);
        setStatus('Requesting a Turnstile challenge…', 'info');

        turnstile.verify(options.challenge, function (token) {
            elements.token.value = token;
            elements.copyButton.disabled = false;
            elements.verifyButton.disabled = true;
            elements.cancelButton.disabled = true;
            setStatus('Token received. Validating it with the demo backend…', 'info');

            fetch(options.backendUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    turnstileToken: token,
                    payload: {source: 'cordova-plugin-turnstile-demo'}
                })
            }).then(function (response) {
                return response.json().then(function (body) {
                    if (!response.ok || body.ok !== true) {
                        throw new Error(body.message || 'Backend validation failed.');
                    }
                    return body;
                });
            }).then(function () {
                setRunning(false);
                setStatus('Full Turnstile validation succeeded.', 'success');
            }).catch(function (error) {
                setRunning(false);
                setStatus(error.message || 'Backend validation failed.', 'error');
            });
        }, function (code) {
            setRunning(false);
            setStatus(errorMessages[code] || ('Verification failed: ' + String(code)), 'error');
        });
    }

    function cancel() {
        var turnstile = plugin();
        if (turnstile && typeof turnstile.cancel === 'function') {
            turnstile.cancel(function () {}, function (code) {
                setStatus('Cancel failed: ' + String(code), 'error');
            });
        }
    }

    function showBadge() {
        var turnstile = plugin();
        turnstile.showBadge({
            label: 'Protected by Turnstile',
            detail: 'Privacy · Help',
            position: elements.badgePosition.value
        }, function () {
            setStatus('Turnstile badge is visible.', 'success');
        }, function (code) {
            setStatus('Could not show the badge: ' + String(code), 'error');
        });
    }

    function hideBadge() {
        var turnstile = plugin();
        turnstile.hideBadge(function () {
            setStatus('Turnstile badge hidden.', 'success');
        }, function (code) {
            setStatus('Could not hide the badge: ' + String(code), 'error');
        });
    }

    function copyToken() {
        elements.token.select();
        elements.token.setSelectionRange(0, elements.token.value.length);
        try {
            document.execCommand('copy');
            setStatus('Token copied to the clipboard.', 'success');
        } catch (error) {
            setStatus('The token could not be copied.', 'error');
        }
    }

    function openExternal(url) {
        window.open(url, '_system');
    }

    function getAppVersion() {
        if (cordova.getAppVersion && typeof cordova.getAppVersion.getVersionNumber === 'function') {
            cordova.getAppVersion.getVersionNumber(function (version) {
                elements.appVersion.textContent = 'App version: ' + version;
            });
        }
    }

    function onDeviceReady() {
        var turnstile = plugin();
        var available = !!turnstile;

        elements.verifyButton.disabled = !available;
        elements.showBadgeButton.disabled = !available;
        elements.hideBadgeButton.disabled = !available;

        if (available) {
            setStatus('Device ready. Enter the challenge and backend URLs.', 'success');
        } else {
            setStatus('cordova-plugin-turnstile is not installed.', 'error');
        }
        getAppVersion();
    }

    function init() {
        elements = {
            action: byId('action'),
            appVersion: byId('appVersion'),
            backendUrl: byId('backendUrl'),
            badgePosition: byId('badgePosition'),
            cancelButton: byId('cancelButton'),
            copyButton: byId('copyButton'),
            hideBadgeButton: byId('hideBadgeButton'),
            showBadgeButton: byId('showBadgeButton'),
            status: byId('status'),
            token: byId('token'),
            challengeUrl: byId('challengeUrl'),
            verifyButton: byId('verifyButton')
        };

        elements.verifyButton.addEventListener('click', verify);
        elements.cancelButton.addEventListener('click', cancel);
        elements.showBadgeButton.addEventListener('click', showBadge);
        elements.hideBadgeButton.addEventListener('click', hideBadge);
        elements.copyButton.addEventListener('click', copyToken);
        byId('pluginLink').addEventListener('click', function () { openExternal(PLUGIN_URL); });
        byId('demosLink').addEventListener('click', function () { openExternal(DEMOS_URL); });
        document.addEventListener('deviceready', onDeviceReady, false);
    }

    document.addEventListener('DOMContentLoaded', init, false);
}());
