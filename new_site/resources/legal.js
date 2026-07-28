// Shared script for managing Language and Region on legal pages
(function () {
    const CSS_STYLES = `
        /* Modal Overlay */
        .legal-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(4, 5, 8, 0.95);
            backdrop-filter: blur(12px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        /* Modal Card */
        .legal-modal {
            background: var(--bg-soft);
            border: 1px solid var(--line);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            padding: 40px;
            width: 90%;
            max-width: 500px;
            text-align: center;
            animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .legal-modal h2 {
            font-size: 1.8rem;
            margin-bottom: 24px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--text) 30%, var(--muted) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .legal-modal-section {
            margin-bottom: 24px;
            text-align: left;
        }

        .legal-modal-section label {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--accent-cyan);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 10px;
        }

        /* Option Buttons Grid */
        .legal-options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .legal-option-btn {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--line);
            border-radius: 6px;
            color: var(--muted);
            padding: 12px;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .legal-option-btn:hover {
            background: rgba(255, 255, 255, 0.07);
            color: var(--text);
            border-color: var(--line-strong);
        }

        .legal-option-btn.active {
            background: rgba(45, 212, 191, 0.1);
            border-color: var(--accent-cyan);
            color: #ffffff;
            box-shadow: 0 0 12px rgba(45, 212, 191, 0.15);
        }

        .legal-confirm-btn {
            width: 100%;
            margin-top: 12px;
            font-size: 1rem;
            cursor: pointer;
        }

        /* Floating Switcher Widget */
        .legal-switcher-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999;
            background: rgba(7, 9, 14, 0.85);
            border: 1px solid var(--line);
            border-radius: 20px;
            padding: 6px 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--muted);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .legal-switcher-widget:hover {
            border-color: var(--accent-cyan);
            color: var(--text);
            transform: translateY(-2px);
        }

        .legal-switcher-widget svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        /* Display Rules for Legal Content */
        .legal-content {
            display: none !important;
        }

        body.lang-rus.region-rf .legal-content.lang-rus.region-rf {
            display: block !important;
        }
        body.lang-rus.region-intl .legal-content.lang-rus.region-intl {
            display: block !important;
        }
        body.lang-eng.region-rf .legal-content.lang-eng.region-rf {
            display: block !important;
        }
        body.lang-eng.region-intl .legal-content.lang-eng.region-intl {
            display: block !important;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* Utility class to prevent body scroll when modal is active */
        body.legal-modal-open {
            overflow: hidden !important;
        }
    `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS_STYLES;
    document.head.appendChild(styleEl);

    // Initialize state
    let currentLang = localStorage.getItem('oncdev_lang');
    let currentRegion = localStorage.getItem('oncdev_region');

    function updatePageContent() {
        // Remove old classes
        document.body.classList.remove('lang-rus', 'lang-eng', 'region-rf', 'region-intl');
        
        // Add new classes
        document.body.classList.add(`lang-${currentLang}`);
        document.body.classList.add(`region-${currentRegion}`);

        // Update Dynamic Titles if available
        const titleEl = document.getElementById('dynamic-title');
        if (titleEl) {
            const key = `data-title-${currentLang}-${currentRegion}`;
            const titleText = titleEl.getAttribute(key);
            if (titleText) {
                titleEl.innerHTML = titleText;
            }
        }

        // Update widget text if widget exists
        const widgetText = document.getElementById('legal-widget-text');
        if (widgetText) {
            const langLabel = currentLang === 'rus' ? 'RU' : 'EN';
            const regionLabel = currentRegion === 'rf' ? 'RU-Reg' : 'Global';
            widgetText.textContent = `${langLabel} / ${regionLabel}`;
        }
    }

    function showSelectorModal() {
        document.body.classList.add('legal-modal-open');

        const overlay = document.createElement('div');
        overlay.className = 'legal-modal-overlay';
        overlay.id = 'legal-modal-overlay';

        // Auto-detect browser defaults
        let tempLang = currentLang || (navigator.language.startsWith('ru') ? 'rus' : 'eng');
        let tempRegion = currentRegion || (navigator.language.startsWith('ru') ? 'rf' : 'intl');

        overlay.innerHTML = `
            <div class="legal-modal">
                <h2>Language & Region / Выберите язык и регион</h2>
                
                <div class="legal-modal-section">
                    <label>Language / Язык</label>
                    <div class="legal-options-grid">
                        <button type="button" class="legal-option-btn ${tempLang === 'rus' ? 'active' : ''}" id="btn-lang-rus">Русский</button>
                        <button type="button" class="legal-option-btn ${tempLang === 'eng' ? 'active' : ''}" id="btn-lang-eng">English</button>
                    </div>
                </div>

                <div class="legal-modal-section">
                    <label>Region / Регион</label>
                    <div class="legal-options-grid">
                        <button type="button" class="legal-option-btn ${tempRegion === 'rf' ? 'active' : ''}" id="btn-region-rf">Россия (RU)</button>
                        <button type="button" class="legal-option-btn ${tempRegion === 'intl' ? 'active' : ''}" id="btn-region-intl">International</button>
                    </div>
                </div>

                <button type="button" class="button primary legal-confirm-btn" id="btn-legal-confirm">
                    ${tempLang === 'rus' ? 'Подтвердить' : 'Confirm'}
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event Listeners for buttons
        const btnLangRus = document.getElementById('btn-lang-rus');
        const btnLangEng = document.getElementById('btn-lang-eng');
        const btnRegionRf = document.getElementById('btn-region-rf');
        const btnRegionIntl = document.getElementById('btn-region-intl');
        const btnConfirm = document.getElementById('btn-legal-confirm');

        function updateConfirmBtnText() {
            btnConfirm.textContent = tempLang === 'rus' ? 'Подтвердить' : 'Confirm';
        }

        btnLangRus.addEventListener('click', () => {
            tempLang = 'rus';
            btnLangRus.classList.add('active');
            btnLangEng.classList.remove('active');
            updateConfirmBtnText();
        });

        btnLangEng.addEventListener('click', () => {
            tempLang = 'eng';
            btnLangEng.classList.add('active');
            btnLangRus.classList.remove('active');
            updateConfirmBtnText();
        });

        btnRegionRf.addEventListener('click', () => {
            tempRegion = 'rf';
            btnRegionRf.classList.add('active');
            btnRegionIntl.classList.remove('active');
        });

        btnRegionIntl.addEventListener('click', () => {
            tempRegion = 'intl';
            btnRegionIntl.classList.add('active');
            btnRegionRf.classList.remove('active');
        });

        btnConfirm.addEventListener('click', () => {
            currentLang = tempLang;
            currentRegion = tempRegion;
            localStorage.setItem('oncdev_lang', currentLang);
            localStorage.setItem('oncdev_region', currentRegion);
            
            document.body.classList.remove('legal-modal-open');
            overlay.remove();
            
            updatePageContent();
        });
    }

    function createFloatingWidget() {
        const widget = document.createElement('div');
        widget.className = 'legal-switcher-widget';
        widget.id = 'legal-switcher-widget';
        
        const langLabel = currentLang === 'rus' ? 'RU' : 'EN';
        const regionLabel = currentRegion === 'rf' ? 'RU-Reg' : 'Global';

        widget.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
            <span id="legal-widget-text">${langLabel} / ${regionLabel}</span>
        `;

        widget.addEventListener('click', showSelectorModal);
        document.body.appendChild(widget);
    }

    // Run on startup
    document.addEventListener('DOMContentLoaded', () => {
        if (!currentLang || !currentRegion) {
            // Set temporary defaults for initial rendering before modal confirmation
            currentLang = navigator.language.startsWith('ru') ? 'rus' : 'eng';
            currentRegion = navigator.language.startsWith('ru') ? 'rf' : 'intl';
            updatePageContent();
            showSelectorModal();
        } else {
            updatePageContent();
        }
        createFloatingWidget();
    });
})();
