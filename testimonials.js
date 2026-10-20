// Testimonial carousel: shows one card at a time and fades to the next automatically
(function () {
    // How long each testimonial stays on screen (in milliseconds). 8000 = 8 seconds.
    const DISPLAY_TIME = 8000;

    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsWrap = document.getElementById('testimonial-dots');

    // No testimonials yet: hide the carousel so only the title and button show
    if (cards.length === 0) {
        carousel.hidden = true;
        dotsWrap.hidden = true;
        return;
    }

    // Only one testimonial: show it without arrows, dots, or rotation
    if (cards.length === 1) {
        cards[0].classList.add('is-active');
        prevBtn.hidden = true;
        nextBtn.hidden = true;
        dotsWrap.hidden = true;
        return;
    }

    // Respect visitors who have turned off animations in their device settings
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 0;
    let timer = null;

    // Create one dot per card
    const dots = cards.map((card, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Show testimonial ${index + 1} of ${cards.length}`);
        dot.addEventListener('click', () => {
            showCard(index);
            restart();
        });
        dotsWrap.appendChild(dot);
        return dot;
    });

    // Show the card at the given position (wraps around at either end)
    function showCard(index) {
        current = (index + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const isActive = i === current;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-hidden', String(!isActive));
        });

        dots.forEach((dot, i) => {
            dot.setAttribute('aria-current', String(i === current));
        });
    }

    function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(() => showCard(current + 1), DISPLAY_TIME);
    }

    function stop() {
        clearInterval(timer);
        timer = null;
    }

    // Resets the countdown after someone clicks, so the card they chose doesn't vanish right away
    function restart() {
        stop();
        start();
    }

    prevBtn.addEventListener('click', () => {
        showCard(current - 1);
        restart();
    });

    nextBtn.addEventListener('click', () => {
        showCard(current + 1);
        restart();
    });

    // Pause while someone is reading (mouse over the card) or using the keyboard inside it
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Pause when the browser tab isn't visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    });

    showCard(0);
    start();
})();