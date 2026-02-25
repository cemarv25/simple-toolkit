import QRCode from 'qrcode';
import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    container.innerHTML = template;

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
