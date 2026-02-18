export function render(container: HTMLElement) {
  container.innerHTML = `
    <h2>Age Calculator</h2>
    <div class="tool-content glass">
      <div class="input-group">
        <label for="birthdate">Date of Birth</label>
        <input type="date" id="birthdate" />
      </div>
      <button id="calc-age-btn" class="primary-btn">Calculate Age</button>
      
      <div id="age-result" class="result-box hidden">
        <div class="result-item">
          <span class="number" id="age-years">0</span>
          <span class="label">Years</span>
        </div>
        <div class="result-item">
          <span class="number" id="age-months">0</span>
          <span class="label">Months</span>
        </div>
        <div class="result-item">
          <span class="number" id="age-days">0</span>
          <span class="label">Days</span>
        </div>
      </div>
    </div>
    
    <style>
      .tool-content {
        padding: 2rem;
        max-width: 500px;
        margin: 0 auto;
        border-radius: 12px;
      }
      .input-group {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }
      input[type="date"] {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 1rem;
      }
      .primary-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
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
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        border-top: 1px solid var(--glass-border);
      }
      .result-box.hidden {
        display: none;
      }
      .result-item {
        text-align: center;
      }
      .result-item .number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--accent-color);
      }
      .result-item .label {
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
      }
    </style>
  `;

  const calcBtn = document.getElementById('calc-age-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', calculateAge);
  }
}

function calculateAge() {
  const birthdateInput = (document.getElementById('birthdate') as HTMLInputElement)?.value;
  if (!birthdateInput) return;

  const birthDate = new Date(birthdateInput);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const yearsEl = document.getElementById('age-years');
  const monthsEl = document.getElementById('age-months');
  const daysEl = document.getElementById('age-days');
  const resultBox = document.getElementById('age-result');

  if (yearsEl) yearsEl.textContent = years.toString();
  if (monthsEl) monthsEl.textContent = months.toString();
  if (daysEl) daysEl.textContent = days.toString();
  if (resultBox) resultBox.classList.remove('hidden');
}
