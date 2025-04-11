// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('loginContainer');
    const verificationContainer = document.getElementById('verificationContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const verificationStatus = document.getElementById('verificationStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    
    let verificationInterval;
  
    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        // In a real application, you would send this data to your backend
        // For this example, we'll simulate a successful login
        console.log('Login attempt with:', { username, password });
        
        // Hide login, show verification
        loginContainer.classList.add('hidden');
        verificationContainer.classList.remove('hidden');
        
        // Fetch verification code
        await getVerificationCode();
        
        // Start checking verification status
        startVerificationCheck();
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
    });
    
    // Fetch verification code from API
    async function getVerificationCode() {
      try {
        // In a real application, you would call your actual API endpoint
        // For this example, we'll simulate the API call
        console.log('Fetching verification code from /api/auth/generate-code');
        
        // This is where you would make the actual fetch request:
        // const response = await fetch('/api/auth/generate-code');
        // const data = await response.json();
        // const code = data.code;
        
        // Simulate receiving a code (in a real app, this would come from the API)
        const simulatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Verification code:', simulatedCode);
        
        // In a real application, this code would be sent to the user via email/SMS
        // For this example, we'll just update the status
        verificationStatus.textContent = 'Verification code has been sent to your device.';
      } catch (error) {
        console.error('Error generating verification code:', error);
        verificationStatus.textContent = 'Failed to generate verification code. Please try again.';
      }
    }
    
    // Start checking if the code is verified
    function startVerificationCheck() {
      // Clear any existing interval
      if (verificationInterval) {
        clearInterval(verificationInterval);
      }
      
      // Check verification status every 2 seconds
      verificationInterval = setInterval(async () => {
        try {
          // In a real application, you would call your actual API endpoint
          // For this example, we'll simulate the API call and gradually move to verified state
          console.log('Checking verification status at /api/auth/is-verified');
          
          // This is where you would make the actual fetch request:
          // const response = await fetch('/api/auth/is-verified');
          // const data = await response.json();
          // const isVerified = data.verified;
          
          // Simulate verification (for demo, verify after a few checks)
          const verificationCode = document.getElementById('verificationCode').value;
          
          // In a real app, this logic would be on your backend
          // Here we're simulating successful verification when any 6-digit code is entered
          const isVerified = verificationCode.length === 6;
          
          if (isVerified) {
            console.log('Verification successful!');
            verificationStatus.textContent = 'Verification successful! Redirecting to dashboard...';
            
            // Stop checking
            clearInterval(verificationInterval);
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              verificationContainer.classList.add('hidden');
              dashboardContainer.classList.remove('hidden');
            }, 1500);
          } else {
            console.log('Not yet verified, waiting...');
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
          verificationStatus.textContent = 'Error checking verification status.';
        }
      }, 2000);
    }
    
    // Handle logout
    logoutBtn.addEventListener('click', () => {
      // Reset the form
      loginForm.reset();
      
      // Show login screen again
      dashboardContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
      
      // Clear verification state
      document.getElementById('verificationCode').value = '';
      verificationStatus.textContent = 'Waiting for verification...';
      if (verificationInterval) {
        clearInterval(verificationInterval);
      }
    });
  });