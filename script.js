document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & Config ---
    const cameraMovements = [
        { en: "Static Shot", id: "Tangkapan Statis" },
        { en: "Pan Left", id: "Geser Kiri" },
        { en: "Pan Right", id: "Geser Kanan" },
        { en: "Pan Up", id: "Geser Atas" },
        { en: "Pan Down", id: "Geser Bawah" },
        { en: "Tilt Up", id: "Miring ke Atas" },
        { en: "Tilt Down", id: "Miring ke Bawah" },
        { en: "Roll Left", id: "Putar Kiri" },
        { en: "Roll Right", id: "Putar Kanan" },
        { en: "Zoom In", id: "Perbesar" },
        { en: "Zoom Out", id: "Perkecil" },
        { en: "Dolly In", id: "Dolly Masuk" },
        { en: "Dolly Out", id: "Dolly Keluar" },
        { en: "Truck Left", id: "Geser Kamera ke Kiri" },
        { en: "Truck Right", id: "Geser Kamera ke Kanan" },
        { en: "Crane Up", id: "Angkat Kamera ke Atas" },
        { en: "Crane Down", id: "Turunkan Kamera" },
        { en: "Tracking Shot", id: "Tangkapan Mengikuti" },
        { en: "3D Rotation", id: "Rotasi 3D" },
        { en: "Orbit", id: "Mengorbit" },
        { en: "Shake", id: "Guncang" },
        { en: "First Person / POV", id: "Sudut Pandang Orang Pertama" }
    ];

    const STORAGE_KEY = 'veo3-prompt-data-v2';
    
    // --- DOM Elements ---
    const form = document.getElementById('prompt-form');
    const scrollContainer = document.querySelector('.scroll-container');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.form-section');
    const cameraSelect = document.getElementById('kamera');
    
    // --- Initialization ---
    function init() {
        populateCameraOptions();
        setupEventListeners();
        setupScrollSpy();
        loadSavedData();
        showNotification('Welcome! Ready to create cinematic prompts.', 'info');
    }

    function populateCameraOptions() {
        cameraMovements.forEach(move => {
            const option = document.createElement('option');
            option.value = move.en;
            option.textContent = `${move.en} (${move.id})`;
            cameraSelect.appendChild(option);
        });
    }

    // --- Core Logic ---
    function generatePrompt() {
        if (!validateForm()) return;

        showLoading();

        // Simulate "thinking" time for effect
        setTimeout(() => {
            const data = getFormData();
            const promptID = buildPromptID(data);
            const promptEN = buildPromptEN(data);

            // Update UI
            document.getElementById('output-id').value = promptID;
            document.getElementById('output-en').value = promptEN;
            
            // Update status indicator
            const statusText = document.querySelector('.status-text');
            const statusDot = document.querySelector('.status-dot');
            statusText.textContent = "Generated just now";
            statusDot.style.background = "var(--accent-secondary)";
            statusDot.style.boxShadow = "0 0 10px var(--accent-secondary)";

            hideLoading();
            showNotification('Prompts generated successfully!', 'success');
            
            // Scroll output into view on mobile
            if (window.innerWidth <= 1024) {
                document.getElementById('output-panel').scrollIntoView({ behavior: 'smooth' });
            }
        }, 1200);
    }

    function getFormData() {
        return {
            judul: getValue('judul'),
            karakter: getValue('karakter'),
            aksi: getValue('aksi'),
            suara: getValue('suara'),
            ekspresi: getValue('ekspresi'),
            dialog: getValue('dialog'),
            latar: getValue('latar'),
            kamera: getValue('kamera'),
            visualTambahan: getValue('visual-tambahan'),
            suasana: getValue('suasana'),
            ambience: getValue('ambience'),
            negatif: getValue('negatif')
        };
    }

    function buildPromptID(data) {
        let parts = [];
        parts.push(`**Judul Scene:** ${data.judul}`);
        if(data.karakter) parts.push(`**Karakter:** ${data.karakter}`);
        if(data.aksi) parts.push(`**Aksi:** ${data.aksi}`);
        if(data.suara) parts.push(`**Detail Suara:** ${data.suara}`);
        if(data.ekspresi) parts.push(`**Ekspresi:** ${data.ekspresi}`);
        if(data.dialog) parts.push(`**Dialog:** "${data.dialog}"`);
        
        let visuals = [];
        if(data.latar) visuals.push(`Latar & Waktu: ${data.latar}`);
        if(data.kamera) visuals.push(`Gerakan Kamera: ${data.kamera}`);
        if(data.visualTambahan) visuals.push(`Detail Visual: ${data.visualTambahan}`);
        if(visuals.length > 0) parts.push(`**Visual & Latar:**\n${visuals.join('\n')}`);

        if(data.suasana) parts.push(`**Suasana:** ${data.suasana}`);
        if(data.ambience) parts.push(`**Suara Lingkungan:** ${data.ambience}`);
        if(data.negatif) parts.push(`**Negative Prompt:** ${data.negatif}`);

        return parts.join('\n\n');
    }

    function buildPromptEN(data) {
        // Keeps user content but changes headers to English
        let parts = [];
        parts.push(`**Scene Title:** ${data.judul}`);
        if(data.karakter) parts.push(`**Core Character:** ${data.karakter}`);
        if(data.aksi) parts.push(`**Character Action:** ${data.aksi}`);
        if(data.suara) parts.push(`**Voice Details:** ${data.suara}`);
        if(data.ekspresi) parts.push(`**Expression:** ${data.ekspresi}`);
        if(data.dialog) parts.push(`**Dialog (ID):** "${data.dialog}"`);
        
        let visuals = [];
        if(data.latar) visuals.push(`Setting & Time: ${data.latar}`);
        if(data.kamera) visuals.push(`Camera Movement: ${data.kamera}`);
        if(data.visualTambahan) visuals.push(`Visual Details: ${data.visualTambahan}`);
        if(visuals.length > 0) parts.push(`**Visuals & Setting:**\n${visuals.join('\n')}`);

        if(data.suasana) parts.push(`**Atmosphere:** ${data.suasana}`);
        if(data.ambience) parts.push(`**Environment Sound:** ${data.ambience}`);
        if(data.negatif) parts.push(`**Negative Prompt:** ${data.negatif}`);

        return parts.join('\n\n');
    }

    // --- Validation & Utilities ---
    function validateForm() {
        const required = ['judul', 'karakter'];
        let isValid = true;
        let firstError = null;

        required.forEach(id => {
            const el = document.getElementById(id);
            if (!el.value.trim()) {
                isValid = false;
                el.parentElement.classList.add('error');
                // Flash error style
                el.style.borderColor = 'var(--accent-danger)';
                setTimeout(() => el.style.borderColor = '', 2000);
                if (!firstError) firstError = el;
            }
        });

        if (!isValid) {
            showNotification('Please fill in the required Core Scene fields.', 'error');
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return isValid;
    }

    function getValue(id) { return document.getElementById(id).value.trim(); }

    // --- Notifications & Loading ---
    function showNotification(msg, type = 'info') {
        const container = document.getElementById('notification-container');
        const toast = document.createElement('div');
        
        // Inline styles for the toast to ensure it works with new CSS
        toast.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                                 type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                                 'rgba(99, 102, 241, 0.9)';
        toast.style.color = '#fff';
        toast.style.padding = '0.75rem 1.25rem';
        toast.style.borderRadius = '0.5rem';
        toast.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        toast.style.backdropFilter = 'blur(4px)';
        toast.style.fontWeight = '500';
        toast.style.fontSize = '0.9rem';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '0.5rem';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        const icon = type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        // Animate
        requestAnimationFrame(() => toast.style.transform = 'translateX(0)');

        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }
    function hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    // --- Clipbard & Reset ---
    async function copyToClipboard(id, btnId) {
        const text = document.getElementById(id).value;
        if (!text) {
            showNotification('Nothing to copy yet!', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!', 'success');
            
            const btn = document.getElementById(btnId);
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = originalIcon, 2000);
        } catch (err) {
            showNotification('Failed to copy', 'error');
        }
    }

    function resetForm() {
        if (confirm('Reset all fields? This cannot be undone.')) {
            form.reset();
            localStorage.removeItem(STORAGE_KEY);
            document.getElementById('output-id').value = '';
            document.getElementById('output-en').value = '';
            
            const statusText = document.querySelector('.status-text');
            const statusDot = document.querySelector('.status-dot');
            statusText.textContent = "Ready";
            statusDot.style.background = "var(--accent-success)";
            statusDot.style.boxShadow = "none";
            
            showNotification('Form reset complete', 'success');
        }
    }

    // --- Autosave ---
    function saveToLocal() {
        const data = getFormData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadSavedData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const el = document.getElementById(key);
                    if (el && data[key]) el.value = data[key];
                });
                // showNotification('Saved draft loaded', 'info');
            } catch (e) {
                console.error('Corerupted save data');
            }
        }
    }

    // --- Scroll Spy & Events ---
    function setupScrollSpy() {
        // Highlight nav on scroll
        scrollContainer.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                // Offset for header
                 if (scrollContainer.scrollTop >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active');
                }
            });
        });
    }

    function setupEventListeners() {
        document.getElementById('generate-btn').addEventListener('click', generatePrompt);
        document.getElementById('reset-btn').addEventListener('click', resetForm);
        
        document.getElementById('copy-id-btn').addEventListener('click', () => copyToClipboard('output-id', 'copy-id-btn'));
        document.getElementById('copy-en-btn').addEventListener('click', () => copyToClipboard('output-en', 'copy-en-btn'));

        // Autosave on input
        form.addEventListener('input', () => {
             // Debounce save slightly
             clearTimeout(window.saveTimeout);
             window.saveTimeout = setTimeout(saveToLocal, 1000);
        });

        // Key shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                generatePrompt();
            }
        });
    }

    // Run
    init();
});
    // Camera movements data
    const cameraMovements = [
        { en: "Static Shot", id: "Tangkapan Statis" },
        { en: "Pan Left", id: "Geser Kiri" },
        { en: "Pan Right", id: "Geser Kanan" },
        { en: "Pan Up", id: "Geser Atas" },
        { en: "Pan Down", id: "Geser Bawah" },
        { en: "Tilt Up", id: "Miring ke Atas" },
        { en: "Tilt Down", id: "Miring ke Bawah" },
        { en: "Roll Left", id: "Putar Kiri" },
        { en: "Roll Right", id: "Putar Kanan" },
        { en: "Zoom In", id: "Perbesar" },
        { en: "Zoom Out", id: "Perkecil" },
        { en: "Dolly In", id: "Dolly Masuk" },
        { en: "Dolly Out", id: "Dolly Keluar" },
        { en: "Truck Left", id: "Geser Kamera ke Kiri" },
        { en: "Truck Right", id: "Geser Kamera ke Kanan" },
        { en: "Crane Up", id: "Angkat Kamera ke Atas" },
        { en: "Crane Down", id: "Turunkan Kamera" },
        { en: "Tracking Shot", id: "Tangkapan Mengikuti" },
        { en: "3D Rotation", id: "Rotasi 3D" },
        { en: "Orbit", id: "Mengorbit" },
        { en: "Shake", id: "Guncang" },
        { en: "First Person / POV", id: "Sudut Pandang Orang Pertama" }
    ];

    // Initialize camera select options
    const cameraSelect = document.getElementById('kamera');
    cameraMovements.forEach(move => {
        const option = document.createElement('option');
        option.value = move.en;
        option.textContent = `${move.en} (${move.id})`;
        cameraSelect.appendChild(option);
    });

    // Utility functions
    const getElementValue = id => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    };
    
    const setElementValue = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    };

    // Progress tracking
    const updateProgress = () => {
        const requiredFields = ['judul', 'karakter'];
        const optionalFields = ['suara', 'aksi', 'ekspresi', 'latar', 'visual-tambahan', 'suasana', 'ambience', 'dialog', 'negatif'];
        const allFields = [...requiredFields, ...optionalFields];
        
        let filledFields = 0;
        allFields.forEach(fieldId => {
            if (getElementValue(fieldId).trim()) {
                filledFields++;
            }
        });
        
        const progressDots = document.querySelectorAll('.progress-dot');
        const progressPercentage = (filledFields / allFields.length) * 100;
        
        progressDots.forEach((dot, index) => {
            if (index < Math.ceil(progressPercentage / 20)) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Add event listeners to all form inputs for progress tracking
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });

    // Enhanced form validation with visual feedback
    const validateForm = () => {
        const requiredFields = [
            { id: 'judul', name: 'Judul Scene' },
            { id: 'karakter', name: 'Deskripsi Karakter Inti' }
        ];
        
        let isValid = true;
        let firstErrorField = null;
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            const inputGroup = element.closest('.input-group');
            
            if (!getElementValue(field.id).trim()) {
                inputGroup.style.borderColor = 'var(--accent-danger)';
                inputGroup.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                
                if (!firstErrorField) {
                    firstErrorField = element;
                }
                isValid = false;
                
                // Remove error styling after 3 seconds
                setTimeout(() => {
                    inputGroup.style.borderColor = '';
                    inputGroup.style.boxShadow = '';
                }, 3000);
            } else {
                inputGroup.style.borderColor = 'var(--accent-success)';
                inputGroup.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                
                setTimeout(() => {
                    inputGroup.style.borderColor = '';
                    inputGroup.style.boxShadow = '';
                }, 1000);
            }
        });
        
        if (!isValid && firstErrorField) {
            // Show modern notification instead of alert
            showNotification('Mohon lengkapi field yang wajib diisi!', 'error');
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return isValid;
    };

    // Modern notification system
    const showNotification = (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--accent-danger)' : 
                        type === 'success' ? 'var(--accent-success)' : 'var(--accent-primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        const icon = type === 'error' ? 'fas fa-exclamation-triangle' : 
                    type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        
        notification.innerHTML = `
            <i class="${icon}" style="margin-right: 0.5rem;"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    };

    // Loading overlay functions
    const showLoading = () => {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const hideLoading = () => {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    };

    // Reset form with smooth animation
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset semua field? Data yang sudah diisi akan hilang.')) {
            const inputIds = [
                'judul', 'karakter', 'suara', 'aksi', 'ekspresi', 'latar', 
                'visual-tambahan', 'suasana', 'ambience', 'dialog', 'negatif',
                'output-id', 'output-en'
            ];
            
            // Add fade out animation
            const formContainer = document.querySelector('.form-container');
            formContainer.style.opacity = '0.5';
            
            setTimeout(() => {
                inputIds.forEach(id => setElementValue(id, ''));
                document.getElementById('kamera').selectedIndex = 0;
                updateProgress();
                
                // Fade back in
                formContainer.style.opacity = '1';
                showNotification('Form berhasil direset!', 'success');
            }, 200);
        }
    });

    // Enhanced prompt generation with loading
    document.getElementById('generate-btn').addEventListener('click', async () => {
        if (!validateForm()) {
            return;
        }

        showLoading();
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const inputs = {
            judul: getElementValue('judul'),
            karakter: getElementValue('karakter'),
            suara: getElementValue('suara'),
            aksi: getElementValue('aksi'),
            ekspresi: getElementValue('ekspresi'),
            latar: getElementValue('latar'),
            kamera: getElementValue('kamera'),
            visualTambahan: getElementValue('visual-tambahan'),
            suasana: getElementValue('suasana'),
            ambience: getElementValue('ambience'),
            dialog: getElementValue('dialog'),
            negatif: getElementValue('negatif'),
        };

        // Helper function to add section only if content exists
        const addSection = (title, content) => content.trim() ? `**${title}:**\n${content.trim()}\n\n` : '';

        // Generate Indonesian Prompt
        let promptID = `**Judul Scene:** ${inputs.judul}\n\n`;
        promptID += addSection('Karakter', inputs.karakter);
        promptID += addSection('Detail Suara', inputs.suara);
        promptID += addSection('Aksi', inputs.aksi);
        promptID += addSection('Ekspresi', inputs.ekspresi);
        promptID += addSection('Latar & Waktu', inputs.latar);
        
        // Handle camera movement and visual details
        let visualSection = '';
        if (inputs.kamera || inputs.visualTambahan.trim()) {
            visualSection = '**Detail Visual:**\n';
            if (inputs.kamera) visualSection += `Gerakan Kamera: ${inputs.kamera}. `;
            if (inputs.visualTambahan.trim()) visualSection += inputs.visualTambahan.trim();
            visualSection += '\n\n';
        }
        promptID += visualSection;
        
        promptID += addSection('Suasana', inputs.suasana);
        promptID += addSection('Suara Lingkungan', inputs.ambience);
        promptID += addSection('Dialog', inputs.dialog);
        promptID += addSection('Negative Prompt', inputs.negatif);

        // Remove trailing newlines
        promptID = promptID.trim();
        setElementValue('output-id', promptID);

        // Generate English Prompt
        let promptEN = `**Scene Title:** ${inputs.judul}\n\n`;
        promptEN += addSection('Core Character', inputs.karakter);
        promptEN += addSection('Character Voice Details', inputs.suara);
        promptEN += addSection('Character Action', inputs.aksi);
        promptEN += addSection('Character Expression', inputs.ekspresi);
        promptEN += addSection('Setting & Time', inputs.latar);
        
        // Handle camera movement and visual details for English
        let visualSectionEN = '';
        if (inputs.kamera || inputs.visualTambahan.trim()) {
            visualSectionEN = '**Additional Visual Details:**\n';
            if (inputs.kamera) visualSectionEN += `Camera Movement: ${inputs.kamera}. `;
            if (inputs.visualTambahan.trim()) visualSectionEN += inputs.visualTambahan.trim();
            visualSectionEN += '\n\n';
        }
        promptEN += visualSectionEN;
        
        promptEN += addSection('Overall Atmosphere', inputs.suasana);
        promptEN += addSection('Environmental Sound/Ambiance', inputs.ambience);
        promptEN += addSection('Character Dialog (in Indonesian)', inputs.dialog);
        promptEN += addSection('Negative Prompt', inputs.negatif);
        
        // Remove trailing newlines
        promptEN = promptEN.trim();
        setElementValue('output-en', promptEN);
        
        hideLoading();
        
        // Scroll to output with smooth animation
        document.querySelector('.output-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        showNotification('Prompt berhasil dibuat! 🎉', 'success');
    });

    // Enhanced copy to clipboard functionality
    const copyToClipboard = async (text, buttonId) => {
        const button = document.getElementById(buttonId);
        const originalContent = button.innerHTML;
        
        try {
            await navigator.clipboard.writeText(text);
            
            button.innerHTML = '<i class="fas fa-check"></i><span>Tersalin!</span>';
            button.style.background = 'var(--accent-success)';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
            }, 2000);
            
            showNotification('Prompt berhasil disalin ke clipboard!', 'success');
            
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.innerHTML = '<i class="fas fa-check"></i><span>Tersalin!</span>';
            button.style.background = 'var(--accent-success)';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.background = '';
            }, 2000);
            
            showNotification('Prompt berhasil disalin ke clipboard!', 'success');
        }
    };

    // Copy button event listeners
    document.getElementById('copy-id-btn').addEventListener('click', () => {
        const text = getElementValue('output-id');
        if (text.trim()) {
            copyToClipboard(text, 'copy-id-btn');
        } else {
            showNotification('Tidak ada prompt untuk disalin. Generate prompt terlebih dahulu!', 'error');
        }
    });

    document.getElementById('copy-en-btn').addEventListener('click', () => {
        const text = getElementValue('output-en');
        if (text.trim()) {
            copyToClipboard(text, 'copy-en-btn');
        } else {
            showNotification('Tidak ada prompt untuk disalin. Generate prompt terlebih dahulu!', 'error');
        }
    });

    // Auto-save functionality (optional)
    const autoSave = () => {
        const formData = {};
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.id) {
                formData[input.id] = input.value;
            }
        });
        localStorage.setItem('veo3-prompt-data', JSON.stringify(formData));
    };

    // Auto-load saved data
    const autoLoad = () => {
        const savedData = localStorage.getItem('veo3-prompt-data');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                Object.keys(formData).forEach(key => {
                    setElementValue(key, formData[key]);
                });
                updateProgress();
                showNotification('Data tersimpan berhasil dimuat!', 'info');
            } catch (e) {
                console.log('Failed to load saved data');
            }
        }
    };

    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);

    // Auto-save on page unload
    window.addEventListener('beforeunload', autoSave);

    // Load saved data on page load
    autoLoad();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('generate-btn').click();
        }
        
        // Ctrl/Cmd + R to reset (with confirmation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            document.getElementById('reset-btn').click();
        }
    });

    // Initialize progress on page load
    updateProgress();

    // Add smooth focus animations
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.closest('.input-group').style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', (e) => {
            e.target.closest('.input-group').style.transform = '';
        });
    });

    // Welcome message
    setTimeout(() => {
        showNotification('Selamat datang! Mulai isi form untuk membuat prompt AI video profesional. 🎬', 'info');
    }, 1000);
}); 
