// Programmatically generate exactly 150 image entries
const categories = ['Nature', 'Architecture', 'Technology', 'Travel', 'Animals'];
const galleryData = [];

for (let i = 1; i <= 150; i++) {
    const category = categories[i % categories.length];
    galleryData.push({
        id: i,
        title: `ApexSnap ${category} Collection ${Math.ceil(i / categories.length)}`,
        category: category,
        // Picsum seed guarantees the URL works perfectly and is consistent
        url: `https://picsum.photos/seed/aurelia${i}/800/600`
    });
}

// High-res URLs for Hero Slider (Using some of the best images from the gallery)
const heroSlides = [
    { title: 'Discover Nature', tag: 'Featured', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80' },
    { title: 'Modern Architecture', tag: 'Design', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80' },
    { title: 'The Future of Tech', tag: 'Innovation', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80' },
    { title: 'Wanderlust Travel', tag: 'Explore', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80' }
];

// DOM Elements
const galleryContainer = document.getElementById('gallery');
const noResults = document.getElementById('no-results');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const heroSliderContainer = document.getElementById('hero-slider');
const sliderIndicatorsContainer = document.getElementById('slider-indicators');
const sliderPrev = document.getElementById('slider-prev');
const sliderNext = document.getElementById('slider-next');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxZoom = document.getElementById('lightbox-zoom');

// State
let currentSlide = 0;
let slideInterval;
let currentFilteredData = [...galleryData];
let currentLightboxIndex = 0;

// --- INITIALIZATION ---
function init() {
    renderHeroSlider();
    renderGallery(currentFilteredData);
    setupEventListeners();
    startSlideShow();
}

// --- HERO SLIDER ---
function renderHeroSlider() {
    heroSlides.forEach((slide, index) => {
        // Create Slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${slide.url}" alt="${slide.title}">
            <div class="slide-content">
                <span class="slide-tag">${slide.tag}</span>
                <h1 class="slide-title">${slide.title}</h1>
            </div>
        `;
        heroSliderContainer.appendChild(slideDiv);

        // Create Indicator
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        sliderIndicatorsContainer.appendChild(indicator);
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
    
    resetSlideShow();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 6000);
}

function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
}

// --- GALLERY ---
function renderGallery(data) {
    galleryContainer.innerHTML = '';
    
    if (data.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    data.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="item-overlay">
                <h3>${item.title}</h3>
                <span class="tag">${item.category}</span>
            </div>
        `;
        
        // Staggered entrance (handled by animations.js reveal observer)
        div.style.setProperty('--stagger', `${(index % 8) * 70}ms`);
        
        div.addEventListener('click', () => openLightbox(index));
        galleryContainer.appendChild(div);
    });
    document.dispatchEvent(new CustomEvent('gallery:rendered'));
}

function filterGallery() {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const searchTerm = searchInput.value.toLowerCase();
    
    currentFilteredData = galleryData.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                              item.category.toLowerCase().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });
    
    renderGallery(currentFilteredData);
}

// --- LIGHTBOX ---
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.classList.remove('zoomed'); // Reset zoom
}

function updateLightboxContent() {
    const item = currentFilteredData[currentLightboxIndex];
    // Request a slightly higher res image for lightbox (works for both Unsplash and Picsum URLs)
    const highResUrl = item.url.includes('unsplash') 
        ? item.url.replace('w=800', 'w=1200')
        : item.url.replace('800/600', '1200/900');
    
    lightboxImg.classList.remove('swap-in');
    void lightboxImg.offsetWidth;
    lightboxImg.src = highResUrl;
    lightboxImg.classList.add('swap-in');
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
}

function nextLightboxImg() {
    currentLightboxIndex++;
    if (currentLightboxIndex >= currentFilteredData.length) {
        currentLightboxIndex = 0;
    }
    updateLightboxContent();
    lightboxImg.classList.remove('zoomed');
}

function prevLightboxImg() {
    currentLightboxIndex--;
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentFilteredData.length - 1;
    }
    updateLightboxContent();
    lightboxImg.classList.remove('zoomed');
}

function toggleZoom() {
    lightboxImg.classList.toggle('zoomed');
    const icon = lightboxZoom.querySelector('i');
    if (lightboxImg.classList.contains('zoomed')) {
        icon.className = 'fa-solid fa-magnifying-glass-minus';
    } else {
        icon.className = 'fa-solid fa-magnifying-glass-plus';
    }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    // Slider Controls
    sliderNext.addEventListener('click', nextSlide);
    sliderPrev.addEventListener('click', prevSlide);
    
    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterGallery();
        });
    });
    
    // Search
    searchInput.addEventListener('input', filterGallery);
    
    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextLightboxImg);
    lightboxPrev.addEventListener('click', prevLightboxImg);
    lightboxZoom.addEventListener('click', toggleZoom);
    lightboxImg.addEventListener('click', toggleZoom);
    
    // Close lightbox on clicking outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightboxImg();
        if (e.key === 'ArrowLeft') prevLightboxImg();
    });
}

// Run app
document.addEventListener('DOMContentLoaded', init);
