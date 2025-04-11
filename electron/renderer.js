// renderer.js - Renderer process file
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const welcomeScreen = document.getElementById('welcomeScreen');
  const verificationScreen = document.getElementById('verificationScreen');
  const resultScreen = document.getElementById('resultScreen');
  const credentialsForm = document.getElementById('credentialsForm');
  const verifyButton = document.getElementById('verifyButton');
  const returnButton = document.getElementById('returnButton');
  const verificationStatus = document.getElementById('verificationStatus');
  const successResult = document.getElementById('successResult');
  const failureResult = document.getElementById('failureResult');

  // Handle credentials form submission
  credentialsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Store credentials (in a real app, these would be securely stored)
    const credentials = {
      username: username,
      token: 'simulated-auth-token', // In a real app, this would be from a login API
    };
    
    // Send credentials to main process
    ipcRenderer.send('store-credentials', credentials);
    
    // Show verification screen
    welcomeScreen.classList.add('hidden');
    verificationScreen.classList.remove('hidden');
  });

  // Handle verification button click
  verifyButton.addEventListener('click', async () => {
    const verificationCode = document.getElementById('verificationCode').value.trim();
    
    if (!verificationCode) {
      verificationStatus.textContent = 'Please enter a verification code';
      return;
    }
    
    verificationStatus.textContent = 'Verifying...';
    
    try {
      // Send verification request to main process
      const result = await ipcRenderer.invoke('verify-code', verificationCode);
      
      // Show result screen
      verificationScreen.classList.add('hidden');
      resultScreen.classList.remove('hidden');
      
      if (result.success) {
        successResult.classList.remove('hidden');
        failureResult.classList.add('hidden');
      } else {
        successResult.classList.add('hidden');
        failureResult.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      verificationStatus.textContent = 'An error occurred. Please try again.';
    }
  });

  // Handle return button click
  returnButton.addEventListener('click', () => {
    // Reset form
    credentialsForm.reset();
    document.getElementById('verificationCode').value = '';
    verificationStatus.textContent = '';
    
    // Return to welcome screen
    resultScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    
    // Hide result displays
    successResult.classList.add('hidden');
    failureResult.classList.add('hidden');
  });
});