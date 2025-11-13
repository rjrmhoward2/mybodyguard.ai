/**
 * MyBodyGuard.ai Landing Page JavaScript
 * Handles mobile menu, form submission, and analytics tracking
 * 
 * PRODUCTION READY - Beehiiv Magic Link Integration Active
 * 
 * Key Features:
 * - Mobile menu toggle
 * - Waitlist form submission via Beehiiv Magic Link
 * - User preferences stored in localStorage
 * - Google Analytics event tracking
 * - Thank you page personalization
 * - Smooth scrolling and animations
 */

// ==========================================================================
// Mobile Menu Toggle
// ==========================================================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && menuToggle) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    }
});

// ==========================================================================
// Smooth Scrolling for Anchor Links
// ==========================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for empty hash
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 73; // Account for fixed nav height
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================================
// Waitlist Form Submission
// ==========================================================================

function handleWaitlistSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.email.value;
    const name = form.name.value;
    const notifyLaunch = form.notify_launch.checked;
    const earlyBird = form.early_bird.checked;
    const merchUpdates = form.merch_updates.checked;
    
    // Validate email
    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Prepare form data
    const formData = {
        email: email,
        name: name,
        notify_launch: notifyLaunch,
        early_bird: earlyBird,
        merch_updates: merchUpdates,
        timestamp: new Date().toISOString()
    };
    
    // Track the submission
    trackEvent('waitlist_submit', {
        email: email.split('@')[1], // Only track domain for privacy
        has_name: name.length > 0
    });
    
    // TODO: Replace with your actual form submission endpoint
    // This is a placeholder for Beehiiv integration or your backend
    submitToBeehiiv(formData)
        .then(response => {
            showFormMessage('✓ Success! You\'re on the waitlist. Check your email for confirmation.', 'success');
            form.reset();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showFormMessage('Something went wrong. Please try again or email us directly at hello@mybodyguard.ai', 'error');
        });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form feedback message
function showFormMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginTop = '1rem';
    messageDiv.style.borderRadius = '0.5rem';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = '600';
    
    if (type === 'success') {
        messageDiv.style.background = '#10B981';
        messageDiv.style.color = '#FFFFFF';
    } else {
        messageDiv.style.background = '#EF4444';
        messageDiv.style.color = '#FFFFFF';
    }
    
    // Insert message
    const form = document.getElementById('waitlistForm');
    form.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.5s ease';
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
    }
}

// ==========================================================================
// Beehiiv / Backend Integration
// ==========================================================================

/**
 * Submit form data to Beehiiv using Magic Link
 * PRODUCTION VERSION - Ready to use!
 */
async function submitToBeehiiv(formData) {
    // Store user preferences in localStorage for future use
    // This lets us track what they signed up for even though Beehiiv only gets email
    if (formData.notify_launch) {
        localStorage.setItem('notify_launch', 'true');
        localStorage.setItem('signup_date', new Date().toISOString());
    }
    if (formData.early_bird) {
        localStorage.setItem('early_bird', 'true');
    }
    if (formData.merch_updates) {
        localStorage.setItem('merch_updates', 'true');
    }
    
    // Store name if provided
    if (formData.name) {
        localStorage.setItem('user_name', formData.name);
    }
    
    // Track the signup event
    trackEvent('waitlist_submit', {
        has_name: formData.name.length > 0,
        notify_launch: formData.notify_launch,
        early_bird: formData.early_bird,
        merch_updates: formData.merch_updates
    });
    
    // Construct the Beehiiv magic link with email
    const magicLink = `https://magic.beehiiv.com/v1/3a79631b-5f1a-4852-b3f7-ceda5239ac70?email=${encodeURIComponent(formData.email)}&redirect_to=https%3A%2F%2Fmybodyguard.ai%2Fthank-you&utm_source=mybodyguard-landing&utm_medium=waitlist-form&utm_campaign=kickstarter-waitlist`;
    
    // Small delay to ensure localStorage is saved
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Redirect to Beehiiv magic link
    // Beehiiv will handle the signup and redirect to thank-you page
    window.location.href = magicLink;
    
    // Return promise (won't actually be used due to redirect)
    return Promise.resolve({ success: true });
}

// ==========================================================================
// Analytics Event Tracking
// ==========================================================================

/**
 * Track events in Google Analytics
 * Make sure GA is properly configured in the HTML
 */
function trackEvent(eventName, eventParams = {}) {
    // Check if gtag is available
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
        console.log('Event tracked:', eventName, eventParams);
    } else {
        console.log('Event tracking (GA not loaded):', eventName, eventParams);
    }
}

// Track outbound links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const url = this.href;
        
        // Only track if not same origin
        if (!url.includes(window.location.hostname)) {
            trackEvent('outbound_click', {
                url: url,
                text: this.textContent.trim()
            });
        }
    });
});

// ==========================================================================
// Scroll Animations (Optional Enhancement)
// ==========================================================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class setup
    const animatedElements = document.querySelectorAll('.problem-card, .feature-item, .company-card, .tier-card, .download-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Add CSS class for fade-in effect
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ==========================================================================
// Navigation Background on Scroll
// ==========================================================================

let lastScrollTop = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add solid background when scrolled
    if (scrollTop > 100) {
        nav.style.background = 'rgba(10, 14, 26, 0.98)';
    } else {
        nav.style.background = 'rgba(10, 14, 26, 0.95)';
    }
    
    lastScrollTop = scrollTop;
});

// ==========================================================================
// Countdown Timer (Optional - for pre-launch countdown)
// ==========================================================================

/**
 * Uncomment and configure if you want a countdown to Kickstarter launch
 */
/*
function startCountdown(targetDate) {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        }
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdownElement) {
                countdownElement.innerHTML = "LIVE NOW!";
            }
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Example: Set countdown to 60 days from now
// const launchDate = new Date().getTime() + (60 * 24 * 60 * 60 * 1000);
// startCountdown(launchDate);
*/

// ==========================================================================
// Console Easter Egg
// ==========================================================================

console.log('%c🛡️ MyBodyGuard.ai', 'font-size: 24px; font-weight: bold; color: #0066FF;');
console.log('%cYour health data. Your device. Your guardian. Forever.', 'font-size: 14px; color: #00C2FF;');
console.log('%c\nInterested in joining our team?', 'font-size: 12px; color: #A0A8B9;');
console.log('%cEmail us at: careers@mybodyguard.ai', 'font-size: 12px; color: #A0A8B9;');

// ==========================================================================
// Page Load Performance Tracking
// ==========================================================================

window.addEventListener('load', () => {
    // Track page load time
    const loadTime = performance.now();
    
    trackEvent('page_load', {
        load_time: Math.round(loadTime),
        page: window.location.pathname
    });
    
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Check if we're on the thank-you page and personalize it
    if (window.location.pathname.includes('thank-you')) {
        personalizeThankYouPage();
    }
});

// ==========================================================================
// Thank You Page Personalization
// ==========================================================================

function personalizeThankYouPage() {
    // Get stored user data from localStorage
    const userName = localStorage.getItem('user_name');
    const notifyLaunch = localStorage.getItem('notify_launch');
    const earlyBird = localStorage.getItem('early_bird');
    const merchUpdates = localStorage.getItem('merch_updates');
    const signupDate = localStorage.getItem('signup_date');
    
    // Personalize greeting if name is available
    if (userName) {
        const headings = document.querySelectorAll('h1');
        headings.forEach(h1 => {
            if (h1.textContent.includes('Welcome, Guardian!')) {
                h1.textContent = `Welcome, ${userName}!`;
            }
        });
    }
    
    // Add personalized preferences section if any preferences were selected
    if (notifyLaunch || earlyBird || merchUpdates) {
        const preferencesHTML = `
            <div style="background: rgba(0, 102, 255, 0.1); padding: 1.5rem; border-radius: 1rem; margin: 2rem 0; border-left: 3px solid #0066FF;">
                <h4 style="margin-bottom: 1rem;">Your Preferences:</h4>
                <ul style="list-style: none; padding: 0; text-align: left;">
                    ${notifyLaunch ? '<li style="padding: 0.25rem 0;">✓ Kickstarter launch notifications</li>' : ''}
                    ${earlyBird ? '<li style="padding: 0.25rem 0;">✓ Early bird pricing alerts (50% off!)</li>' : ''}
                    ${merchUpdates ? '<li style="padding: 0.25rem 0;">✓ New merchandise updates</li>' : ''}
                </ul>
                <p style="font-size: 0.875rem; color: var(--light-gray); margin-top: 1rem; margin-bottom: 0;">
                    You can update these preferences anytime by clicking the link in any email we send.
                </p>
            </div>
        `;
        
        // Insert after the "What Happens Next?" section
        const sections = document.querySelectorAll('div[style*="background: rgba(0, 102, 255"]');
        if (sections.length > 0) {
            sections[0].insertAdjacentHTML('afterend', preferencesHTML);
        }
    }
    
    // Track thank you page view
    trackEvent('thank_you_page_view', {
        has_name: !!userName,
        notify_launch: !!notifyLaunch,
        early_bird: !!earlyBird,
        merch_updates: !!merchUpdates
    });
    
    // Optional: Show confetti or celebration animation
    // Uncomment if you want a celebratory effect
    // showCelebration();
}

// ==========================================================================
// Optional: Celebration Animation for Thank You Page
// ==========================================================================

function showCelebration() {
    // Simple confetti-like effect using emoji
    const emojis = ['🛡️', '✨', '🎉', '💙', '🚀'];
    const colors = ['#0066FF', '#00C2FF', '#7B61FF'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const celebration = document.createElement('div');
            celebration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            celebration.style.position = 'fixed';
            celebration.style.left = Math.random() * 100 + '%';
            celebration.style.top = '-50px';
            celebration.style.fontSize = (Math.random() * 20 + 20) + 'px';
            celebration.style.opacity = '1';
            celebration.style.pointerEvents = 'none';
            celebration.style.zIndex = '9999';
            celebration.style.transition = 'all 3s ease-out';
            
            document.body.appendChild(celebration);
            
            // Animate down
            setTimeout(() => {
                celebration.style.top = '100vh';
                celebration.style.opacity = '0';
                celebration.style.transform = `rotate(${Math.random() * 360}deg)`;
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                celebration.remove();
            }, 3000);
        }, i * 100);
    }
}