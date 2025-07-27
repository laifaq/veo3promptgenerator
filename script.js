document.addEventListener('DOMContentLoaded', () => {

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

    const cameraSelect = document.getElementById('kamera');
    cameraMovements.forEach(move => {
        const option = document.createElement('option');
        option.value = move.en;
        option.textContent = `${move.en} (${move.id})`;
        cameraSelect.appendChild(option);
    });

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

    document.getElementById('reset-btn').addEventListener('click', () => {
        const inputIds = [
            'judul', 'karakter', 'suara', 'aksi', 'ekspresi', 'latar', 
            'visual-tambahan', 'suasana', 'ambience', 'dialog', 'negatif',
            'output-id', 'output-en'
        ];
        inputIds.forEach(id => setElementValue(id, ''));
        document.getElementById('kamera').selectedIndex = 0;
    });

    document.getElementById('generate-btn').addEventListener('click', () => {
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

        // Basic validation - check if at least the title and character are filled
        if (!inputs.judul.trim()) {
            alert('Mohon isi Judul Scene terlebih dahulu!');
            document.getElementById('judul').focus();
            return;
        }
        
        if (!inputs.karakter.trim()) {
            alert('Mohon isi Deskripsi Karakter Inti terlebih dahulu!');
            document.getElementById('karakter').focus();
            return;
        }

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
    });

    // Copy to clipboard functionality
    const copyToClipboard = async (text, buttonId) => {
        try {
            await navigator.clipboard.writeText(text);
            const button = document.getElementById(buttonId);
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const button = document.getElementById(buttonId);
            const originalContent = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.backgroundColor = '';
            }, 2000);
        }
    };

    document.getElementById('copy-id-btn').addEventListener('click', () => {
        const text = getElementValue('output-id');
        if (text.trim()) {
            copyToClipboard(text, 'copy-id-btn');
        }
    });

    document.getElementById('copy-en-btn').addEventListener('click', () => {
        const text = getElementValue('output-en');
        if (text.trim()) {
            copyToClipboard(text, 'copy-en-btn');
        }
    });
}); 
