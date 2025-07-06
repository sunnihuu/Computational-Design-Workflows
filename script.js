// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger menu loaded!');
    
    // Hamburger menu functionality
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuNav = document.getElementById('menuNav');
    
    // Toggle menu function
    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        menuNav.classList.toggle('active');
        
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
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuNav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    console.log('Hamburger menu event listeners attached successfully!');
}); 