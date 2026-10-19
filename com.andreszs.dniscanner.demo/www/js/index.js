'use strict';

var scanButton = document.getElementById('scan-button');
var scanLabel = document.getElementById('scan-label');
var deviceStatus = document.getElementById('device-status');
var resultCard = document.getElementById('result-card');
var resultStatus = document.getElementById('result-status');
var resultSummary = document.getElementById('result-summary');
var resultJson = document.getElementById('result-json');
var previewWrap = document.getElementById('preview-wrap');
var resultImage = document.getElementById('result-image');
var scanProfile = document.getElementById('scan-profile');

document.addEventListener('deviceready', function () {
    populateVersions();
    setDeviceStatus('Dispositivo listo. Configurá la captura y abrí el scanner.', 'success');
    scanButton.disabled = false;
    scanButton.addEventListener('click', scan);
    scanProfile.addEventListener('change', updateProfileOptions);
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

    platformVersion.textContent = cordova.platformVersion || cordova.version || 'No disponible';
}

async function scan() {
    var profile = scanProfile.value;
    var generic = profile === 'genericCard';
    var sideInput = document.querySelector('input[name="side"]:checked');
    var side = generic ? 'any' : (sideInput ? sideInput.value : 'front');
    var sideValidation = generic ? 'off' : document.getElementById('side-validation').value;
    var flashMode = document.getElementById('flash-mode').value;
    var orientation = document.getElementById('scan-orientation').value;
    var maxOutputLongEdge = parseInt(
        document.getElementById('max-output-long-edge').value,
        10
    );
    var guideMarginPercent = parseFloat(
        document.getElementById('guide-margin-percent').value
    );
    var cropPaddingPercent = parseFloat(
        document.getElementById('crop-padding-percent').value
    );
    var showCloseButton = document.getElementById('show-close-button').checked;
    var showFlashButton = document.getElementById('show-flash-button').checked;
    var debugMode = document.getElementById('debug-mode').checked;
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
    previewWrap.classList.add('d-none');
    resultImage.removeAttribute('src');

    try {
        var result = await DniScanner.scan({
            profile: profile,
            side: side,
            sideValidation: sideValidation,
            autoCapture: true,
            flashMode: flashMode,
            orientation: orientation,
            showCloseButton: showCloseButton,
            showFlashButton: showFlashButton,
            debugMode: debugMode,
            maxOutputLongEdge: maxOutputLongEdge,
            guideMarginPercent: guideMarginPercent,
            cropPaddingPercent: cropPaddingPercent,
            checks: checks,
            instructionText: generic
                ? 'Enmarcá la tarjeta dentro del recuadro'
                : side === 'back'
                    ? 'Enmarcá el dorso del DNI'
                    : 'Enmarcá el frente del DNI',
            timeoutMs: 60000
        });

        if (result.status === 'cancelled') {
            showMessage('Cancelado', 'La captura fue cancelada por el usuario.', result, false);
            return;
        }

        var confidence = result.confidence && result.confidence.document;
        var confidenceText = typeof confidence === 'number'
            ? Math.round(confidence * 100) + '%'
            : 'sin dato';
        var summaryParts = [
            result.documentCandidate
                ? (result.profile === 'genericCard' ? 'Tarjeta capturada' : 'Documento capturado')
                : 'Captura completada',
            'confianza geométrica ' + confidenceText,
            result.usableForOcr ? 'apto para OCR' : 'revisar antes del OCR',
            result.width + '×' + result.height + ' px'
        ];
        if (result.detectedSide && result.detectedSide !== 'unknown') {
            summaryParts.splice(1, 0, labelForSide(result.detectedSide));
        }
        if (Array.isArray(result.qualityWarnings) && result.qualityWarnings.length > 0) {
            summaryParts.push('avisos: ' + result.qualityWarnings.map(labelForWarning).join(', '));
        }

        resultImage.src = result.imageUri;
        previewWrap.classList.remove('d-none');
        showMessage(
            'Correcto',
            summaryParts.join(' · '),
            result,
            true
        );
    } catch (error) {
        var normalized = normalizeError(error);
        showMessage(
            normalized.code || 'ERROR',
            normalized.message || 'No fue posible completar la captura.',
            normalized,
            false,
            true
        );
    } finally {
        setBusy(false);
    }
}

function setBusy(busy) {
    scanButton.disabled = busy;
    scanLabel.textContent = busy ? 'Scanner abierto…' : 'Abrir scanner';
    setDeviceStatus(
        busy ? 'Scanner abierto. Seguí las indicaciones en pantalla.'
            : 'Dispositivo listo. Configurá la captura y abrí el scanner.',
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
    resultCard.classList.remove('d-none');
    window.setTimeout(function () {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
}

function setDeviceStatus(message, kind) {
    deviceStatus.textContent = message;
    deviceStatus.className = 'alert alert-' + kind + ' mb-0';
}

function labelForSide(side) {
    if (side === 'front') {
        return 'Frente detectado';
    }
    if (side === 'back') {
        return 'Dorso detectado';
    }
    return 'Cara no determinada';
}

function labelForWarning(warning) {
    var labels = {
        low_sharpness: 'nitidez baja',
        low_light: 'poca luz',
        high_light: 'exceso de luz',
        glare: 'reflejos',
        uneven_lighting: 'iluminación desigual',
        edge_obstruction: 'bordes obstruidos'
    };
    return labels[warning] || warning;
}

function normalizeError(error) {
    if (error && typeof error === 'object') {
        return error;
    }
    return { code: 'UNKNOWN', message: String(error || 'Error desconocido') };
}
