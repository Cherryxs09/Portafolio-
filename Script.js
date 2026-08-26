document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ============================================================
    // Scroll reveal
    // ============================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ============================================================
    // Anotación de rol: alterna frases escritas a mano en tinta roja
    // ============================================================
    const roleAnnotation = document.getElementById('roleAnnotation');
    if (roleAnnotation) {
        const notes = [
            '→ diseñador de sistemas legibles',
            '→ investigador de comportamiento',
            '→ prototipador compulsivo',
            '→ Alejandro Ayala'
        ];
        let idx = 0;
        if (!prefersReducedMotion) {
            setInterval(() => {
                idx = (idx + 1) % notes.length;
                roleAnnotation.classList.remove('swap');
                void roleAnnotation.offsetWidth;
                roleAnnotation.textContent = notes[idx];
                roleAnnotation.classList.add('swap');
            }, 2600);
        }
    }

    // ============================================================
    // Índice lateral: resaltar la sección activa
    // ============================================================
    const tabStops = Array.from(document.querySelectorAll('.tab-stop'));
    const sections = tabStops
        .map(stop => document.querySelector(stop.getAttribute('href')))
        .filter(Boolean);

    function setActiveStop(index) {
        tabStops.forEach((s, i) => {
            const active = i === index;
            s.classList.toggle('is-active', active);
            if (active && s.dataset.color) {
                s.style.setProperty('--ink-color', s.dataset.color);
            }
        });
    }

    if (sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = sections.indexOf(entry.target);
                    if (idx !== -1) setActiveStop(idx);
                }
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
        sections.forEach(sec => sectionObserver.observe(sec));
        setActiveStop(0);
    }

    // ============================================================
    // Gafete independiente arrastrable con efecto elástico
    // ============================================================
    const badge = document.getElementById('draggableBadge');
    if (badge) {
        let isDragging = false;
        let startX, startY;
        let currentX = 0;
        let currentY = 0;

        function dragStart(e) {
            isDragging = true;
            badge.style.transition = 'none';
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            startX = clientX - currentX;
            startY = clientY - currentY;
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            currentX = clientX - startX;
            currentY = clientY - startY;

            badge.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${2 + currentX * 0.03}deg)`;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            badge.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            currentX = 0;
            currentY = 0;
            badge.style.transform = `translate(0px, 0px) rotate(2deg)`;

            setTimeout(() => {
                badge.style.transition = '';
            }, 600);
        }

        badge.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', dragEnd);

        badge.addEventListener('touchstart', dragStart);
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', dragEnd);
    }
});