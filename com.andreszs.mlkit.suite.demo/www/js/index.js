'use strict';

(function () {
    var BARCODE_FORMATS = [
        'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'CODE_128', 'DATA_MATRIX',
        'EAN_8', 'EAN_13', 'ITF', 'PDF_417', 'QR_CODE', 'UPC_A', 'UPC_E'
    ];
    var lastDocumentImage = null;

    function element(id) { return document.getElementById(id); }
    function integerValue(id) { return Number(element(id).value); }
    function pluginLocale() { return element('plugin-locale').value || 'auto'; }

    function renderOutput(id, value, isError) {
        var output = element(id);
        var resultBlock = document.querySelector('[data-result-for="' + id + '"]');
        if (resultBlock) resultBlock.classList.remove('hidden');
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
            { name: 'Barcode scanning', value: result.barcode },
            { name: 'Document scanner', value: result.document },
            { name: 'Face detection', value: result.face },
            { name: 'Image labeling', value: result.imageLabeling },
            { name: 'Subject segmentation', value: result.subjectSegmentation },
            { name: 'Text recognition v2', value: result.text }
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
            scannerMode: element('document-mode').value,
            locale: pluginLocale()
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

    function selectImage(pathInputId, previewId, imagePath, previewUri) {
        if (pathInputId) element(pathInputId).value = imagePath;
        element(previewId).src = previewUri || imagePath;
        element(previewId).classList.remove('hidden');
    }

    function webViewImageUri(imageUri) {
        if (imageUri.charAt(0) === '/') return 'file://' + imageUri;
        return imageUri;
    }

    function loadGalleryPreview(imageUri, previewUri, pathInputId, previewId, onSuccess, onError) {
        var preview = element(previewId);
        preview.onload = function () {
            preview.onload = null;
            preview.onerror = null;
            onSuccess();
        };
        preview.onerror = function () {
            preview.onload = null;
            preview.onerror = null;
            preview.classList.add('hidden');
            preview.removeAttribute('src');
            onError(new Error('Unable to load the selected image preview.'));
        };
        selectImage(pathInputId, previewId, imageUri, previewUri);
    }

    function galleryCacheExtension(file) {
        var name = file && file.name ? String(file.name) : '';
        var match = name.match(/\.[a-z0-9]{1,5}$/i);
        if (match) return match[0].toLowerCase();
        var extensions = {
            'image/bmp': '.bmp',
            'image/gif': '.gif',
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };
        return extensions[file && file.type] || '.jpg';
    }

    function cacheGalleryFile(file, fallbackUri, onReady) {
        if (!window.cordova || !cordova.file || !cordova.file.cacheDirectory
                || typeof window.resolveLocalFileSystemURL !== 'function') {
            onReady(fallbackUri);
            return;
        }
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (directory) {
            var name = 'mlkit-gallery-' + Date.now() + galleryCacheExtension(file);
            directory.getFile(name, { create: true, exclusive: false }, function (entry) {
                entry.createWriter(function (writer) {
                    writer.onwriteend = function () {
                        onReady(entry.nativeURL || entry.toURL());
                    };
                    writer.onerror = function () { onReady(fallbackUri); };
                    writer.write(file);
                }, function () { onReady(fallbackUri); });
            }, function () { onReady(fallbackUri); });
        }, function () { onReady(fallbackUri); });
    }

    function galleryDataBlob(imageData) {
        var raw = String(imageData || '');
        var dataUri = raw.indexOf('data:') === 0
            ? raw
            : 'data:image/jpeg;base64,' + raw;
        var parts = dataUri.split(',', 2);
        if (parts.length !== 2) throw new Error('The gallery did not return valid image data.');
        var mimeMatch = parts[0].match(/^data:([^;]+)/i);
        var bytes = window.atob(parts[1]);
        var values = new Uint8Array(bytes.length);
        for (var index = 0; index < bytes.length; index += 1) {
            values[index] = bytes.charCodeAt(index);
        }
        return {
            blob: new Blob([values], { type: mimeMatch ? mimeMatch[1] : 'image/jpeg' }),
            previewUri: dataUri
        };
    }

    function selectGalleryData(imageData, pathInputId, previewId, onSuccess, onError) {
        var image;
        try {
            image = galleryDataBlob(imageData);
        } catch (error) {
            onError(error, '');
            return;
        }
        cacheGalleryFile(image.blob, '', function (scanUri) {
            if (!scanUri) {
                onError(new Error('Unable to cache the selected image.'), '');
                return;
            }
            loadGalleryPreview(scanUri, image.previewUri, pathInputId, previewId, function () {
                onSuccess(scanUri);
            }, function (error) {
                onError(error, scanUri);
            });
        });
    }

    function selectGalleryImage(imageUri, pathInputId, previewId, onSuccess, onError) {
        var fallbackUri = webViewImageUri(imageUri);

        function loadPreview(scanUri, previewUri) {
            loadGalleryPreview(scanUri, previewUri, pathInputId, previewId, function () {
                onSuccess(scanUri);
            }, function (error) {
                onError(error, scanUri);
            });
        }

        function loadUriFallback(scanUri, resolvedUri) {
            loadGalleryPreview(scanUri, resolvedUri, pathInputId, previewId, function () {
                onSuccess(scanUri);
            }, function () {
                if (resolvedUri === fallbackUri) {
                    onError(new Error('Unable to load the selected image preview.'), scanUri);
                    return;
                }
                loadGalleryPreview(scanUri, fallbackUri, pathInputId, previewId, function () {
                    onSuccess(scanUri);
                }, function (error) {
                    onError(error, scanUri);
                });
            });
        }

        if (typeof window.resolveLocalFileSystemURL !== 'function') {
            loadUriFallback(imageUri, fallbackUri);
            return;
        }
        window.resolveLocalFileSystemURL(imageUri, function (entry) {
            var resolvedUri = entry.toURL();
            if (typeof entry.file !== 'function' || typeof window.FileReader !== 'function') {
                loadUriFallback(imageUri, resolvedUri);
                return;
            }
            entry.file(function (file) {
                var reader = new FileReader();
                reader.onload = function () {
                    cacheGalleryFile(file, imageUri, function (scanUri) {
                        loadPreview(scanUri, String(reader.result));
                    });
                };
                reader.onerror = function () {
                    cacheGalleryFile(file, imageUri, function (scanUri) {
                        loadUriFallback(scanUri, resolvedUri);
                    });
                };
                reader.readAsDataURL(file);
            }, function () {
                loadUriFallback(imageUri, resolvedUri);
            });
        }, function () {
            loadUriFallback(imageUri, fallbackUri);
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

        return MlKit.prepareDocumentScanner({ locale: pluginLocale() }).then(function (result) {
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
                element('ocr-document-button').removeAttribute('title');
                element('image-labeling-document-button').disabled = false;
                element('image-labeling-document-button').removeAttribute('title');
                element('subject-segmentation-document-button').disabled = false;
                element('subject-segmentation-document-button').removeAttribute('title');
            } else if (result.status === 'success') {
                lastDocumentImage = null;
                element('ocr-document-button').disabled = true;
                element('ocr-document-button').title = 'Scan a document with JPEG pages first';
                element('image-labeling-document-button').disabled = true;
                element('image-labeling-document-button').title =
                    'Scan a document with JPEG pages first';
                element('subject-segmentation-document-button').disabled = true;
                element('subject-segmentation-document-button').title =
                    'Scan a document with JPEG pages first';
            }
        }).catch(function (error) {
            renderOutput('document-output', errorPayload(error), true);
        }).then(function () {
            setBusy('document-button', false, 'Scan document', 'Scanning…');
        });
    }

    function requireImagePath(pathInputId, outputId) {
        var value = element(pathInputId).value.trim();
        if (!value) {
            renderOutput(outputId, errorPayload(new Error('Select an image first.')), true);
            return '';
        }
        return value;
    }

    function galleryDestinationType() {
        if (window.cordova && cordova.platformId === 'android'
                && Camera.DestinationType.DATA_URL !== undefined) {
            return Camera.DestinationType.DATA_URL;
        }
        return Camera.DestinationType.FILE_URI;
    }

    function chooseTextImageFromGallery() {
        if (!navigator.camera || !window.Camera) {
            renderOutput('text-output', errorPayload(new Error('Camera gallery picker is unavailable.')), true);
            return;
        }

        setBusy('text-gallery-button', true, 'Gallery', 'Opening…');
        var destinationType = galleryDestinationType();
        navigator.camera.getPicture(function (imageValue) {
            var select = destinationType === Camera.DestinationType.DATA_URL
                ? selectGalleryData
                : selectGalleryImage;
            select(imageValue, 'text-image-path', 'text-image-preview', function () {
                renderOutput('text-output', 'Image selected.');
                element('text-button').disabled = false;
                element('text-button').removeAttribute('title');
                setBusy('text-gallery-button', false, 'Gallery', 'Opening…');
            }, function (error, scanUri) {
                if (!scanUri) {
                    renderOutput('text-output', errorPayload({
                        code: 'IMAGE_CACHE_FAILED',
                        message: error.message,
                        recoverable: true
                    }), true);
                    setBusy('text-gallery-button', false, 'Gallery', 'Opening…');
                    return;
                }
                element('text-image-path').value = scanUri;
                element('text-button').disabled = false;
                element('text-button').removeAttribute('title');
                renderOutput('text-output', 'Image selected; preview unavailable.');
                setBusy('text-gallery-button', false, 'Gallery', 'Opening…');
            });
        }, function (message) {
            if (message && message !== 'No Image Selected') {
                renderOutput('text-output', errorPayload({
                    code: 'IMAGE_PICK_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('text-gallery-button', false, 'Gallery', 'Opening…');
        }, {
            quality: 100,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false
        });
    }

    function recognizeText() {
        var imagePath = requireImagePath('text-image-path', 'text-output');
        if (!imagePath) return;
        setBusy('text-button', true, 'Recognize text', 'Processing…');
        renderOutput('text-output', 'Recognizing…');
        MlKit.recognizeText(imagePath, { locale: pluginLocale() }).then(function (text) {
            renderOutput('text-output', text || '(No text found)');
        }).catch(function (error) {
            renderOutput('text-output', errorPayload(error), true);
        }).then(function () {
            setBusy('text-button', false, 'Recognize text', 'Processing…');
        });
    }

    function enableImageLabeling(imagePath) {
        element('image-labeling-path').value = imagePath;
        element('image-labeling-button').disabled = false;
        element('image-labeling-button').removeAttribute('title');
    }

    function selectImageLabelingValue(imageValue, destinationType, sourceButtonId,
                                      sourceIdleText) {
        var select = destinationType === Camera.DestinationType.DATA_URL
            ? selectGalleryData
            : selectGalleryImage;
        select(imageValue, 'image-labeling-path', 'image-labeling-preview', function (scanUri) {
            enableImageLabeling(scanUri);
            renderOutput('image-labeling-output', 'Image selected.');
            setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
        }, function (error, scanUri) {
            if (!scanUri) {
                renderOutput('image-labeling-output', errorPayload({
                    code: 'IMAGE_CACHE_FAILED',
                    message: error.message,
                    recoverable: true
                }), true);
                setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
                return;
            }
            enableImageLabeling(scanUri);
            renderOutput('image-labeling-output', 'Image selected; preview unavailable.');
            setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
        });
    }

    function chooseImageLabelingImage() {
        if (!navigator.camera || !window.Camera) {
            renderOutput(
                'image-labeling-output',
                errorPayload(new Error('Camera gallery picker is unavailable.')),
                true
            );
            return;
        }

        setBusy('image-labeling-gallery-button', true, 'Gallery', 'Opening…');
        var destinationType = galleryDestinationType();
        navigator.camera.getPicture(function (imageValue) {
            selectImageLabelingValue(
                imageValue, destinationType, 'image-labeling-gallery-button', 'Gallery'
            );
        }, function (message) {
            if (message && message !== 'No Image Selected') {
                renderOutput('image-labeling-output', errorPayload({
                    code: 'IMAGE_PICK_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('image-labeling-gallery-button', false, 'Gallery', 'Opening…');
        }, {
            quality: 100,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false
        });
    }

    function captureImageLabelingPhoto() {
        if (!navigator.camera || !window.Camera) {
            renderOutput(
                'image-labeling-output',
                errorPayload(new Error('Camera is unavailable.')),
                true
            );
            return;
        }

        setBusy('image-labeling-camera-button', true, 'Take photo', 'Camera…');
        var destinationType = Camera.DestinationType.FILE_URI;
        navigator.camera.getPicture(function (imageValue) {
            selectImageLabelingValue(
                imageValue, destinationType, 'image-labeling-camera-button', 'Take photo'
            );
        }, function (message) {
            if (message && message !== 'No Image Selected' && message !== 'Camera cancelled.') {
                renderOutput('image-labeling-output', errorPayload({
                    code: 'IMAGE_CAPTURE_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('image-labeling-camera-button', false, 'Take photo', 'Camera…');
        }, {
            quality: 100,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true,
            saveToPhotoAlbum: false
        });
    }

    function labelImage() {
        var imagePath = requireImagePath('image-labeling-path', 'image-labeling-output');
        if (!imagePath) return;
        var threshold = Number(element('image-labeling-threshold').value);
        if (!isFinite(threshold) || threshold < 0 || threshold > 1) {
            renderOutput(
                'image-labeling-output',
                errorPayload(new Error('Confidence threshold must be from 0 to 1.')),
                true
            );
            return;
        }
        setBusy('image-labeling-button', true, 'Label image', 'Processing…');
        renderOutput('image-labeling-output', 'Labeling…');
        MlKit.labelImage(imagePath, {
            confidenceThreshold: threshold,
            locale: pluginLocale()
        }).then(function (labels) {
            renderOutput('image-labeling-output', labels);
        }).catch(function (error) {
            renderOutput('image-labeling-output', errorPayload(error), true);
        }).then(function () {
            setBusy('image-labeling-button', false, 'Label image', 'Processing…');
        });
    }

    function labelLastDocumentPage() {
        if (!lastDocumentImage) {
            renderOutput('image-labeling-output', errorPayload({
                code: 'NO_DOCUMENT_IMAGE',
                message: 'Scan a document with JPEG pages enabled first.',
                recoverable: true
            }), true);
            return;
        }
        selectImage(
            'image-labeling-path',
            'image-labeling-preview',
            lastDocumentImage.path,
            lastDocumentImage.previewUri
        );
        enableImageLabeling(lastDocumentImage.path);
        labelImage();
    }

    function enableSubjectSegmentation(imagePath) {
        element('subject-segmentation-path').value = imagePath;
        element('subject-segmentation-button').disabled = false;
        element('subject-segmentation-button').removeAttribute('title');
    }

    function selectSubjectSegmentationValue(imageValue, destinationType, sourceButtonId,
                                              sourceIdleText) {
        var select = destinationType === Camera.DestinationType.DATA_URL
            ? selectGalleryData
            : selectGalleryImage;
        select(
            imageValue,
            'subject-segmentation-path',
            'subject-segmentation-input-preview',
            function (scanUri) {
                enableSubjectSegmentation(scanUri);
                renderOutput('subject-segmentation-output', 'Image selected.');
                setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
            },
            function (error, scanUri) {
                if (!scanUri) {
                    renderOutput('subject-segmentation-output', errorPayload({
                        code: 'IMAGE_CACHE_FAILED',
                        message: error.message,
                        recoverable: true
                    }), true);
                    setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
                    return;
                }
                enableSubjectSegmentation(scanUri);
                renderOutput(
                    'subject-segmentation-output',
                    'Image selected; preview unavailable.'
                );
                setBusy(sourceButtonId, false, sourceIdleText, 'Opening…');
            }
        );
    }

    function chooseSubjectSegmentationImage() {
        if (!navigator.camera || !window.Camera) {
            renderOutput(
                'subject-segmentation-output',
                errorPayload(new Error('Camera gallery picker is unavailable.')),
                true
            );
            return;
        }
        setBusy('subject-segmentation-gallery-button', true, 'Gallery', 'Opening…');
        var destinationType = galleryDestinationType();
        navigator.camera.getPicture(function (imageValue) {
            selectSubjectSegmentationValue(
                imageValue,
                destinationType,
                'subject-segmentation-gallery-button',
                'Gallery'
            );
        }, function (message) {
            if (message && message !== 'No Image Selected') {
                renderOutput('subject-segmentation-output', errorPayload({
                    code: 'IMAGE_PICK_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('subject-segmentation-gallery-button', false, 'Gallery', 'Opening…');
        }, {
            quality: 100,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false
        });
    }

    function captureSubjectSegmentationPhoto() {
        if (!navigator.camera || !window.Camera) {
            renderOutput(
                'subject-segmentation-output',
                errorPayload(new Error('Camera is unavailable.')),
                true
            );
            return;
        }
        setBusy('subject-segmentation-camera-button', true, 'Take photo', 'Camera…');
        var destinationType = Camera.DestinationType.FILE_URI;
        navigator.camera.getPicture(function (imageValue) {
            selectSubjectSegmentationValue(
                imageValue,
                destinationType,
                'subject-segmentation-camera-button',
                'Take photo'
            );
        }, function (message) {
            if (message && message !== 'No Image Selected' && message !== 'Camera cancelled.') {
                renderOutput('subject-segmentation-output', errorPayload({
                    code: 'IMAGE_CAPTURE_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('subject-segmentation-camera-button', false, 'Take photo', 'Camera…');
        }, {
            quality: 95,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true,
            saveToPhotoAlbum: false
        });
    }

    function segmentSubjects() {
        var imagePath = requireImagePath(
            'subject-segmentation-path',
            'subject-segmentation-output'
        );
        if (!imagePath) return;
        var maxDimension = integerValue('subject-segmentation-max-dimension');
        if (!Number.isInteger(maxDimension) || maxDimension < 256 || maxDimension > 4096) {
            renderOutput(
                'subject-segmentation-output',
                errorPayload(new Error('Maximum dimension must be from 256 to 4096.')),
                true
            );
            return;
        }
        setBusy('subject-segmentation-button', true, 'Remove background', 'Processing…');
        renderOutput('subject-segmentation-output', 'Segmenting…');
        MlKit.segmentSubjects(imagePath, {
            maxDimension: maxDimension,
            locale: pluginLocale()
        }).then(function (result) {
            renderOutput('subject-segmentation-output', result);
            if (result && result.status === 'success' && result.imageUri) {
                var preview = element('subject-segmentation-result-preview');
                preview.src = result.imageUri + '?t=' + Date.now();
                preview.classList.remove('hidden');
            }
        }).catch(function (error) {
            renderOutput('subject-segmentation-output', errorPayload(error), true);
        }).then(function () {
            setBusy(
                'subject-segmentation-button',
                false,
                'Remove background',
                'Processing…'
            );
        });
    }

    function segmentLastDocumentSubjects() {
        if (!lastDocumentImage) {
            renderOutput('subject-segmentation-output', errorPayload({
                code: 'NO_DOCUMENT_IMAGE',
                message: 'Scan a document with JPEG pages enabled first.',
                recoverable: true
            }), true);
            return;
        }
        selectImage(
            'subject-segmentation-path',
            'subject-segmentation-input-preview',
            lastDocumentImage.path,
            lastDocumentImage.previewUri
        );
        enableSubjectSegmentation(lastDocumentImage.path);
        segmentSubjects();
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
        selectImage(
            'text-image-path',
            'text-image-preview',
            lastDocumentImage.path,
            lastDocumentImage.previewUri
        );
        element('text-button').disabled = false;
        element('text-button').removeAttribute('title');
        recognizeText();
    }

    function scanImageBarcodes(imagePath) {
        var formats = selectedFormats();
        if (!formats.length) {
            renderOutput(
                'image-barcode-output',
                errorPayload(new Error('Select at least one barcode format.')),
                true
            );
            setBusy('barcode-image-button', false, 'Scan image', 'Processing…');
            return;
        }
        setBusy('barcode-image-button', true, 'Scan image', 'Processing…');
        renderOutput('image-barcode-output', 'Scanning…');
        MlKit.scanBarcodes(imagePath, {
            formats: formats,
            locale: pluginLocale()
        }).then(function (results) {
            renderOutput('image-barcode-output', results);
        }).catch(function (error) {
            renderOutput('image-barcode-output', errorPayload(error), true);
        }).then(function () {
            setBusy('barcode-image-button', false, 'Scan image', 'Processing…');
        });
    }

    function chooseBarcodeImage() {
        if (!navigator.camera || !window.Camera) {
            renderOutput(
                'image-barcode-output',
                errorPayload(new Error('Camera gallery picker is unavailable.')),
                true
            );
            return;
        }

        setBusy('barcode-image-button', true, 'Scan image', 'Opening…');
        var destinationType = galleryDestinationType();
        navigator.camera.getPicture(function (imageValue) {
            var select = destinationType === Camera.DestinationType.DATA_URL
                ? selectGalleryData
                : selectGalleryImage;
            select(imageValue, null, 'barcode-image-preview', function (scanUri) {
                scanImageBarcodes(scanUri);
            }, function (error, scanUri) {
                if (!scanUri) {
                    renderOutput('image-barcode-output', errorPayload({
                        code: 'IMAGE_CACHE_FAILED',
                        message: error.message,
                        recoverable: true
                    }), true);
                    setBusy('barcode-image-button', false, 'Scan image', 'Opening…');
                    return;
                }
                scanImageBarcodes(scanUri);
            });
        }, function (message) {
            if (message && message !== 'No Image Selected') {
                renderOutput('image-barcode-output', errorPayload({
                    code: 'IMAGE_PICK_FAILED',
                    message: String(message),
                    recoverable: true
                }), true);
            }
            setBusy('barcode-image-button', false, 'Scan image', 'Opening…');
        }, {
            quality: 100,
            destinationType: destinationType,
            encodingType: Camera.EncodingType.JPEG,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: false
        });
    }

    var FACE_GESTURES = [
        'OPEN_MOUTH', 'NOD', 'SHAKE', 'BLINK', 'SMILE'
    ];

    function resolvedFaceGesture(value, excluded) {
        if (value !== 'RANDOM') return value;
        var candidates = FACE_GESTURES.filter(function (gesture) {
            return gesture !== excluded;
        });
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    function faceOptions() {
        var checks = {};
        Array.prototype.forEach.call(document.querySelectorAll('#face-checks [data-check]'), function (input) {
            checks[input.getAttribute('data-check')] = input.checked;
        });
        var options = {
            outputWidth: integerValue('face-width'),
            outputHeight: integerValue('face-height'),
            jpegQuality: integerValue('face-quality'),
            showCloseButton: element('face-close').checked,
            debugMode: element('face-debug').checked,
            beepEnabled: element('face-beep').checked,
            revealCapture: element('face-reveal-capture').checked,
            requireDeviceVertical: element('face-require-vertical').checked,
            timeoutMs: integerValue('face-timeout'),
            locale: pluginLocale(),
            checks: checks
        };
        var gestures = [];
        var requestedFirstGesture = element('face-first-gesture').value;
        var requestedSecondGesture = element('face-second-gesture').value;
        var firstGesture = resolvedFaceGesture(
            requestedFirstGesture,
            requestedSecondGesture && requestedSecondGesture !== 'RANDOM'
                ? requestedSecondGesture
                : null
        );
        if (firstGesture) {
            gestures.push(firstGesture);
            var secondGesture = resolvedFaceGesture(requestedSecondGesture, firstGesture);
            if (secondGesture) gestures.push(secondGesture);
        }
        options.gestures = gestures;
        if (gestures.length) {
            var captureAfter = element('face-capture-after').value;
            options.captureAfterGesture = captureAfter === 'all'
                ? gestures.length
                : Math.min(Number(captureAfter), gestures.length);
        } else {
            options.captureAfterGesture = 0;
        }
        options.gestureTimeoutMs = integerValue('face-gesture-timeout');
        options.neutralTimeoutMs = integerValue('face-neutral-timeout');
        options.retryMessageMs = integerValue('face-retry-message');
        return options;
    }

    function syncFaceGestureSettings() {
        var hasFirstGesture = Boolean(element('face-first-gesture').value);
        element('face-second-gesture').disabled = !hasFirstGesture;
        element('face-capture-after').disabled = !hasFirstGesture;
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
        var options = {
            formats: formats,
            showCloseButton: element('barcode-close').checked,
            showTorchButton: element('barcode-torch').checked,
            beepEnabled: element('barcode-beep').checked,
            timeoutMs: integerValue('barcode-timeout'),
            locale: pluginLocale()
        };
        var instruction = element('barcode-instruction').value.trim();
        if (instruction) options.instructionText = instruction;
        return options;
    }

    function scanBarcode() {
        var options;
        try {
            options = barcodeOptions();
        } catch (error) {
            renderOutput('barcode-output', errorPayload(error), true);
            return;
        }
        setBusy('barcode-button', true, 'Scan with camera', 'Camera…');
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
            setBusy('barcode-button', false, 'Scan with camera', 'Camera…');
        });
    }

    function enableDemo() {
        element('device-status').textContent = '';
        element('device-status').className = 'status hidden';
        element('capabilities-button').disabled = false;
        element('document-button').disabled = false;
        element('text-gallery-button').disabled = false;
        element('image-labeling-gallery-button').disabled = false;
        element('image-labeling-camera-button').disabled = false;
        element('subject-segmentation-gallery-button').disabled = false;
        element('subject-segmentation-camera-button').disabled = false;
        element('barcode-image-button').disabled = false;
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
        var pluginVersion = 'Unavailable';
        try {
            var pluginList = cordova.require('cordova/plugin_list');
            pluginVersion = pluginList.metadata['cordova-plugin-mlkit-suite'] || pluginVersion;
        } catch (ignored) {
            // Keep the fallback when Cordova metadata is unavailable.
        }
        element('about-plugin-version').textContent = pluginVersion;
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
    element('text-gallery-button').addEventListener('click', chooseTextImageFromGallery);
    element('image-labeling-gallery-button').addEventListener('click', chooseImageLabelingImage);
    element('image-labeling-camera-button').addEventListener('click', captureImageLabelingPhoto);
    element('image-labeling-document-button').addEventListener('click', labelLastDocumentPage);
    element('image-labeling-button').addEventListener('click', labelImage);
    element('subject-segmentation-gallery-button').addEventListener(
        'click', chooseSubjectSegmentationImage
    );
    element('subject-segmentation-camera-button').addEventListener(
        'click', captureSubjectSegmentationPhoto
    );
    element('subject-segmentation-document-button').addEventListener(
        'click', segmentLastDocumentSubjects
    );
    element('subject-segmentation-button').addEventListener('click', segmentSubjects);
    element('ocr-document-button').addEventListener('click', recognizeLastDocumentPage);
    element('text-button').addEventListener('click', recognizeText);
    element('barcode-image-button').addEventListener('click', chooseBarcodeImage);
    element('capabilities-button').addEventListener('click', readCapabilities);
    element('face-first-gesture').addEventListener('change', syncFaceGestureSettings);
    element('face-button').addEventListener('click', captureFace);
    element('barcode-button').addEventListener('click', scanBarcode);

    syncFaceGestureSettings();

    document.addEventListener('deviceready', function () {
        populateAbout();
        if (!window.MlKit) {
            failDemo('ML Kit unavailable');
            return;
        }
        enableDemo();
    }, false);
}());
