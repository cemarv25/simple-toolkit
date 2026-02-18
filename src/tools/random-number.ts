export function render(container: HTMLElement) {
  container.innerHTML = `
    <h2>Random Number Generator</h2>
    <div class="tool-content glass">
      <div class="input-row">
        <div class="input-group">
          <label for="min-num">Min</label>
          <input type="number" id="min-num" value="1" />
        </div>
        <div class="input-group">
          <label for="max-num">Max</label>
          <input type="number" id="max-num" value="100" />
        </div>
      </div>
      <button id="generate-btn" class="primary-btn">Generate</button>
      
      <div id="rng-result" class="result-box hidden">
        <span id="random-value">0</span>
      </div>
    </div>

    <style>
      .tool-content {
        padding: 2rem;
        max-width: 400px;
        margin: 0 auto;
        border-radius: 12px;
        text-align: center;
      }
      .input-row {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .input-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      label {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }
      input[type="number"] {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
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
      .result-box {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid var(--glass-border);
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .result-box.hidden {
        visibility: hidden;
      }
      #random-value {
        font-size: 4rem;
        font-weight: 700;
        color: var(--accent-color);
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      @keyframes popIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    </style>
  `;

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
    valueSpan.classList.remove('animate');
    void valueSpan.offsetWidth; // trigger reflow
    valueSpan.textContent = random.toString();
    valueSpan.style.animation = 'none';
    valueSpan.offsetHeight; /* trigger reflow */
    valueSpan.style.animation = 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }
}
