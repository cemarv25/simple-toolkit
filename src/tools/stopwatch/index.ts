import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval: number | null = null;
    let laps: number[] = [];

    container.innerHTML = template;

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
