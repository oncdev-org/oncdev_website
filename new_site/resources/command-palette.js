// Raycast Style Command Palette (⌘K) for oncdev

const commandPaletteHTML = `
<div id="cmd-palette-modal" class="cmd-modal-overlay hidden" role="dialog" aria-modal="true">
    <div class="cmd-modal-box">
        <div class="cmd-header">
            <i class="cmd-search-icon">🔍</i>
            <input type="text" id="cmd-search-input" placeholder="Поиск по разделам, проектам и документам... (⌘K)" autocomplete="off">
            <span class="cmd-kbd">ESC</span>
        </div>
        <div class="cmd-body">
            <div class="cmd-group-title">Разделы oncdev</div>
            <div class="cmd-list" id="cmd-results">
                <a href="/new_site/main/" class="cmd-item active">
                    <span class="cmd-icon">🏠</span>
                    <div class="cmd-text"><strong>Главная страница</strong><small>Обзор экосистемы oncdev</small></div>
                    <span class="cmd-badge">Перейти</span>
                </a>
                <a href="/new_site/timer/" class="cmd-item">
                    <span class="cmd-icon">⏱️</span>
                    <div class="cmd-text"><strong>Таймер ожидания</strong><small>Мониторинг выходов ролика PolimerS</small></div>
                    <span class="cmd-badge">⌘T</span>
                </a>
                <a href="/new_site/vpn/" class="cmd-item">
                    <span class="cmd-icon">🛡️</span>
                    <div class="cmd-text"><strong>VPN Сервис</strong><small>Подписка и получение VLESS ключей</small></div>
                    <span class="cmd-badge">⌘V</span>
                </a>
                <a href="/new_site/wiki/" class="cmd-item">
                    <span class="cmd-icon">📚</span>
                    <div class="cmd-text"><strong>База знаний & Документы</strong><small>Инструкции по настройке и соглашения</small></div>
                    <span class="cmd-badge">⌘D</span>
                </a>
                <a href="/new_site/about/" class="cmd-item">
                    <span class="cmd-icon">👥</span>
                    <div class="cmd-text"><strong>О создателях</strong><small>Информация о Vobi и Polimer</small></div>
                    <span class="cmd-badge">⌘A</span>
                </a>
                <a href="/new_site/channel-summary/" class="cmd-item">
                    <span class="cmd-icon">📊</span>
                    <div class="cmd-text"><strong>Сводка канала</strong><small>Статистика и просмотры PolimerS</small></div>
                    <span class="cmd-badge">⌘S</span>
                </a>
                <a href="/new_site/polisours/" class="cmd-item">
                    <span class="cmd-icon">⚡</span>
                    <div class="cmd-text"><strong>PoliSours Corner</strong><small>Игры, моды Minecraft и медиа</small></div>
                    <span class="cmd-badge">⌘P</span>
                </a>
            </div>
        </div>
        <div class="cmd-footer">
            <span>Используйте <kbd>↑</kbd> <kbd>↓</kbd> для навигации, <kbd>Enter</kbd> для выбора</span>
        </div>
    </div>
</div>
`;

function initCommandPalette() {
    if (!document.getElementById('cmd-palette-modal')) {
        document.body.insertAdjacentHTML('beforeend', commandPaletteHTML);
    }

    const modal = document.getElementById('cmd-palette-modal');
    const input = document.getElementById('cmd-search-input');
    const results = document.getElementById('cmd-results');
    const items = results.querySelectorAll('.cmd-item');

    function openModal() {
        modal.classList.remove('hidden');
        input.value = '';
        filterItems('');
        input.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function filterItems(query) {
        const q = query.toLowerCase().trim();
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(q)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Keybindings
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (modal.classList.contains('hidden')) {
                openModal();
            } else {
                closeModal();
            }
        }
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    input.addEventListener('input', (e) => filterItems(e.target.value));

    // Bind triggers if present
    document.querySelectorAll('.cmd-trigger').forEach(btn => {
        btn.addEventListener('click', openModal);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommandPalette);
} else {
    initCommandPalette();
}
