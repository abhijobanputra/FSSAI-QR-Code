/* app.js - FSSAI QR Code Generator and Reader App */

// Global App State
const state = {
    currentTab: 'generator', // 'generator' or 'scanner'
    activeTheme: 'dark', // 'dark' or 'high-contrast'
    generatedPayload: null,
    scannedPayload: null,
    html5QrScanner: null,
    speechUtterance: null
};

// -------------------------------------------------------------
// Presets / Food Templates Data
// -------------------------------------------------------------
const FOOD_PRESETS = [
    {
        id: 'choco-milk',
        btnText: '🍫 Milk Chocolate',
        data: {
            product_name: 'Milk Chocolate Silk',
            brand_name: 'ChocoDelight',
            fssai_license: '10021011000123',
            veg_status: 'veg',
            date_manufacture: '2026-05-01',
            expiry_date: '2026-11-01',
            storage_conditions: 'Store in a cool, dry place. Keep away from direct heat.',
            ingredients_list: 'Sugar, Cocoa Butter, Milk Solids (16%*), Cocoa Solids, Emulsifiers (Lecithin - INS 322, INS 476), Natural Vanilla Flavoring.',
            allergens: ['Milk', 'Soy'],
            serving_size: '20g (Approx. 4 Blocks)',
            servings_per_pack: '5',
            nutri_energy: 535,
            nutri_energy_rda: '10%',
            nutri_protein: 7.2,
            nutri_protein_rda: '-',
            nutri_carb: 56.4,
            nutri_carb_rda: '-',
            nutri_sugars: 55.0,
            nutri_sugars_rda: '-',
            nutri_added_sugars: 46.5,
            nutri_added_sugars_rda: '15%',
            nutri_fat: 31.2,
            nutri_fat_rda: '8%',
            nutri_sat_fat: 19.5,
            nutri_sat_fat_rda: '20%',
            nutri_trans_fat: 0.1,
            nutri_trans_fat_rda: '0%',
            nutri_cholesterol: 15,
            nutri_cholesterol_rda: '-',
            nutri_sodium: 95,
            nutri_sodium_rda: '5%',
            cc_address: 'ChocoDelight Foods Pvt. Ltd., Survey No 45, Phase 1, Industrial Area, Okhla, New Delhi - 110020',
            cc_email: 'support@chocodelight.in',
            cc_phone: '1800-11-1234'
        }
    },
    {
        id: 'apple-juice',
        btnText: '🍎 Apple Juice',
        data: {
            product_name: '100% Pressed Organic Apple Juice',
            brand_name: 'SunRipe Beverages',
            fssai_license: '10018022000567',
            veg_status: 'veg',
            date_manufacture: '2026-05-20',
            expiry_date: '2026-09-20',
            storage_conditions: 'Refrigerate after opening and consume within 5 days.',
            ingredients_list: '100% Organic Apple Juice Concentrate, Water, Antioxidant (Ascorbic Acid - INS 300).',
            allergens: ['None'],
            serving_size: '200ml',
            servings_per_pack: '1',
            nutri_energy: 46,
            nutri_energy_rda: '5%',
            nutri_protein: 0.1,
            nutri_protein_rda: '-',
            nutri_carb: 11.3,
            nutri_carb_rda: '-',
            nutri_sugars: 10.5,
            nutri_sugars_rda: '-',
            nutri_added_sugars: 0.0,
            nutri_added_sugars_rda: '0%',
            nutri_fat: 0.0,
            nutri_fat_rda: '0%',
            nutri_sat_fat: 0.0,
            nutri_sat_fat_rda: '0%',
            nutri_trans_fat: 0.0,
            nutri_trans_fat_rda: '0%',
            nutri_cholesterol: 0,
            nutri_cholesterol_rda: '-',
            nutri_sodium: 5,
            nutri_sodium_rda: '0.2%',
            cc_address: 'SunRipe Fruit Juices India Corp, Plot 45, Sector 4, GIDC Estate, Gandhinagar, Gujarat - 382010',
            cc_email: 'feedback@sunripe.in',
            cc_phone: '+91-79-98765432'
        }
    },
    {
        id: 'chicken-meatballs',
        btnText: '🍗 Chicken Meatballs',
        data: {
            product_name: 'Cheesy Chicken Meatballs (Ready to Cook)',
            brand_name: 'MeatBites Foods',
            fssai_license: '10015042000890',
            veg_status: 'nonveg',
            date_manufacture: '2026-06-01',
            expiry_date: '2026-07-01',
            storage_conditions: 'Keep frozen at -18°C or below. Do not refreeze after thawing.',
            ingredients_list: 'Chicken Meat (65%), Processed Cheese (15%) [Milk Solids, Salt, Culture, Emulsifier (INS 331, INS 339)], Water, Breadcrumbs [Wheat Flour, Yeast, Salt], Onion, Spices and Condiments, Stabilizer (INS 451).',
            allergens: ['Milk', 'Gluten'],
            serving_size: '100g (Approx. 5 meatballs)',
            servings_per_pack: '3.5',
            nutri_energy: 220,
            nutri_energy_rda: '11%',
            nutri_protein: 16.5,
            nutri_protein_rda: '-',
            nutri_carb: 8.5,
            nutri_carb_rda: '-',
            nutri_sugars: 0.5,
            nutri_sugars_rda: '-',
            nutri_added_sugars: 0.0,
            nutri_added_sugars_rda: '0%',
            nutri_fat: 13.8,
            nutri_fat_rda: '20%',
            nutri_sat_fat: 6.2,
            nutri_sat_fat_rda: '28%',
            nutri_trans_fat: 0.15,
            nutri_trans_fat_rda: '1%',
            nutri_cholesterol: 45,
            nutri_cholesterol_rda: '-',
            nutri_sodium: 480,
            nutri_sodium_rda: '24%',
            cc_address: 'MeatBites Frozen Foods Ltd., Survey No 110/3, Yelahanka Industrial Zone, Bengaluru, Karnataka - 560064',
            cc_email: 'care@meatbites.co.in',
            cc_phone: '+91-80-12345678'
        }
    }
];

// -------------------------------------------------------------
// Initialization & Startup
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTabListeners();
    initPresetButtons();
    initGeneratorForm();
    initAccessibilityVoiceAnnounce();
    initScannerModule();
});

// Theme setup (High Contrast Mode)
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    document.getElementById('toggle-contrast').addEventListener('click', () => {
        const nextTheme = state.activeTheme === 'dark' ? 'high-contrast' : 'dark';
        setTheme(nextTheme);
    });
}

function setTheme(theme) {
    state.activeTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// -------------------------------------------------------------
// Voice Intro Accessibility
// -------------------------------------------------------------
function initAccessibilityVoiceAnnounce() {
    const speakIntroBtn = document.getElementById('announce-page');
    
    speakIntroBtn.addEventListener('click', () => {
        window.speechSynthesis.cancel(); // cancel any active speech
        
        const introText = "Welcome to the FSSAI Compliant Food Label QR Code Generator and Scanner. This tool is designed to help businesses create labels accessible to the visually impaired, and help consumers read packaging ingredients, nutritional values, allergens, and expiry dates. Select the generator tab to create a new QR code, or the scanner tab to read an existing label. Press tab to navigate.";
        
        const utterance = new SpeechSynthesisUtterance(introText);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    });
}

// -------------------------------------------------------------
// Tabs Navigation
// -------------------------------------------------------------
function initTabListeners() {
    const tabGeneratorBtn = document.getElementById('tab-generator-btn');
    const tabScannerBtn = document.getElementById('tab-scanner-btn');
    const sectionGenerator = document.getElementById('section-generator');
    const sectionScanner = document.getElementById('section-scanner');

    tabGeneratorBtn.addEventListener('click', () => {
        switchTab('generator');
    });

    tabScannerBtn.addEventListener('click', () => {
        switchTab('scanner');
    });
    
    function switchTab(target) {
        state.currentTab = target;
        if (target === 'generator') {
            tabGeneratorBtn.classList.add('active');
            tabGeneratorBtn.setAttribute('aria-selected', 'true');
            tabScannerBtn.classList.remove('active');
            tabScannerBtn.setAttribute('aria-selected', 'false');
            sectionGenerator.classList.add('active');
            sectionScanner.classList.remove('active');
            // Stop scanning if camera is active
            stopWebcamScanner();
        } else {
            tabScannerBtn.classList.add('active');
            tabScannerBtn.setAttribute('aria-selected', 'true');
            tabGeneratorBtn.classList.remove('active');
            tabGeneratorBtn.setAttribute('aria-selected', 'false');
            sectionScanner.classList.add('active');
            sectionGenerator.classList.remove('active');
        }
    }
}

// -------------------------------------------------------------
// Preset Loader Code
// -------------------------------------------------------------
function initPresetButtons() {
    const container = document.getElementById('preset-buttons-container');
    
    FOOD_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset-btn';
        btn.textContent = preset.btnText;
        btn.addEventListener('click', () => loadPreset(preset.data));
        container.appendChild(btn);
    });

    // Load first preset by default
    loadPreset(FOOD_PRESETS[0].data);
}

function loadPreset(data) {
    // Fill basic fields
    document.getElementById('product_name').value = data.product_name;
    document.getElementById('brand_name').value = data.brand_name || '';
    document.getElementById('fssai_license').value = data.fssai_license;
    document.getElementById('veg_status').value = data.veg_status;
    document.getElementById('date_manufacture').value = data.date_manufacture;
    document.getElementById('expiry_date').value = data.expiry_date;
    document.getElementById('storage_conditions').value = data.storage_conditions || '';
    document.getElementById('ingredients_list').value = data.ingredients_list;
    document.getElementById('serving_size').value = data.serving_size || '';
    document.getElementById('servings_per_pack').value = data.servings_per_pack || '';
    
    // Fill allergens checkboxes
    const allergenCheckboxes = document.querySelectorAll('input[name="allergens"]');
    allergenCheckboxes.forEach(cb => {
        cb.checked = data.allergens.includes(cb.value);
    });

    // Fill nutritional facts
    document.getElementById('nutri_energy').value = data.nutri_energy;
    document.getElementById('nutri_energy_rda').value = data.nutri_energy_rda;
    document.getElementById('nutri_protein').value = data.nutri_protein;
    document.getElementById('nutri_protein_rda').value = data.nutri_protein_rda;
    document.getElementById('nutri_carb').value = data.nutri_carb;
    document.getElementById('nutri_carb_rda').value = data.nutri_carb_rda;
    document.getElementById('nutri_sugars').value = data.nutri_sugars;
    document.getElementById('nutri_sugars_rda').value = data.nutri_sugars_rda;
    document.getElementById('nutri_added_sugars').value = data.nutri_added_sugars;
    document.getElementById('nutri_added_sugars_rda').value = data.nutri_added_sugars_rda;
    document.getElementById('nutri_fat').value = data.nutri_fat;
    document.getElementById('nutri_fat_rda').value = data.nutri_fat_rda;
    document.getElementById('nutri_sat_fat').value = data.nutri_sat_fat;
    document.getElementById('nutri_sat_fat_rda').value = data.nutri_sat_fat_rda;
    document.getElementById('nutri_trans_fat').value = data.nutri_trans_fat;
    document.getElementById('nutri_trans_fat_rda').value = data.nutri_trans_fat_rda;
    document.getElementById('nutri_cholesterol').value = data.nutri_cholesterol;
    document.getElementById('nutri_cholesterol_rda').value = data.nutri_cholesterol_rda;
    document.getElementById('nutri_sodium').value = data.nutri_sodium;
    document.getElementById('nutri_sodium_rda').value = data.nutri_sodium_rda;

    // Fill customer care
    document.getElementById('cc_address').value = data.cc_address;
    document.getElementById('cc_email').value = data.cc_email;
    document.getElementById('cc_phone').value = data.cc_phone;

    // Automatically generate the QR code for this preset so they see it immediately
    const payload = compileFormPayload();
    state.generatedPayload = payload;
    document.getElementById('raw-json-output').textContent = JSON.stringify(payload, null, 2);
    generateQRCode(payload);
    
    // Enable buttons
    document.getElementById('btn-download-qr').disabled = false;
    document.getElementById('btn-share-payload').disabled = false;
}

// -------------------------------------------------------------
// Generator Form Logic
// -------------------------------------------------------------
function initGeneratorForm() {
    const form = document.getElementById('fssai-generator-form');
    const btnDownload = document.getElementById('btn-download-qr');
    const btnShare = document.getElementById('btn-share-payload');
    const btnCopyRaw = document.getElementById('btn-copy-raw-json');

    // Handle "None" allergen toggle
    const allergenCheckboxes = document.querySelectorAll('input[name="allergens"]');
    allergenCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target.value === 'None' && e.target.checked) {
                // Uncheck all other options
                allergenCheckboxes.forEach(otherCb => {
                    if (otherCb.value !== 'None') otherCb.checked = false;
                });
            } else if (e.target.value !== 'None' && e.target.checked) {
                // Uncheck the "None" options
                allergenCheckboxes.forEach(otherCb => {
                    if (otherCb.value === 'None') otherCb.checked = false;
                });
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Compile JSON Payload
        const payload = compileFormPayload();
        state.generatedPayload = payload;
        
        // Render JSON in Preview panel
        const rawOutput = document.getElementById('raw-json-output');
        rawOutput.textContent = JSON.stringify(payload, null, 2);
        
        // Render QR Code
        generateQRCode(payload);
        
        // Enable buttons
        btnDownload.disabled = false;
        btnShare.disabled = false;
    });

    // Copy Raw JSON Actions
    btnCopyRaw.addEventListener('click', () => {
        if (!state.generatedPayload) return;
        copyTextToClipboard(JSON.stringify(state.generatedPayload, null, 2), btnCopyRaw);
    });

    btnShare.addEventListener('click', () => {
        if (!state.generatedPayload) return;
        copyTextToClipboard(JSON.stringify(state.generatedPayload), btnShare, 'Payload copied!');
    });

    btnDownload.addEventListener('click', () => {
        const img = document.querySelector('#qrcode-wrapper img');
        if (!img) return;
        
        const dataUrl = img.src;
        const link = document.createElement('a');
        link.download = `fssai-qr-${state.generatedPayload.product_name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = dataUrl;
        link.click();
    });
}

function compileFormPayload() {
    // Get allergens list
    const allergenList = [];
    const allergenCheckboxes = document.querySelectorAll('input[name="allergens"]:checked');
    allergenCheckboxes.forEach(cb => allergenList.push(cb.value));
    if (allergenList.length === 0) {
        allergenList.push('None');
    }

    const payload = {
        fssai_guidelines_compliant: true,
        
        product_name: document.getElementById('product_name').value.trim(),
        brand_name: document.getElementById('brand_name').value.trim(),
        fssai_license: document.getElementById('fssai_license').value.trim(),
        veg_status: document.getElementById('veg_status').value,
        
        date_marking_shelf_life: {
            date_manufacture: document.getElementById('date_manufacture').value,
            expiry_date: document.getElementById('expiry_date').value,
            storage_conditions: document.getElementById('storage_conditions').value.trim()
        },
        
        ingredients_list: document.getElementById('ingredients_list').value.trim(),
        allergen_declaration: allergenList,
        
        nutritional_facts: {
            serving_size: document.getElementById('serving_size').value.trim(),
            servings_per_pack: document.getElementById('servings_per_pack').value.trim(),
            nutrients: {
                energy: { 
                    value: parseFloat(document.getElementById('nutri_energy').value) || 0, 
                    unit: 'kcal',
                    rda: document.getElementById('nutri_energy_rda').value.trim() || '-'
                },
                protein: { 
                    value: parseFloat(document.getElementById('nutri_protein').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_protein_rda').value.trim() || '-'
                },
                carbohydrates: { 
                    value: parseFloat(document.getElementById('nutri_carb').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_carb_rda').value.trim() || '-'
                },
                total_sugars: { 
                    value: parseFloat(document.getElementById('nutri_sugars').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_sugars_rda').value.trim() || '-'
                },
                added_sugars: { 
                    value: parseFloat(document.getElementById('nutri_added_sugars').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_added_sugars_rda').value.trim() || '-'
                },
                total_fat: { 
                    value: parseFloat(document.getElementById('nutri_fat').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_fat_rda').value.trim() || '-'
                },
                saturated_fat: { 
                    value: parseFloat(document.getElementById('nutri_sat_fat').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_sat_fat_rda').value.trim() || '-'
                },
                trans_fat: { 
                    value: parseFloat(document.getElementById('nutri_trans_fat').value) || 0, 
                    unit: 'g',
                    rda: document.getElementById('nutri_trans_fat_rda').value.trim() || '-'
                },
                cholesterol: { 
                    value: parseFloat(document.getElementById('nutri_cholesterol').value) || 0, 
                    unit: 'mg',
                    rda: document.getElementById('nutri_cholesterol_rda').value.trim() || '-'
                },
                sodium: { 
                    value: parseFloat(document.getElementById('nutri_sodium').value) || 0, 
                    unit: 'mg',
                    rda: document.getElementById('nutri_sodium_rda').value.trim() || '-'
                }
            }
        },
        
        customer_care_details: {
            company_name_address: document.getElementById('cc_address').value.trim(),
            email: document.getElementById('cc_email').value.trim(),
            phone: document.getElementById('cc_phone').value.trim()
        }
    };

    return payload;
}

// QRCode.js rendering implementation
function generateQRCode(payload) {
    const wrapper = document.getElementById('qrcode-wrapper');
    wrapper.innerHTML = ''; // clear placeholder or previous images
    
    // We convert payload to compact JSON string
    const payloadStr = JSON.stringify(payload);
    
    // Config parameters: high resolution, error correction Q (25% damage recovery), and standard margin
    QRCode.toDataURL(payloadStr, {
        width: 600,
        margin: 4,
        errorCorrectionLevel: 'Q',
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    }, function (error, url) {
        if (error) {
            console.error(error);
            wrapper.innerHTML = `<p class="error">Failed to generate QR Code: ${error.message}</p>`;
            return;
        }
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = `QR Code for ${payload.product_name}`;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.width = '240px';
        img.style.display = 'block';
        img.style.backgroundColor = '#ffffff';
        img.style.padding = '8px';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        
        wrapper.appendChild(img);
    });
}

// -------------------------------------------------------------
// Scanner & Reader Logic (via webcam or files)
// -------------------------------------------------------------
function initScannerModule() {
    const btnStartCam = document.getElementById('btn-start-camera');
    const btnStopCam = document.getElementById('btn-stop-camera');
    const fileQrInput = document.getElementById('file-qr-input');
    const fileDropZone = document.getElementById('file-drop-zone');
    
    // Audio buttons
    const btnSpeak = document.getElementById('btn-speak-now');
    const btnStopSpeech = document.getElementById('btn-stop-speech');
    
    // WebCam Scan Trigger
    btnStartCam.addEventListener('click', () => {
        startWebcamScanner();
    });

    btnStopCam.addEventListener('click', () => {
        stopWebcamScanner();
    });

    // File Selection Trigger
    fileQrInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            processQrFile(file);
        }
    });

    // Drag-Drop File Upload Zone
    fileDropZone.addEventListener('click', () => {
        fileQrInput.click();
    });

    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropZone.style.borderColor = 'var(--primary-color)';
    });

    fileDropZone.addEventListener('dragleave', () => {
        fileDropZone.style.borderColor = 'var(--border-color)';
    });

    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropZone.style.borderColor = 'var(--border-color)';
        const file = e.dataTransfer.files[0];
        if (file) {
            processQrFile(file);
        }
    });

    // Copy scanned JSON Button
    document.getElementById('btn-copy-scanned-json').addEventListener('click', () => {
        if (!state.scannedPayload) return;
        copyTextToClipboard(JSON.stringify(state.scannedPayload, null, 2), document.getElementById('btn-copy-scanned-json'));
    });

    // Voice Readout playback listeners
    btnSpeak.addEventListener('click', () => {
        playAccessibilityReadout();
    });

    btnStopSpeech.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        document.getElementById('tts-status-text').textContent = "Audio Readout Available";
    });
}

// Camera Scanner Implementation
function startWebcamScanner() {
    if (state.html5QrScanner) {
        stopWebcamScanner();
    }

    const cameraPlaceholder = document.getElementById('camera-placeholder');
    const laser = document.getElementById('scanner-laser-element');
    const btnStartCam = document.getElementById('btn-start-camera');
    const btnStopCam = document.getElementById('btn-stop-camera');

    cameraPlaceholder.style.display = 'none';
    laser.style.display = 'block';
    btnStartCam.style.display = 'none';
    btnStopCam.style.display = 'block';
    
    // Show visual guidance overlay and tips card
    document.getElementById('scanner-frame-element').style.display = 'block';
    document.getElementById('camera-guidance-info').style.display = 'block';

    try {
        state.html5QrScanner = new Html5Qrcode("reader-webcam", /* verbose= */ true);
        
        state.html5QrScanner.start(
            { facingMode: "environment" },
            {
                fps: 15
                // Scan full frame for maximum speed and scan reliability
            },
            (decodedText) => {
                // Success handler
                stopWebcamScanner();
                handleScannerSuccess(decodedText);
            },
            (errorMessage) => {
                // Error handler: quiet logs
            }
        ).catch(err => {
            console.error("Camera scan failed to launch inside start promise:", err);
            cleanupScannerOnError();
        });
    } catch (err) {
        console.error("Error creating Html5Qrcode instance:", err);
        cleanupScannerOnError();
    }

    function cleanupScannerOnError() {
        state.html5QrScanner = null;
        cameraPlaceholder.style.display = 'flex';
        laser.style.display = 'none';
        btnStartCam.style.display = 'block';
        btnStopCam.style.display = 'none';
        
        // Hide visual guidance overlay and tips card
        document.getElementById('scanner-frame-element').style.display = 'none';
        document.getElementById('camera-guidance-info').style.display = 'none';
        
        alert("Unable to open camera. Check permissions or upload an image of the QR code instead.");
    }
}

function stopWebcamScanner() {
    const cameraPlaceholder = document.getElementById('camera-placeholder');
    const laser = document.getElementById('scanner-laser-element');
    const btnStartCam = document.getElementById('btn-start-camera');
    const btnStopCam = document.getElementById('btn-stop-camera');

    const resetUI = () => {
        state.html5QrScanner = null;
        cameraPlaceholder.style.display = 'flex';
        laser.style.display = 'none';
        btnStartCam.style.display = 'block';
        btnStopCam.style.display = 'none';
        
        // Hide visual guidance overlay and tips card
        document.getElementById('scanner-frame-element').style.display = 'none';
        document.getElementById('camera-guidance-info').style.display = 'none';
    };

    if (state.html5QrScanner) {
        state.html5QrScanner.stop()
            .then(resetUI)
            .catch(err => {
                console.error("Error stopping camera scan:", err);
                resetUI();
            });
    } else {
        resetUI();
    }
}

// File Scanner Implementation using jsQR
function processQrFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            try {
                // Create a canvas to extract image data
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw solid white background first to avoid transparent pixels breaking jsQR binarization!
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                context.drawImage(img, 0, 0);
                
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "attemptBoth",
                });
                
                if (code) {
                    handleScannerSuccess(code.data);
                } else {
                    console.warn("jsQR: no QR code found in file upload.");
                    alert("Could not decode any QR Code from this image file. Please verify it is a valid FSSAI compliance QR code.");
                }
            } catch (err) {
                console.error("File decode error:", err);
                alert("Failed to process the uploaded image. Ensure it is a valid picture file.");
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// -------------------------------------------------------------
// Scanner Success Handler & Validation
// -------------------------------------------------------------
function handleScannerSuccess(decodedText) {
    let parsedData = null;
    
    // Attempt parsing JSON
    try {
        parsedData = JSON.parse(decodedText);
    } catch (err) {
        // Fallback if the QR code is just plain text
        parsedData = parsePlainTextQR(decodedText);
    }

    state.scannedPayload = parsedData;

    // Render JSON in panel
    document.getElementById('scanned-json-output').textContent = JSON.stringify(parsedData, null, 2);

    // Build plain text Screen-reader friendly layout
    renderScreenReaderCard(parsedData);

    // Run FSSAI compliance validator
    runComplianceCheck(parsedData);

    // Enable voice play buttons
    document.getElementById('btn-speak-now').disabled = false;
    document.getElementById('btn-stop-speech').disabled = false;

    // Trigger voice readout automatically
    playAccessibilityReadout();
}

// Fallback plain text parsed mapping
function parsePlainTextQR(text) {
    return {
        fssai_guidelines_compliant: false,
        product_name: "Unstructured QR Label",
        ingredients_list: text,
        allergen_declaration: ["Unspecified"],
        date_marking_shelf_life: {
            date_manufacture: "Unknown",
            expiry_date: "Unknown",
            storage_conditions: "Not provided"
        },
        nutritional_facts: {
            serving_size: "Unknown",
            servings_per_pack: "Unknown",
            nutrients: {}
        },
        customer_care_details: {
            company_name_address: "Not specified",
            email: "Not specified",
            phone: "Not specified"
        }
    };
}

// -------------------------------------------------------------
// Screen Reader View Rendering
// -------------------------------------------------------------
function renderScreenReaderCard(data) {
    const container = document.getElementById('accessibility-card');
    container.innerHTML = ''; // Clear prior placeholder

    // Build accessibility container
    const article = document.createElement('article');
    article.setAttribute('aria-label', `Product label details for ${data.product_name}`);

    // Title / Brand
    const titleBlock = document.createElement('div');
    titleBlock.className = 'acc-title';
    
    const vegBadgeHtml = data.veg_status === 'veg' 
        ? `<span class="veg-badge" title="Vegetarian"><span class="veg-circle"></span></span>`
        : `<span class="nonveg-badge" title="Non-Vegetarian"><span class="nonveg-triangle"></span></span>`;

    titleBlock.innerHTML = `
        ${vegBadgeHtml}
        <h2>${data.product_name}</h2>
    `;
    article.appendChild(titleBlock);

    // Sub-brand / FSSAI License
    const brandBlock = document.createElement('div');
    brandBlock.className = 'acc-section';
    brandBlock.innerHTML = `
        <p><strong>Brand:</strong> ${data.brand_name || 'N/A'}</p>
        <p><strong>FSSAI License Number:</strong> ${data.fssai_license || 'Not provided'}</p>
    `;
    article.appendChild(brandBlock);

    // Allergens
    const allergenBlock = document.createElement('div');
    allergenBlock.className = 'acc-section';
    
    let allergenClass = 'text-primary';
    let allergenPrefix = '⚠️ Allergen Statement: ';
    if (data.allergen_declaration.includes('None')) {
        allergenClass = 'text-muted';
        allergenPrefix = '✅ Allergen Status: ';
    }
    
    allergenBlock.innerHTML = `
        <h4>Allergen Declaration</h4>
        <p class="${allergenClass}"><strong>${allergenPrefix}</strong> ${data.allergen_declaration.join(', ')}</p>
    `;
    article.appendChild(allergenBlock);

    // Expiry and dates
    const dateBlock = document.createElement('div');
    dateBlock.className = 'acc-section';
    const storageHtml = data.date_marking_shelf_life.storage_conditions 
        ? `<p><strong>Storage Conditions:</strong> ${data.date_marking_shelf_life.storage_conditions}</p>`
        : '';
    dateBlock.innerHTML = `
        <h4>Dates & Shelf Life</h4>
        <p><strong>Manufactured On:</strong> ${formatReadableDate(data.date_marking_shelf_life.date_manufacture)}</p>
        <p><strong>Expiry / Best Before:</strong> ${formatReadableDate(data.date_marking_shelf_life.expiry_date)}</p>
        ${storageHtml}
    `;
    article.appendChild(dateBlock);

    // Ingredients
    const ingredientsBlock = document.createElement('div');
    ingredientsBlock.className = 'acc-section';
    ingredientsBlock.innerHTML = `
        <h4>Ingredients</h4>
        <p>${data.ingredients_list}</p>
    `;
    article.appendChild(ingredientsBlock);

    // Nutritional Info Table
    const nutritionBlock = document.createElement('div');
    nutritionBlock.className = 'acc-section';
    
    let nutrientRows = '';
    if (data.nutritional_facts && data.nutritional_facts.nutrients) {
        const nutrients = data.nutritional_facts.nutrients;
        for (const [key, value] of Object.entries(nutrients)) {
            const nutrientName = key.replace(/_/g, ' ').toUpperCase();
            nutrientRows += `
                <tr>
                    <td>${nutrientName}</td>
                    <td>${value.value} ${value.unit}</td>
                    <td>${value.rda || '-'}</td>
                </tr>
            `;
        }
    }
    
    const servingInfo = data.nutritional_facts.serving_size 
        ? `<p><strong>Serving Size:</strong> ${data.nutritional_facts.serving_size} ${data.nutritional_facts.servings_per_pack ? `| <strong>Servings Per Pack:</strong> ${data.nutritional_facts.servings_per_pack}` : ''}</p>`
        : '';

    nutritionBlock.innerHTML = `
        <h4>Nutritional Information</h4>
        ${servingInfo}
        <table class="nutri-table" summary="Nutritional values per 100g or ml, and Recommended Daily Allowance per serve.">
            <thead>
                <tr>
                    <th scope="col">Nutrient</th>
                    <th scope="col">Per 100g/ml</th>
                    <th scope="col">Per Serve (% RDA)</th>
                </tr>
            </thead>
            <tbody>
                ${nutrientRows || '<tr><td colspan="3">No nutritional entries found.</td></tr>'}
            </tbody>
        </table>
    `;
    article.appendChild(nutritionBlock);

    // Customer Care Details
    const ccBlock = document.createElement('div');
    ccBlock.className = 'acc-section';
    ccBlock.innerHTML = `
        <h4>Customer Care Details</h4>
        <p><strong>Company Name & Address:</strong> ${data.customer_care_details.company_name_address}</p>
        <p><strong>Customer Helpline:</strong> ${data.customer_care_details.phone}</p>
        <p><strong>Customer Email:</strong> <a href="mailto:${data.customer_care_details.email}">${data.customer_care_details.email}</a></p>
    `;
    article.appendChild(ccBlock);

    container.appendChild(article);
}

// -------------------------------------------------------------
// Voice Synthesizer - Text-to-Speech (TTS)
// -------------------------------------------------------------
function playAccessibilityReadout() {
    window.speechSynthesis.cancel(); // kill existing playback

    const data = state.scannedPayload;
    if (!data) return;

    const statusText = document.getElementById('tts-status-text');
    statusText.textContent = "🔊 Reading details aloud...";

    // Build highly clear speech text
    let textToSpeak = `Product Name. ${data.product_name}. `;
    if (data.brand_name) {
        textToSpeak += `Brand Name. ${data.brand_name}. `;
    }
    
    textToSpeak += `Veg status is ${data.veg_status === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}. `;
    
    // Allergen warnings
    if (data.allergen_declaration.includes('None') || data.allergen_declaration.length === 0) {
        textToSpeak += `Allergen declaration. No major allergens declared. `;
    } else {
        textToSpeak += `Allergen warning. Contains the following allergens: ${data.allergen_declaration.join(', ')}. `;
    }

    // Expiry Dates
    textToSpeak += `Manufactured on ${formatVoiceDate(data.date_marking_shelf_life.date_manufacture)}. `;
    textToSpeak += `Best before or expiry date is ${formatVoiceDate(data.date_marking_shelf_life.expiry_date)}. `;
    if (data.date_marking_shelf_life.storage_conditions) {
        textToSpeak += `Storage conditions: ${data.date_marking_shelf_life.storage_conditions}. `;
    }

    // Customer care
    textToSpeak += `Customer helpline number is ${speakSpellOutNumber(data.customer_care_details.phone)}. `;
    textToSpeak += `Customer email is ${data.customer_care_details.email}. `;

    // FSSAI license spell out
    if (data.fssai_license) {
        textToSpeak += `FSSAI license number is ${speakSpellOutNumber(data.fssai_license)}. `;
    }

    // Ingredients
    textToSpeak += `Ingredients list: ${data.ingredients_list}. `;

    // Nutritional Info
    if (data.nutritional_facts && data.nutritional_facts.nutrients) {
        textToSpeak += `Nutritional facts summary. `;
        if (data.nutritional_facts.serving_size) {
            textToSpeak += `Serving size is ${data.nutritional_facts.serving_size}. `;
        }
        const nutrients = data.nutritional_facts.nutrients;
        if (nutrients.energy) textToSpeak += `Energy, ${nutrients.energy.value} kilocalories. RDA percentage is ${nutrients.energy.rda || 'Not declared'}. `;
        if (nutrients.protein) textToSpeak += `Protein, ${nutrients.protein.value} grams. `;
        if (nutrients.carbohydrates) textToSpeak += `Carbohydrates, ${nutrients.carbohydrates.value} grams. `;
        if (nutrients.total_sugars) textToSpeak += `Total sugars, ${nutrients.total_sugars.value} grams. `;
        if (nutrients.added_sugars) textToSpeak += `Added sugars, ${nutrients.added_sugars.value} grams. RDA percentage is ${nutrients.added_sugars.rda || 'Not declared'}. `;
        if (nutrients.total_fat) textToSpeak += `Total fat, ${nutrients.total_fat.value} grams. RDA percentage is ${nutrients.total_fat.rda || 'Not declared'}. `;
        if (nutrients.sodium) textToSpeak += `Sodium, ${nutrients.sodium.value} milligrams. RDA percentage is ${nutrients.sodium.rda || 'Not declared'}. `;
    }

    textToSpeak += `End of product label readout.`;

    // Initialize Utterance
    state.speechUtterance = new SpeechSynthesisUtterance(textToSpeak);
    state.speechUtterance.rate = 0.95; // Slightly slower for comprehension
    
    state.speechUtterance.onend = () => {
        statusText.textContent = "Audio Readout Completed";
    };

    state.speechUtterance.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
        statusText.textContent = "Audio Readout Error";
    };

    window.speechSynthesis.speak(state.speechUtterance);
}

// Helper: Spell out License digits and helpline numbers clearly
function speakSpellOutNumber(numStr) {
    if (!numStr) return '';
    return numStr.toString().split('').map(char => {
        if (char >= '0' && char <= '9') {
            return char + ' ';
        } else if (char === '-') {
            return 'dash ';
        } else if (char === '+') {
            return 'plus ';
        }
        return char;
    }).join('');
}

// -------------------------------------------------------------
// FSSAI Compliance Verification Engine
// -------------------------------------------------------------
function runComplianceCheck(data) {
    const list = document.getElementById('compliance-checklist-container');
    list.innerHTML = ''; // Clear awaiting message

    const checks = [];

    // Check 1: 14 digit license
    const licRegex = /^\d{14}$/;
    if (data.fssai_license && licRegex.test(data.fssai_license)) {
        checks.push({
            status: 'pass',
            icon: '✅',
            title: 'FSSAI License Verified',
            desc: `Valid 14-digit FSSAI License: ${data.fssai_license}`
        });
    } else {
        checks.push({
            status: 'fail',
            icon: '❌',
            title: 'FSSAI License Error',
            desc: 'A valid 14-digit numeric FSSAI license number is required for Indian compliance.'
        });
    }

    // Check 2: Expiry Date check
    const mfgDate = new Date(data.date_marking_shelf_life.date_manufacture);
    const expDate = new Date(data.date_marking_shelf_life.expiry_date);
    const today = new Date();

    if (isNaN(mfgDate.getTime()) || isNaN(expDate.getTime())) {
        checks.push({
            status: 'fail',
            icon: '❌',
            title: 'Date Markings Missing',
            desc: 'Date of Manufacture or Expiry details are invalid or missing.'
        });
    } else if (expDate <= mfgDate) {
        checks.push({
            status: 'fail',
            icon: '❌',
            title: 'Expiry Date Conflict',
            desc: 'Expiry date cannot be equal to or prior to the Manufacturing date.'
        });
    } else if (expDate < today) {
        checks.push({
            status: 'warning',
            icon: '⚠️',
            title: 'Product Expired',
            desc: `This product reached its expiry or best before date on ${formatReadableDate(data.date_marking_shelf_life.expiry_date)}.`
        });
    } else {
        checks.push({
            status: 'pass',
            icon: '✅',
            title: 'Shelf-Life Validity',
            desc: `Product is within shelf-life. Expires: ${formatReadableDate(data.date_marking_shelf_life.expiry_date)}`
        });
    }

    // Check 3: Allergen declarations safety match
    const allergens = data.allergen_declaration;
    const ingredients = data.ingredients_list.toLowerCase();
    
    if (allergens.includes('None') && allergens.length > 1) {
        checks.push({
            status: 'warning',
            icon: '⚠️',
            title: 'Allergen Declaration Conflict',
            desc: '"No Allergens" was checked alongside specific food allergens.'
        });
    } else if (!allergens.includes('None')) {
        // Double check ingredients matches allergen warnings
        const missingMatches = [];
        allergens.forEach(allergen => {
            const checkTerm = allergen.toLowerCase();
            // simple check: if allergen is Milk, check if "milk" or "cheese" or "dairy" is in ingredients
            if (checkTerm === 'milk' && !ingredients.includes('milk') && !ingredients.includes('cheese') && !ingredients.includes('butter') && !ingredients.includes('solid')) {
                missingMatches.push('Milk');
            }
            if (checkTerm === 'gluten' && !ingredients.includes('wheat') && !ingredients.includes('gluten') && !ingredients.includes('barley') && !ingredients.includes('flour')) {
                missingMatches.push('Gluten');
            }
            if (checkTerm === 'soy' && !ingredients.includes('soy') && !ingredients.includes('lecithin')) {
                missingMatches.push('Soy');
            }
        });
        
        if (missingMatches.length > 0) {
            checks.push({
                status: 'warning',
                icon: '⚠️',
                title: 'Allergen Ingredient Verification',
                desc: `Declared allergen: (${missingMatches.join(', ')}) was not directly matched inside the ingredients text. Ensure accurate labelling.`
            });
        } else {
            checks.push({
                status: 'pass',
                icon: '✅',
                title: 'Allergen Declarations Compliant',
                desc: `Mandatory allergens (${allergens.join(', ')}) are declared and match listed ingredients.`
            });
        }
    } else {
        checks.push({
            status: 'pass',
            icon: '✅',
            title: 'Allergens Declared Clear',
            desc: 'Label declares no critical allergens present.'
        });
    }

    // Check 4: Nutritional Fields Compliances
    const nutrients = data.nutritional_facts.nutrients;
    const requiredNutrients = ['energy', 'protein', 'carbohydrates', 'total_sugars', 'added_sugars', 'total_fat', 'saturated_fat', 'trans_fat', 'sodium'];
    const missingNutrients = [];

    requiredNutrients.forEach(nutrient => {
        if (!nutrients || !nutrients[nutrient] || nutrients[nutrient].value === undefined) {
            missingNutrients.push(nutrient.replace(/_/g, ' '));
        }
    });

    if (missingNutrients.length > 0) {
        checks.push({
            status: 'fail',
            icon: '❌',
            title: 'Mandatory Nutrition Values Missing',
            desc: `FSSAI 2020 regulations require: (${missingNutrients.join(', ')}) values to be listed on consumer packaging.`
        });
    } else {
        checks.push({
            status: 'pass',
            icon: '✅',
            title: 'Nutritional Profile Complete',
            desc: 'All 9 FSSAI mandatory macro-nutrients, added sugars, and sodium values are provided.'
        });
    }

    // Check 5: Customer Care check
    const cc = data.customer_care_details;
    if (cc && cc.company_name_address && cc.email && cc.phone) {
        checks.push({
            status: 'pass',
            icon: '✅',
            title: 'Customer Grievance Contacts',
            desc: 'Helpline telephone number, business email, and postal address are fully declared.'
        });
    } else {
        checks.push({
            status: 'fail',
            icon: '❌',
            title: 'Customer Contacts Incomplete',
            desc: 'FSSAI mandates customer care email, address, and telephone hotline be present.'
        });
    }

    // Render results in checklist UI
    checks.forEach(check => {
        const item = document.createElement('li');
        item.className = `compliance-item ${check.status}`;
        item.innerHTML = `
            <span class="compliance-icon">${check.icon}</span>
            <div class="compliance-text">
                <h5>${check.title}</h5>
                <p>${check.desc}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

// -------------------------------------------------------------
// Common Utilities
// -------------------------------------------------------------
function formatReadableDate(dateString) {
    if (!dateString || dateString === 'Unknown') return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return dateString;
    }
}

function formatVoiceDate(dateString) {
    if (!dateString || dateString === 'Unknown') return 'unspecified';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateString;
    }
}

function copyTextToClipboard(text, btnElement, successMsg = 'Copied!') {
    const originalText = btnElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        btnElement.textContent = successMsg;
        btnElement.style.backgroundColor = 'var(--primary-color)';
        setTimeout(() => {
            btnElement.textContent = originalText;
            btnElement.style.backgroundColor = '';
        }, 1500);
    }).catch(err => {
        console.error('Clipboard copy failed: ', err);
    });
}
