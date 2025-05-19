// Show/hide password toggle
document.addEventListener('DOMContentLoaded', function () {
    // Add show/hide password toggle
    const pwdInput = document.getElementById('pwd');
    if (pwdInput) {
        const toggle = document.createElement('span');
        toggle.title = 'Show/Hide Password';
        toggle.style.cursor = 'pointer';
        toggle.style.marginLeft = '8px';
        toggle.style.userSelect = 'none';
        toggle.innerHTML = `
            <svg id="eye-open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="vertical-align:middle;" viewBox="0 0 24 24" fill="none" stroke="#636e72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2"/></svg>
            <svg id="eye-closed" xmlns="http://www.w3.org/2000/svg" width="22" height="22" style="vertical-align:middle;display:none;" viewBox="0 0 24 24" fill="none" stroke="#636e72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-10.74-7.5a10.96 10.96 0 0 1 4.06-5.06"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.83 3.16-2.03"/><path d="M14.47 14.47A3.5 3.5 0 0 1 12 8.5c-.62 0-1.2.18-1.69.48"/></svg>
        `;
        pwdInput.parentNode.appendChild(toggle);

        const eyeOpen = toggle.querySelector('#eye-open');
        const eyeClosed = toggle.querySelector('#eye-closed');

        toggle.addEventListener('click', function () {
            if (pwdInput.type === 'password') {
                pwdInput.type = 'text';
                eyeOpen.style.display = 'none';
                eyeClosed.style.display = '';
            } else {
                pwdInput.type = 'password';
                eyeOpen.style.display = '';
                eyeClosed.style.display = 'none';
            }
        });
    }

    // --- Form Validation and Real-time Feedback ---
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('form-message');

    // Helper functions
    function validateEmail(email) {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function validatePassword(pwd) {
        return pwd.length >= 8;
    }
    function showFieldError(field, msg) {
        let err = field.parentNode.querySelector('.field-error');
        if (!err) {
            err = document.createElement('span');
            err.className = 'field-error';
            err.style.color = '#d63031';
            err.style.fontSize = '0.95em';
            err.style.marginLeft = '8px';
            field.parentNode.appendChild(err);
        }
        err.textContent = msg;
        field.classList.add('invalid');
    }
    function clearFieldError(field) {
        let err = field.parentNode.querySelector('.field-error');
        if (err) err.remove();
        field.classList.remove('invalid');
    }

    if (form) {
        // Real-time feedback for required, email, and password fields
        form.querySelectorAll('input[required], input[type="email"], input[type="password"]').forEach(field => {
            field.addEventListener('input', function () {
                if (field.type === 'email') {
                    if (!validateEmail(field.value)) {
                        showFieldError(field, 'Invalid email format');
                    } else {
                        clearFieldError(field);
                    }
                } else if (field.type === 'password') {
                    if (!validatePassword(field.value)) {
                        showFieldError(field, 'Password must be at least 8 characters');
                    } else {
                        clearFieldError(field);
                    }
                } else if (field.hasAttribute('required')) {
                    if (!field.value.trim()) {
                        showFieldError(field, 'This field is required');
                    } else {
                        clearFieldError(field);
                    }
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let valid = true;
            // Validate required fields
            const requiredFields = form.querySelectorAll('input[required], select[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    valid = false;
                } else {
                    clearFieldError(field);
                }
            });

            // Validate all emails
            form.querySelectorAll('input[type="email"]').forEach(field => {
                if (field.value && !validateEmail(field.value)) {
                    showFieldError(field, 'Invalid email format');
                    valid = false;
                } else if (field.value) {
                    clearFieldError(field);
                }
            });

            // Validate password
            if (pwdInput) {
                if (!validatePassword(pwdInput.value)) {
                    showFieldError(pwdInput, 'Password must be at least 8 characters');
                    valid = false;
                } else {
                    clearFieldError(pwdInput);
                }
            }

            // Custom: at least one language checkbox checked (if present)
            const langCheckboxes = form.querySelectorAll('input[name="languages"]');
            let langChecked = langCheckboxes.length === 0 ? true : false;
            langCheckboxes.forEach(cb => { if (cb.checked) langChecked = true; });
            if (!langChecked && langCheckboxes.length > 0) {
                valid = false;
                langCheckboxes[0].parentNode.insertAdjacentHTML('beforeend',
                    '<span class="lang-error" style="color:#d63031;font-size:0.95em;margin-left:8px;">Select at least one language</span>');
                setTimeout(() => {
                    const err = form.querySelector('.lang-error');
                    if (err) err.remove();
                }, 2000);
            }

            if (valid) {
                messageDiv.textContent = "Registration successful! We have received your details.";
                messageDiv.className = "success";
                messageDiv.classList.remove('hidden');
                form.reset();
                // Remove all field errors after successful submit
                form.querySelectorAll('.field-error').forEach(e => e.remove());
            } else {
                messageDiv.textContent = "Please fill all required fields correctly.";
                messageDiv.className = "error";
                messageDiv.classList.remove('hidden');
                form.classList.add('shake');
                setTimeout(() => form.classList.remove('shake'), 500);
            }
        });

        // Hide message on input
        form.addEventListener('input', function () {
            messageDiv.classList.add('hidden');
        });
    }

    // Highlight row on table hover
    document.querySelectorAll('table').forEach(table => {
        table.addEventListener('mouseover', function (e) {
            if (e.target.tagName === 'INPUT') {
                const row = e.target.closest('tr');
                if (row) row.style.background = '#ffeaa7';
            }
        });
        table.addEventListener('mouseout', function (e) {
            if (e.target.tagName === 'INPUT') {
                const row = e.target.closest('tr');
                if (row) row.style.background = '';
            }
        });
    });

    // --- Button click and hover effects ---
    const submitBtn = document.querySelector('input[type="submit"]');
    const resetBtn = document.querySelector('button[type="reset"]');
    [submitBtn, resetBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('mousedown', function () {
                btn.style.transform = 'scale(0.96)';
                btn.style.boxShadow = '0 2px 8px #b2bec3';
            });
            btn.addEventListener('mouseup', function () {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
            btn.addEventListener('mouseenter', function () {
                btn.style.backgroundColor = '#74b9ff';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.backgroundColor = '';
            });
        }
    });

    // --- Keypress detection ---
    form && form.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && input.type !== 'submit') {
                messageDiv.textContent = `You pressed Enter in "${input.name || input.id}" field.`;
                messageDiv.className = "success";
                messageDiv.classList.remove('hidden');
                setTimeout(() => messageDiv.classList.add('hidden'), 1200);
            }
        });
    });

    form && form.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            messageDiv.textContent = "Form input cancelled (Escape pressed).";
            messageDiv.className = "error";
            messageDiv.classList.remove('hidden');
            setTimeout(() => messageDiv.classList.add('hidden'), 1200);
        }
    });

    // --- Button that changes text or color ---
    let demoBtn = document.getElementById('demo-btn');
    if (!demoBtn) {
        demoBtn = document.createElement('button');
        demoBtn.id = 'demo-btn';
        demoBtn.textContent = 'Click me for color!';
        demoBtn.style.margin = '20px auto 10px auto';
        demoBtn.style.display = 'block';
        demoBtn.style.background = '#00b894';
        demoBtn.style.color = '#fff';
        demoBtn.style.fontSize = '1.1em';
        demoBtn.style.border = 'none';
        demoBtn.style.borderRadius = '6px';
        demoBtn.style.padding = '10px 28px';
        demoBtn.style.cursor = 'pointer';
        document.body.insertBefore(demoBtn, document.querySelector('form'));
    }
    demoBtn.addEventListener('click', function () {
        if (demoBtn.textContent === 'Click me for color!') {
            demoBtn.textContent = 'Clicked!';
            demoBtn.style.background = '#fdcb6e';
            demoBtn.style.color = '#222';
        } else {
            demoBtn.textContent = 'Click me for color!';
            demoBtn.style.background = '#00b894';
            demoBtn.style.color = '#fff';
        }
        demoBtn.classList.add('shake');
        setTimeout(() => demoBtn.classList.remove('shake'), 400);
    });
    demoBtn.addEventListener('mouseenter', function () {
        demoBtn.style.background = '#55efc4';
    });
    demoBtn.addEventListener('mouseleave', function () {
        demoBtn.style.background = demoBtn.textContent === 'Clicked!' ? '#fdcb6e' : '#00b894';
    });

    // --- Simple image gallery/slideshow ---
    const galleryImages = [
        "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/46148/aircraft-hangar-airplane-jet-46148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "https://images.pexels.com/photos/210574/pexels-photo-210574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    ];
    let galleryIdx = 0;
    let gallery = document.getElementById('gallery');
    if (!gallery) {
        gallery = document.createElement('div');
        gallery.id = 'gallery';
        gallery.style.textAlign = 'center';
        gallery.style.margin = '30px auto 10px auto';
        gallery.innerHTML = `
            <img id="gallery-img" src="${galleryImages[0]}" alt="Gallery" style="max-width:500px;max-height:300px;border-radius:10px;box-shadow:0 2px 12px #b2bec3;">
            <br>
            <button id="prev-img" style="margin:10px 10px 0 0;">&#8592; Prev</button>
            <button id="next-img" style="margin:10px 0 0 10px;">Next &#8594;</button>
        `;
        document.body.insertBefore(gallery, demoBtn.nextSibling);
    }
    const galleryImg = document.getElementById('gallery-img') || gallery.querySelector('#gallery-img');
    const prevBtn = document.getElementById('prev-img') || gallery.querySelector('#prev-img');
    const nextBtn = document.getElementById('next-img') || gallery.querySelector('#next-img');
    prevBtn.addEventListener('click', function () {
        galleryIdx = (galleryIdx - 1 + galleryImages.length) % galleryImages.length;
        galleryImg.src = galleryImages[galleryIdx];
        galleryImg.classList.add('fade-in');
        setTimeout(() => galleryImg.classList.remove('fade-in'), 400);
    });
    nextBtn.addEventListener('click', function () {
        galleryIdx = (galleryIdx + 1) % galleryImages.length;
        galleryImg.src = galleryImages[galleryIdx];
        galleryImg.classList.add('fade-in');
        setTimeout(() => galleryImg.classList.remove('fade-in'), 400);
    });

    // --- Tabs/Accordion ---
    let tabs = document.getElementById('info-tabs');
    if (!tabs) {
        tabs = document.createElement('div');
        tabs.id = 'info-tabs';
        tabs.style.maxWidth = '700px';
        tabs.style.margin = '30px auto 20px auto';
        tabs.innerHTML = `
            <div style="display:flex;justify-content:center;">
                <button class="tab-btn active" style="padding:8px 22px;margin:0 6px;border-radius:6px;border:none;background:#0984e3;color:#fff;cursor:pointer;">About</button>
                <button class="tab-btn" style="padding:8px 22px;margin:0 6px;border-radius:6px;border:none;background:#b2bec3;color:#222;cursor:pointer;">Contact</button>
                <button class="tab-btn" style="padding:8px 22px;margin:0 6px;border-radius:6px;border:none;background:#b2bec3;color:#222;cursor:pointer;">FAQ</button>
            </div>
            <div class="tab-content" style="background:#eaf6ff;padding:18px 20px;border-radius:8px;margin-top:10px;">
                <div class="tab-panel" style="display:block;">Welcome to the Aeronautical Engineers Association of Kenya. We connect aviation professionals across the region.</div>
                <div class="tab-panel" style="display:none;">Contact us at <a href="mailto:info@aeak.or.ke">info@aeak.or.ke</a> or call +254 700 000 000.</div>
                <div class="tab-panel" style="display:none;">Q: How do I join?<br>A: Fill the registration form above and submit your documents.</div>
            </div>
        `;
        document.body.insertBefore(tabs, gallery.nextSibling);
    }
    const tabBtns = tabs.querySelectorAll('.tab-btn');
    const tabPanels = tabs.querySelectorAll('.tab-panel');
    tabBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            tabBtns.forEach((b, i) => {
                b.classList.toggle('active', i === idx);
                b.style.background = i === idx ? '#0984e3' : '#b2bec3';
                b.style.color = i === idx ? '#fff' : '#222';
            });
            tabPanels.forEach((panel, i) => {
                panel.style.display = i === idx ? 'block' : 'none';
            });
        });
    });

    // --- Bonus: Animation using CSS ---
    const style = document.createElement('style');
    style.textContent = `
        .fade-in { animation: fadeIn 0.4s; }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.98);}
            to { opacity: 1; transform: scale(1);}
        }
        .shake { animation: shake 0.4s; }
        @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-8px); }
            80% { transform: translateX(8px); }
            100% { transform: translateX(0); }
        }
        .invalid { border-color: #d63031 !important; background: #ffeaea !important; }
        .field-error { color: #d63031; font-size: 0.95em; margin-left: 8px; }
    `;
    document.head.appendChild(style);
});