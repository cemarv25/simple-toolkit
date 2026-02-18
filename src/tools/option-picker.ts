type Option = {
  id: string;
  name: string;
  color: string;
  weight: number;
};

export function render(container: HTMLElement) {
  let options: Option[] = [
    { id: '1', name: '', color: '#4facfe', weight: 50 },
    { id: '2', name: '', color: '#f093fb', weight: 50 }
  ];

  container.innerHTML = `
    <div class="option-picker-tool">
      <h2>Option Picker</h2>
      <div class="tool-content glass">
        <div id="options-list" class="options-list"></div>
        
        <div class="options-controls">
          <button id="add-option-btn" class="secondary-btn">Add Option</button>
          <button id="balance-btn" class="secondary-btn" title="Equalize chances">Balance</button>
        </div>
        
        <div class="actions">
          <button id="choose-btn" class="primary-btn">Pick One!</button>
        </div>

        <div id="choice-result" class="choice-result hidden">
          <div id="chosen-color-pill" class="color-pill"></div>
          <p id="chosen-name">The winner is: <span>Option Name</span></p>
        </div>
      </div>
    </div>

    <style>
      .option-picker-tool {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
      }
      .tool-content {
        padding: 2rem;
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .options-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .option-item {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        gap: 1.2rem;
        align-items: center;
        background: rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--glass-border);
      }
      .option-color-input {
        width: 36px;
        height: 36px;
        padding: 0;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        background: none;
        flex-shrink: 0;
      }
      .option-color-input::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      .option-color-input::-webkit-color-swatch {
        border: none;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      .option-name-input {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 10px 14px;
        border-radius: 8px;
        font-family: var(--font-main);
        width: 100%;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .option-name-input:focus {
        outline: none;
        border-color: var(--accent-color);
        background: rgba(255, 255, 255, 0.05);
      }
      .option-name-input::placeholder {
        color: var(--text-secondary);
        opacity: 0.8;
      }
      .weight-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 120px;
        flex-shrink: 0;
      }
      .weight-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        margin-bottom: 4px;
        white-space: nowrap;
      }
      .weight-slider {
        width: 100%;
        cursor: pointer;
        margin: 0;
      }
      .remove-btn {
        background: transparent;
        border: none;
        color: var(--danger-color);
        font-size: 1.4rem;
        cursor: pointer;
        padding: 8px;
        opacity: 0.7;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .remove-btn:hover {
        opacity: 1;
        background: rgba(255, 75, 75, 0.1);
      }
      .options-controls {
        display: flex;
        gap: 0.8rem;
        width: 100%;
      }
      #add-option-btn {
        flex: 0 0 70%;
        box-sizing: border-box;
      }
      #balance-btn {
        flex: 0 0 calc(30% - 0.8rem);
        box-sizing: border-box;
      }
      .secondary-btn {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        color: var(--text-primary);
        padding: 12px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .primary-btn {
        width: 100%;
        padding: 18px;
        border: none;
        border-radius: 14px;
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        font-weight: 700;
        font-size: 1.3rem;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.2s;
        box-shadow: 0 4px 15px rgba(229, 46, 113, 0.3);
      }
      .primary-btn:active {
        transform: scale(0.98);
      }
      .choice-result {
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--glass-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        animation: pickPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .choice-result.hidden {
        display: none;
      }
      .color-pill {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        border: 4px solid rgba(255,255,255,0.2);
      }
      #chosen-name {
        font-size: 1.6rem;
        font-weight: 500;
      }
      #chosen-name span {
        font-weight: 700;
        color: var(--accent-color);
      }

      @keyframes pickPop {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      @media (max-width: 580px) {
        .option-item {
          grid-template-columns: auto 1fr auto;
          gap: 0.8rem;
          padding: 1rem;
        }
        .weight-control {
          grid-column: span 3;
          width: 100%;
          order: 3;
          margin-top: 0.5rem;
        }
        .remove-btn {
          grid-column: 3;
          grid-row: 1;
          justify-self: end;
          padding: 4px;
        }
        .option-name-input {
           grid-column: 2;
        }
      }
    </style>
  `;

  const listContainer = document.getElementById('options-list')!;
  const addBtn = document.getElementById('add-option-btn')!;
  const balanceBtn = document.getElementById('balance-btn')!;
  const chooseBtn = document.getElementById('choose-btn')!;
  const resultArea = document.getElementById('choice-result')!;
  const chosenColorPill = document.getElementById('chosen-color-pill')!;
  const chosenNameSpan = document.querySelector('#chosen-name span')!;

  function generateId() {
    return Math.random().toString(36).slice(2, 11);
  }

  function balanceWeights(changedId: string | null = null, newWeight: number | null = null) {
    if (options.length === 0) return;

    if (changedId && newWeight !== null) {
      const changed = options.find(o => o.id === changedId)!;
      changed.weight = newWeight;

      const others = options.filter(o => o.id !== changedId);
      if (others.length > 0) {
        const targetSumOthers = 100 - newWeight;
        const currentSumOthers = others.reduce((s, o) => s + o.weight, 0);

        if (currentSumOthers === 0) {
          others.forEach(o => o.weight = targetSumOthers / others.length);
        } else {
          others.forEach(o => {
            o.weight = (o.weight / currentSumOthers) * targetSumOthers;
          });
        }
      }
    } else {
      // Re-balance all equally (e.g. after add/remove or clicking Balance)
      const equalWeight = 100 / options.length;
      options.forEach(o => o.weight = equalWeight);
    }
  }

  function renderOptions() {
    listContainer.innerHTML = '';
    options.forEach((opt, index) => {
      const item = document.createElement('div');
      item.className = 'option-item';
      item.dataset.id = opt.id;
      item.innerHTML = `
        <input type="color" class="option-color-input" value="${opt.color}" title="Choose color">
        <input type="text" class="option-name-input" value="${opt.name}" placeholder="Option ${index + 1}">
        <div class="weight-control">
            <span class="weight-label">Chance: ${Math.round(opt.weight)}%</span>
            <input type="range" min="0" max="100" step="1" value="${opt.weight}" class="weight-slider">
        </div>
        <button class="remove-btn" title="Remove option">✕</button>
      `;

      const colorInp = item.querySelector('.option-color-input') as HTMLInputElement;
      const nameInp = item.querySelector('.option-name-input') as HTMLInputElement;
      const weightInp = item.querySelector('.weight-slider') as HTMLInputElement;
      const removeBtn = item.querySelector('.remove-btn') as HTMLButtonElement;

      colorInp.addEventListener('input', (e) => {
        opt.color = (e.target as HTMLInputElement).value;
      });
      nameInp.addEventListener('input', (e) => {
        opt.name = (e.target as HTMLInputElement).value;
      });

      weightInp.addEventListener('input', (e) => {
        const newWeight = parseInt((e.target as HTMLInputElement).value);
        balanceWeights(opt.id, newWeight);

        // Update all labels and sliders without full re-render
        options.forEach(o => {
          const row = listContainer.querySelector(`[data-id="${o.id}"]`);
          if (row) {
            row.querySelector('.weight-label')!.textContent = `Chance: ${Math.round(o.weight)}%`;
            (row.querySelector('.weight-slider') as HTMLInputElement).value = o.weight.toString();
          }
        });
      });

      removeBtn.addEventListener('click', () => {
        if (options.length > 1) {
          options = options.filter(o => o.id !== opt.id);
          balanceWeights();
          renderOptions();
        }
      });

      listContainer.appendChild(item);
    });
  }

  function addOption() {
    const colors = ['#4facfe', '#00f2fe', '#f093fb', '#f5576c', '#43e97b', '#38f9d7', '#fa709a', '#fee140'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    options.push({
      id: generateId(),
      name: '',
      color: randomColor,
      weight: 0 // Will be balanced
    });
    balanceWeights();
    renderOptions();
  }

  function chooseOne() {
    if (options.length === 0) return;

    const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;

    let selected = options[0];
    for (const opt of options) {
      if (random < opt.weight) {
        selected = opt;
        break;
      }
      random -= opt.weight;
    }

    // Visual feedback
    resultArea.classList.remove('hidden');
    resultArea.style.animation = 'none';
    void resultArea.offsetWidth; // trigger reflow
    resultArea.style.animation = 'pickPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    chosenColorPill.style.backgroundColor = selected.color;
    // Use name or placeholder name if empty
    const displayName = selected.name || `Option ${options.indexOf(selected) + 1}`;
    chosenNameSpan.textContent = displayName;

    // Smooth scroll to result
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  addBtn.addEventListener('click', addOption);
  balanceBtn.addEventListener('click', () => {
    balanceWeights();
    renderOptions();
  });
  chooseBtn.addEventListener('click', chooseOne);

  balanceWeights();
  renderOptions();
}
