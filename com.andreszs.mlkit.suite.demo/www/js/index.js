'use strict';

(function () {
    var BARCODE_FORMATS = [
        'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'CODE_128', 'DATA_MATRIX',
        'EAN_8', 'EAN_13', 'ITF', 'PDF_417', 'QR_CODE', 'UPC_A', 'UPC_E'
    ];
    var lastDocumentImage = null;

    function element(id) { return document.getElementById(id); }
    function integerValue(id) { return Number(element(id).value); }

    function renderOutput(id, value, isError) {
        var output = element(id);
        output.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        output.classList.toggle('error', Boolean(isError));
        var copyButton = document.querySelector('[data-copy-target="' + id + '"]');
        if (copyButton) copyButton.disabled = !output.textContent;
    }

    function legacyCopyText(value) {
        return new Promise(function (resolve, reject) {
            var textarea = document.createElement('textarea');
            textarea.value = value;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                if (!document.execCommand('copy')) throw new Error('Copy command was rejected.');
                resolve();
            } catch (error) {
                reject(error);
            } finally {
                document.body.removeChild(textarea);
            }
        });
    }

    function copyText(value) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            return navigator.clipboard.writeText(value).catch(function () {
                return legacyCopyText(value);
            });
        }
        return legacyCopyText(value);
    }

    function copyOutput(button) {
        var output = element(button.getAttribute('data-copy-target'));
        if (!output || !output.textContent) return;
        button.disabled = true;
        copyText(output.textContent).then(function () {
            button.textContent = 'COPIED';
        }).catch(function () {
            button.textContent = 'COPY FAILED';
        }).then(function () {
            window.setTimeout(function () {
                button.textContent = 'COPY';
                button.disabled = false;
            }, 1200);
        });
    }

    function errorPayload(error) {
        if (error && typeof error === 'object') return error;
        return { code: 'UNKNOWN', message: String(error), recoverable: false };
    }

    function setBusy(buttonId, busy, idleText, busyText) {
        var button = element(buttonId);
        button.disabled = busy;
        button.textContent = busy ? busyText : idleText;
    }

    function renderFormats() {
        var container = element('barcode-formats');
        BARCODE_FORMATS.forEach(function (format) {
            var label = document.createElement('label');
            var checkbox = document.createElement('input');
            var text = document.createTextNode(format);
            checkbox.type = 'checkbox';
            checkbox.value = format;
            checkbox.checked = true;
            checkbox.className = 'barcode-format';
            label.appendChild(checkbox);
            label.appendChild(text);
            container.appendChild(label);
        });
    }

    function selectedFormats() {
        return Array.prototype.slice.call(document.querySelectorAll('.barcode-format:checked'))
            .map(function (checkbox) { return checkbox.value; });
    }

    function setAllFormats(checked) {
        Array.prototype.forEach.call(document.querySelectorAll('.barcode-format'), function (checkbox) {
            checkbox.checked = checked;
        });
    }

    function capabilityState(module) {
        if (!module) return { label: 'unknown', className: '' };
        if (module.modelStatus === 'bundled') {
            return { label: 'ready', className: 'ready' };
        }
        if (module.ready === true) {
            return { label: 'ready', className: 'ready' };
        }
        if (module.modelStatus === 'unsupported') {
            return { label: 'unsupported', className: 'unsupported' };
        }
        if (module.ready === false) {
            return { label: 'pending', className: 'not-ready' };
        }
        return { label: 'unknown', className: '' };
    }

    function renderCapabilitiesSummary(result) {
        var summary = element('capabilities-summary');
        var modules = [
            { name: 'Face detection', value: result.face },
            { name: 'Barcode scanning', value: result.barcode },
            { name: 'Text recognition', value: result.text },
            { name: 'Document scanner', value: result.document }
        ];
        summary.textContent = '';
        modules.forEach(function (entry) {
            var item = document.createElement('div');
            var name = document.createElement('strong');
            var mode = document.createElement('span');
            var state = document.createElement('span');
            var status = capabilityState(entry.value);
            item.className = 'capability-item';
            name.className = 'capability-name';
            name.textContent = entry.name;
            mode.className = 'capability-mode';
            mode.textContent = (entry.value && entry.value.mode) || 'unknown';
            state.className = 'capability-state' + (status.className ? ' ' + status.className : '');
            state.textContent = status.label;
            item.appendChild(name);
            item.appendChild(mode);
            item.appendChild(state);
            summary.appendChild(item);
        });
    }

    function readCapabilities() {
        renderOutput('capabilities-output', 'Reading…');
        MlKit.getCapabilities().then(function (result) {
            renderCapabilitiesSummary(result);
            renderOutput('capabilities-output', result);
        }).catch(function (error) {
            element('capabilities-summary').textContent = 'Unavailable';
            renderOutput('capabilities-output', errorPayload(error), true);
        });
    }

    function documentOptions() {
        var resultFormats = [];
        if (element('document-jpeg').checked) resultFormats.push('JPEG');
        if (element('document-pdf').checked) resultFormats.push('PDF');
        if (!resultFormats.length) throw new Error('Select JPEG, PDF, or both.');
        return {
            pageLimit: integerValue('document-page-limit'),
            galleryImportAllowed: element('document-gallery').checked,
            resultFormats: resultFormats,
            scannerMode: element('document-mode').value
        };
    }

    function renderDocumentPreviews(result) {
        var container = element('document-previews');
        container.innerHTML = '';
        if (!result || result.status !== 'success' || !result.pages) return;
        result.pages.forEach(function (page, index) {
            var image = document.createElement('img');
            image.src = page.imageUri + '?t=' + Date.now() + '-' + index;
            image.alt = 'Scanned page ' + (index + 1);
            container.appendChild(image);
        });
    }

    function selectImage(imagePath, previewUri) {
        element('image-path').value = imagePath;
        element('selected-image-preview').src = previewUri || imagePath;
        element('selected-image-preview').classList.remove('hidden');
    }

    function webViewImageUri(imageUri) {
        if (imageUri.charAt(0) === '/') return 'file://' + imageUri;
        return imageUri;
    }

    function loadGalleryPreview(imageUri, previewUri, onSuccess, onError) {
        var preview = element('selected-image-preview');
        preview.onload = function () {
            preview.onload = null;
            preview.onerror = null;
            onSuccess();
        };
        preview.onerror = function () {
            preview.onload = null;
            preview.onerror = null;
            onError(new Error('Unable to load the selected image preview.'));
        };
        selectImage(imageUri, previewUri);
    }

    function selectGalleryImage(imageUri, onSuccess, onError) {
        var fallbackUri = webViewImageUri(imageUri);

        if (typeof window.resolveLocalFileSystemURL !== 'function') {
            loadGalleryPreview(imageUri, fallbackUri, onSuccess, onError);
            return;
        }
        window.resolveLocalFileSystemURL(imageUri, function (entry) {
            var resolvedUri = entry.toURL();
            loadGalleryPreview(imageUri, resolvedUri, onSuccess, function () {
                if (resolvedUri === fallbackUri) {
                    onError(new Error('Unable to load the selected image preview.'));
                    return;
                }
                loadGalleryPreview(imageUri, fallbackUri, onSuccess, onError);
            });
        }, function () {
            loadGalleryPreview(imageUri, fallbackUri, onSuccess, onError);
        });
    }

    function prepareDocumentScanner() {
        var spinnerVisible = false;
        var spinnerTimer = window.setTimeout(function () {
            if (window.SpinnerDialog && typeof window.SpinnerDialog.show === 'function') {
                spinnerVisible = true;
                window.SpinnerDialog.show(
                    null,
                    'Preparing scanner…',
                    true
                );
            }
        }, 350);

        function finishPreparation() {
            window.clearTimeout(spinnerTimer);
            if (spinnerVisible && window.SpinnerDialog
                    && typeof window.SpinnerDialog.hide === 'function') {
                window.SpinnerDialog.hide();
            }
        }

        return MlKit.prepareDocumentScanner().then(function (result) {
            finishPreparation();
            return result;
        }, function (error) {
            finishPreparation();
            throw error;
        });
    }

    function scanDocument() {
        var options;
        try {
            options = documentOptions();
        } catch (error) {
            renderOutput('document-output', errorPayload(error), true);
            return;
        }
        setBusy('document-button', true, 'Scan document', 'Scanning…');
        renderOutput('document-output', 'Preparing…');
        prepareDocumentScanner().then(function () {
            renderOutput('document-output', 'Opening scanner…');
            return MlKit.scanDocument(options);
        }).then(function (result) {
            renderOutput('document-output', result);
            renderDocumentPreviews(result);
            if (result.status === 'success' && result.pages && result.pages.length) {
                lastDocumentImage = {
                    path: result.pages[0].imagePath || result.pages[0].imageUri,
                    previewUri: result.pages[0].imageUri || result.pages[0].imagePath
                };
                element('ocr-document-button').disabled = false;
            } else if (result.status === 'success') {
                lastDocumentImage = null;
                element('ocr-document-button').disabled = true;
            }
        }).catch(function (error) {
            renderOutput('document-output', errorPayload(error), true);
        }).then(function () {
            setBusy('document-button', false, 'Scan document', 'Scanning…');
        });
    }

    function requireImagePath(outputId) {
        var value = element('image-path').value.trim();
        if (!value) {
            renderOutput(outputId, errorPayload(new Error('Select an image first.')), true);
            return '';
        }
        return value;
    }

    function chooseImageFromGallery() {
        if (!navigator.camera || !window.Camera) {
            renderOutput('text-output', errorPayload(new Error('Camera gallery picker is unavailable.')), true);
            return;
        }

        setBusy('gallery-image-button', true, 'Gallery', 'Opening…');
        navigator.camera.getPicture(function (imageUri) {
            selectGalleryImage(imageUri, function () {
                renderOutput('text-output', 'Image selected.');
                setBusy('gallery-image-button', false, 'Gallery', 'Opening…');
            }, function (error) {
                renderOutput('text-output', errorPayload({
                    code: 'IMAGE_PREVIEW_FAILED',
                    message: error.message,
                    recoverable: true
                }), true);
                setBusy('gallery-image-button', false, 'Gallery', 'Opening…');
            });
        }, function (message) {
            if (message && message !== 'No Image Selected') {
                renderOutput('text-output', errorPayload({
                    code: 'IMAGE_PICK_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('gallery-image-button', false, 'Gallery', 'Opening…');
        }, {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false
        });
    }

    function recognizeText() {
        var imagePath = requireImagePath('text-output');
        if (!imagePath) return;
        setBusy('text-button', true, 'Recognize text', 'Processing…');
        renderOutput('text-output', 'Recognizing…');
        MlKit.recognizeText(imagePath).then(function (text) {
            renderOutput('text-output', text || '(No text found)');
        }).catch(function (error) {
            renderOutput('text-output', errorPayload(error), true);
        }).then(function () {
            setBusy('text-button', false, 'Recognize text', 'Processing…');
        });
    }

    function recognizeLastDocumentPage() {
        if (!lastDocumentImage) {
            renderOutput('text-output', errorPayload({
                code: 'NO_DOCUMENT_IMAGE',
                message: 'Scan a document with JPEG pages enabled first.',
                recoverable: true
            }), true);
            return;
        }
        selectImage(lastDocumentImage.path, lastDocumentImage.previewUri);
        recognizeText();
    }

    function scanImageBarcodes() {
        var imagePath = requireImagePath('image-barcode-output');
        if (!imagePath) return;
        var formats = selectedFormats();
        var options = formats.length ? { formats: formats } : {};
        setBusy('image-barcode-button', true, 'Scan barcodes', 'Processing…');
        renderOutput('image-barcode-output', 'Scanning…');
        MlKit.scanBarcodes(imagePath, options).then(function (results) {
            renderOutput('image-barcode-output', results);
        }).catch(function (error) {
            renderOutput('image-barcode-output', errorPayload(error), true);
        }).then(function () {
            setBusy('image-barcode-button', false, 'Scan barcodes', 'Processing…');
        });
    }

    function faceOptions() {
        var checks = {};
        Array.prototype.forEach.call(document.querySelectorAll('#face-checks [data-check]'), function (input) {
            checks[input.getAttribute('data-check')] = input.checked;
        });
        return {
            outputWidth: integerValue('face-width'),
            outputHeight: integerValue('face-height'),
            jpegQuality: integerValue('face-quality'),
            showCloseButton: element('face-close').checked,
            debugMode: element('face-debug').checked,
            instructionText: element('face-instruction').value,
            timeoutMs: integerValue('face-timeout'),
            checks: checks
        };
    }

    function captureFace() {
        setBusy('face-button', true, 'Capture face', 'Camera…');
        renderOutput('face-output', 'Opening camera…');
        MlKit.face.capture(faceOptions()).then(function (result) {
            renderOutput('face-output', result);
            if (result.status === 'success' && result.imageUri) {
                element('face-preview').src = result.imageUri + '?t=' + Date.now();
                element('face-preview').classList.remove('hidden');
            }
        }).catch(function (error) {
            renderOutput('face-output', errorPayload(error), true);
        }).then(function () {
            setBusy('face-button', false, 'Capture face', 'Camera…');
        });
    }

    function barcodeOptions() {
        var formats = selectedFormats();
        if (!formats.length) throw new Error('Select at least one barcode format.');
        return {
            formats: formats,
            showCloseButton: element('barcode-close').checked,
            showTorchButton: element('barcode-torch').checked,
            instructionText: element('barcode-instruction').value,
            timeoutMs: integerValue('barcode-timeout')
        };
    }

    function scanBarcode() {
        var options;
        try {
            options = barcodeOptions();
        } catch (error) {
            renderOutput('barcode-output', errorPayload(error), true);
            return;
        }
        setBusy('barcode-button', true, 'Scan barcode', 'Camera…');
        renderOutput('barcode-output', 'Opening camera…');
        element('barcode-summary').classList.add('hidden');
        MlKit.barcode.scan(options).then(function (result) {
            renderOutput('barcode-output', result);
            if (result.status === 'success') {
                element('barcode-format').textContent = result.format;
                element('barcode-text').textContent = result.text;
                element('barcode-summary').classList.remove('hidden');
            }
        }).catch(function (error) {
            renderOutput('barcode-output', errorPayload(error), true);
        }).then(function () {
            setBusy('barcode-button', false, 'Scan barcode', 'Camera…');
        });
    }

    function enableDemo() {
        element('device-status').textContent = 'Ready';
        element('device-status').className = 'status ready';
        element('capabilities-button').disabled = false;
        element('document-button').disabled = false;
        element('gallery-image-button').disabled = false;
        element('text-button').disabled = false;
        element('image-barcode-button').disabled = false;
        element('face-button').disabled = false;
        element('barcode-button').disabled = false;
        readCapabilities();
    }

    function failDemo(message) {
        element('device-status').textContent = message;
        element('device-status').className = 'status error';
    }

    function populateAbout() {
        var platformId = window.cordova && cordova.platformId ? cordova.platformId : '';
        if (platformId === 'android') {
            element('about-platform-name').textContent = 'cordova-android';
        } else if (platformId === 'ios') {
            element('about-platform-name').textContent = 'cordova-ios';
        } else {
            element('about-platform-name').textContent = platformId
                ? 'Cordova ' + platformId
                : 'Cordova platform';
        }
        element('about-platform-version').textContent = window.cordova
            && cordova.platformVersion
            ? cordova.platformVersion
            : 'Unavailable';
    }

    renderFormats();
    Array.prototype.forEach.call(document.querySelectorAll('.copy-output'), function (button) {
        button.addEventListener('click', function () { copyOutput(button); });
    });
    element('formats-all').addEventListener('click', function () { setAllFormats(true); });
    element('formats-none').addEventListener('click', function () { setAllFormats(false); });
    element('document-button').addEventListener('click', scanDocument);
    element('gallery-image-button').addEventListener('click', chooseImageFromGallery);
    element('ocr-document-button').addEventListener('click', recognizeLastDocumentPage);
    element('text-button').addEventListener('click', recognizeText);
    element('image-barcode-button').addEventListener('click', scanImageBarcodes);
    element('capabilities-button').addEventListener('click', readCapabilities);
    element('face-button').addEventListener('click', captureFace);
    element('barcode-button').addEventListener('click', scanBarcode);

    document.addEventListener('deviceready', function () {
        populateAbout();
        if (!window.MlKit) {
            failDemo('ML Kit unavailable');
            return;
        }
        enableDemo();
    }, false);
}());
