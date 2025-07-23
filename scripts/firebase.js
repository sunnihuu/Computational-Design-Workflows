// Firebase Poll App - Tutorial JavaScript
// This script demonstrates how to integrate Firebase Realtime Database with a simple web app
// It shows real-time data synchronization across multiple users

// Wait for the DOM (Document Object Model) to be fully loaded before running any code
// This ensures all HTML elements exist before we try to access them
document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // STEP 1: FIREBASE CONFIGURATION
  // ========================================
  // Firebase configuration object - this connects your app to your Firebase project
  // You get these values from your Firebase Console (https://console.firebase.google.com)
  // 
  // To set up Firebase:
  // 1. Go to Firebase Console and create a new project
  // 2. Add a web app to your project
  // 3. Copy the config object that Firebase provides
  // 4. Replace the values below with your actual Firebase config
  
const firebaseConfig = {
  apiKey: "AIzaSyBLYxbOiOdBdbFdLTECRiJ_PAuoUXAj_0k",
  authDomain: "fir-poll-app.firebaseapp.com",
  databaseURL: "https://fir-poll-app-default-rtdb.firebaseio.com",
  projectId: "fir-poll-app",
  storageBucket: "fir-poll-app.firebasestorage.app",
  messagingSenderId: "476548808558",
  appId: "1:476548808558:web:6be496f3c05f0fcda74b7f",
  measurementId: "G-8XF7ED8153"
};
  // Initialize Firebase - this connects your app to Firebase services
  // firebase.initializeApp() sets up the connection using your configuration
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firebase Realtime Database
  // This is like getting a "handle" to your database that you can use to read/write data
  const database = firebase.database();

  // ========================================
  // STEP 2: GET REFERENCES TO HTML ELEMENTS
  // ========================================
  // We need to get references to the HTML elements we want to update
  // This is like getting "handles" to the parts of the webpage we want to change
  
  const shadeButton = document.getElementById('vote-shade');
  const manageableButton = document.getElementById('vote-manageable');
  const hotButton = document.getElementById('vote-hot');
  const avoidButton = document.getElementById('vote-avoid');
  const shadeCount = document.getElementById('shade-count');
  const manageableCount = document.getElementById('manageable-count');
  const hotCount = document.getElementById('hot-count');
  const avoidCount = document.getElementById('avoid-count');
  const totalVotes = document.getElementById('total-votes');
  const connectionStatus = document.getElementById('connection-status');
  const neighborhoodInput = document.getElementById('neighborhood');

  // ========================================
  // STEP 3: SET UP REAL-TIME DATABASE LISTENERS
  // ========================================
  // Firebase Realtime Database can automatically update your app when data changes
  // We use .on('value') to listen for any changes to our poll data
  
  // Listen for changes to each poll option in the database
  database.ref('poll/shade').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    shadeCount.textContent = count;
    updateTotalVotes();
    console.log('Shade votes updated:', count);
  });
  database.ref('poll/manageable').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    manageableCount.textContent = count;
    updateTotalVotes();
    console.log('Manageable votes updated:', count);
  });
  database.ref('poll/hot').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    hotCount.textContent = count;
    updateTotalVotes();
    console.log('Hot votes updated:', count);
  });
  database.ref('poll/avoid').on('value', function(snapshot) {
    const count = snapshot.val() || 0;
    avoidCount.textContent = count;
    updateTotalVotes();
    console.log('Avoid votes updated:', count);
  });

  // ========================================
  // STEP 4: SET UP BUTTON EVENT LISTENERS
  // ========================================
  // When users click the vote buttons, we need to update the database
  // Firebase will then automatically update all other connected users
  
  // Handle vote button clicks for each option
  shadeButton.addEventListener('click', function() {
    handleVote('shade', 'Comfortable / lots of shade');
  });
  manageableButton.addEventListener('click', function() {
    handleVote('manageable', 'A bit hot but manageable');
  });
  hotButton.addEventListener('click', function() {
    handleVote('hot', 'Very hot / no shade');
  });
  avoidButton.addEventListener('click', function() {
    handleVote('avoid', 'I avoid walking outdoors');
  });

  function handleVote(optionKey, optionLabel) {
    // Optionally, get the neighborhood value
    const neighborhood = neighborhoodInput ? neighborhoodInput.value.trim() : '';
    database.ref('poll/' + optionKey).once('value')
      .then(function(snapshot) {
        const currentCount = snapshot.val() || 0;
        const newCount = currentCount + 1;
        return database.ref('poll/' + optionKey).set(newCount);
      })
      .then(function() {
        // Optionally, store the neighborhood with a timestamp (not required for vote count)
        if (neighborhood) {
          const entry = {
            neighborhood: neighborhood,
            option: optionLabel,
            timestamp: Date.now()
          };
          database.ref('responses').push(entry);
        }
        showVoteConfirmation(optionLabel);
      })
      .catch(function(error) {
        console.error('Error recording vote:', error);
        showError('Failed to record vote. Please try again.');
      });
  }

  // ========================================
  // STEP 5: HELPER FUNCTIONS
  // ========================================
  // These functions help us manage the user interface and provide feedback
  
  /**
   * updateTotalVotes Function
   * Purpose: Calculate and display the total number of votes
   * This function runs whenever either vote count changes
   */
  function updateTotalVotes() {
    const shadeVotes = parseInt(shadeCount.textContent) || 0;
    const manageableVotes = parseInt(manageableCount.textContent) || 0;
    const hotVotes = parseInt(hotCount.textContent) || 0;
    const avoidVotes = parseInt(avoidCount.textContent) || 0;
    const total = shadeVotes + manageableVotes + hotVotes + avoidVotes;
    totalVotes.textContent = total;
  }

  /**
   * showVoteConfirmation Function
   * Purpose: Show a brief confirmation message when a vote is recorded
   * @param {string} vote - The vote that was recorded ('Yes' or 'No')
   */
  function showVoteConfirmation(vote) {
    // Create a temporary confirmation message
    const confirmation = document.createElement('div');
    confirmation.className = 'vote-confirmation';
    confirmation.textContent = `Thank you for voting "${vote}"!`;
    confirmation.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Add the confirmation to the page
    document.body.appendChild(confirmation);
    
    // Remove the confirmation after 3 seconds
    setTimeout(function() {
      confirmation.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(function() {
        if (confirmation.parentNode) {
          confirmation.parentNode.removeChild(confirmation);
        }
      }, 300);
    }, 3000);
  }

  /**
   * showError Function
   * Purpose: Show an error message if something goes wrong
   * @param {string} message - The error message to display
   */
  function showError(message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 1000;
    `;
    
    document.body.appendChild(error);
    
    setTimeout(function() {
      if (error.parentNode) {
        error.parentNode.removeChild(error);
      }
    }, 5000);
  }

  // ========================================
  // STEP 6: CONNECTION STATUS MONITORING
  // ========================================
  // Firebase provides connection status information
  // This helps us know if we're connected to the database
  
  // Listen for connection state changes
  database.ref('.info/connected').on('value', function(snapshot) {
    const connected = snapshot.val();
    
    if (connected) {
      // We're connected to Firebase
      connectionStatus.innerHTML = '<p style="color: #4CAF50;">✅ Connected to Firebase</p>';
      console.log('Connected to Firebase');
    } else {
      // We're not connected to Firebase
      connectionStatus.innerHTML = '<p style="color: #f44336;">❌ Disconnected from Firebase</p>';
      console.log('Disconnected from Firebase');
    }
  });

  // ========================================
  // STEP 7: INITIALIZATION
  // ========================================
  // Set up any initial state when the page loads
  
  // Initialize vote counts to 0 if they don't exist in the database
  database.ref('poll').once('value')
    .then(function(snapshot) {
      if (!snapshot.exists()) {
        return database.ref('poll').set({
          shade: 0,
          manageable: 0,
          hot: 0,
          avoid: 0
        });
      }
    })
    .then(function() {
      console.log('Poll initialized successfully');
    })
    .catch(function(error) {
      console.error('Error initializing poll:', error);
    });

  // Add CSS animations for the vote confirmation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  console.log('Firebase Poll App initialized successfully!');
  console.log('Tutorial: This app demonstrates real-time data synchronization with Firebase');
});

// ========================================
// FIREBASE TUTORIAL SUMMARY
// ========================================
/*
This tutorial demonstrates several key Firebase concepts:

1. CONFIGURATION: Setting up Firebase with your project credentials
2. DATABASE REFERENCE: Getting a handle to your Realtime Database
3. REAL-TIME LISTENERS: Using .on('value') to automatically update UI when data changes
4. DATA WRITING: Using .set() to save data to the database
5. DATA READING: Using .once('value') to read data once
6. ERROR HANDLING: Managing connection issues and errors
7. CONNECTION MONITORING: Checking if your app is connected to Firebase

Key Benefits of Firebase Realtime Database:
- Automatic synchronization across all connected users
- No server management required
- Real-time updates without page refreshes
- Built-in offline support
- Scalable and secure

To use this in your own project:
1. Create a Firebase project at https://console.firebase.google.com
2. Replace the firebaseConfig object with your actual project settings
3. Set up your database rules in the Firebase Console
4. Deploy your app to Firebase Hosting (optional but recommended)
*/ 