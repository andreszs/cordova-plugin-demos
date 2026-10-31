'use strict';

var scanButton = document.getElementById('scan-button');
var scanLabel = document.getElementById('scan-label');
var deviceStatus = document.getElementById('device-status');
var resultCard = document.getElementById('result-card');
var resultStatus = document.getElementById('result-status');
var resultResolution = document.getElementById('result-resolution');
var resultSummary = document.getElementById('result-summary');
var resultJson = document.getElementById('result-json');
var previewWrap = document.getElementById('preview-wrap');
var resultImage = document.getElementById('result-image');
var scanProfile = document.getElementById('scan-profile');
var copyImageButton = document.getElementById('copy-image-button');
var copyMetadataButton = document.getElementById('copy-metadata-button');
var copyFeedback = document.getElementById('copy-feedback');
var clipboardImageBlob = null;
var currentImageReference = '';

document.addEventListener('deviceready', function () {
    populateVersions();
    setDeviceStatus('Device ready. Configure the scan and open the scanner.', 'success');
    scanButton.disabled = false;
    scanButton.addEventListener('click', scan);
    scanProfile.addEventListener('change', updateProfileOptions);
    copyImageButton.addEventListener('click', copyCapturedImage);
    copyMetadataButton.addEventListener('click', copyMetadata);
    resultImage.addEventListener('load', prepareClipboardImage);
    updateProfileOptions();
}, false);

function updateProfileOptions() {
    var generic = scanProfile.value === 'genericCard';
    document.getElementById('dni-side-options').disabled = generic;
    document.getElementById('side-validation').disabled = generic;
    document.getElementById('side-validation-group').classList.toggle('text-muted', generic);
}

function populateVersions() {
    var platformName = document.getElementById('platform-name');
    var platformVersion = document.getElementById('platform-version');
    var platformId = cordova.platformId || '';

    if (platformId === 'android') {
        platformName.textContent = 'cordova-android';
    } else if (platformId === 'ios') {
        platformName.textContent = 'cordova-ios';
    } else {
        platformName.textContent = platformId ? 'Cordova ' + platformId : 'Cordova platform';
    }

    platformVersion.textContent = cordova.platformVersion || cordova.version || 'Unavailable';
}

async function scan() {
    var numericInputIds = [
        'preferred-capture-long-edge',
        'max-output-long-edge',
        'min-effective-document-long-edge',
        'min-still-sharpness-variance',
        'timeout-ms'
    ];
    for (var inputIndex = 0; inputIndex < numericInputIds.length; inputIndex += 1) {
        var numericInput = document.getElementById(numericInputIds[inputIndex]);
        if (!numericInput.checkValidity()) {
            numericInput.reportValidity();
            return;
        }
    }

    var profile = scanProfile.value;
    var generic = profile === 'genericCard';
    var sideInput = document.querySelector('input[name="side"]:checked');
    var side = generic ? 'any' : (sideInput ? sideInput.value : 'front');
    var sideValidation = generic ? 'off' : document.getElementById('side-validation').value;
    var flashMode = document.getElementById('flash-mode').value;
    var orientation = document.getElementById('scan-orientation').value;
    var preferredCaptureLongEdge = parseInt(
        document.getElementById('preferred-capture-long-edge').value,
        10
    );
    var maxOutputLongEdge = parseInt(
        document.getElementById('max-output-long-edge').value,
        10
    );
    var minEffectiveDocumentLongEdge = parseInt(
        document.getElementById('min-effective-document-long-edge').value,
        10
    );
    var minStillSharpnessVariance = parseFloat(
        document.getElementById('min-still-sharpness-variance').value
    );
    var timeoutMs = parseInt(document.getElementById('timeout-ms').value, 10);
    var showCloseButton = document.getElementById('show-close-button').checked;
    var showFlashButton = document.getElementById('show-flash-button').checked;
    var autoCapture = document.getElementById('auto-capture').checked;
    var debugMode = document.getElementById('debug-mode').checked;
    var beepEnabled = document.getElementById('beep-enabled').checked;
    var customInstruction = document.getElementById('instruction-text').value.trim();
    var checks = {
        documentSize: document.getElementById('check-document-size').checked,
        centering: document.getElementById('check-centering').checked,
        perspective: document.getElementById('check-perspective').checked,
        stability: document.getElementById('check-stability').checked,
        sharpness: document.getElementById('check-sharpness').checked,
        brightness: document.getElementById('check-brightness').checked,
        glare: document.getElementById('check-glare').checked,
        shadows: document.getElementById('check-shadows').checked,
        edgeOcclusion: document.getElementById('check-edge-occlusion').checked
    };

    setBusy(true);
    resultCard.classList.add('d-none');
    resultResolution.classList.add('d-none');
    resultResolution.textContent = '';
    previewWrap.classList.add('d-none');
    resultImage.removeAttribute('src');
    resetCopyActions();

    try {
        var result = await DniScanner.scan({
            profile: profile,
            side: side,
            sideValidation: sideValidation,
            autoCapture: autoCapture,
            flashMode: flashMode,
            orientation: orientation,
            showCloseButton: showCloseButton,
            showFlashButton: showFlashButton,
            debugMode: debugMode,
            beepEnabled: beepEnabled,
            preferredCaptureLongEdge: preferredCaptureLongEdge,
            maxOutputLongEdge: maxOutputLongEdge,
            minEffectiveDocumentLongEdge: minEffectiveDocumentLongEdge,
            minStillSharpnessVariance: minStillSharpnessVariance,
            checks: checks,
            instructionText: customInstruction || (generic
                ? 'Ubicá la tarjeta dentro del recuadro'
                : side === 'back'
                    ? 'Ubicá el dorso del DNI dentro del recuadro'
                    : 'Ubicá el frente del DNI dentro del recuadro'),
            timeoutMs: timeoutMs
        });

        if (result.status === 'cancelled') {
            showMessage('Cancelled', 'The scan was cancelled by the user.', result, false);
            return;
        }

        var confidence = result.confidence && result.confidence.document;
        var confidenceText = typeof confidence === 'number'
            ? Math.round(confidence * 100) + '%'
            : 'sin dato';
        var summaryParts = [
            result.documentCandidate
                ? (result.profile === 'genericCard' ? 'Card captured' : 'Document captured')
                : 'Scan completed',
            'geometric confidence ' + confidenceText,
            result.usableForOcr ? 'suitable for OCR' : 'review before OCR',
            result.width + '×' + result.height + ' px'
        ];
        if (result.detectedSide && result.detectedSide !== 'unknown') {
            summaryParts.splice(1, 0, labelForSide(result.detectedSide));
        }
        if (Array.isArray(result.qualityWarnings) && result.qualityWarnings.length > 0) {
            summaryParts.push('warnings: ' + result.qualityWarnings.map(labelForWarning).join(', '));
        }

        currentImageReference = result.imageUri || result.imagePath || '';
        resultImage.src = result.imageUri;
        previewWrap.classList.remove('d-none');
        showCapturedResolution(result);
        showMessage(
            'Success',
            summaryParts.join(' · '),
            result,
            true
        );
    } catch (error) {
        var normalized = normalizeError(error);
        showMessage(
            normalized.code || 'ERROR',
            normalized.message || 'The scan could not be completed.',
            normalized,
            false,
            true
        );
    } finally {
        setBusy(false);
    }
}

function showCapturedResolution(result) {
    var parts = [];
    if (Number.isFinite(result.rawWidth) && Number.isFinite(result.rawHeight)) {
        parts.push('RAW ' + result.rawWidth + '×' + result.rawHeight + ' px');
    }
    if (Number.isFinite(result.effectiveDocumentLongEdge)) {
        parts.push('effective document ' + result.effectiveDocumentLongEdge + ' px');
    }
    if (Number.isFinite(result.width) && Number.isFinite(result.height)) {
        parts.push('final ' + result.width + '×' + result.height + ' px');
    }
    var sharpnessVariance = result.quality && result.quality.sharpnessVariance;
    if (Number.isFinite(sharpnessVariance)) {
        parts.push('sharpness ' + sharpnessVariance.toFixed(1));
    }
    resultResolution.textContent = 'Captured image: ' + (parts.length
        ? parts.join(' · ')
        : 'resolution unavailable');
    resultResolution.classList.remove('d-none');
}

function setBusy(busy) {
    scanButton.disabled = busy;
    scanLabel.textContent = busy ? 'Scanner open…' : 'Open scanner';
    setDeviceStatus(
        busy ? 'Scanner open. Follow the on-screen instructions.'
            : 'Device ready. Configure the scan and open the scanner.',
        busy ? 'info' : 'success'
    );
}

function showMessage(title, summary, payload, success, error) {
    resultStatus.textContent = title;
    resultStatus.className = 'alert alert-' + (error
        ? 'danger'
        : success ? 'success' : 'warning');
    resultSummary.textContent = summary;
    resultJson.textContent = JSON.stringify(payload, null, 2);
    copyMetadataButton.disabled = false;
    resultCard.classList.remove('d-none');
    window.setTimeout(function () {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
}

function resetCopyActions() {
    clipboardImageBlob = null;
    currentImageReference = '';
    copyImageButton.disabled = true;
    copyMetadataButton.disabled = true;
    copyFeedback.textContent = '';
    copyFeedback.className = 'small text-muted text-right mt-2 mb-0';
}

function prepareClipboardImage() {
    copyImageButton.disabled = false;
    createPngBlob(resultImage).then(function (blob) {
        clipboardImageBlob = blob;
    }).catch(function () {
        clipboardImageBlob = null;
    });
}

async function copyCapturedImage() {
    try {
        var blob = clipboardImageBlob || await createPngBlob(resultImage);
        if (!navigator.clipboard || typeof navigator.clipboard.write !== 'function'
                || typeof window.ClipboardItem !== 'function') {
            await copyText(currentImageReference);
            setCopyFeedback(
                'This WebView cannot place images on the clipboard; the image reference was copied instead.',
                false
            );
            return;
        }

        var item = new window.ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopyFeedback('Image copied.', true);
    } catch (error) {
        if (currentImageReference) {
            try {
                await copyText(currentImageReference);
                setCopyFeedback(
                    'The bitmap could not be copied; its image reference was copied instead.',
                    false
                );
                return;
            } catch (fallbackError) {
                // Report the original image-copy failure below.
            }
        }
        setCopyFeedback('The image could not be copied on this device.', false);
    }
}

async function copyMetadata() {
    try {
        await copyText(resultJson.textContent);
        setCopyFeedback('Metadata copied.', true);
    } catch (error) {
        setCopyFeedback('The metadata could not be copied.', false);
    }
}

function createPngBlob(image) {
    return new Promise(function (resolve, reject) {
        if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
            reject(new Error('The image is not available yet.'));
            return;
        }

        var canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        var context = canvas.getContext('2d');
        if (!context) {
            reject(new Error('Canvas is unavailable.'));
            return;
        }

        try {
            context.drawImage(image, 0, 0);
            canvas.toBlob(function (blob) {
                canvas.width = 0;
                canvas.height = 0;
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('The image could not be converted.'));
                }
            }, 'image/png');
        } catch (error) {
            reject(error);
        }
    });
}

function copyText(text) {
    if (!text) {
        return Promise.reject(new Error('There is no content to copy.'));
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return navigator.clipboard.writeText(text).catch(function () {
            legacyCopyText(text);
        });
    }

    try {
        legacyCopyText(text);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

function legacyCopyText(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', 'readonly');
    textArea.className = 'sr-only';
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    var copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (!copied) {
        throw new Error('The clipboard is unavailable.');
    }
}

function setCopyFeedback(message, success) {
    copyFeedback.textContent = message;
    copyFeedback.className = 'small text-' + (success ? 'success' : 'muted')
        + ' text-right mt-2 mb-0';
}

function setDeviceStatus(message, kind) {
    deviceStatus.textContent = message;
    deviceStatus.className = 'alert alert-' + kind + ' mb-0';
}

function labelForSide(side) {
    if (side === 'front') {
        return 'Front detected';
    }
    if (side === 'back') {
        return 'Back detected';
    }
    return 'Side not determined';
}

function labelForWarning(warning) {
    var labels = {
        low_sharpness: 'low sharpness',
        low_light: 'low light',
        high_light: 'excessive light',
        glare: 'glare',
        uneven_lighting: 'uneven lighting',
        edge_obstruction: 'obstructed edges'
    };
    return labels[warning] || warning;
}

function normalizeError(error) {
    if (error && typeof error === 'object') {
        return error;
    }
    return { code: 'UNKNOWN', message: String(error || 'Unknown error') };
}
