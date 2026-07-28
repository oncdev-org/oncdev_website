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
                            <span>О создателях (Vobi & Polimer)</span>
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

        // Event listener for opening Command Palette
        window.addEventListener('keydown', (e) => {
            // Prevent Google default Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
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

    document.addEventListener('DOMContentLoaded', () => {
        injectCommandPaletteHTML();
        setupCommandPalette();
        setupScrollReveal();
    });
})();
