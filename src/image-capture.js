class ImageCapture extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --preview-width: 100%;
                    --preview-height: 300px;
                    --button-background: #008CBA;
                    --button-color: white;
                    --button-padding: 10px 20px;
                    --button-border: none;
                    --button-border-radius: 5px;
                    --button-font-size: 16px;
                }
                .preview {
                    width: var(--preview-width);
                    height: var(--preview-height);
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                video, img {
                    max-width: 100%;
                    max-height: 100%;
                }
                .controls {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                select, button {
                    background: var(--button-background);
                    color: var(--button-color);
                    padding: var(--button-padding);
                    border: var(--button-border);
                    border-radius: var(--button-border-radius);
                    font-size: var(--button-font-size);
                    cursor: pointer;
                }
                button:disabled {
                    background: #ccc;
                }
                .loading {
                    position: absolute;
                    display: none;
                }
                .loading.show {
                    display: block;
                }
                .error {
                    color: red;
                    font-size: 14px;
                    margin-top: 10px;
                    text-align: center;
                }
            </style>
            <div class="preview" id="preview">
                <div class="loading" id="loading">Loading...</div>
                <video id="video" autoplay></video>
                <img id="captured-image" style="display:none;">
            </div>
            <div class="controls">
                <select id="camera-select"></select>
                <button id="capture-button" disabled>Capture</button>
            </div>
            <div class="error" id="error"></div>
        `;

        this.video = this.shadowRoot.querySelector('#video');
        this.capturedImage = this.shadowRoot.querySelector('#captured-image');
        this.captureButton = this.shadowRoot.querySelector('#capture-button');
        this.preview = this.shadowRoot.querySelector('#preview');
        this.cameraSelect = this.shadowRoot.querySelector('#camera-select');
        this.loading = this.shadowRoot.querySelector('#loading');
        this.error = this.shadowRoot.querySelector('#error');

        this.captureButton.addEventListener('click', () => this.captureImage());
        this.cameraSelect.addEventListener('change', () => this.changeCamera());
    }

    async connectedCallback() {
        this.loading.classList.add('show');
        this.error.textContent = '';
        try {
            await this.startCamera();
            await this.populateCameraOptions();
            this.captureButton.disabled = false;
        } catch (err) {
            this.error.textContent = 'Error accessing camera: ' + err.message;
        } finally {
            this.loading.classList.remove('show');
        }
    }

    async populateCameraOptions() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        this.cameraSelect.innerHTML = videoDevices.map(device => `
            <option value="${device.deviceId}">${device.label || `Unnamed Camera`}</option>
        `).join('');
    }

    async startCamera(deviceId) {
        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined
            }
        };

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.video.srcObject = this.stream;
        this.video.play();
    }

    changeCamera() {
        const selectedDeviceId = this.cameraSelect.value;
        this.startCamera(selectedDeviceId);
    }

    captureImage() {
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');

        this.dispatchEvent(new CustomEvent('imagecaptured', { detail: { imageDataUrl } }));
        
        this.reset();
    }

    reset() {
        this.video.style.display = 'block';
        this.capturedImage.style.display = 'none';
        this.capturedImage.src = '';
    }
}

customElements.define('image-capture', ImageCapture);
