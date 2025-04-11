// main.js - Main Electron process file
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Store user credentials
let userCredentials = null;

// Handle credential storage
ipcMain.on('store-credentials', (event, credentials) => {
  userCredentials = credentials;
  console.log('Credentials stored:', userCredentials);
});

// Handle verification request
ipcMain.handle('verify-code', async (event, verificationCode) => {
  try {
    if (!userCredentials) {
      return { success: false, message: 'No credentials stored' };
    }

    console.log('Sending verification request with code:', verificationCode);
    
    // In a real app, use actual API endpoint
    // const response = await axios.post('http://your-api-url/verify-code', {
    //   code: verificationCode,
    //   username: userCredentials.username,
    //   token: userCredentials.token
    // });
    
    // For demonstration, we'll simulate the API response
    // Simulate verification success if code is "123456"
    const success = verificationCode === '123456';
    
    return {
      success: success,
      message: success ? 'Verification successful!' : 'Invalid verification code'
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      message: 'Verification request failed. Please try again.'
    };
  }
});