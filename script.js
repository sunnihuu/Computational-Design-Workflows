// Bauhaus Grid with Interactive Shapes
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bauhaus grid loaded!');
    
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
    
    // Shape Interactions
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach(shape => {
        // Add click effect
        shape.addEventListener('click', function() {
            // Create ripple effect
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.2)';
            }, 150);
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            console.log('Shape clicked:', this.className);
        });
        
        // Add subtle rotation on hover
        shape.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Add keyboard navigation for shapes
        shape.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make shapes focusable
        shape.setAttribute('tabindex', '0');
    });
    
    // Add subtle animation to grid lines
    const lines = document.querySelectorAll('.line');
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
            line.style.opacity = '0.1';
        }, index * 100);
    });
    
    // Add entrance animation for shapes
    shapes.forEach((shape, index) => {
        shape.style.opacity = '0';
        shape.style.transform = 'scale(0.5)';
        shape.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            shape.style.opacity = '1';
            shape.style.transform = '';
        }, index * 50 + 500);
    });
    
    // Add color cycling effect on double click
    shapes.forEach(shape => {
        let clickCount = 0;
        let clickTimer;
        
        shape.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 300);
            } else {
                clearTimeout(clickTimer);
                clickCount = 0;
                
                // Cycle through colors
                const colors = ['red', 'blue', 'yellow', 'black'];
                const currentColor = this.getAttribute('data-color');
                const currentIndex = colors.indexOf(currentColor);
                const nextIndex = (currentIndex + 1) % colors.length;
                const nextColor = colors[nextIndex];
                
                // Remove current color classes
                this.classList.remove('red', 'blue', 'yellow', 'black');
                // Add new color class
                this.classList.add(nextColor);
                // Update data attribute
                this.setAttribute('data-color', nextColor);
                
                console.log('Color changed to:', nextColor);
            }
        });
    });
    
    console.log('Bauhaus grid event listeners attached successfully!');
}); 