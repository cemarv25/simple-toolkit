import { tools } from '../../config/pages-config';
import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    container.innerHTML = template;

    const toolsList = document.getElementById('about-tools-list');
    if (toolsList) {
        toolsList.innerHTML = tools.map(t => `<li>${t.name}</li>`).join('');
    }

    const feedbackBtn = document.getElementById('about-feedback-btn');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            history.pushState(null, '', '/feedback');
            const event = new PopStateEvent('popstate');
            window.dispatchEvent(event);
        });
    }
}
