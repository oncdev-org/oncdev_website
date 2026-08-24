(function() {
    // Check if consent has already been accepted
    if (localStorage.getItem('oncdev_consent_accepted_v2') === 'true') {
        return;
    }

    const isRu = navigator.language.startsWith('ru');
    const texts = {
        title: isRu ? "Согласие с документами" : "Consent to Legal Documents",
        description: isRu ? 
            "Для использования ресурсов и сервисов oncdev вам необходимо ознакомиться и согласиться со следующими условиями:" :
            "To use the resources and services of oncdev, you must read and agree to the following terms:",
        tos: isRu ? "Я принимаю <a href='https://oncdev.net/wiki/tos/' target='_blank'>Условия использования</a>" : "I accept the <a href='https://oncdev.net/wiki/tos/' target='_blank'>Terms of Service</a>",
        refund: isRu ? "Я принимаю <a href='https://oncdev.net/wiki/refund/' target='_blank'>Публичную оферту и правила возврата</a>" : "I accept the <a href='https://oncdev.net/wiki/refund/' target='_blank'>Refund Policy</a>",
        privacy: isRu ? "Я даю согласие на обработку персональных данных в соответствии с <a href='https://oncdev.net/wiki/privacy/' target='_blank'>Политикой конфиденциальности</a>" : "I agree to the processing of personal data in accordance with the <a href='https://oncdev.net/wiki/privacy/' target='_blank'>Privacy Policy</a>",
        confirm: isRu ? "Подтвердить и продолжить" : "Confirm and Continue"
    };

    const css = `
        .oncdev-consent-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(4, 5, 8, 0.96);
            backdrop-filter: blur(20px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', "Segoe UI", system-ui, sans-serif;
            color: #f5f7fb;
        }
        .oncdev-consent-card {
            background: #0d1018;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            padding: 40px;
            width: 90%;
            max-width: 520px;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
            text-align: left;
        }
        .oncdev-consent-card h2 {
            font-size: 1.6rem;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #2dd4bf, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .oncdev-consent-card p {
            color: #a8b0c2;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 24px;
        }
        .oncdev-consent-checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 30px;
        }
        .oncdev-consent-checkbox-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            cursor: pointer;
            user-select: none;
        }
        .oncdev-consent-checkbox-item input[type="checkbox"] {
            margin-top: 4px;
            width: 18px;
            height: 18px;
            accent-color: #2dd4bf;
            cursor: pointer;
            flex-shrink: 0;
        }
        .oncdev-consent-checkbox-item label {
            color: #a8b0c2;
            font-size: 0.9rem;
            line-height: 1.4;
            cursor: pointer;
        }
        .oncdev-consent-checkbox-item label a {
            color: #2dd4bf;
            text-decoration: underline;
            font-weight: 600;
            transition: color 0.2s;
        }
        .oncdev-consent-checkbox-item label a:hover {
            color: #8b5cf6;
        }
        .oncdev-consent-btn {
            width: 100%;
            min-height: 48px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #70798f;
            font-weight: 750;
            font-size: 1rem;
            cursor: not-allowed;
            transition: all 0.25s ease;
        }
        .oncdev-consent-btn.active {
            color: #ffffff;
            cursor: pointer;
            background: linear-gradient(135deg, rgba(45, 212, 191, 0.3), rgba(139, 92, 246, 0.3));
            border-color: #2dd4bf;
            box-shadow: 0 0 16px rgba(45, 212, 191, 0.25);
        }
        .oncdev-consent-btn.active:hover {
            transform: translateY(-2px);
        }
        body.oncdev-consent-active {
            overflow: hidden !important;
        }
    `;

    function init() {
        // Inject CSS
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        // Create Modal
        const overlay = document.createElement('div');
        overlay.className = 'oncdev-consent-overlay';
        overlay.innerHTML = `
            <div class="oncdev-consent-card">
                <h2>${texts.title}</h2>
                <p>${texts.description}</p>
                <div class="oncdev-consent-checkbox-group">
                    <div class="oncdev-consent-checkbox-item">
                        <input type="checkbox" id="oncdev-chk-tos">
                        <label for="oncdev-chk-tos">${texts.tos}</label>
                    </div>
                    <div class="oncdev-consent-checkbox-item">
                        <input type="checkbox" id="oncdev-chk-refund">
                        <label for="oncdev-chk-refund">${texts.refund}</label>
                    </div>
                    <div class="oncdev-consent-checkbox-item">
                        <input type="checkbox" id="oncdev-chk-privacy">
                        <label for="oncdev-chk-privacy">${texts.privacy}</label>
                    </div>
                </div>
                <button type="button" class="oncdev-consent-btn" id="oncdev-btn-confirm" disabled>${texts.confirm}</button>
            </div>
        `;

        document.body.classList.add('oncdev-consent-active');
        document.body.appendChild(overlay);

        const chkTos = document.getElementById('oncdev-chk-tos');
        const chkRefund = document.getElementById('oncdev-chk-refund');
        const chkPrivacy = document.getElementById('oncdev-chk-privacy');
        const btnConfirm = document.getElementById('oncdev-btn-confirm');

        function checkValidity() {
            if (chkTos.checked && chkRefund.checked && chkPrivacy.checked) {
                btnConfirm.disabled = false;
                btnConfirm.classList.add('active');
            } else {
                btnConfirm.disabled = true;
                btnConfirm.classList.remove('active');
            }
        }

        chkTos.addEventListener('change', checkValidity);
        chkRefund.addEventListener('change', checkValidity);
        chkPrivacy.addEventListener('change', checkValidity);

        btnConfirm.addEventListener('click', () => {
            if (!btnConfirm.disabled) {
                localStorage.setItem('oncdev_consent_accepted_v2', 'true');
                document.body.classList.remove('oncdev-consent-active');
                overlay.remove();
            }
        });
    }

    // Wait for body to be ready
    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
