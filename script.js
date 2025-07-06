// script.js
// Hamburger menu and name button functionality for personal course website

// This JavaScript code runs when the HTML page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personal course website loaded!');
    
    // Hamburger menu functionality
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuNav = document.getElementById('menuNav');
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    
    // Toggle menu function
    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        menuNav.classList.toggle('active');
        header.classList.toggle('menu-open');
        main.classList.toggle('menu-open');
        
        // Prevent body scroll when menu is open
        if (menuNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Add click event to hamburger button
    hamburgerBtn.addEventListener('click', toggleMenu);
    
    // Close menu when clicking on menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            console.log('Menu item clicked:', this.textContent);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (menuNav.classList.contains('active') && 
            !hamburgerBtn.contains(e.target) && 
            !menuNav.contains(e.target)) {
            toggleMenu();
        }
    });
    
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