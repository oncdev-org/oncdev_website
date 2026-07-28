// Configuration API with automatic local fallback
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8021' 
    : 'https://api.oncdev.online:8021';

let currentTab = 'buy';
let currentStep = 1;
let plans = [];
let sbpDetails = { sbpPhone: '+79525908980', cardNum: '2204320380053084', receiver: 'Платон П.' };
let selectedPlanId = null;
let discountMultiplier = 1.0;
let promoApplied = false;
let selectedFile = null;

const DEFAULT_PLANS = [
    { id: '1m', name: '1 месяц (30 дней)', price: 50, oldPrice: null, badge: null, durationDays: 30 },
    { id: '3m', name: '3 месяца (90 дней)', price: 140, oldPrice: 150, badge: 'СКИДКА 7%', durationDays: 90 },
    { id: '6m', name: '6 месяцев (180 дней)', price: 270, oldPrice: 300, badge: 'ВЫГОДА 10%', durationDays: 180 },
    { id: '12m', name: '12 месяцев (365 дней)', price: 500, oldPrice: 600, badge: 'ХИТ • ВЫГОДА 17%', durationDays: 365 }
];

document.addEventListener('DOMContentLoaded', () => {
    fetchPlans();
    setupDragAndDrop();
});

function switchTab(tab) {
    if (tab === currentTab) return;
    
    const prevBtn = document.getElementById(`tab-btn-${currentTab}`);
    const nextBtn = document.getElementById(`tab-btn-${tab}`);
    const prevContent = document.getElementById(`tab-content-${currentTab}`);
    const nextContent = document.getElementById(`tab-content-${tab}`);

    if (prevBtn) prevBtn.classList.remove('active', 'bg-white', 'text-black');
    if (prevBtn) prevBtn.classList.add('text-neutral-400');
    
    if (nextBtn) nextBtn.classList.add('active', 'bg-white', 'text-black');
    if (nextBtn) nextBtn.classList.remove('text-neutral-400');

    if (prevContent) prevContent.classList.remove('active');
    if (nextContent) nextContent.classList.add('active');
    
    currentTab = tab;
}

async function fetchPlans() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        
        const response = await fetch(`${API_BASE}/api/plans`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.plans && data.plans.length > 0) {
                plans = data.plans;
                if (data.sbp) sbpDetails = data.sbp;
                renderPlans();
                return;
            }
        }
        throw new Error('Fallback to default plans');
    } catch (e) {
        plans = DEFAULT_PLANS;
        renderPlans();
    }
}

function renderPlans() {
    const container = document.getElementById('plans-container');
    if (!container) return;

    container.innerHTML = '';
    
    plans.forEach(plan => {
        const card = document.createElement('div');
        card.className = `plan-card p-6 border transition-all cursor-pointer flex flex-col justify-between ${
            selectedPlanId === plan.id 
                ? 'border-white bg-white/10' 
                : 'border-[#1c1c1c] bg-[#050505] hover:border-white/40'
        }`;
        
        card.onclick = () => selectPlan(plan.id);

        card.innerHTML = `
            <div class="space-y-2">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-white text-base font-mono uppercase">${plan.name}</span>
                    ${plan.badge ? `<span class="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">${plan.badge}</span>` : ''}
                </div>
                <div class="flex items-baseline gap-3 pt-2 font-mono">
                    ${plan.oldPrice ? `<span class="line-through text-neutral-500 text-sm">${plan.oldPrice} руб.</span>` : ''}
                    <span class="text-3xl font-extrabold text-white">${plan.price} руб.</span>
                </div>
            </div>
            <div class="pt-4 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-[#1c1c1c] mt-4">
                <span>VLESS • UNLIMITED</span>
                <span class="${selectedPlanId === plan.id ? 'text-white font-bold' : 'text-neutral-500'}">${selectedPlanId === plan.id ? 'ВЫБРАНО ✓' : 'ВЫБРАТЬ'}</span>
            </div>
        `;

        container.appendChild(card);
    });

    // Auto-select first plan if none selected
    if (!selectedPlanId && plans.length > 0) {
        selectPlan(plans[0].id);
    }
}

function selectPlan(planId) {
    selectedPlanId = planId;
    renderPlans();
    const btnStep2 = document.getElementById('btn-goto-step-2');
    if (btnStep2) btnStep2.disabled = false;
    updateOrderSummary();
}

function updateOrderSummary() {
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (!selectedPlan) return;

    const basePrice = selectedPlan.price;
    const finalPrice = Math.round(basePrice * discountMultiplier);

    const oldPriceEl = document.getElementById('summary-old-price');
    const priceEl = document.getElementById('summary-price');
    const planEl = document.getElementById('summary-plan');
    const usernameEl = document.getElementById('summary-username');

    if (priceEl) priceEl.innerText = `${finalPrice} руб.`;
    if (planEl) planEl.innerText = selectedPlan.name;
    
    if (usernameEl) {
        const usernameVal = document.getElementById('buy-username')?.value?.trim();
        if (noTgAccess) {
            usernameEl.innerText = 'Без Telegram (выдача по коду)';
        } else if (noUsername) {
            usernameEl.innerText = 'Без @username';
        } else {
            usernameEl.innerText = usernameVal ? `@${usernameVal.replace(/^@/, '')}` : '@не указан';
        }
    }

    if (discountMultiplier < 1.0 && oldPriceEl) {
        oldPriceEl.innerText = `${basePrice} руб.`;
        oldPriceEl.classList.remove('hidden');
    } else if (oldPriceEl) {
        oldPriceEl.classList.add('hidden');
    }
}

function goToStep(step) {
    if (step < 1 || step > 4) return;

    // Validate step transition
    if (step === 3) {
        const usernameInput = document.getElementById('buy-username');
        if (!noUsername && !noTgAccess && (!usernameInput || !usernameInput.value.trim())) {
            showToast('Укажите ваш Telegram юзернейм!');
            return;
        }
    }

    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) targetStep.classList.add('active');

    // Update progress dots
    document.querySelectorAll('.step-dot').forEach(dot => {
        const dStep = parseInt(dot.getAttribute('data-step'));
        if (dStep === step) {
            dot.classList.add('active');
            dot.classList.remove('completed');
        } else if (dStep < step) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });

    currentStep = step;
    updateOrderSummary();
}

function validateStep2() {
    const btn = document.getElementById('btn-goto-step-3');
    const input = document.getElementById('buy-username');
    if (btn) {
        btn.disabled = !noUsername && !noTgAccess && (!input || !input.value.trim());
    }
    updateOrderSummary();
}

function toggleUsernameField(checkbox) {
    const input = document.getElementById('buy-username');
    if (checkbox.checked) {
        if (input) { input.value = ''; input.disabled = true; }
        const noTg = document.getElementById('no-tg-access-checkbox');
        if (noTg) noTg.checked = false;
        noTgAccess = false;
        noUsername = true;
    } else {
        if (input) input.disabled = false;
        noUsername = false;
    }
    validateStep2();
}

function toggleNoTgAccessField(checkbox) {
    const warning = document.getElementById('no-tg-warning');
    const input = document.getElementById('buy-username');
    if (checkbox.checked) {
        noTgAccess = true;
        if (warning) warning.classList.remove('hidden');
        if (input) { input.value = ''; input.disabled = true; }
        const noUser = document.getElementById('no-username-checkbox');
        if (noUser) noUser.checked = false;
        noUsername = false;
    } else {
        noTgAccess = false;
        if (warning) warning.classList.add('hidden');
        if (input) input.disabled = false;
    }
    validateStep2();
}

function applyPromoCode() {
    const input = document.getElementById('buy-promo');
    const status = document.getElementById('promo-status');
    if (!input || !status) return;

    const code = input.value.trim().toUpperCase();
    if (code === 'ONCDEV' || code === 'POLIMER' || code === 'VOBI') {
        discountMultiplier = 0.9;
        promoApplied = true;
        status.className = 'text-xs font-mono text-emerald-400 font-bold';
        status.innerText = '✓ Промокод применен! Скидка 10%';
    } else {
        discountMultiplier = 1.0;
        promoApplied = false;
        status.className = 'text-xs font-mono text-red-400';
        status.innerText = '✕ Недействительный промокод';
    }
    updateOrderSummary();
}

function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        navigator.clipboard.writeText(el.innerText || el.textContent);
        showToast('Текст скопирован в буфер обмена!');
    }
}

function triggerFileInput() {
    const input = document.getElementById('receipt-file');
    if (input) input.click();
}

function setupDragAndDrop() {
    const dropzone = document.getElementById('dropzone');
    if (!dropzone) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropzone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
        handleFileSelect({ target: { files: files } });
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    selectedFile = files[0];
    const previewContainer = document.getElementById('file-preview-container');
    const filenameEl = document.getElementById('preview-filename');
    const filesizeEl = document.getElementById('preview-filesize');
    const btnSubmit = document.getElementById('btn-submit-order');

    if (filenameEl) filenameEl.innerText = selectedFile.name;
    if (filesizeEl) filesizeEl.innerText = `(${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`;
    if (previewContainer) previewContainer.classList.remove('hidden');
    if (btnSubmit) btnSubmit.disabled = false;
}

function removeSelectedFile() {
    selectedFile = null;
    const previewContainer = document.getElementById('file-preview-container');
    const btnSubmit = document.getElementById('btn-submit-order');
    if (previewContainer) previewContainer.classList.add('hidden');
    if (btnSubmit) btnSubmit.disabled = true;
}

function submitOrder() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const savedCodeEl = document.getElementById('success-saved-code');
    if (savedCodeEl) savedCodeEl.innerText = code;

    const noTgNotice = document.getElementById('no-tg-success-notice');
    if (noTgNotice && noTgAccess) noTgNotice.classList.remove('hidden');

    goToStep(4);
}

function resetForm() {
    selectedPlanId = null;
    selectedFile = null;
    discountMultiplier = 1.0;
    promoApplied = false;
    noUsername = false;
    noTgAccess = false;
    
    const inputUser = document.getElementById('buy-username');
    if (inputUser) { inputUser.value = ''; inputUser.disabled = false; }
    
    const noUserChk = document.getElementById('no-username-checkbox');
    if (noUserChk) noUserChk.checked = false;

    const noTgChk = document.getElementById('no-tg-access-checkbox');
    if (noTgChk) noTgChk.checked = false;

    removeSelectedFile();
    goToStep(1);
}

function goToCheckOrderTab() {
    switchTab('check');
}

function handleCheckOrder(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('check-order-code');
    const code = input ? input.value.trim().toUpperCase() : '';
    if (!code) return;

    const loading = document.getElementById('check-loading');
    const results = document.getElementById('check-results');
    const approved = document.getElementById('result-approved');

    if (loading) loading.classList.remove('hidden');
    if (results) results.classList.add('hidden');

    setTimeout(() => {
        if (loading) loading.classList.add('hidden');
        if (results) results.classList.remove('hidden');
        if (approved) approved.classList.remove('hidden');
        
        const link = document.getElementById('vless-link');
        if (link) link.innerText = `vless://oncdev-sub-${code.toLowerCase()}@node1.oncdev.ru:443?security=reality&type=tcp#oncdev-VPN`;
    }, 800);
}

function copyVlessLink() {
    copyText('vless-link');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.innerText = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}
