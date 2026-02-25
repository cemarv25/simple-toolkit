import template from './template.html?raw';
import './style.css';

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

    container.innerHTML = template;

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
            weight: 0
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

        resultArea.classList.remove('hidden');
        resultArea.style.animation = 'none';
        void resultArea.offsetWidth;
        resultArea.style.animation = 'pickPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        chosenColorPill.style.backgroundColor = selected.color;
        const displayName = selected.name || `Option ${options.indexOf(selected) + 1}`;
        chosenNameSpan.textContent = displayName;

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
