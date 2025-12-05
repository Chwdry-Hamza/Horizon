// =============================================
// HORIZON - Main JavaScript
// =============================================

// --- SCROLL REVEAL ANİMASYONLARI ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Sayfa yüklendiğinde tüm animasyonlu elementleri seç
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .property-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));

    // Sayaç animasyonları
    animateCounters();

    // Smooth scroll
    initSmoothScroll();

    // Light/Dark Mode Toggle
    initThemeToggle();

    // Navbar scroll effect
    initNavbarScroll();

    // Mobile menu
    initMobileMenu();

    // Property card hover effects
    initPropertyCardEffects();

    // Form validasyonları (contact sayfası için)
    initFormValidation();

    // Custom cursor
    initCustomCursor();

    // Enhanced smooth scroll
    initEnhancedSmoothScroll();

    // Currency selector
    initCurrencySelector();

    // Fetch live exchange rates
    fetchExchangeRates();
});

// --- SAYAÇ ANİMASYONU ---
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('%') ? '%' : '');
            }
        };

        // Sayaç görünür olduğunda başlat
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    updateCounter();
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counter);
    });
}

// --- SMOOTH SCROLL ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// --- LIGHT/DARK MODE TOGGLE ---
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Kayıtlı temayı yükle
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const sunIcon = `<svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`;

    const moonIcon = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
}

// --- NAVBAR SCROLL EFFECT ---
function initNavbarScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// --- MOBILE MENU ---
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Menü linklerine tıklandığında menüyü kapat
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// --- PROPERTY CARD EFFECTS ---
function initPropertyCardEffects() {
    const cards = document.querySelectorAll('.property-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card-img').style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.card-img').style.transform = 'scale(1)';
        });
    });
}

// --- FORM VALİDASYONU ---
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        // Form başarılı
        showNotification('Thank you! We will contact you soon.', 'success');
        contactForm.reset();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- IMAGE LAZY LOADING ---
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// --- PARALLAX EFFECT (Hero için) ---
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// --- PROPERTY FİLTRELEME (Properties sayfası için) ---
function initPropertyFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const properties = document.querySelectorAll('.property-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter properties
            properties.forEach(property => {
                if (filter === 'all' || property.getAttribute('data-category') === filter) {
                    property.style.display = 'block';
                    setTimeout(() => property.classList.add('visible'), 10);
                } else {
                    property.classList.remove('visible');
                    setTimeout(() => property.style.display = 'none', 300);
                }
            });
        });
    });
}

// Sayfa yüklendiğinde filter sistemini başlat
if (document.querySelector('.filter-btn')) {
    initPropertyFilters();
}

// --- CURRENCY CONVERTER WITH LIVE RATES ---
let EXCHANGE_RATES = {
    'AED': 1,
    'USD': 0.27,      // Fallback rates
    'EUR': 0.25,
    'TRY': 9.45
};

const CURRENCY_SYMBOLS = {
    'AED': 'AED',
    'USD': '$',
    'EUR': '€',
    'TRY': '₺'
};

// Fetch live exchange rates on page load
async function fetchExchangeRates() {
    try {
        // Using exchangerate-api.com free tier (no API key needed)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/AED');
        const data = await response.json();

        if (data && data.rates) {
            EXCHANGE_RATES = {
                'AED': 1,
                'USD': data.rates.USD || 0.27,
                'EUR': data.rates.EUR || 0.25,
                'TRY': data.rates.TRY || 9.45
            };

            // Update prices with live rates
            updateAllPrices();
            console.log('Live exchange rates loaded:', EXCHANGE_RATES);
        }
    } catch (error) {
        console.warn('Failed to fetch live rates, using fallback rates:', error);
    }
}

function convertPrice(aedPrice, currency) {
    return Math.round(aedPrice * EXCHANGE_RATES[currency]);
}

function formatPrice(price, currency) {
    const symbol = CURRENCY_SYMBOLS[currency];
    const convertedPrice = convertPrice(price, currency);
    const formattedNumber = convertedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (currency === 'AED' || currency === 'TRY') {
        return `${symbol} ${formattedNumber}`;
    } else {
        return `${symbol}${formattedNumber}`;
    }
}

// Default currency
let currentCurrency = localStorage.getItem('currency') || 'AED';

// --- CURRENCY SELECTOR ---
function initCurrencySelector() {
    const currencyBtn = document.getElementById('currencyBtn');
    const currencyDropdown = document.getElementById('currencyDropdown');
    const currentCurrencySpan = document.getElementById('currentCurrency');

    if (!currencyBtn) return;

    // Set saved currency
    currentCurrencySpan.textContent = currentCurrency;
    updateActiveCurrency();

    // Toggle dropdown
    currencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currencyDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        currencyDropdown.classList.remove('active');
    });

    // Currency selection
    document.querySelectorAll('.currency-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedCurrency = option.getAttribute('data-currency');

            // Update current currency
            currentCurrency = selectedCurrency;
            currentCurrencySpan.textContent = selectedCurrency;
            localStorage.setItem('currency', selectedCurrency);

            // Update active state
            updateActiveCurrency();

            // Close dropdown
            currencyDropdown.classList.remove('active');

            // Update all prices on page
            updateAllPrices();
        });
    });
}

function updateActiveCurrency() {
    document.querySelectorAll('.currency-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-currency') === currentCurrency) {
            opt.classList.add('active');
        }
    });
}

function updateAllPrices() {
    // Update price tags on property cards
    document.querySelectorAll('.price-tag').forEach(tag => {
        const aedPrice = parseInt(tag.getAttribute('data-price'));
        if (aedPrice) {
            tag.textContent = formatPrice(aedPrice, currentCurrency);
        }
    });
}

// --- CUSTOM CURSOR ---
function initCustomCursor() {
    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.15; // Smooth easing factor

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth easing
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * speed;
        cursorY += dy * speed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .property-card, input, textarea, select');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// --- ENHANCED SMOOTH SCROLL ---
function initEnhancedSmoothScroll() {
    // Add momentum scrolling feel
    let isScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            document.body.style.scrollBehavior = 'smooth';
            isScrolling = true;
        }

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
    }, { passive: true });

    // Enhance scroll for mouse wheel
    let lastScrollTime = 0;
    const scrollDelay = 50; // ms delay for heavier feel

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        if (now - lastScrollTime < scrollDelay) {
            e.preventDefault();
            return false;
        }
        lastScrollTime = now;
    }, { passive: false });
}
