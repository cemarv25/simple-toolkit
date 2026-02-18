import QRCode from 'qrcode';

export function render(container: HTMLElement) {
    container.innerHTML = `
    <div class="qr-tool">
        <h2>QR Code Generator</h2>
        <div class="tool-content glass">
            <div class="input-group">
                <label for="qr-input">Link or Text</label>
                <textarea id="qr-input" placeholder="Enter URL or text here..." rows="4"></textarea>
            </div>
            
            <button id="generate-qr-btn" class="primary-btn">Generate QR Code</button>

            <div id="qr-result" class="result-area hidden">
                <div class="qr-preview-container">
                    <canvas id="qr-canvas"></canvas>
                </div>
                <div class="download-actions">
                    <button id="download-png" class="secondary-btn">Download PNG</button>
                </div>
            </div>
        </div>
    </div>

    <style>
      .qr-tool {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
      }

      .tool-content {
        padding: 2rem;
        border-radius: var(--border-radius);
      }

      .input-group {
        margin-bottom: 1.5rem;
        text-align: left;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }

      textarea {
        width: 100%;
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        font-family: var(--font-main);
        resize: vertical;
        box-sizing: border-box;
      }

      textarea::placeholder {
        color: var(--text-secondary);
        opacity: 0.8;
      }

      textarea:focus {
        outline: none;
        border-color: var(--accent-color);
      }

      .primary-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.1s;
      }

      .primary-btn:active {
        transform: scale(0.98);
      }

      .result-area {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--glass-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .result-area.hidden {
        display: none;
      }

      .qr-preview-container {
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      #qr-canvas {
        max-width: 100%;
        height: auto !important;
      }

      .download-actions {
        width: 100%;
      }

      .secondary-btn {
        width: 100%;
        padding: 10px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }

      .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    </style>
  `;

    const input = document.getElementById('qr-input') as HTMLTextAreaElement;
    const generateBtn = document.getElementById('generate-qr-btn')!;
    const resultArea = document.getElementById('qr-result')!;
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    const downloadBtn = document.getElementById('download-png')!;

    async function generateQR() {
        const text = input.value.trim();
        if (!text) {
            alert('Please enter some text or a link');
            return;
        }

        try {
            // Basic sanitization: QR codes can contain anything, but we ensure it's a string
            const sanitizedText = String(text);

            await QRCode.toCanvas(canvas, sanitizedText, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
            });

            resultArea.classList.remove('hidden');
        } catch (err: unknown) {
            console.error(err);
            alert('Error generating QR code');
        }
    }

    function downloadQR() {
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    generateBtn.addEventListener('click', generateQR);
    downloadBtn.addEventListener('click', downloadQR);
}
