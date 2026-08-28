/**
 * Main entry point
 * Orchestrates all modules: Envelope, Countdown, RSVP, Map
 * Initializes AOS, navigation, smooth scroll
 */

import '../css/style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { initEnvelope } from './envelope.js';
import { initCountdown } from './countdown.js';
import { initRSVP } from './rsvp.js';
import { initMap } from './map.js';
import { initMusic } from './music.js';
import { initAutoScroll } from './autoscroll.js';

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });

  // Initialize all modules
  initEnvelope();
  initCountdown();
  initRSVP();
  initMap();
  initMusic();
  initAutoScroll();

  // Navigation & Hero effects
  initNavigation();
  initHeroParticles();

  // Smooth scroll
  initSmoothScroll();
});

function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.background = Math.random() > 0.4 ? '#FFD14D' : '#FFFFF0';
    p.style.boxShadow = '0 0 10px rgba(255, 209, 77, 0.8)';
    p.style.opacity = (Math.random() * 0.6 + 0.2).toString();
    p.style.animation = `float ${Math.random() * 5 + 4}s ease-in-out infinite alternate`;
    p.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(p);
  }
}

// ===== Navigation =====
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!nav) return;

  // Scroll handler: change nav style
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Mobile menu toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');

      // Animate hamburger to X
      const spans = menuBtn.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top,
          behavior: 'smooth',
        });
      }
    });
  });
}
