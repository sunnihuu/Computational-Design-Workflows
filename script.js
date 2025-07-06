// script.js
// Landing page functionality for GSAPP Computational Design Workflows

// This JavaScript code runs when the HTML page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('GSAPP Computational Design Workflows landing page loaded!');
    
    // Hamburger Menu Functionality
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
    
    // CTA Button functionality
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            console.log('Explore button clicked!');
            // Add your navigation logic here
            // For example: window.location.href = '#projects';
        });
    }
    
    // Title line hover effects
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        line.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(0) scale(1.05)';
        });
        
        line.addEventListener('mouseleave', function() {
            const originalTransform = index === 0 ? 'translateX(-2rem)' : 
                                   index === 1 ? 'translateX(1rem)' : 
                                   'translateX(-1rem)';
            this.style.transform = originalTransform;
        });
    });
    
    // Geometric elements interaction
    const geoElements = document.querySelectorAll('.geo-element');
    geoElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(45deg)';
            this.style.zIndex = '10';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
    
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.hero-text, .hero-visual, .cta-section');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuNav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('All event listeners attached successfully!');
});