document.addEventListener('DOMContentLoaded', () => {

    // Fallback copy function for older browsers
    function fallbackCopyTextToClipboard(text, button, originalText) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Failed to copy to clipboard');
        }
        
        document.body.removeChild(textArea);
    }

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
    if (cameraSelect) {
        cameraMovements.forEach(move => {
            const option = document.createElement('option');
            option.value = move.en;
            option.textContent = `${move.en} (${move.id})`;
            cameraSelect.appendChild(option);
        });
    }

    const getElementValue = id => document.getElementById(id).value;
    const setElementValue = (id, value) => { document.getElementById(id).value = value; };

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const inputIds = [
                'judul', 'karakter', 'suara', 'aksi', 'ekspresi', 'latar', 
                'visual-tambahan', 'suasana', 'ambience', 'dialog', 'negatif',
                'output-id', 'output-en'
            ];
            inputIds.forEach(id => setElementValue(id, ''));
            const kameraSelect = document.getElementById('kamera');
            if (kameraSelect) {
                kameraSelect.selectedIndex = 0;
            }
        });
    }

    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
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

                    // Check if required fields are filled
            if (!inputs.judul.trim()) {
                alert('Mohon isi Judul Scene terlebih dahulu!');
                document.getElementById('judul').focus();
                return;
            }

            // Generate Indonesian Prompt
            let promptID = `**Judul Scene:** ${inputs.judul}\n\n`;
            if (inputs.karakter.trim()) promptID += `**Karakter:**\n${inputs.karakter}\n\n`;
            if (inputs.suara.trim()) promptID += `**Detail Suara:**\n${inputs.suara}\n\n`;
            if (inputs.aksi.trim()) promptID += `**Aksi:**\n${inputs.aksi}\n\n`;
            if (inputs.ekspresi.trim()) promptID += `**Ekspresi:**\n${inputs.ekspresi}\n\n`;
            if (inputs.latar.trim()) promptID += `**Latar & Waktu:**\n${inputs.latar}\n\n`;
            if (inputs.kamera || inputs.visualTambahan.trim()) {
                promptID += `**Detail Visual:**\n`;
                if (inputs.kamera) promptID += `Gerakan Kamera: ${inputs.kamera}. `;
                if (inputs.visualTambahan.trim()) promptID += inputs.visualTambahan;
                promptID += `\n\n`;
            }
            if (inputs.suasana.trim()) promptID += `**Suasana:**\n${inputs.suasana}\n\n`;
            if (inputs.ambience.trim()) promptID += `**Suara Lingkungan:**\n${inputs.ambience}\n\n`;
            if (inputs.dialog.trim()) promptID += `**Dialog:**\n${inputs.dialog}\n\n`;
            if (inputs.negatif.trim()) promptID += `**Negative Prompt:**\n${inputs.negatif}`;

        setElementValue('output-id', promptID);

                    // Generate English Prompt
            let promptEN = `**Scene Title:** ${inputs.judul}\n\n`;
            if (inputs.karakter.trim()) promptEN += `**Core Character:**\n${inputs.karakter}\n\n`;
            if (inputs.suara.trim()) promptEN += `**Character Voice Details:**\n${inputs.suara}\n\n`;
            if (inputs.aksi.trim()) promptEN += `**Character Action:**\n${inputs.aksi}\n\n`;
            if (inputs.ekspresi.trim()) promptEN += `**Character Expression:**\n${inputs.ekspresi}\n\n`;
            if (inputs.latar.trim()) promptEN += `**Setting & Time:**\n${inputs.latar}\n\n`;
            if (inputs.kamera || inputs.visualTambahan.trim()) {
                promptEN += `**Additional Visual Details:**\n`;
                if (inputs.kamera) promptEN += `Camera Movement: ${inputs.kamera}. `;
                if (inputs.visualTambahan.trim()) promptEN += inputs.visualTambahan;
                promptEN += `\n\n`;
            }
            if (inputs.suasana.trim()) promptEN += `**Overall Atmosphere:**\n${inputs.suasana}\n\n`;
            if (inputs.ambience.trim()) promptEN += `**Environmental Sound/Ambiance:**\n${inputs.ambience}\n\n`;
            if (inputs.dialog.trim()) promptEN += `**Character Dialog (in Indonesian):**\n${inputs.dialog}\n\n`;
            if (inputs.negatif.trim()) promptEN += `**Negative Prompt:**\n${inputs.negatif}`;
        
            setElementValue('output-en', promptEN);
        });
    }

    // Copy functionality
    const copyIdBtn = document.getElementById('copy-id-btn');
    const copyEnBtn = document.getElementById('copy-en-btn');

    if (copyIdBtn) {
        copyIdBtn.addEventListener('click', () => {
            const outputId = document.getElementById('output-id');
            if (outputId && outputId.value.trim()) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(outputId.value).then(() => {
                        copyIdBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyIdBtn.textContent = 'Copy Indonesian Prompt';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                        fallbackCopyTextToClipboard(outputId.value, copyIdBtn, 'Copy Indonesian Prompt');
                    });
                } else {
                    fallbackCopyTextToClipboard(outputId.value, copyIdBtn, 'Copy Indonesian Prompt');
                }
            } else {
                alert('No content to copy!');
            }
        });
    }

    if (copyEnBtn) {
        copyEnBtn.addEventListener('click', () => {
            const outputEn = document.getElementById('output-en');
            if (outputEn && outputEn.value.trim()) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(outputEn.value).then(() => {
                        copyEnBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyEnBtn.textContent = 'Copy English Prompt';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy: ', err);
                        fallbackCopyTextToClipboard(outputEn.value, copyEnBtn, 'Copy English Prompt');
                    });
                } else {
                    fallbackCopyTextToClipboard(outputEn.value, copyEnBtn, 'Copy English Prompt');
                }
            } else {
                alert('No content to copy!');
            }
        });
    }
}); 
