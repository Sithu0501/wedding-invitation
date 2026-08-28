/**
 * Auto-Scroll Module
 * - Starts smooth auto-scrolling automatically when "OPEN INVITATION" is clicked
 * - Faster, cinematic scrolling speed
 * - Stops immediately when user clicks anywhere, touches the screen, or scrolls manually
 */

let isAutoScrolling = false;
let scrollSpeed = 2.5; // Fast and smooth cinematic scroll speed (px per frame)
let scrollRAF = null;
let startTimeout = null;

export function initAutoScroll() {
  listenForEnvelopeOpen();
  setupUserInteractionListeners();
}

function listenForEnvelopeOpen() {
  // Watch for the invitation landing overlay to be removed (user clicked "OPEN INVITATION")
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (node.id === 'envelope-overlay') {
          observer.disconnect();
          // Give user a moment to view the Hero section, then start auto-scroll
          startTimeout = setTimeout(() => {
            startAutoScroll();
          }, 1200);
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true });
}

export function startAutoScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;

  function step() {
    if (!isAutoScrolling) return;

    // Stop when reaching near the bottom of the page
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 15)) {
      stopAutoScroll();
      return;
    }

    window.scrollBy(0, scrollSpeed);
    scrollRAF = requestAnimationFrame(step);
  }

  scrollRAF = requestAnimationFrame(step);
}

export function stopAutoScroll() {
  if (!isAutoScrolling && !startTimeout) return;
  
  // Cancel pending start if user interacted early
  if (startTimeout) {
    clearTimeout(startTimeout);
    startTimeout = null;
  }

  isAutoScrolling = false;
  if (scrollRAF) {
    cancelAnimationFrame(scrollRAF);
    scrollRAF = null;
  }
}

function setupUserInteractionListeners() {
  // Clicking anywhere on the screen stops auto-scroll
  window.addEventListener('click', () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  }, { capture: true });

  // Touch screen anywhere stops auto-scroll
  window.addEventListener('touchstart', () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  }, { passive: true });

  // Mouse wheel stops auto-scroll
  window.addEventListener('wheel', () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  }, { passive: true });

  // Any scroll keys stop auto-scroll
  window.addEventListener('keydown', () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  });
}
