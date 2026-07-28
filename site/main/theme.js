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

    // Code Terminal Dynamic Height Auto-Adjustment & Tabs Switcher
    const terminalBody = document.querySelector('.terminal-body');
    const updateTerminalHeight = (activePane) => {
        if (terminalBody && activePane) {
            const paneHeight = activePane.scrollHeight;
            terminalBody.style.height = `${paneHeight + 48}px`; // 48px padding (24px top + 24px bottom)
        }
    };

    const terminalTabs = document.querySelectorAll('.terminal-tab');
    const terminalPanes = document.querySelectorAll('.terminal-code');
    
    // Initial height calculation
    const initialPane = document.querySelector('.terminal-code:not(.hidden)');
    if (initialPane) {
        // Wait a tick for DOM rendering
        setTimeout(() => updateTerminalHeight(initialPane), 50);
    }

    terminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            terminalTabs.forEach(t => t.classList.remove('active'));
            terminalPanes.forEach(p => p.classList.add('hidden'));

            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.remove('hidden');
                updateTerminalHeight(targetPane);
                targetPane.style.animation = 'none';
                targetPane.offsetHeight; // trigger reflow
                targetPane.style.animation = 'fadeIn 0.3s ease';
            }
        });
    });

    window.addEventListener('resize', () => {
        const activePane = document.querySelector('.terminal-code:not(.hidden)');
        if (activePane) {
            updateTerminalHeight(activePane);
        }
    });
});
