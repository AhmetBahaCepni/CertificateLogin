const { app, BrowserWindow, ipcMain } = require('electron');
const pkcs11js = require('pkcs11js');
const forge = require('node-forge');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, '.env') });

let mainWindow;

const HSMpath = process.env.HSM_LIB_PATH || "C:\\SoftHSM2\\lib\\softhsm2-X64.dll";

console.log("HSM Path:", HSMpath);

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: __dirname + "/preload.js"
        }
    });
    mainWindow.loadFile("index.html");
});

// Handler to get available slots
ipcMain.handle('get-slots', async () => {
    try {
        let pkcs11 = new pkcs11js.PKCS11();
        pkcs11.load(HSMpath);
        pkcs11.C_Initialize();

        // Getting list of slots
        let slots = pkcs11.C_GetSlotList(true);
        if (slots.length === 0) throw new Error("HSM bulunamadı!");
        
        // Get token labels for display
        let tokenLabels = [];
        for (let i = 0; i < slots.length; i++) {
            let tokenInfo = pkcs11.C_GetTokenInfo(slots[i]);
            let tokenLabel = tokenInfo.label.trim();
            tokenLabels.push(`Slot ${i} - ${tokenLabel}`);
        }
        
        pkcs11.C_Finalize();
        
        return tokenLabels;
    } catch (error) {
        console.error("Error getting slots:", error);
        throw error;
    }
});

// Handler for sign-in process
ipcMain.handle('sign-in', async (event, data) => {
    const { slotIndex, pin, code } = data;
    
    try {
        let pkcs11 = new pkcs11js.PKCS11();
        pkcs11.load(HSMpath);
        pkcs11.C_Initialize();

        let slots = pkcs11.C_GetSlotList(true);
        if (slots.length === 0) throw new Error("HSM bulunamadı!");
        
        if (slotIndex < 0 || slotIndex >= slots.length) {
            throw new Error("Geçersiz slot indeksi!");
        }

        // Open session with selected slot
        let session = pkcs11.C_OpenSession(slots[slotIndex], pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        
        // Login with provided PIN
        try {
            pkcs11.C_Login(session, 1, pin);
        } catch (error) {
            throw new Error("PIN doğrulanamadı: " + error.message);
        }

        // Find certificate objects
        let objects = pkcs11.C_FindObjectsInit(session, [
            { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_CERTIFICATE }
        ]);
        let obj = pkcs11.C_FindObjects(session);
        pkcs11.C_FindObjectsFinal(session);

        console.log("Found objects:", obj);

        if (obj.length === 0) throw new Error("E-İmza sertifikası bulunamadı!");

        // Get certificate value
        let certValue = pkcs11.C_GetAttributeValue(session, obj, [
            { type: pkcs11js.CKA_VALUE }
        ])[0].value;

        // Convert certificate to PEM format
        let certPem = "-----BEGIN CERTIFICATE-----\n" + certValue.toString('base64') + "\n-----END CERTIFICATE-----";
        let cert = forge.pki.certificateFromPem(certPem);

        // Extract user information from certificate
        let username = cert.subject.getField("CN").value;
        let organization = cert.subject.getField("O").value;

        pkcs11.C_Logout(session);
        pkcs11.C_CloseSession(session);
        pkcs11.C_Finalize();

        // Verify code with API
        const response = await fetch("http://localhost:8080/api/auth/verify-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                code: code
            })
        });

        responseData = await response.json();
        if (!response.ok) {
            throw new Error("Doğrulama hatası: " + responseData.error);
        }
        else{
            console.log("Doğrulama başarılı:", responseData.message);
        }

        return `Doğrulama başarılı! Web sayfasına geri dönebilirsiniz.`;
    } catch (error) {
        console.error("Sign-in error:", error);
        return "Hata: " + error.message;
    }
});