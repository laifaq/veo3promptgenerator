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

    const getElementValue = id => document.getElementById(id).value;
    const setElementValue = (id, value) => { document.getElementById(id).value = value; };

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

        // Generate Indonesian Prompt
        let promptID = `**Judul Scene:** ${inputs.judul}\n\n`;
        promptID += `**Karakter:**\n${inputs.karakter}\n\n`;
        promptID += `**Detail Suara:**\n${inputs.suara}\n\n`;
        promptID += `**Aksi:**\n${inputs.aksi}\n\n`;
        promptID += `**Ekspresi:**\n${inputs.ekspresi}\n\n`;
        promptID += `**Latar & Waktu:**\n${inputs.latar}\n\n`;
        promptID += `**Detail Visual:**\nGerakan Kamera: ${inputs.kamera}. ${inputs.visualTambahan}\n\n`;
        promptID += `**Suasana:**\n${inputs.suasana}\n\n`;
        promptID += `**Suara Lingkungan:**\n${inputs.ambience}\n\n`;
        promptID += `**Dialog:**\n${inputs.dialog}\n\n`;
        promptID += `**Negative Prompt:**\n${inputs.negatif}`;

        setElementValue('output-id', promptID);

        // Generate English Prompt
        let promptEN = `**Scene Title:** ${inputs.judul}\n\n`;
        promptEN += `**Core Character:**\n${inputs.karakter}\n\n`;
        promptEN += `**Character Voice Details:**\n${inputs.suara}\n\n`;
        promptEN += `**Character Action:**\n${inputs.aksi}\n\n`;
        promptEN += `**Character Expression:**\n${inputs.ekspresi}\n\n`;
        promptEN += `**Setting & Time:**\n${inputs.latar}\n\n`;
        promptEN += `**Additional Visual Details:**\nCamera Movement: ${inputs.kamera}. ${inputs.visualTambahan}\n\n`;
        promptEN += `**Overall Atmosphere:**\n${inputs.suasana}\n\n`;
        promptEN += `**Environmental Sound/Ambiance:**\n${inputs.ambience}\n\n`;
        promptEN += `**Character Dialog (in Indonesian):**\n${inputs.dialog}\n\n`;
        promptEN += `**Negative Prompt:**\n${inputs.negatif}`;
        
        setElementValue('output-en', promptEN);
    });
}); 