// ApexSnap — premium gallery motion layer (vanilla JS, no dependencies)
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;

    // Scroll reveal observer
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    function wireItems() {
        document.querySelectorAll('.gallery-item:not([data-anim])').forEach((item) => {
            item.dataset.anim = '1';
            io.observe(item);
            const img = item.querySelector('img');
            if (img) {
                if (img.complete && img.naturalWidth) img.classList.add('loaded');
                else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            }
            if (canHover && !reduce) addTilt(item);
        });
        const g = document.getElementById('gallery');
        if (g) requestAnimationFrame(() => g.classList.remove('switching'));
    }

    // 3D tilt + inner image parallax
    function addTilt(item) {
        const img = item.querySelector('img');
        item.addEventListener('mousemove', (e) => {
            const r = item.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            item.classList.add('tilting');
            item.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
            if (img) img.style.transform = `scale(1.12) translate(${-x * 14}px, ${-y * 14}px)`;
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('tilting');
            item.style.transform = '';
            if (img) img.style.transform = '';
        });
    }

    // Lightbox: FLIP zoom from clicked thumbnail
    let lastThumb = null;
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item || reduce) return;
        lastThumb = item.querySelector('img');
        const lbImg = document.getElementById('lightbox-img');
        requestAnimationFrame(() => {
            const from = lastThumb.getBoundingClientRect();
            const to = lbImg.getBoundingClientRect();
            if (!to.width) return;
            const sx = from.width / to.width, sy = from.height / to.height;
            const dx = from.left + from.width / 2 - (to.left + to.width / 2);
            const dy = from.top + from.height / 2 - (to.top + to.height / 2);
            lbImg.classList.remove('swap-in');
            lbImg.classList.add('fly');
            lbImg.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                lbImg.classList.remove('fly');
                lbImg.style.transform = '';
            }));
        });
    }, true);

    // Direction-aware slide in lightbox
    const setDir = (d) => document.getElementById('lightbox-img')?.style.setProperty('--swap-dir', d);
    document.getElementById('lightbox-next')?.addEventListener('click', () => setDir('40px'), true);
    document.getElementById('lightbox-prev')?.addEventListener('click', () => setDir('-40px'), true);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') setDir('40px');
        if (e.key === 'ArrowLeft') setDir('-40px');
    }, true);

    // Filter ripple + gallery switch fade
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const r = btn.getBoundingClientRect();
            const s = document.createElement('span');
            const size = Math.max(r.width, r.height);
            s.className = 'ripple';
            s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
            btn.appendChild(s);
            setTimeout(() => s.remove(), 650);
        });
        btn.addEventListener('click', () => document.getElementById('gallery')?.classList.add('switching'), true);
    });

    // Scroll: progress bar, navbar shrink, hero parallax
    const bar = document.querySelector('.scroll-progress');
    const nav = document.querySelector('.navbar');
    const hero = document.getElementById('hero-slider');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.scrollY;
            const max = document.documentElement.scrollHeight - innerHeight;
            if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
            nav?.classList.toggle('scrolled', y > 40);
            if (hero && !reduce && y < innerHeight) hero.style.transform = `translateY(${y * 0.35}px)`;
            ticking = false;
        });
    }, { passive: true });

    document.addEventListener('gallery:rendered', wireItems);
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelector('.controls-container')?.classList.add('reveal');
        document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
        wireItems();
    });
})();
