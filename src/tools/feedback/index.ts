import { tools } from '../../config/pages-config';
import template from './template.html?raw';
import './style.css';

export function render(container: HTMLElement) {
    container.innerHTML = template;

    const toolSelect = document.getElementById('feedback-tool') as HTMLSelectElement;
    if (toolSelect) {
        const prevToolId = (window as any).prevToolId;
        tools.forEach(t => {
            const option = new Option(t.name, t.id);
            if (t.id === prevToolId) option.selected = true;
            toolSelect.add(option);
        });
    }

    const form = document.getElementById('feedback-form') as HTMLFormElement;
    const successMsg = document.getElementById('feedback-success');
    const backBtn = document.getElementById('back-home-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Feedback submitted:', {
                tool: toolSelect.value,
                message: (document.getElementById('feedback-message') as HTMLTextAreaElement).value
            });

            form.classList.add('hidden');
            successMsg?.classList.remove('hidden');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.pushState(null, '', '/');
            const event = new PopStateEvent('popstate');
            window.dispatchEvent(event);
        });
    }
}
