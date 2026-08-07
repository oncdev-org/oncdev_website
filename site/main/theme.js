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

    // Code Terminal Dynamic Height Auto-Adjustment & Interactive Typewriter Switcher
    const terminalBody = document.querySelector('.terminal-body');
    const updateTerminalHeight = (activePane) => {
        if (terminalBody && activePane) {
            const paneHeight = activePane.scrollHeight;
            terminalBody.style.height = `${paneHeight + 48}px`; // 48px padding (24px top + 24px bottom)
        }
    };

    const terminalTabs = document.querySelectorAll('.terminal-tab');
    const terminalPanes = document.querySelectorAll('.terminal-code');
    const paneTemplates = {};
    const cursorHTML = '<span class="typing-cursor"></span>';
    let currentPaneId = 'pane-status';
    let currentAnimId = null;
    let isAnimating = false;

    // Cache original pristine HTML for each tab pane
    terminalPanes.forEach(pane => {
        paneTemplates[pane.id] = pane.innerHTML;
    });

    // Append initial typing cursor to active pane
    const initialPane = document.querySelector('.terminal-code:not(.hidden)');
    if (initialPane) {
        initialPane.innerHTML = paneTemplates[initialPane.id] + cursorHTML;
        setTimeout(() => updateTerminalHeight(initialPane), 50);
    }

    // Helper: Safely slice HTML without breaking opening/closing tags mid-typing
    const getSafeHTMLSlice = (fullHTML, visibleLength) => {
        let visibleChars = 0;
        let index = 0;
        let inTag = false;

        while (index < fullHTML.length && visibleChars < visibleLength) {
            if (fullHTML[index] === '<') inTag = true;
            if (!inTag) visibleChars++;
            if (fullHTML[index] === '>') inTag = false;
            index++;
        }

        if (inTag) {
            const endTagPos = fullHTML.indexOf('>', index);
            if (endTagPos !== -1) {
                index = endTagPos + 1;
            }
        }

        return fullHTML.slice(0, index);
    };

    // Helper: Count visible non-HTML characters
    const countVisibleChars = (fullHTML) => {
        let count = 0;
        let inTag = false;
        for (let i = 0; i < fullHTML.length; i++) {
            if (fullHTML[i] === '<') inTag = true;
            else if (fullHTML[i] === '>') inTag = false;
            else if (!inTag) count++;
        }
        return count;
    };

    // Programmer Typewriter & Eraser Engine
    const typewriteSwitch = (fromPaneId, toPaneId) => {
        if (currentAnimId) {
            cancelAnimationFrame(currentAnimId);
            currentAnimId = null;
        }

        const fromPane = document.getElementById(fromPaneId);
        const toPane = document.getElementById(toPaneId);
        if (!toPane) return;

        const fromFullHTML = paneTemplates[fromPaneId] || (fromPane ? fromPane.innerHTML : '');
        const toFullHTML = paneTemplates[toPaneId];
        
        const fromTotalChars = countVisibleChars(fromFullHTML);
        const toTotalChars = countVisibleChars(toFullHTML);

        let phase = fromPane && fromPaneId !== toPaneId ? 'erasing' : 'typing';
        let currentCharCount = phase === 'erasing' ? fromTotalChars : 0;

        if (fromPane && phase === 'erasing') {
            fromPane.classList.remove('hidden');
        }
        if (toPane && phase === 'typing') {
            toPane.classList.remove('hidden');
        }

        const step = () => {
            if (phase === 'erasing') {
                currentCharCount -= 3; // Rapid backspacing speed
                if (currentCharCount <= 0) {
                    currentCharCount = 0;
                    if (fromPane) {
                        fromPane.innerHTML = '';
                        fromPane.classList.add('hidden');
                    }
                    toPane.classList.remove('hidden');
                    toPane.innerHTML = cursorHTML;
                    phase = 'typing';
                    currentPaneId = toPaneId;
                } else if (fromPane) {
                    fromPane.innerHTML = getSafeHTMLSlice(fromFullHTML, currentCharCount) + cursorHTML;
                }
                updateTerminalHeight(phase === 'erasing' ? fromPane : toPane);
            } else if (phase === 'typing') {
                currentCharCount += 2; // Skilled developer typing speed
                if (currentCharCount >= toTotalChars) {
                    toPane.innerHTML = toFullHTML + cursorHTML;
                    updateTerminalHeight(toPane);
                    isAnimating = false;
                    currentPaneId = toPaneId;
                    return; // Finished
                } else {
                    toPane.innerHTML = getSafeHTMLSlice(toFullHTML, currentCharCount) + cursorHTML;
                }
                updateTerminalHeight(toPane);
            }

            currentAnimId = requestAnimationFrame(step);
        };

        isAnimating = true;
        currentAnimId = requestAnimationFrame(step);
    };

    terminalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            if (targetId === currentPaneId && !isAnimating) return;

            terminalTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            typewriteSwitch(currentPaneId, targetId);
        });
    });

    window.addEventListener('resize', () => {
        const activePane = document.querySelector('.terminal-code:not(.hidden)');
        if (activePane) {
            updateTerminalHeight(activePane);
        }
    });
});
