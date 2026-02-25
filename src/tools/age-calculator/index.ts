import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    container.innerHTML = template;

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
