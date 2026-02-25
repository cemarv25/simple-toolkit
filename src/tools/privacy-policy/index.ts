import template from './template.html?raw';
import './style.css';

type GoogleFC = {
    showRevocationMessage: () => void;
};

declare global {
    interface Window {
        googlefc?: GoogleFC;
    }
}

export function render(container: HTMLElement) {
    container.innerHTML = template;

    const reopenButton = document.getElementById('reopen-cookie-banner');
    if (reopenButton) {
        reopenButton.addEventListener('click', () => {
            if (window.googlefc && typeof window.googlefc.showRevocationMessage === 'function') {
                window.googlefc.showRevocationMessage();
            } else {
                alert("Cookie preferences are managed by Google. If you don't see a message, please ensure your ad blocker is disabled and refresh the page.");
            }
        });
    }
}
