document.addEventListener('DOMContentLoaded', () => {
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
        const optionalFields = ['suara', 'aksi', 'ekspresi', 'latar', 'kamera', 'visual-tambahan', 'suasana', 'ambience', 'dialog', 'negatif'];
        const allFields = [...requiredFields, ...optionalFields];
        
        let filledFields = 0;
        let requiredFilled = 0;
        
        requiredFields.forEach(fieldId => {
            if (getElementValue(fieldId).trim()) {
                requiredFilled++;
                filledFields++;
            }
        });
        
        optionalFields.forEach(fieldId => {
            if (getElementValue(fieldId).trim()) {
                filledFields++;
            }
        });
        
        const progressDots = document.querySelectorAll('.progress-dot');
        
        // First dot is always active if any field is filled
        if (filledFields > 0 || requiredFilled > 0) {
            progressDots[0]?.classList.add('active');
        } else {
            progressDots[0]?.classList.remove('active');
        }
        
        // Calculate progress based on filled fields
        const progressSteps = Math.min(5, Math.ceil((filledFields / allFields.length) * 5));
        
        progressDots.forEach((dot, index) => {
            if (index < progressSteps) {
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
        if (overlay) {
            overlay.classList.add('show');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    const hideLoading = () => {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
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
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
        try {
            const formData = {};
            const inputs = document.querySelectorAll('input, textarea, select');
            let hasContent = false;
            
            inputs.forEach(input => {
                if (input.id && !input.id.includes('output')) {
                    formData[input.id] = input.value;
                    if (input.value.trim()) {
                        hasContent = true;
                    }
                }
            });
            
            if (hasContent) {
                localStorage.setItem('veo3-prompt-data', JSON.stringify(formData));
            }
        } catch (e) {
            console.log('Auto-save failed:', e);
        }
    };

    // Auto-load saved data
    const autoLoad = () => {
        try {
            const savedData = localStorage.getItem('veo3-prompt-data');
            if (savedData) {
                const formData = JSON.parse(savedData);
                let hasData = false;
                
                Object.keys(formData).forEach(key => {
                    if (formData[key] && formData[key].trim()) {
                        setElementValue(key, formData[key]);
                        hasData = true;
                    }
                });
                
                if (hasData) {
                    updateProgress();
                    setTimeout(() => {
                        showNotification('Data tersimpan berhasil dimuat!', 'info');
                    }, 2000);
                }
            }
        } catch (e) {
            console.log('Failed to load saved data:', e);
            localStorage.removeItem('veo3-prompt-data');
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
        const hasAutoLoadedData = localStorage.getItem('veo3-prompt-data');
        if (!hasAutoLoadedData) {
            showNotification('Selamat datang! Mulai isi form untuk membuat prompt AI video profesional. 🎬', 'info');
        }
    }, 1500);
}); 
