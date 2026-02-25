import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    container.innerHTML = template;

    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNumber);
    }
}

function generateNumber() {
    const minInput = document.getElementById('min-num') as HTMLInputElement;
    const maxInput = document.getElementById('max-num') as HTMLInputElement;

    if (!minInput || !maxInput) return;

    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);

    if (isNaN(min) || isNaN(max)) return;

    if (min > max) {
        alert("Min cannot be greater than Max");
        return;
    }

    const random = Math.floor(Math.random() * (max - min + 1)) + min;

    const resultBox = document.getElementById('rng-result');
    const valueSpan = document.getElementById('random-value');

    if (resultBox) resultBox.classList.remove('hidden');

    if (valueSpan) {
        valueSpan.textContent = random.toString();
        valueSpan.style.animation = 'none';
        valueSpan.offsetHeight; /* trigger reflow */
        valueSpan.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
}
