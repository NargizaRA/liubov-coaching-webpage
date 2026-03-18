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
const datesGrid = document.querySelector('.calendar-grid.dates');
const monthYearDisplay = document.querySelector('.month-year');
const prevBtn = document.querySelectorAll('.calendar-nav')[0];
const nextBtn = document.querySelectorAll('.calendar-nav')[1];
const slotButtons = document.querySelectorAll('.slot-btn');
const confirmBtn = document.querySelector('.confirm-btn');
const selectedDateDisplay = document.querySelector('.selected-date');

const monthNamesDe = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const monthNamesRu = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

let currentDate = new Date();
let selectedDate = null;
let activeMonthStr = "";

function renderCalendar() {
    datesGrid.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = window.IS_RU ? monthNamesRu : monthNamesDe;
    activeMonthStr = monthNames[month];
    monthYearDisplay.textContent = `${activeMonthStr} ${year}`;
    
    // First day of month
    const firstDay = new Date(year, month, 1).getDay();
    // JS getDay() starts Sunday=0. Adjust for Monday=0
    let startDayOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Empty blocks for offset
    for (let i = 0; i < startDayOffset; i++) {
        const emptySpan = document.createElement('span');
        datesGrid.appendChild(emptySpan);
    }
    
    // Real days
    for (let i = 1; i <= daysInMonth; i++) {
        const daySpan = document.createElement('span');
        daySpan.textContent = i;
        
        // Disable weekends or past days for realism (optional)
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay();
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (dayOfWeek === 0 || dayOfWeek === 6 || dateObj < today) {
            // Weekend or past -> unavailble
            daySpan.classList.add('unavailable');
            daySpan.style.color = '#ccc';
        } else {
            daySpan.classList.add('available');
            daySpan.style.cursor = 'pointer';
            
            // Re-bind selection logic based on previous state if matched
            if (selectedDate && selectedDate.d === i && selectedDate.m === month && selectedDate.y === year) {
                daySpan.classList.add('selected');
            }
            
            daySpan.addEventListener('click', () => {
                document.querySelectorAll('.calendar-grid.dates span.selected').forEach(el => el.classList.remove('selected'));
                daySpan.classList.add('selected');
                
                selectedDate = { d: i, m: month, y: year };
                const selectionPrefix = window.IS_RU ? "Выбранная дата:" : "Ausgewähltes Datum:";
                selectedDateDisplay.textContent = `${selectionPrefix} ${i}. ${activeMonthStr} ${year}`;
            });
        }
        
        datesGrid.appendChild(daySpan);
    }
}

// Nav Buttons
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Initial Render
renderCalendar();

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
        
        const activeTimeEl = document.querySelector('.slot-btn.active');
        
        if (!selectedDate || !activeTimeEl) {
            alert(window.IS_RU ? "Пожалуйста, выберите дату и время." : "Bitte wählen Sie ein Datum und eine Uhrzeit aus.");
            return;
        }

        const activeDateStr = `${selectedDate.d}. ${activeMonthStr} ${selectedDate.y}`;
        const activeTime = activeTimeEl.textContent;
        const timeSuffix = window.IS_RU ? "" : " Uhr";
        
        // Disable button and show loading state
        confirmBtn.textContent = window.IS_RU ? "Отправка..." : "Wird gesendet...";
        confirmBtn.disabled = true;
        
        // This connects to the EmailJS service
        const templateParams = {
            to_name: 'Liubov Mukash',
            from_name: 'Website Besucher',
            requested_date: activeDateStr,
            requested_time: `${activeTime}${timeSuffix}`,
            message: window.IS_RU ? `Кто-то запросил встречу онлайн на ${activeDateStr} в ${activeTime}.` : `Jemand hat online einen Termin für den ${activeDateStr} um ${activeTime} angefragt.`
        };

        // Real send function utilizing variables you provided
        emailjs.send('service_8zqu6u8', 'template_f1c19yi', templateParams)
            .then(function() {
                const successMsg = window.IS_RU 
                    ? `Спасибо! Ваш запрос на встречу на ${activeDateStr} в ${activeTime} был отправлен Любови. Она свяжется с вами в ближайшее время.` 
                    : `Vielen Dank! Ihre Terminanfrage für den ${activeDateStr} um ${activeTime} Uhr wurde per E-Mail an Liubov gesendet. Sie meldet sich in Kürze bei Ihnen.`;
                alert(successMsg);
                
                // Reset and close
                confirmBtn.textContent = window.IS_RU ? "Подтвердить запись" : "Termin bestätigen";
                confirmBtn.disabled = false;
                closeCalendar();
            }, function(error) {
                console.error("EmailJS Error:", error);
                alert(window.IS_RU ? "Ошибка отправки письма!" : "Fehler beim Senden der eMail!");
                
                confirmBtn.textContent = window.IS_RU ? "Подтвердить запись" : "Termin bestätigen";
                confirmBtn.disabled = false;
            });
    });
}
