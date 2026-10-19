// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ========================================
//   PROJECTS CAROUSEL (seamless infinite loop)
// ========================================
// How it works:
// The track slides one tile with a CSS transition. When the slide
// finishes, the tile that left the view is moved to the other end of
// the track, and the track snaps back to its starting position without
// animating. Because the tiles look identical before and after the snap,
// the loop never shows a jump.

const track = document.getElementById('project-track');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

const SLIDE_DURATION = 500; // milliseconds
const SLIDE_EASING = 'cubic-bezier(0.25, 0.8, 0.25, 1)'; // gentle ease-out

// Respect visitors who turn off animations in their device settings
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Prevents a second click from starting before the first slide finishes
let isSliding = false;

// Distance to move: one tile's width plus the gap between tiles
function getSlideDistance() {
    const tile = track.querySelector('.project-tile');
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return tile.getBoundingClientRect().width + gap;
}

// Animate the track to a position
function slideTo(position) {
    track.style.transition = `transform ${SLIDE_DURATION}ms ${SLIDE_EASING}`;
    track.style.transform = `translateX(${position}px)`;
}

// Move the track to a position instantly (no animation)
function jumpTo(position) {
    track.style.transition = 'none';
    track.style.transform = `translateX(${position}px)`;
}

// Run a function once the track's own slide finishes.
// The check matters because the project cards have hover transitions too,
// and their "transitionend" events bubble up to the track.
function afterSlide(callback) {
    function handleEnd(event) {
        if (event.target !== track || event.propertyName !== 'transform') return;
        track.removeEventListener('transitionend', handleEnd);
        callback();
    }
    track.addEventListener('transitionend', handleEnd);
}

// Next: slide left, then move the first tile to the end
function showNext() {
    if (isSliding) return;

    if (reducedMotion.matches) {
        track.appendChild(track.firstElementChild);
        return;
    }

    isSliding = true;
    slideTo(-getSlideDistance());

    afterSlide(() => {
        track.appendChild(track.firstElementChild);
        jumpTo(0);
        isSliding = false;
    });
}

// Previous: move the last tile to the front (out of view), then slide right
function showPrevious() {
    if (isSliding) return;

    if (reducedMotion.matches) {
        track.prepend(track.lastElementChild);
        return;
    }

    isSliding = true;
    track.prepend(track.lastElementChild);
    jumpTo(-getSlideDistance());

    // Make the browser apply the jump before starting the slide
    track.getBoundingClientRect();

    slideTo(0);
    afterSlide(() => {
        isSliding = false;
    });
}

scrollLeftBtn.addEventListener('click', showPrevious);
scrollRightBtn.addEventListener('click', showNext);