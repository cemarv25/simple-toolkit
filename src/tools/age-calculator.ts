export function render(container: HTMLElement) {
  container.innerHTML = `
    <h2>Age Calculator</h2>
    <div class="tool-content glass">
      <div class="mode-selector">
        <button id="mode-forward" class="mode-btn active">Find Age</button>
        <button id="mode-reverse" class="mode-btn">Find Birth Date</button>
      </div>

      <div class="input-form">
        <div class="input-row">
          <div class="input-group">
            <label for="input-year" id="label-year">Birth Year</label>
            <input type="number" id="input-year" placeholder="YYYY" min="1900" max="2100" />
          </div>
          <div class="input-group">
            <label for="input-month" id="label-month">Month (Optional)</label>
            <select id="input-month">
              <option value="">Month</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
          <div class="input-group">
            <label for="input-day" id="label-day">Day (Optional)</label>
            <input type="number" id="input-day" placeholder="DD" min="1" max="31" />
          </div>
        </div>
        <button id="calc-btn" class="primary-btn">Calculate Age</button>
      </div>
      
      <div id="result-container" class="result-box hidden">
        <div id="result-status"></div>
        <div id="age-result-details" class="result-grid">
          <div class="result-item" id="years-item">
            <span class="number" id="res-years">0</span>
            <span class="label">Years</span>
          </div>
          <div class="result-item" id="months-item">
            <span class="number" id="res-months">0</span>
            <span class="label">Months</span>
          </div>
          <div class="result-item" id="days-item">
            <span class="number" id="res-days">0</span>
            <span class="label">Days</span>
          </div>
        </div>
        <div id="birthdate-result-text" class="result-text hidden"></div>
      </div>
    </div>
    
    <style>
      .tool-content {
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 12px;
      }
      .mode-selector {
        display: flex;
        gap: 10px;
        margin-bottom: 2rem;
        background: rgba(255, 255, 255, 0.05);
        padding: 5px;
        border-radius: 10px;
        border: 1px solid var(--glass-border);
      }
      .mode-btn {
        flex: 1;
        padding: 10px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s;
      }
      .mode-btn.active {
        background: var(--accent-color);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      .input-row {
        display: grid;
        grid-template-columns: 1.5fr 1.5fr 1fr;
        gap: 15px;
        margin-bottom: 1.5rem;
      }
      @media (max-width: 480px) {
        .input-row {
          grid-template-columns: 1fr;
        }
      }
      .input-group {
        display: flex;
        flex-direction: column;
      }
      label {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }
      input, select {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.15); /* Slightly more opaque for better contrast */
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s;
      }
      input::placeholder {
        color: var(--text-secondary);
        opacity: 1;
      }
      input:focus, select:focus {
        border-color: var(--accent-color);
        background: rgba(255, 255, 255, 0.2);
      }
      .primary-btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 8px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.1s, opacity 0.3s;
        font-size: 1.1rem;
      }
      .primary-btn:active {
        transform: scale(0.98);
      }
      .hidden {
        display: none !important;
      }
      .result-box {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--glass-border);
        text-align: center;
      }
      #result-status {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
        font-weight: 500;
      }
      .result-grid {
        display: flex;
        justify-content: center;
        gap: 2rem;
      }
      .result-item {
        text-align: center;
      }
      .result-item .number {
        display: block;
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--accent-color);
        line-height: 1;
      }
      .result-item .label {
        font-size: 0.85rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 5px;
      }
      .result-text {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--accent-color);
      }
    </style>
  `;

  let currentMode: 'forward' | 'reverse' = 'forward';

  const modeForward = document.getElementById('mode-forward');
  const modeReverse = document.getElementById('mode-reverse');
  const calcBtn = document.getElementById('calc-btn');
  const labelYear = document.getElementById('label-year');
  const labelMonth = document.getElementById('label-month');
  const labelDay = document.getElementById('label-day');
  const inputYear = document.getElementById('input-year') as HTMLInputElement;
  const inputMonth = document.getElementById('input-month') as HTMLSelectElement;
  const inputDay = document.getElementById('input-day') as HTMLInputElement;

  const updateMode = (mode: 'forward' | 'reverse') => {
    currentMode = mode;
    if (mode === 'forward') {
      modeForward?.classList.add('active');
      modeReverse?.classList.remove('active');
      if (labelYear) labelYear.textContent = 'Birth Year';
      if (labelMonth) labelMonth.textContent = 'Month (Optional)';
      if (labelDay) labelDay.textContent = 'Day (Optional)';
      if (calcBtn) calcBtn.textContent = 'Calculate Age';
    } else {
      modeReverse?.classList.add('active');
      modeForward?.classList.remove('active');
      if (labelYear) labelYear.textContent = 'Age (Years)';
      if (labelMonth) labelMonth.textContent = 'Birth Month (Optional)';
      if (labelDay) labelDay.textContent = 'Birth Day (Optional)';
      if (calcBtn) calcBtn.textContent = 'Calculate Birth Date';
    }
    const resContainer = document.getElementById('result-container');
    if (resContainer) resContainer.classList.add('hidden');

    const resText = document.getElementById('birthdate-result-text');
    if (resText) resText.textContent = '';

    ['res-years', 'res-months', 'res-days'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '0';
    });
  };

  modeForward?.addEventListener('click', () => updateMode('forward'));
  modeReverse?.addEventListener('click', () => updateMode('reverse'));

  calcBtn?.addEventListener('click', () => {
    if (currentMode === 'forward') {
      calculateAge(inputYear, inputMonth, inputDay);
    } else {
      calculateBirthDate(inputYear, inputMonth, inputDay);
    }
  });
}

function calculateAge(yIn: HTMLInputElement, mIn: HTMLSelectElement, dIn: HTMLInputElement) {
  const year = parseInt(yIn.value);
  if (isNaN(year)) return;

  const today = new Date();
  const resContainer = document.getElementById('result-container');
  const resStatus = document.getElementById('result-status');
  const resGrid = document.getElementById('age-result-details');
  const resText = document.getElementById('birthdate-result-text');

  const yearsEl = document.getElementById('res-years');
  const monthsEl = document.getElementById('res-months');
  const daysEl = document.getElementById('res-days');

  const yItem = document.getElementById('years-item');
  const mItem = document.getElementById('months-item');
  const dItem = document.getElementById('days-item');

  if (!resContainer || !resStatus || !resGrid || !resText) return;

  resContainer.classList.remove('hidden');
  resGrid.classList.remove('hidden');
  resText.classList.add('hidden');
  resStatus.textContent = 'Age Result:';

  const mVal = mIn.value;
  const dVal = dIn.value;

  if (mVal === '') {
    // Only Year provided
    let age = today.getFullYear() - year;
    if (yearsEl) yearsEl.textContent = age.toString();
    yItem?.classList.remove('hidden');
    mItem?.classList.add('hidden');
    dItem?.classList.add('hidden');
  } else if (dVal === '') {
    // Year and Month
    const month = parseInt(mVal);
    let years = today.getFullYear() - year;
    let months = today.getMonth() - month;
    if (months < 0) {
      years--;
      months += 12;
    }
    if (yearsEl) yearsEl.textContent = years.toString();
    if (monthsEl) monthsEl.textContent = months.toString();
    yItem?.classList.remove('hidden');
    mItem?.classList.remove('hidden');
    dItem?.classList.add('hidden');
  } else {
    // Full date
    const month = parseInt(mVal);
    const day = parseInt(dVal);
    const birthDate = new Date(year, month, day);

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

    if (yearsEl) yearsEl.textContent = years.toString();
    if (monthsEl) monthsEl.textContent = months.toString();
    if (daysEl) daysEl.textContent = days.toString();
    yItem?.classList.remove('hidden');
    mItem?.classList.remove('hidden');
    dItem?.classList.remove('hidden');
  }
}

function calculateBirthDate(yIn: HTMLInputElement, mIn: HTMLSelectElement, dIn: HTMLInputElement) {
  const ageYears = parseInt(yIn.value);
  if (isNaN(ageYears)) return;

  const today = new Date();
  const resContainer = document.getElementById('result-container');
  const resStatus = document.getElementById('result-status');
  const resGrid = document.getElementById('age-result-details');
  const resText = document.getElementById('birthdate-result-text');

  if (!resContainer || !resStatus || !resGrid || !resText) return;

  resContainer.classList.remove('hidden');
  resGrid.classList.add('hidden');
  resText.classList.remove('hidden');
  resStatus.textContent = 'Estimated Birth Date:';

  const mVal = mIn.value;
  const dVal = dIn.value;

  if (mVal === '') {
    // Only Age Years provided
    resText.textContent = `Born in ${today.getFullYear() - ageYears}`;
  } else {
    // Birth Month provided
    const birthMonth = parseInt(mVal);
    const birthDay = parseInt(dVal) || 1; // Default to 1st if not provided

    let birthYear = today.getFullYear() - ageYears;

    // Check if birthday has occurred this year
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)) {
      // Birthday hasn't happened yet this year, so person was born a year earlier
      birthYear--;
    }

    const birthDate = new Date(birthYear, birthMonth, birthDay);

    if (dVal === '') {
      // Month and Year only
      const monthName = birthDate.toLocaleString('default', { month: 'long' });
      resText.textContent = `${monthName} ${birthYear}`;
    } else {
      // Full Date
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      resText.textContent = birthDate.toLocaleDateString(undefined, options);
    }
  }
}
