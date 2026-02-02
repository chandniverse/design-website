/**
 * Chandni Naidu Portfolio Website
 * Main JavaScript - Handles animations and interactions
 */

(function() {
    'use strict';

    // ================================
    // Intersection Observer for Scroll Animations
    // ================================
    
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all cards immediately
            document.querySelectorAll('[data-animate]').forEach(element => {
                element.classList.add('animate-in');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Optional: unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(element => {
            observer.observe(element);
        });
    }

    // ================================
    // Stagger Animation Delays
    // ================================
    
    function addStaggerDelay() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // ================================
    // Smooth Scroll for Internal Links
    // ================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal links
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ================================
    // Image Loading Optimization
    // ================================
    
    function optimizeImageLoading() {
        // Add loading animation for images
        const images = document.querySelectorAll('.project-image');
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
                
                img.addEventListener('error', function() {
                    console.warn('Image failed to load:', this.src);
                    this.classList.add('error');
                });
            }
        });
    }

    // ================================
    // Preload Animated GIFs on Hover
    // ================================
    
    function initGifPreloading() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            const animatedImage = link.querySelector('.project-image-animated');
            
            if (animatedImage) {
                link.addEventListener('mouseenter', function() {
                    // Force load the GIF if it hasn't loaded yet
                    if (!animatedImage.complete) {
                        const src = animatedImage.src;
                        animatedImage.src = '';
                        animatedImage.src = src;
                    }
                }, { once: true });
            }
        });
    }

    // ================================
    // Reduce Motion Support
    // ================================
    
    function checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
            
            // Show all cards immediately
            document.querySelectorAll('[data-animate]').forEach(element => {
                element.classList.add('animate-in');
            });
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', () => {
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }

    // ================================
    // Performance Monitoring
    // ================================
    
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page load time: ${pageLoadTime}ms`);
            });
        }
    }

    // ================================
    // External Link Security
    // ================================
    
    function secureExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        
        externalLinks.forEach(link => {
            // Ensure external links have proper security attributes
            if (!link.hasAttribute('rel') || link.getAttribute('rel').indexOf('noopener') === -1) {
                const currentRel = link.getAttribute('rel') || '';
                link.setAttribute('rel', currentRel + ' noopener noreferrer');
            }
        });
    }

    // ================================
    // Keyboard Navigation Enhancement
    // ================================
    
    function enhanceKeyboardNavigation() {
        // Add focus visible class for better keyboard navigation styling
        document.body.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.body.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    }

    // ================================
    // Viewport Height Fix for Mobile
    // ================================
    
    function setVhProperty() {
        // Fix for viewport height on mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // ================================
    // Initialize All Features
    // ================================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Check for reduced motion preference first
        checkReducedMotion();
        
        // Initialize features
        addStaggerDelay();
        initScrollAnimations();
        initSmoothScroll();
        optimizeImageLoading();
        initGifPreloading();
        secureExternalLinks();
        enhanceKeyboardNavigation();
        setVhProperty();
        
        // Log performance in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logPerformance();
        }
        
        // Update vh property on resize/orientation change
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setVhProperty();
            }, 100);
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(setVhProperty, 100);
        });
    }

    // ================================
    // Start Application
    // ================================
    
    init();

})();

// ================================
// Service Worker Registration (Optional)
// ================================

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => {
                console.log('ServiceWorker registration successful');
            },
            err => {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}
