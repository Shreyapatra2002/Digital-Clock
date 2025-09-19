// DOM elements
const clockElement = document.getElementById('clock');
const timeDisplay = document.querySelector('.time-display');
const dateDisplay = document.querySelector('.date-display');
const themeButtons = document.querySelectorAll('.theme-btn');
const timezoneElement = document.getElementById('timezone');
const dayOfYearElement = document.getElementById('day-of-year');
const weekNumberElement = document.getElementById('week-number');

// State variables
let is24HourFormat = false;
let animationsActive = true;
let currentTheme = 'default';

// Days and months arrays
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Initialize clock
updateClock();
setInterval(updateClock, 1000);

// Set up event listeners
themeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        changeTheme(this.dataset.theme);
    });
    
    // Add touch event for mobile
    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        changeTheme(this.dataset.theme);
    }, { passive: false });
});

// Add mousemove effect for 3D rotation on desktop
if (window.matchMedia("(hover: hover)").matches) {
    document.addEventListener('mousemove', handleMouseMove);
}

// Add touch events for mobile 3D effect
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
    if (!animationsActive) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = (touchStartX - touchX) / 10;
    const deltaY = (touchStartY - touchY) / 10;
    
    gsap.to(clockElement, {
        duration: 0.5,
        rotationY: -deltaX,
        rotationX: -deltaY,
        ease: "power2.out"
    });
    
    // Apply subtle 3D effect to info boxes too
    gsap.to('.info-box', {
        duration: 0.5,
        rotationY: -deltaX * 0.2,
        rotationX: -deltaY * 0.2,
        ease: "power2.out",
        stagger: 0.1
    });
    
    // Prevent default to avoid scrolling while interacting with the clock
    e.preventDefault();
}, { passive: false });

// Update clock function
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    let timeString;
    
    if (is24HourFormat) {
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${minutes}:${seconds}`;
    } else {
        const meridiem = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        hours = hours.toString().padStart(2, '0');
        timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    }
    
    // Update time display
    timeDisplay.textContent = timeString;
    
    // Update date display
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    dateDisplay.textContent = `${day}, ${month} ${date}, ${year}`;
    
    // Update additional info
    updateAdditionalInfo(now);
    
    // Add animation if enabled
    if (animationsActive && seconds === '00') {
        animateClock();
    }
}

// Update additional information
function updateAdditionalInfo(date) {
    // Timezone
    timezoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Day of year (1-365/366)
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    dayOfYearElement.textContent = dayOfYear;
    
    // Week number
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    weekNumberElement.textContent = weekNumber;
}

// Change theme based on selection
function changeTheme(theme) {
    currentTheme = theme;
    
    const themes = {
        default: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
        dark: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        sunset: 'linear-gradient(135deg, #ff5e62, #ff9966)',
        green: 'linear-gradient(135deg, #00b09b, #96c93d)',
        purple: 'linear-gradient(135deg, #5D4157, #A8CABA)'
    };
    
    document.body.style.background = themes[theme];
    
    // Update active theme button
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Handle mouse move for 3D effect (desktop only)
function handleMouseMove(e) {
    if (!animationsActive) return;
    
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    
    gsap.to(clockElement, {
        duration: 1,
        rotationY: x,
        rotationX: y,
        ease: "power2.out"
    });
    
    // Apply 3D effect to info boxes too
    gsap.to('.info-box', {
        duration: 1,
        rotationY: x * 0.3,
        rotationX: y * 0.3,
        ease: "power2.out",
        stagger: 0.1
    });
}

// Animate the clock
function animateClock() {
    if (!animationsActive) return;
    
    // GSAP animation for the clock
    gsap.fromTo(timeDisplay, 
        { scale: 1.2, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    
    // Add a subtle pulse effect
    gsap.to(clockElement, {
        duration: 0.2,
        scale: 1.03,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
    });
}

// Initial animation when page loads
gsap.from('#clock-container', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    rotationX: 15,
    ease: "power3.out"
});

gsap.from('.theme-selector, .info-box', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    delay: 0.5,
    ease: "power2.out"
});