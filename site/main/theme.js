document.addEventListener('DOMContentLoaded', () => {
    // Theme setup
    document.body.classList.add('dark-theme');
    try {
        localStorage.setItem('theme', 'dark');
    } catch (error) {
        console.warn('Theme preference could not be saved.', error);
    }

    // Interactive background blob
    const interactiveBlob = document.getElementById('interactive-blob');
    if (interactiveBlob) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            interactiveBlob.style.opacity = '1';
            interactiveBlob.style.left = `${x}px`;
            interactiveBlob.style.top = `${y}px`;
        });

        document.addEventListener('mouseleave', () => {
            interactiveBlob.style.opacity = '0';
        });
    }

    // Bento Cards Spotlight Effect
    const bentoCards = document.querySelectorAll('.bento-card, .glass-card');
    bentoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Code Terminal Tabs Switcher
    const terminalTabs = document.querySelectorAll('.terminal-tab');
    const terminalPanes = document.querySelectorAll('.terminal-code');
    terminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            terminalTabs.forEach(t => t.classList.remove('active'));
            terminalPanes.forEach(p => p.classList.add('hidden'));

            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
            }
        });
    });
});
