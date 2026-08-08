(function () {
    // 1. Inject Command Palette HTML into body on load
    function injectCommandPaletteHTML() {
        if (document.getElementById('cmd-palette-backdrop')) return;

        const paletteHTML = `
        <div id="cmd-palette-backdrop" class="cmd-palette-backdrop" aria-hidden="true">
            <div class="cmd-palette-dialog" role="dialog" aria-modal="true">
                <div class="cmd-search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="cmd-input" class="cmd-search-input" placeholder="Поиск по сайту, сервисам и документации... (Нажмите Esc для выхода)" autocomplete="off" />
                    <kbd>ESC</kbd>
                </div>
                <div class="cmd-results-list" id="cmd-results">
                    <div class="cmd-group-title">Быстрые разделы</div>
                    <a href="/vpn" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>VPN Доступ — Оформить подписку / Забрать ключ</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/timer" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-clock"></i>
                            <span>Таймер ожидания видео PolimerS</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/wiki" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-book"></i>
                            <span>База знаний & Документация</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/about" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-users"></i>
                            <span>О создателях (meforr & PoliSours)</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>

                    <div class="cmd-group-title">Инструкции VPN</div>
                    <a href="/wiki/v2ray/" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-brands fa-android"></i>
                            <span>Настройка на смартфонах (Android / iOS)</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/wiki/v2rayn/" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-brands fa-windows"></i>
                            <span>Настройка на Windows (v2rayN)</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>

                    <div class="cmd-group-title">Юридические документы</div>
                    <a href="/wiki/tos/" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-file-contract"></i>
                            <span>Пользовательское соглашение (ToS)</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/wiki/privacy/" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-shield-cat"></i>
                            <span>Политика конфиденциальности</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                    <a href="/wiki/refund/" class="cmd-item">
                        <div class="cmd-item-left">
                            <i class="fa-solid fa-receipt"></i>
                            <span>Публичная оферта и условия возврата</span>
                        </div>
                        <kbd>↵</kbd>
                    </a>
                </div>
                <div class="cmd-footer">
                    <span>oncdev studio command palette</span>
                    <div class="cmd-footer-keys">
                        <span><kbd>↑</kbd> <kbd>↓</kbd> Навигация</span>
                        <span><kbd>ESC</kbd> Закрыть</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', paletteHTML);
    }

    // 2. Command Palette Controller
    function setupCommandPalette() {
        const backdrop = document.getElementById('cmd-palette-backdrop');
        const input = document.getElementById('cmd-input');
        const results = document.getElementById('cmd-results');
        if (!backdrop || !input || !results) return;

        function openPalette() {
            backdrop.classList.add('open');
            backdrop.setAttribute('aria-hidden', 'false');
            input.value = '';
            filterItems('');
            setTimeout(() => input.focus(), 50);
        }

        function closePalette() {
            backdrop.classList.remove('open');
            backdrop.setAttribute('aria-hidden', 'true');
        }

        function filterItems(query) {
            const items = results.querySelectorAll('.cmd-item');
            const term = query.toLowerCase().trim();

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (!term || text.includes(term)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Event listener for opening Command Palette (Alt+K, Ctrl+Shift+K, or '/')
        window.addEventListener('keydown', (e) => {
            const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
            
            // Alt + K (Alt + Л), Ctrl + Shift + K, or '/' when not typing
            const isAltK = e.altKey && (e.code === 'KeyK' || e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л');
            const isCtrlShiftK = e.ctrlKey && e.shiftKey && (e.code === 'KeyK' || e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л');
            const isSlash = e.key === '/' && !isInputActive;

            // Fallback for Ctrl+K / Cmd+K preventing browser URL bar focus
            const isCtrlK = (e.ctrlKey || e.metaKey) && (e.code === 'KeyK' || e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л');

            if (isAltK || isCtrlShiftK || isSlash || isCtrlK) {
                e.preventDefault();
                e.stopPropagation();
                if (backdrop.classList.contains('open')) {
                    closePalette();
                } else {
                    openPalette();
                }
            }

            if (e.key === 'Escape' && backdrop.classList.contains('open')) {
                closePalette();
            }
        }, true);

        // Click on backdrop to close
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closePalette();
        });

        input.addEventListener('input', (e) => {
            filterItems(e.target.value);
        });

        // Expose open function globally
        window.openCmdPalette = openPalette;
    }

    // 3. Scroll Reveal Observer
    function setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .bento-card, .glass-card, .changelog-item');
        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('reveal-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    // 4. Smooth 3D Parallax Tilt Engine (Applied strictly to Project Cards - 50% softer intensity)
    function setup3DTiltEffect() {
        // Target strictly Project Showcase Cards
        const projectCards = document.querySelectorAll('.bento-section .bento-card, .project-card');
        const MAX_TILT_DEGREE = 2.75; // 50% softer tilt angle

        projectCards.forEach(card => {
            let reqId = null;
            const popElements = card.querySelectorAll('h2, h3, p, .button, .tech-pill, .bento-header-tag, .timer-preview-box, .bento-sublinks, .bento-svg-graphic');

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
                popElements.forEach(el => {
                    el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.45s ease, filter 0.45s ease';
                });
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const normX = (x - centerX) / centerX;
                const normY = (y - centerY) / centerY;

                const rotateX = -1 * normY * MAX_TILT_DEGREE;
                const rotateY = normX * MAX_TILT_DEGREE;

                const popX = normX * 3;
                const popY = normY * 3;

                if (reqId) cancelAnimationFrame(reqId);
                reqId = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`;

                    popElements.forEach(el => {
                        const isTitle = el.tagName === 'H2' || el.tagName === 'H3';
                        const isPrimary = el.classList.contains('button');
                        const depthMultiplier = isPrimary ? 1.3 : (isTitle ? 1.0 : 0.7);

                        const shiftX = (popX * depthMultiplier).toFixed(1);
                        const shiftY = (popY * depthMultiplier).toFixed(1);

                        el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 10px) scale(1.01)`;
                        if (isTitle || el.tagName === 'P') {
                            el.style.textShadow = `0 ${(4 + Math.abs(popY)).toFixed(0)}px 10px rgba(0, 0, 0, 0.65)`;
                        }
                    });
                });
            });

            card.addEventListener('mouseleave', () => {
                if (reqId) cancelAnimationFrame(reqId);
                // Ultra-smooth return transition
                card.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

                popElements.forEach(el => {
                    el.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.75s ease, filter 0.75s ease';
                    el.style.transform = `translate3d(0px, 0px, 0px) scale(1)`;
                    el.style.textShadow = 'none';
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectCommandPaletteHTML();
        setupCommandPalette();
        setupScrollReveal();
        setup3DTiltEffect();
    });
})();
