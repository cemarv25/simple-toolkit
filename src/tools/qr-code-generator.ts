import QRCode from 'qrcode';

export function render(container: HTMLElement) {
  container.innerHTML = `
    <div class="qr-tool">
        <h1>QR Code Generator</h1>
        <p class="tool-intro">
            Quickly transform a link to QR code with our free and fast QR code generator. 
            Perfect for sharing websites, social media profiles, URLs or text instantly.
        </p>
        
        <div class="tool-content glass">
            <div class="input-group">
                <label for="qr-input">Link or Text</label>
                <textarea id="qr-input" placeholder="Enter URL or text here..." rows="4"></textarea>
            </div>
            
            <button id="generate-qr-btn" class="primary-btn">Generate QR Code</button>

            <div id="qr-result" class="result-area hidden">
                <div class="qr-preview-container">
                    <canvas id="qr-canvas" aria-label="Generated QR Code"></canvas>
                </div>
                <div class="download-actions">
                    <button id="download-png" class="secondary-btn">Download PNG</button>
                </div>
            </div>
        </div>

        <section class="tool-info">
            <h2>How to Use the QR Code URL Generator</h2>
            <p>1. Enter the URL or link you want to convert into the input box above.</p>
            <p>2. Click "Generate QR Code" to create your unique link to QR code instantly.</p>
            <p>3. Download your QR code as a PNG file for use in print or digital media.</p>

            <h2>Frequently Asked Questions</h2>
            <div class="faq-accordion">
                <details class="faq-item">
                    <summary>What is a QR code generator?</summary>
                    <div class="faq-content">
                        <p>A QR code generator is a tool that converts some text (links, urls, names, etc.) into a QR code, allowing users to scan it with their phone camera, copying the text or navigating to the link instantly.</p>
                    </div>
                </details>
                <details class="faq-item">
                    <summary>Is this QR code generator free?</summary>
                    <div class="faq-content">
                        <p>Yes, Simple Toolkit's QR code generator is completely free to use for any personal or commercial links.</p>
                    </div>
                </details>
                <details class="faq-item">
                    <summary>Can I use this for any type of link?</summary>
                    <div class="faq-content">
                        <p>Absolutely! You can use it to create a QR code for your website, social media, Google Maps location, or any other valid URL.</p>
                    </div>
                </details>
                <details class="faq-item">
                    <summary>How many QR codes can I generate?</summary>
                    <div class="faq-content">
                        <p>You can generate as many QR codes as you want, completely free of charge.</p>
                    </div>
                </details>
                <details class="faq-item">
                    <summary>Do I need to create an account to use this tool?</summary>
                    <div class="faq-content">
                        <p>No, you don't need to create an account to use this tool. It's completely free and open to use for everyone.</p>
                    </div>
                </details>
                <details class="faq-item">
                    <summary>Do you store any data used to generate QR codes?</summary>
                    <div class="faq-content">
                        <p>No, we don't store any data. All QR codes are generated locally and are not stored on our servers.</p>
                    </div>
                </details>
            </div>
        </section>
    </div>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "QR Code Generator - Simple Toolkit",
      "url": "https://simple-toolkit.com/qr-code-generator",
      "description": "Free and fast QR code generator for links and URLs. Create high-quality QR codes instantly.",
      "applicationCategory": "Utility",
      "operatingSystem": "All"
    }
    </script>

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

      .tool-intro {
        margin-bottom: 2rem;
        color: var(--text-secondary);
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .tool-intro strong {
        color: var(--text-primary);
        font-weight: 600;
      }

      .tool-info {
        margin-top: 4rem;
        text-align: left;
        border-top: 1px solid var(--glass-border);
        padding-top: 2rem;
      }

      .tool-info h2 {
        margin: 2rem 0 1rem;
        color: var(--text-primary);
        font-size: 1.5rem;
      }

      .tool-info h3 {
        margin: 1.5rem 0 0.5rem;
        color: var(--text-primary);
        font-size: 1.2rem;
      }

      .tool-info p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .faq-accordion {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .faq-item {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .faq-item[open] {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--accent-color);
      }

      summary {
        padding: 1.2rem;
        cursor: pointer;
        font-weight: 600;
        color: var(--text-primary);
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
      }

      summary::-webkit-details-marker {
        display: none;
      }

      summary::after {
        content: '+';
        font-size: 1.5rem;
        color: var(--accent-color);
        transition: transform 0.3s ease;
      }

      .faq-item[open] summary::after {
        content: '−';
        transform: rotate(180deg);
      }

      .faq-content {
        padding: 0 1.2rem 1.2rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .faq-content p {
        margin: 0;
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
