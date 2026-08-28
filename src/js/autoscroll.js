/**
 * Auto-Scroll Module
 * - Provides a smooth auto-scroll down the invitation
 * - Floating luxury control button with play/pause state
 * - Automatically pauses when user scrolls manually, touches, or interacts
 * - Resumes on click, automatically stops at the page bottom
 */

let isAutoScrolling = false;
let scrollSpeed = 1.3; // Smooth reading pace (pixels per frame)
let scrollRAF = null;
let autoScrollBtn = null;
let lastScrollY = window.scrollY;

export function initAutoScroll() {
  createAutoScrollButton();
  listenForEnvelopeOpen();
  setupUserInteractionListeners();
  setupScrollIndicator();
}

function createAutoScrollButton() {
  autoScrollBtn = document.createElement('button');
  autoScrollBtn.id = 'autoscroll-toggle';
  autoScrollBtn.className = 'autoscroll-toggle';
  autoScrollBtn.setAttribute('aria-label', 'Toggle Auto Scroll');
  autoScrollBtn.innerHTML = `
    <div class="autoscroll-icon">
      <svg class="icon-play" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <polygon points="6 4 20 12 6 20 6 4"></polygon>
      </svg>
      <svg class="icon-pause" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:none;">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </div>
    <span class="autoscroll-label">Auto Scroll</span>
  `;

  // Hidden initially until invitation is opened
  autoScrollBtn.style.opacity = '0';
  autoScrollBtn.style.pointerEvents = 'none';

  document.body.appendChild(autoScrollBtn);

  autoScrollBtn.addEventListener('click', toggleAutoScroll);
}

function listenForEnvelopeOpen() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (node.id === 'envelope-overlay') {
          observer.disconnect();
          setTimeout(() => {
            showAutoScrollButton();
          }, 800);
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true });
}

function showAutoScrollButton() {
  if (!autoScrollBtn) return;
  autoScrollBtn.style.pointerEvents = 'auto';
  autoScrollBtn.style.animation = 'scrollBtnAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
}

export function startAutoScroll() {
  if (isAutoScrolling) return;
  isAutoScrolling = true;
  updateButtonUI();

  function step() {
    if (!isAutoScrolling) return;

    // Check if reached near bottom
    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10)) {
      stopAutoScroll();
      return;
    }

    window.scrollBy(0, scrollSpeed);
    lastScrollY = window.scrollY;
    scrollRAF = requestAnimationFrame(step);
  }

  scrollRAF = requestAnimationFrame(step);
}

export function stopAutoScroll() {
  isAutoScrolling = false;
  if (scrollRAF) {
    cancelAnimationFrame(scrollRAF);
    scrollRAF = null;
  }
  updateButtonUI();
}

export function toggleAutoScroll() {
  if (isAutoScrolling) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
}

function updateButtonUI() {
  if (!autoScrollBtn) return;
  const playIcon = autoScrollBtn.querySelector('.icon-play');
  const pauseIcon = autoScrollBtn.querySelector('.icon-pause');
  const label = autoScrollBtn.querySelector('.autoscroll-label');

  if (isAutoScrolling) {
    autoScrollBtn.classList.add('scrolling');
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    if (label) label.textContent = 'Pause';
  } else {
    autoScrollBtn.classList.remove('scrolling');
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (label) label.textContent = 'Auto Scroll';
  }
}

function setupUserInteractionListeners() {
  // Pause if user manually wheels/touches/drags to scroll
  window.addEventListener('wheel', () => {
    if (isAutoScrolling) stopAutoScroll();
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    // If touch wasn't on the auto scroll button itself
    if (autoScrollBtn && e.target !== autoScrollBtn && !autoScrollBtn.contains(e.target)) {
      if (isAutoScrolling) stopAutoScroll();
    }
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) {
      if (isAutoScrolling) stopAutoScroll();
    }
  });
}

function setupScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    indicator.style.cursor = 'pointer';
    indicator.addEventListener('click', () => {
      startAutoScroll();
    });
  }
}
