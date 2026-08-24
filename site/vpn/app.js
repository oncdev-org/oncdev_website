// Конфигурация API: для тестов локально, для продакшена - домен с HTTPS на VPS
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8021' 
    : 'https://api.oncdev.online:8021'; // Используем поддомен с HTTPS на порту 8021

let currentTab = 'buy';

let currentStep = 1;
let plans = [];
let sbpDetails = {};
let selectedPlanId = null;
let discountMultiplier = 1.0;
let promoApplied = false;
let selectedFile = null;

// On Page Load
document.addEventListener('DOMContentLoaded', () => {
    fetchPlans();
    setupDragAndDrop();

    // Interactive background blob (matched with OnCube design)
    const interactiveBlob = document.getElementById('interactive-blob');
    if (interactiveBlob) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Show blob on first movement
            interactiveBlob.style.opacity = '1';
            
            // Move blob with delay effect
            interactiveBlob.style.left = `${x}px`;
            interactiveBlob.style.top = `${y}px`;
        });

        document.addEventListener('mouseleave', () => {
            interactiveBlob.style.opacity = '0';
        });
    }
});

// Tab Navigation
function switchTab(tab) {
    if (tab === currentTab) return;
    
    // Deactivate current tab
    document.getElementById(`tab-btn-${currentTab}`).classList.remove('active');
    document.getElementById(`tab-content-${currentTab}`).classList.remove('active');
    
    // Activate new tab
    currentTab = tab;
    document.getElementById(`tab-btn-${currentTab}`).classList.add('active');
    document.getElementById(`tab-content-${currentTab}`).classList.add('active');
}

// Fetch plans and payment details from API
async function fetchPlans() {
    try {
        const response = await fetch(`${API_BASE}/api/plans`);
        if (!response.ok) throw new Error('Ошибка сети при получении тарифов');
        
        const data = await response.json();
        plans = data.plans;
        sbpDetails = data.sbp_details;
        
        renderPlans();
        renderRequisites();
    } catch (error) {
        console.error('Failed to fetch plans:', error);
        const container = document.getElementById('plans-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>Не удалось загрузить тарифные планы. Пожалуйста, обновите страницу.</span>
                </div>
            `;
        }
    }
}

// Render plans dynamically
function renderPlans() {
    const container = document.getElementById('plans-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    plans.forEach(plan => {
        const oldPrice = promoApplied ? plan.price : null;
        const currentPrice = promoApplied ? Math.floor(plan.price * discountMultiplier) : plan.price;
        
        const card = document.createElement('div');
        card.className = `plan-card ${selectedPlanId === plan.id ? 'selected' : ''}`;
        card.setAttribute('id', `plan-${plan.id}`);
        card.onclick = () => selectPlan(plan.id);
        
        card.innerHTML = `
            <div class="plan-name">${plan.name}</div>
            <div class="plan-price-box">
                ${oldPrice ? `<span class="plan-price-old">${oldPrice}₽</span>` : ''}
                <span class="plan-price">${currentPrice}₽</span>
            </div>
            <div class="plan-period">${plan.days} дней доступа</div>
        `;
        container.appendChild(card);
    });
    
    validateStep1();
}

// Render requisites dynamically
function renderRequisites() {
    if (!sbpDetails) return;
    
    // Map text values
    const phoneEl = document.getElementById('req-phone');
    const cardEl = document.getElementById('req-card');
    const receiverSbp = document.getElementById('req-receiver-sbp');
    const receiverCard = document.getElementById('req-receiver-card');
    
    if (phoneEl) phoneEl.textContent = sbpDetails.sbp_phone;
    if (cardEl) cardEl.textContent = sbpDetails.card_number;
    if (receiverSbp) receiverSbp.textContent = sbpDetails.receiver;
    if (receiverCard) receiverCard.textContent = sbpDetails.receiver;
}

// Select plan handler
function selectPlan(planId) {
    // Deselect previous
    if (selectedPlanId) {
        const prevCard = document.getElementById(`plan-${selectedPlanId}`);
        if (prevCard) prevCard.classList.remove('selected');
    }
    
    // Select new
    selectedPlanId = planId;
    const card = document.getElementById(`plan-${planId}`);
    if (card) card.classList.add('selected');
    
    validateStep1();
}

// Validations for step progression
function validateStep1() {
    const btn = document.getElementById('btn-goto-step-2');
    if (btn) btn.disabled = (selectedPlanId === null);
}

function validateStep2() {
    const usernameInput = document.getElementById('buy-username');
    const btn = document.getElementById('btn-goto-step-3');
    const checkbox = document.getElementById('no-username-checkbox');
    const noTgCheckbox = document.getElementById('no-tg-access-checkbox');
    if (!usernameInput || !btn) return;
    
    if (noTgCheckbox && noTgCheckbox.checked) {
        btn.disabled = false;
        return;
    }
    
    let val = usernameInput.value.trim();
    if (checkbox && checkbox.checked) {
        // Strip non-digit characters in real-time
        const cleanVal = val.replace(/\D/g, '');
        if (val !== cleanVal) {
            usernameInput.value = cleanVal;
            val = cleanVal;
        }
        btn.disabled = (val.length < 5);
    } else {
        btn.disabled = (val.length < 3);
    }
}

function toggleUsernameField(checkbox) {
    const usernameInput = document.getElementById('buy-username');
    const prefix = document.getElementById('username-prefix');
    const hint = document.getElementById('username-hint');
    const noTgCheckbox = document.getElementById('no-tg-access-checkbox');
    if (!usernameInput || !prefix || !hint) return;
    
    if (checkbox.checked) {
        if (noTgCheckbox) noTgCheckbox.checked = false;
        const noTgWarning = document.getElementById('no-tg-warning');
        if (noTgWarning) noTgWarning.classList.add('hidden');
        usernameInput.disabled = false;
        prefix.textContent = 'ID';
        usernameInput.placeholder = '5123456789';
        usernameInput.value = '';
        hint.innerHTML = 'Укажите ваш цифровой Telegram ID. Его можно узнать в ботах <a href="https://t.me/userinfobot" target="_blank" style="color: #2dd4bf; text-decoration: underline;">@userinfobot</a> или <a href="https://t.me/raw_data_bot" target="_blank" style="color: #2dd4bf; text-decoration: underline;">@raw_data_bot</a>.';
    } else {
        prefix.textContent = '@';
        usernameInput.placeholder = 'vobimngr';
        usernameInput.value = '';
        hint.textContent = 'Никнейм должен быть указан без ошибок — по нему привязывается VPN.';
    }
    validateStep2();
}

function toggleNoTgAccessField(checkbox) {
    const usernameInput = document.getElementById('buy-username');
    const noUsernameCheckbox = document.getElementById('no-username-checkbox');
    const prefix = document.getElementById('username-prefix');
    const hint = document.getElementById('username-hint');
    const noTgWarning = document.getElementById('no-tg-warning');
    if (!usernameInput || !prefix || !hint) return;

    if (checkbox.checked) {
        if (noUsernameCheckbox) noUsernameCheckbox.checked = false;
        usernameInput.disabled = true;
        usernameInput.value = '';
        prefix.textContent = '@';
        usernameInput.placeholder = 'Временный аккаунт';
        hint.textContent = 'Подписка будет оформлена как временный аккаунт. Вы привяжете её в Telegram-боте позже.';
        if (noTgWarning) noTgWarning.classList.remove('hidden');
    } else {
        usernameInput.disabled = false;
        usernameInput.placeholder = 'vobimngr';
        hint.textContent = 'Никнейм должен быть указан без ошибок — по нему привязывается VPN.';
        if (noTgWarning) noTgWarning.classList.add('hidden');
    }
    validateStep2();
}

// Validation for Step 3
function validateStep3() {
    const btn = document.getElementById('btn-submit-order');
    if (btn) btn.disabled = (selectedFile === null);
}

// Step Navigation
function goToStep(step) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    
    // Set dot state
    const dots = document.querySelectorAll('.step-dot');
    
    // Mark previous as completed
    if (step > currentStep) {
        for (let i = currentStep; i < step; i++) {
            dots[i-1].classList.remove('active');
            dots[i-1].classList.add('completed');
        }
    } else {
        // Going backward
        for (let i = step; i <= currentStep; i++) {
            dots[i-1].classList.remove('completed');
            dots[i-1].classList.remove('active');
        }
    }
    
    // Activate new dot
    dots[step-1].classList.add('active');
    
    // Calculate progress line width
    const progressLine = document.getElementById('progress-line');
    if (progressLine) {
        const percentage = ((step - 1) / (dots.length - 1)) * 100;
        progressLine.style.setProperty('--progress-width', `${percentage}%`);
        
        // Update line width directly via inline css
        progressLine.style.background = `linear-gradient(to right, #6366f1 0%, #6366f1 ${percentage}%, rgba(255,255,255,0.06) ${percentage}%)`;
    }
    
    // Update step
    currentStep = step;
    
    // Prepare data for Step 3 summary if entering it
    if (step === 3) {
        prepareStep3Summary();
    }
    
    // Show new step
    document.getElementById(`step-${currentStep}`).classList.add('active');
}

// Apply Promo Code
function applyPromoCode() {
    const input = document.getElementById('buy-promo');
    const feedback = document.getElementById('promo-status');
    if (!input || !feedback) return;
    
    const code = input.value.trim().toLowerCase();
    if (!code) {
        feedback.className = 'promo-feedback error';
        feedback.textContent = 'Пожалуйста, введите промокод';
        return;
    }
    
    if (code === 'матьебал') {
        discountMultiplier = 0.8;
        promoApplied = true;
        feedback.className = 'promo-feedback success';
        feedback.textContent = '✅ Промокод успешно применен! Скидка 20% добавлена.';
        
        // Re-render plans with new pricing
        renderPlans();
    } else {
        feedback.className = 'promo-feedback error';
        feedback.textContent = '❌ Неверный или истекший промокод';
    }
}

// Prepare Step 3 Order Summary
function prepareStep3Summary() {
    const usernameInput = document.getElementById('buy-username');
    const checkbox = document.getElementById('no-username-checkbox');
    let username = usernameInput.value.trim();
    
    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;
    
    const originalPrice = plan.price;
    const finalPrice = promoApplied ? Math.floor(originalPrice * discountMultiplier) : originalPrice;
    
    const oldPriceEl = document.getElementById('summary-old-price');
    const priceEl = document.getElementById('summary-price');
    const planEl = document.getElementById('summary-plan');
    const usernameEl = document.getElementById('summary-username');
    
    if (promoApplied) {
        oldPriceEl.textContent = `${originalPrice} руб.`;
        oldPriceEl.classList.remove('hidden');
    } else {
        oldPriceEl.classList.add('hidden');
    }
    
    priceEl.textContent = `${finalPrice} руб.`;
    planEl.textContent = `${plan.name} (${plan.days} дней)`;
    
    const noTgCheckbox = document.getElementById('no-tg-access-checkbox');
    if (noTgCheckbox && noTgCheckbox.checked) {
        usernameEl.textContent = 'Временный аккаунт (привязка в боте)';
    } else if (checkbox && checkbox.checked) {
        usernameEl.textContent = `Telegram ID: ${username}`;
    } else {
        usernameEl.textContent = `@${username.replace(/^@/, '')}`;
    }
}

// Drag & Drop / File Upload / Clipboard Paste Logic
function setupDragAndDrop() {
    // Global Clipboard Paste Listener (Ctrl+V / Paste)
    window.addEventListener('paste', (e) => {
        // If user is actively typing in a text field without clipboard files, allow default text paste
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        const activeType = document.activeElement ? document.activeElement.type : '';
        const isTextInput = activeTag === 'TEXTAREA' || (activeTag === 'INPUT' && activeType !== 'file' && activeType !== 'checkbox' && activeType !== 'radio');

        const clipboardFiles = e.clipboardData ? e.clipboardData.files : null;
        const clipboardItems = e.clipboardData ? e.clipboardData.items : null;

        let fileToProcess = null;

        if (clipboardFiles && clipboardFiles.length > 0) {
            fileToProcess = clipboardFiles[0];
        } else if (clipboardItems && clipboardItems.length > 0) {
            for (let i = 0; i < clipboardItems.length; i++) {
                const item = clipboardItems[i];
                if (item.kind === 'file' || item.type.startsWith('image/') || item.type === 'application/pdf') {
                    const blob = item.getAsFile();
                    if (blob) {
                        const ext = (blob.type && blob.type.includes('/')) ? blob.type.split('/')[1] : 'png';
                        fileToProcess = new File([blob], `screenshot_${Date.now()}.${ext}`, {
                            type: blob.type || 'image/png',
                            lastModified: Date.now()
                        });
                        break;
                    }
                }
            }
        }

        if (fileToProcess) {
            // If user is currently on another step, switch to step 3
            if (currentTab === 'buy' && currentStep < 3) {
                if (!selectedPlanId && plans.length > 0) {
                    selectPlan(plans[0].id);
                }
                goToStep(3);
            }
            processFile(fileToProcess);
            showToast('Скриншот успешно вставлен из буфера обмена!');
            e.preventDefault();
        }
    });

    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('dragover');
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length > 0) {
                processFile(dt.files[0]);
            }
        }, false);
    }
}

function triggerFileInput() {
    const fileInput = document.getElementById('receipt-file');
    if (fileInput) fileInput.click();
}

// Drag over dropzone
function handleDragOver(e) {
    e.preventDefault();
    const dropzone = document.getElementById('dropzone');
    if (dropzone) dropzone.classList.add('dragover');
}

// Drag leave dropzone
function handleDragLeave(e) {
    e.preventDefault();
    const dropzone = document.getElementById('dropzone');
    if (dropzone) dropzone.classList.remove('dragover');
}

// Drop file
function handleDrop(e) {
    e.preventDefault();
    const dropzone = document.getElementById('dropzone');
    if (dropzone) dropzone.classList.remove('dragover');
    
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
    }
}

// File input select
function handleFileSelect(e) {
    if (e.target && e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
    }
}

// Compress image using HTML5 Canvas helper
function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.85) {
    return new Promise((resolve) => {
        // Only attempt canvas compression on raster images
        const fileType = (file.type || '').toLowerCase();
        if (!fileType.startsWith('image/') || fileType === 'image/svg+xml' || fileType === 'image/gif') {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                
                if (!width || !height) {
                    return resolve(file);
                }

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob && blob.size < file.size) {
                        const originalName = file.name || `screenshot_${Date.now()}.png`;
                        const newName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";
                        const compressedFile = new File([blob], newName, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        resolve(file);
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}

// Validate and show preview of image / file
function processFile(file) {
    if (!file) return;

    const fileName = file.name || `screenshot_${Date.now()}.png`;
    const fileExt = fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '';
    const fileType = (file.type || '').toLowerCase();
    
    const isPdf = fileType === 'application/pdf' || fileExt === 'pdf';
    const isImage = fileType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'heic', 'heif', 'avif'].includes(fileExt);
    
    if (!isPdf && !isImage) {
        showToast('Пожалуйста, выберите файл изображения (PNG, JPG, WEBP и др.) или PDF', 'error');
        return;
    }
    
    // Validate size (< 15MB)
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
        showToast('Файл слишком большой. Максимальный размер 15 МБ', 'error');
        return;
    }
    
    if (isPdf) {
        selectedFile = file;
        
        const fileIcon = document.querySelector('.file-preview .file-icon');
        if (fileIcon) {
            fileIcon.className = 'fa-regular fa-file-pdf file-icon';
            fileIcon.style.color = '#ef4444';
        }
        
        // Update preview
        const fnEl = document.getElementById('preview-filename');
        const fsEl = document.getElementById('preview-filesize');
        if (fnEl) fnEl.textContent = fileName;
        if (fsEl) fsEl.textContent = formatBytes(file.size);
        
        const dropzone = document.getElementById('dropzone');
        const previewContainer = document.getElementById('file-preview-container');
        if (dropzone) dropzone.classList.add('hidden');
        if (previewContainer) previewContainer.classList.remove('hidden');
        
        validateStep3();
    } else {
        const dropzone = document.getElementById('dropzone');
        const uploadText = dropzone ? dropzone.querySelector('.upload-text') : null;
        const originalText = uploadText ? uploadText.textContent : 'Нажмите или перетащите скриншот/PDF сюда';
        if (uploadText) {
            uploadText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Обработка...';
        }
        
        compressImage(file).then(compressedFile => {
            selectedFile = compressedFile;
            
            const fileIcon = document.querySelector('.file-preview .file-icon');
            if (fileIcon) {
                fileIcon.className = 'fa-regular fa-image file-icon';
                fileIcon.style.color = '#2dd4bf';
            }
            
            // Update preview
            const fnEl = document.getElementById('preview-filename');
            const fsEl = document.getElementById('preview-filesize');
            if (fnEl) fnEl.textContent = compressedFile.name || fileName;
            if (fsEl) fsEl.textContent = formatBytes(compressedFile.size) + (compressedFile.size < file.size ? ' (оптимизировано)' : '');
            
            const previewContainer = document.getElementById('file-preview-container');
            if (dropzone) dropzone.classList.add('hidden');
            if (previewContainer) previewContainer.classList.remove('hidden');
            
            if (uploadText) uploadText.textContent = originalText;
            validateStep3();
        }).catch(err => {
            console.warn('Compression bypassed, using original file:', err);
            selectedFile = file;
            
            const fileIcon = document.querySelector('.file-preview .file-icon');
            if (fileIcon) {
                fileIcon.className = 'fa-regular fa-image file-icon';
                fileIcon.style.color = '#2dd4bf';
            }
            
            // Update preview
            const fnEl = document.getElementById('preview-filename');
            const fsEl = document.getElementById('preview-filesize');
            if (fnEl) fnEl.textContent = fileName;
            if (fsEl) fsEl.textContent = formatBytes(file.size);
            
            const previewContainer = document.getElementById('file-preview-container');
            if (dropzone) dropzone.classList.add('hidden');
            if (previewContainer) previewContainer.classList.remove('hidden');
            
            if (uploadText) uploadText.textContent = originalText;
            validateStep3();
        });
    }
}

// Remove uploaded image preview
function removeSelectedFile() {
    selectedFile = null;
    const fileInput = document.getElementById('receipt-file');
    if (fileInput) fileInput.value = '';
    
    const previewContainer = document.getElementById('file-preview-container');
    const dropzone = document.getElementById('dropzone');
    if (previewContainer) previewContainer.classList.add('hidden');
    if (dropzone) dropzone.classList.remove('hidden');
    
    const fileIcon = document.querySelector('.file-preview .file-icon');
    if (fileIcon) {
        fileIcon.className = 'fa-regular fa-image file-icon';
        fileIcon.style.color = '';
    }
    
    validateStep3();
}

// Submit payment order
async function submitOrder() {
    if (!selectedPlanId || !selectedFile) return;
    
    const usernameInput = document.getElementById('buy-username');
    const checkbox = document.getElementById('no-username-checkbox');
    const noTgCheckbox = document.getElementById('no-tg-access-checkbox');
    let username = usernameInput.value.trim();
    if (noTgCheckbox && noTgCheckbox.checked) {
        username = 'tmp_pending';
    } else if (checkbox && checkbox.checked) {
        if (/^\d+$/.test(username)) {
            username = 'id' + username;
        }
    } else {
        username = username.replace(/^@/, '');
    }
    
    const promoCode = document.getElementById('buy-promo').value.trim();
    
    const btn = document.getElementById('btn-submit-order');
    const btnText = document.getElementById('submit-btn-text');
    const errorAlert = document.getElementById('submit-error');
    const errorText = document.getElementById('error-message-text');
    
    // Loading state
    btn.disabled = true;
    btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Отправка...';
    errorAlert.classList.add('hidden');
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('plan_id', selectedPlanId);
    formData.append('promo_code', promoCode);
    formData.append('screenshot', selectedFile);
    
    try {
        const response = await fetch(`${API_BASE}/api/submit-payment`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Setup step 4 (Success page)
            document.getElementById('success-saved-code').textContent = data.payment_code;
            const noTgNotice = document.getElementById('no-tg-success-notice');
            if (noTgNotice) {
                if (noTgCheckbox && noTgCheckbox.checked) {
                    noTgNotice.classList.remove('hidden');
                } else {
                    noTgNotice.classList.add('hidden');
                }
            }
            goToStep(4);
        } else {
            throw new Error(data.error || 'Неизвестная ошибка на сервере');
        }
    } catch (error) {
        console.error('Submit order error:', error);
        errorText.textContent = error.message || 'Ошибка отправки. Пожалуйста, проверьте интернет-соединение.';
        errorAlert.classList.remove('hidden');
        
        // Reset button
        btn.disabled = false;
        btnText.textContent = 'Отправить квитанцию';
    }
}

// Reset form wizard
function resetForm() {
    // Reset wizard variables
    selectedPlanId = null;
    selectedFile = null;
    promoApplied = false;
    discountMultiplier = 1.0;
    
    const promoInput = document.getElementById('buy-promo');
    if (promoInput) promoInput.value = '';
    
    const promoStatus = document.getElementById('promo-status');
    if (promoStatus) promoStatus.textContent = '';
    
    const usernameInput = document.getElementById('buy-username');
    if (usernameInput) usernameInput.value = '';
    
    removeSelectedFile();
    
    // Reset steps
    currentStep = 1;
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index === 0) dot.classList.add('active');
    });
    
    const progressLine = document.getElementById('progress-line');
    if (progressLine) progressLine.style.background = 'rgba(255, 255, 255, 0.06)';
    
    document.getElementById('step-4').classList.remove('active');
    document.getElementById('step-1').classList.add('active');
    
    renderPlans();
}

// Trigger check order action from success screen
function goToCheckOrderTab() {
    const code = document.getElementById('success-saved-code').textContent;
    document.getElementById('check-order-code').value = code;
    resetForm();
    switchTab('check');
    
    // Submit query immediately
    document.getElementById('check-order-form').dispatchEvent(new Event('submit'));
}

// Request status of the purchase by unique order code
async function handleCheckOrder(event) {
    event.preventDefault();
    
    const codeInput = document.getElementById('check-order-code');
    if (!codeInput) return;
    
    const code = codeInput.value.trim().toUpperCase();
    if (!code) return;
    
    const loading = document.getElementById('check-loading');
    const results = document.getElementById('check-results');
    
    const resApproved = document.getElementById('result-approved');
    const resPending = document.getElementById('result-pending');
    const resDeclined = document.getElementById('result-declined');
    
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    resApproved.classList.add('hidden');
    resPending.classList.add('hidden');
    resDeclined.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE}/api/check-order?code=${encodeURIComponent(code)}`);
        const data = await response.json();
        
        loading.classList.add('hidden');
        results.classList.remove('hidden');
        
        if (!response.ok || !data.found) {
            showToast(data.error || 'Заказ не найден. Проверьте правильность кода.', 'error');
            return;
        }
        
        if (data.status === 'approved') {
            if (data.tg_username) {
                document.getElementById('res-username').textContent = `${data.tg_username} (привязан)`;
            } else if (data.username.startsWith('tmp_')) {
                document.getElementById('res-username').textContent = 'Временный аккаунт (привязка в боте @oncdevbot)';
            } else if (data.username.startsWith('id') && /^\d+$/.test(data.username.substring(2))) {
                document.getElementById('res-username').textContent = `Telegram ID: ${data.username.substring(2)}`;
            } else {
                document.getElementById('res-username').textContent = `@${data.username}`;
            }
            document.getElementById('res-plan').textContent = data.plan_name;
            
            const vlessLink = document.getElementById('vless-link');
            if (data.subscription_url) {
                vlessLink.textContent = data.subscription_url;
                vlessLink.style.fontStyle = 'normal';
            } else {
                vlessLink.textContent = 'Ключ не сгенерирован. Напишите в поддержку.';
                vlessLink.style.fontStyle = 'italic';
            }
            resApproved.classList.remove('hidden');
        } else if (data.status === 'pending') {
            document.getElementById('pending-code').textContent = code;
            if (data.tg_username) {
                document.getElementById('pending-username').textContent = `${data.tg_username} (привязан)`;
            } else if (data.username.startsWith('tmp_')) {
                document.getElementById('pending-username').textContent = 'Временный аккаунт (привязка в боте @oncdevbot)';
            } else if (data.username.startsWith('id') && /^\d+$/.test(data.username.substring(2))) {
                document.getElementById('pending-username').textContent = `Telegram ID: ${data.username.substring(2)}`;
            } else {
                document.getElementById('pending-username').textContent = `@${data.username}`;
            }
            resPending.classList.remove('hidden');
        } else if (data.status === 'declined') {
            document.getElementById('declined-code').textContent = code;
            
            const reasonEl = document.getElementById('declined-reason');
            const reasonWrapper = document.getElementById('decline-reason-wrapper');
            if (data.decline_reason) {
                reasonEl.textContent = data.decline_reason;
                reasonWrapper.classList.remove('hidden');
            } else {
                reasonWrapper.classList.add('hidden');
            }
            resDeclined.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error checking order:', error);
        loading.classList.add('hidden');
        showToast('Не удалось проверить статус заказа. Попробуйте позже.', 'error');
    }
}

// Copy VLESS link helper
function copyVlessLink() {
    const linkEl = document.getElementById('vless-link');
    if (!linkEl) return;
    
    const text = linkEl.textContent;
    if (text && !text.startsWith('Ключ не')) {
        navigator.clipboard.writeText(text).then(() => {
            const icon = document.getElementById('copy-icon');
            icon.className = 'fa-solid fa-check';
            icon.style.color = '#10b981';
            
            showToast('VLESS ссылка успешно скопирована!');
            
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
                icon.style.color = '';
            }, 2000);
        });
    }
}

// Copy text helper
function copyText(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let text = el.textContent || el.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Текст скопирован в буфер обмена');
    });
}

// Helper Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    
    if (type === 'error') {
        toastIcon.className = 'fa-solid fa-circle-exclamation';
        toastIcon.style.color = '#ef4444';
        toast.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    } else {
        toastIcon.className = 'fa-solid fa-circle-check';
        toastIcon.style.color = '#10b981';
        toast.style.borderColor = '';
    }
    
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Utilities: Bytes formatting
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
