// script.js
// Name button hover effect for personal course website

// This JavaScript code runs when the HTML page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personal course website loaded!');
    
    // Find the name button in the HTML using its ID
    const nameButton = document.getElementById('nameButton');
    
    // Add hover event listeners for the name button
    nameButton.addEventListener('mouseenter', function() {
        // Change text to "Jiayu" when hovering
        this.textContent = 'Jiayu';
        console.log('Name changed to Jiayu');
    });
    
    nameButton.addEventListener('mouseleave', function() {
        // Change text back to "Sunni Hu" when not hovering
        this.textContent = 'Sunni Hu';
        console.log('Name changed back to Sunni Hu');
    });
    
    // Optional: Add click effect for additional interactivity
    nameButton.addEventListener('click', function() {
        // Add a temporary visual feedback
        this.style.transform = 'scale(0.95)';
        
        // Reset the transform after a short delay
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        console.log('Name button clicked!');
    });
});