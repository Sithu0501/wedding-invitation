import { gsap } from 'gsap';

/**
 * Envelope reveal animation using GSAP
 * - Full-screen envelope with wax seal
 * - Click/tap to open: flap opens, card slides out
 * - Overlay fades away revealing the main site
 */
export function initEnvelope() {
  const overlay = document.getElementById('envelope-overlay');
  const flap = document.getElementById('envelope-flap');
  const card = document.getElementById('envelope-card');
  const seal = document.getElementById('wax-seal');
  const prompt = document.querySelector('.envelope-prompt');

  if (!overlay) return;

  // Prevent scrolling while envelope is visible
  document.body.style.overflow = 'hidden';

  // Create floating particles
  createParticles();

  // Click handler
  overlay.addEventListener('click', openEnvelope, { once: true });

  function openEnvelope() {
    const tl = gsap.timeline({
      onComplete: () => {
        overlay.remove();
        document.body.style.overflow = '';
      }
    });

    // 1. Hide prompt
    tl.to(prompt, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in'
    });

    // 2. Seal breaks apart
    tl.to(seal, {
      scale: 1.3,
      opacity: 0,
      duration: 0.4,
      ease: 'back.in(2)',
    }, '-=0.1');

    // 3. Envelope flap opens (3D rotation)
    tl.to(flap, {
      rotateX: -180,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.2');

    // 4. Card slides up
    tl.to(card, {
      y: '-30%',
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
    }, '-=0.3');

    // 5. Card text reveals (staggered)
    tl.to('#envelope-card h2, #envelope-card h1, #envelope-card .ampersand, #envelope-card p', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.12,
      ease: 'power2.out',
    }, '-=0.3');

    // 6. Hold for a moment
    tl.to({}, { duration: 1.2 });

    // 7. Burst golden particles
    tl.call(() => burstParticles());

    // 8. Fade everything out
    tl.to(overlay, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.5');
  }
}

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? '#D4AF37' : '#F5E6A3';
    container.appendChild(particle);

    // Gentle floating animation
    gsap.to(particle, {
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 2 + 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(particle, {
      y: `${Math.random() * 40 - 20}px`,
      x: `${Math.random() * 30 - 15}px`,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
}

function burstParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.width = `${Math.random() * 6 + 3}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    particle.style.background = ['#D4AF37', '#F5E6A3', '#E8C84A', '#FFD14D', '#FFFFF0'][Math.floor(Math.random() * 5)];
    container.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 40;
    const distance = Math.random() * 300 + 100;

    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      rotation: Math.random() * 720,
      duration: Math.random() * 1 + 0.5,
      ease: 'power2.out',
    });
  }
}
