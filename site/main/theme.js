document.addEventListener('DOMContentLoaded', () => {
    // Theme setup
    document.body.classList.add('dark-theme');
    try {
        localStorage.setItem('theme', 'dark');
    } catch (error) {
        console.warn('Theme preference could not be saved.', error);
    }

    // Bento Cards Spotlight Mouse Tracking
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

    // Code Terminal Tabs Switcher with Smooth Animation
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
                targetPane.style.animation = 'none';
                targetPane.offsetHeight; // trigger reflow
                targetPane.style.animation = 'fadeIn 0.3s ease';
            }
        });
    });
});
