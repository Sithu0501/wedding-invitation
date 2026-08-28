import { gsap } from 'gsap';

/**
 * Invitation reveal animation using GSAP
 * - Clean landing screen with "THE WEDDING OF", couple names, date
 * - "OPEN INVITATION" button with smooth fade transition
 */
export function initEnvelope() {
  const overlay = document.getElementById('envelope-overlay');
  const openBtn = document.getElementById('open-invitation-btn');
  const card = document.getElementById('landing-card');

  if (!overlay) return;

  // Prevent scrolling while landing overlay is visible
  document.body.style.overflow = 'hidden';

  // Smooth entrance for landing card
  if (card) {
    gsap.fromTo(
      card,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.1 }
    );
  }

  let isOpened = false;

  function openInvitation(e) {
    if (e) e.stopPropagation();
    if (isOpened) return;
    isOpened = true;

    // Smooth exit animation
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        overlay.remove();
        document.body.style.overflow = '';
      }
    });
  }

  if (openBtn) {
    openBtn.addEventListener('click', openInvitation);
  }
}

