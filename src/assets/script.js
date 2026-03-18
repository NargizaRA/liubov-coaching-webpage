document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Hamburger Menu Logic ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            
            // Hamburger Animation (optional simple toggle)
            hamburger.classList.toggle('toggle');
        });

        // Close menu when a link is clicked
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just opening a modal (like #termin)
            if(targetId === '#termin' || targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // Account for fixed header offset
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // --- Cookie Banner Logic ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    // Check if user already made a choice
    if (!localStorage.getItem('cookieConsent')) {
        // Slight delay for better UX
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    const hideBanner = () => {
        cookieBanner.classList.remove('show');
    };

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideBanner();
        console.log("Cookies accepted");
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        hideBanner();
        console.log("Cookies declined");
    });
});

// --- Modal / Calendar Logic ---
const modal = document.getElementById('calendar-modal');

function openCalendar() {
    modal.classList.add('show');
}

function closeCalendar() {
    modal.classList.remove('show');
}

// Close modal if clicking outside of the content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeCalendar();
    }
});

// --- Calendar Interaction Logic ---
const availableDates = document.querySelectorAll('.calendar-grid.dates span.available');
const slotButtons = document.querySelectorAll('.slot-btn');
const confirmBtn = document.querySelector('.confirm-btn');
const selectedDateDisplay = document.querySelector('.selected-date');

// Month mapping for simple demo
const monthStr = "März"; 

availableDates.forEach(dateElement => {
    dateElement.addEventListener('click', () => {
        // Remove selected class from all dates
        document.querySelectorAll('.calendar-grid.dates span.selected')
            .forEach(el => el.classList.remove('selected'));
            
        // Add selected class to clicked date
        dateElement.classList.add('selected');
        
        // Update display text (simple logic for demo purposes)
        const day = dateElement.textContent;
        selectedDateDisplay.textContent = `Ausgewähltes Datum: ${day}. ${monthStr}`;
    });
});

slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all slots
        slotButtons.forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked slot
        btn.classList.add('active');
    });
});

// Add EmailJS submission logic
const calendarForm = document.getElementById('calendar-form');

if (calendarForm && confirmBtn) {
    calendarForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const activeDateEl = document.querySelector('.calendar-grid.dates span.selected');
        const activeTimeEl = document.querySelector('.slot-btn.active');
        
        if (!activeDateEl || !activeTimeEl) {
            alert("Bitte wählen Sie ein Datum und eine Uhrzeit aus.");
            return;
        }

        const activeDate = activeDateEl.textContent;
        const activeTime = activeTimeEl.textContent;
        
        // Disable button and show loading state
        confirmBtn.textContent = 'Wird gesendet...';
        confirmBtn.disabled = true;
        
        // This connects to the EmailJS service
        const templateParams = {
            to_name: 'Liubov Mukash',
            from_name: 'Website Besucher',
            requested_date: `${activeDate}. ${monthStr} 2026`,
            requested_time: `${activeTime} Uhr`,
            message: `Jemand hat online einen Termin für den ${activeDate}. ${monthStr} um ${activeTime} angefragt.`
        };

        // Real send function utilizing variables you provided
        emailjs.send('service_8zqu6u8', 'template_f1c19yi', templateParams)
            .then(function() {
                alert(`Vielen Dank! Ihre Terminanfrage für den ${activeDate}. ${monthStr} um ${activeTime} Uhr wurde per E-Mail an Liubov gesendet. Sie meldet sich in Kürze bei Ihnen.`);
                
                // Reset and close
                confirmBtn.textContent = 'Termin bestätigen';
                confirmBtn.disabled = false;
                closeCalendar();
            }, function(error) {
                console.error("EmailJS Error:", error);
                alert("Fehler beim Senden der eMail! Bitte überprüfen Sie die Template ID in script.js.");
                
                confirmBtn.textContent = 'Termin bestätigen';
                confirmBtn.disabled = false;
            });
    });
}
