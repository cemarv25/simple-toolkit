export function render(container: HTMLElement) {
  container.innerHTML = `
    <h2>Unit Converter</h2>
    <div class="tool-content glass">
      <div class="converter-type">
        <label>Type:</label>
        <select id="unit-type">
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
        </select>
      </div>

      <div class="conversion-row">
        <div class="input-group">
            <input type="number" id="input-value" value="1" />
            <select id="input-unit"></select>
        </div>
        <span class="equals">=</span>
        <div class="input-group">
            <input type="number" id="output-value" readonly />
            <select id="output-unit"></select>
        </div>
      </div>
    </div>

    <style>
      .tool-content {
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
        border-radius: 12px;
      }
      .converter-type {
        margin-bottom: 2rem;
        text-align: center;
      }
      #unit-type {
        padding: 8px 16px;
        border-radius: 20px;
        background: rgba(255,255,255,0.2);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        font-size: 1rem;
        cursor: pointer;
      }
      .conversion-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
      }
      .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
      }
      input[type="number"] {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-family: var(--font-main);
        font-size: 1.2rem;
        width: 100%;
        box-sizing: border-box;
      }
      select {
        padding: 8px;
        border-radius: 8px;
        background: rgba(0,0,0,0.2);
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
      }
      .equals {
        font-size: 2rem;
        color: var(--text-secondary);
      }
      @media (max-width: 600px) {
        .conversion-row {
            flex-direction: column;
        }
      }
    </style>
  `;

  initConverter();
}

type UnitCategory = {
  base?: string;
  rates?: Record<string, number>;
  units?: string[];
};

const units: Record<string, UnitCategory> = {
  length: {
    base: 'meter',
    rates: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      inch: 39.3701,
      foot: 3.28084,
      mile: 0.000621371
    }
  },
  weight: {
    base: 'gram',
    rates: {
      gram: 1,
      kilogram: 0.001,
      milligram: 1000,
      pound: 0.00220462,
      ounce: 0.035274
    }
  },
  temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin']
  }
};

function initConverter() {
  const typeSelect = document.getElementById('unit-type') as HTMLSelectElement;
  const inputUnit = document.getElementById('input-unit') as HTMLSelectElement;
  const outputUnit = document.getElementById('output-unit') as HTMLSelectElement;
  const inputValue = document.getElementById('input-value') as HTMLInputElement;

  if (!typeSelect || !inputUnit || !outputUnit || !inputValue) return;

  typeSelect.addEventListener('change', () => {
    populateUnits(typeSelect.value);
    convert();
  });

  [inputUnit, outputUnit, inputValue].forEach(el => {
    el.addEventListener('input', convert);
    el.addEventListener('change', convert);
  });

  populateUnits('length');
  convert();
}

function populateUnits(type: string) {
  const inputSel = document.getElementById('input-unit') as HTMLSelectElement;
  const outputSel = document.getElementById('output-unit') as HTMLSelectElement;

  if (!inputSel || !outputSel) return;

  inputSel.innerHTML = '';
  outputSel.innerHTML = '';

  if (type === 'temperature') {
    units.temperature.units?.forEach(u => {
      inputSel.add(new Option(u, u));
      outputSel.add(new Option(u, u));
    });
    outputSel.value = 'Fahrenheit';
  } else {
    const rates = units[type].rates;
    if (rates) {
      for (const unit in rates) {
        inputSel.add(new Option(unit, unit));
        outputSel.add(new Option(unit, unit));
      }
      const keys = Object.keys(rates);
      if (keys.length > 1) outputSel.value = keys[1];
    }
  }
}

function convert() {
  const typeSelect = document.getElementById('unit-type') as HTMLSelectElement;
  const inputUnitEl = document.getElementById('input-unit') as HTMLSelectElement;
  const outputUnitEl = document.getElementById('output-unit') as HTMLSelectElement;
  const inputValueEl = document.getElementById('input-value') as HTMLInputElement;
  const outputValueEl = document.getElementById('output-value') as HTMLInputElement;

  if (!typeSelect || !inputUnitEl || !outputUnitEl || !inputValueEl || !outputValueEl) return;

  const type = typeSelect.value;
  const from = inputUnitEl.value;
  const to = outputUnitEl.value;
  const val = parseFloat(inputValueEl.value);

  if (isNaN(val)) {
    outputValueEl.value = '';
    return;
  }

  let result: number;
  if (type === 'temperature') {
    result = convertTemp(val, from, to);
  } else {
    const rates = units[type].rates;
    if (rates && rates[from] && rates[to]) {
      const base = val / rates[from];
      result = base * rates[to];
    } else {
      result = val;
    }
  }

  outputValueEl.value = parseFloat(result.toFixed(6)).toString();
}

function convertTemp(val: number, from: string, to: string): number {
  if (from === to) return val;

  let celsius: number = 0;
  if (from === 'Celsius') celsius = val;
  else if (from === 'Fahrenheit') celsius = (val - 32) * 5 / 9;
  else if (from === 'Kelvin') celsius = val - 273.15;

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return (celsius * 9 / 5) + 32;
  if (to === 'Kelvin') return celsius + 273.15;

  return val;
}
