export function render(container: HTMLElement) {
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval: number | null = null;
    let laps: number[] = [];

    container.innerHTML = `
    <div class="stopwatch-tool">
        <div id="stopwatch-display" class="display-main">00:00.00</div>
        
        <div id="main-tap-area" class="tap-area glass">
            <span id="tap-instruction">TAP TO START</span>
        </div>

        <div class="bottom-controls">
            <button id="lap-btn" class="secondary-btn" disabled>Lap</button>
            <button id="reset-btn" class="secondary-btn danger">Reset</button>
        </div>

        <div class="laps-container glass hidden" id="laps-section">
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Average Lap</span>
                    <span class="stat-value" id="avg-lap">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Laps</span>
                    <span class="stat-value" id="total-laps">0</span>
                </div>
            </div>
            <div id="laps-list" class="laps-list"></div>
        </div>
    </div>

    <style>
      .stopwatch-tool {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        gap: 1.5rem;
        padding-bottom: 2rem;
      }

      .display-main {
        font-size: 5rem;
        font-weight: 700;
        font-family: monospace;
        color: var(--accent-color);
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        margin: 1rem 0;
      }

      .tap-area {
        width: 100%;
        flex: 1;
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: var(--border-radius);
        transition: background 0.2s, transform 0.1s;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
      }

      .tap-area:active {
        transform: scale(0.99);
        background: rgba(255, 255, 255, 0.15);
      }

      #tap-instruction {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .laps-container {
        width: 100%;
        max-height: 250px;
        overflow-y: auto;
        padding: 1rem;
        border-radius: var(--border-radius);
      }

      .laps-container.hidden {
        display: none;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--glass-border);
      }

      .stat-item {
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 0.8rem;
        color: var(--text-secondary);
        text-transform: uppercase;
      }

      .stat-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .laps-list {
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
      }

      .lap-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        font-family: monospace;
      }

      .bottom-controls {
        display: flex;
        width: 100%;
        gap: 1rem;
        margin-top: auto;
      }

      .secondary-btn {
        flex: 1;
        padding: 1.5rem;
        border: 1px solid var(--glass-border);
        background: var(--glass-bg);
        color: var(--text-primary);
        border-radius: var(--border-radius);
        font-weight: 600;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .secondary-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .secondary-btn:not(:disabled):hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .secondary-btn.danger {
        color: var(--danger-color);
      }

      @media (max-width: 480px) {
        .display-main {
          font-size: 3.5rem;
        }
        .tap-area {
            min-height: 200px;
        }
      }
    </style>
  `;

    const display = document.getElementById('stopwatch-display')!;
    const tapArea = document.getElementById('main-tap-area')!;
    const tapInstruction = document.getElementById('tap-instruction')!;
    const lapBtn = document.getElementById('lap-btn') as HTMLButtonElement;
    const resetBtn = document.getElementById('reset-btn')!;
    const lapsSection = document.getElementById('laps-section')!;
    const lapsList = document.getElementById('laps-list')!;
    const avgLapEl = document.getElementById('avg-lap')!;
    const totalLapsEl = document.getElementById('total-laps')!;

    function formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }

    function updateDisplay() {
        const currentElapsed = elapsedTime + (startTime ? Date.now() - startTime : 0);
        display.textContent = formatTime(currentElapsed);
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = window.setInterval(updateDisplay, 10);
        tapInstruction.textContent = 'TAP TO STOP';
        lapBtn.disabled = false;
    }

    function stopTimer() {
        if (startTime) {
            elapsedTime += Date.now() - startTime;
            startTime = 0;
        }
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        tapInstruction.textContent = 'TAP TO RESUME';
    }

    function handleTap() {
        if (timerInterval) {
            stopTimer();
        } else {
            startTimer();
        }
    }

    function handleLap() {
        const currentElapsed = elapsedTime + (startTime ? Date.now() - startTime : 0);
        const lastLapTime = laps.length > 0 ? laps.reduce((a, b) => a + b, 0) : 0;
        const lapDuration = currentElapsed - lastLapTime;

        laps.push(lapDuration);
        renderLaps();
    }

    function renderLaps() {
        lapsSection.classList.remove('hidden');
        lapsList.innerHTML = '';

        laps.forEach((lap, index) => {
            const row = document.createElement('div');
            row.className = 'lap-row';
            row.innerHTML = `
        <span>Lap ${index + 1}</span>
        <span>${formatTime(lap)}</span>
      `;
            lapsList.appendChild(row);
        });

        const avg = laps.reduce((a, b) => a + b, 0) / laps.length;
        avgLapEl.textContent = formatTime(avg);
        totalLapsEl.textContent = laps.length.toString();
    }

    function resetTimer() {
        stopTimer();
        startTime = 0;
        elapsedTime = 0;
        laps = [];
        display.textContent = '00:00.00';
        tapInstruction.textContent = 'TAP TO START';
        lapBtn.disabled = true;
        lapsSection.classList.add('hidden');
        lapsList.innerHTML = '';
    }

    tapArea.addEventListener('click', handleTap);
    lapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleLap();
    });
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetTimer();
    });
}
