/**
 * Multi-step RSVP form
 * 5 steps: Attendance → Guest Names → Meal Prefs → Hotel → Confirm
 * Data persisted to localStorage + Firebase Firestore
 */

import { getDb, isFirebaseConfigured } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

let rsvpData = {
  attendance: '',
  guestCount: 1,
  guests: [],
  mealPrefs: [],
  dietaryNotes: '',
  personalMessage: '',
};

let currentStep = 1;

export function initRSVP() {
  // Load any saved data
  const saved = localStorage.getItem('wedding-rsvp-madhusha-malshi');
  if (saved) {
    try {
      rsvpData = { ...rsvpData, ...JSON.parse(saved) };
    } catch (e) { /* ignore */ }
  }

  // Expose functions to global scope for inline onclick handlers
  window.selectOption = selectOption;
  window.nextStep = nextStep;
  window.prevStep = prevStep;
  window.submitRSVP = submitRSVP;
}

function selectOption(el, type) {
  const container = el.parentElement;
  container.querySelectorAll('.rsvp-option').forEach(opt => opt.classList.remove('selected'));
  el.classList.add('selected');

  const value = el.dataset.value;

  if (type === 'attendance') {
    rsvpData.attendance = value;
    const guestField = document.getElementById('guest-count-field');
    if (value === 'yes' || value === 'maybe') {
      guestField.style.display = 'flex';
    } else {
      guestField.style.display = 'none';
    }
  }
}

function nextStep(fromStep) {
  // Validate current step
  if (!validateStep(fromStep)) return;

  // Collect data from current step
  collectStepData(fromStep);

  // Save to localStorage
  saveData();

  if (fromStep === 1 && rsvpData.attendance === 'no') {
    // Skip to confirmation if declining
    currentStep = 4;
    showStep(4);
    updateProgress(4);
    buildSummary();
    return;
  }

  currentStep = fromStep + 1;

  // Build dynamic content for next step
  if (currentStep === 2) buildGuestNameInputs();
  if (currentStep === 3) buildMealPrefInputs();
  if (currentStep === 4) buildSummary();

  showStep(currentStep);
  updateProgress(currentStep);
}

function prevStep(fromStep) {
  if (rsvpData.attendance === 'no' && fromStep === 4) {
    currentStep = 1;
  } else {
    currentStep = fromStep - 1;
  }
  showStep(currentStep);
  updateProgress(currentStep);
}

function showStep(step) {
  document.querySelectorAll('.rsvp-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`rsvp-step-${step}`);
  if (target) target.classList.add('active');
}

function updateProgress(step) {
  const indicators = document.querySelectorAll('.rsvp-step-indicator');
  const lines = document.querySelectorAll('.rsvp-step-line');

  indicators.forEach((ind, i) => {
    const s = i + 1;
    ind.classList.remove('active', 'completed');
    if (s === step) ind.classList.add('active');
    else if (s < step) ind.classList.add('completed');
  });

  lines.forEach((line, i) => {
    line.classList.remove('completed');
    if (i + 1 < step) line.classList.add('completed');
  });
}

function validateStep(step) {
  if (step === 1) {
    if (!rsvpData.attendance) {
      shakeElement(document.getElementById('attendance-options'));
      return false;
    }
  }
  if (step === 2) {
    const inputs = document.querySelectorAll('#guest-names-container input');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = 'rgba(231, 76, 60, 0.6)';
        valid = false;
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
      }
    });
    if (!valid) return false;
  }
  return true;
}

function collectStepData(step) {
  if (step === 1) {
    rsvpData.guestCount = parseInt(document.getElementById('guest-count').value) || 1;
  }
  if (step === 2) {
    const inputs = document.querySelectorAll('#guest-names-container input');
    rsvpData.guests = Array.from(inputs).map(inp => inp.value.trim());
  }
  if (step === 3) {
    const selects = document.querySelectorAll('#meal-prefs-container select');
    rsvpData.mealPrefs = Array.from(selects).map(sel => sel.value);
    rsvpData.dietaryNotes = document.getElementById('dietary-notes').value.trim();
  }
}

function buildGuestNameInputs() {
  const container = document.getElementById('guest-names-container');
  container.innerHTML = '';

  for (let i = 0; i < rsvpData.guestCount; i++) {
    const card = document.createElement('div');
    card.className = 'guest-card';
    card.innerHTML = `
      <div class="guest-card-header">Guest ${i + 1}${i === 0 ? ' (You)' : ''}</div>
      <div class="rsvp-field">
        <input type="text" placeholder="Full Name" value="${rsvpData.guests[i] || ''}" />
      </div>
    `;
    container.appendChild(card);
  }
}

function buildMealPrefInputs() {
  const container = document.getElementById('meal-prefs-container');
  container.innerHTML = '';

  const guests = rsvpData.guests.length ? rsvpData.guests : ['Guest 1'];

  guests.forEach((name, i) => {
    const card = document.createElement('div');
    card.className = 'guest-card';
    card.innerHTML = `
      <div class="guest-card-header">${name || `Guest ${i + 1}`}</div>
      <div class="rsvp-field">
        <label>Meal Preference</label>
        <select>
          <option value="">Select meal...</option>
          <option value="chicken" ${rsvpData.mealPrefs[i] === 'chicken' ? 'selected' : ''}>🍗 Chicken</option>
          <option value="fish" ${rsvpData.mealPrefs[i] === 'fish' ? 'selected' : ''}>🐟 Fish</option>
          <option value="vegetarian" ${rsvpData.mealPrefs[i] === 'vegetarian' ? 'selected' : ''}>🥗 Vegetarian</option>
          <option value="vegan" ${rsvpData.mealPrefs[i] === 'vegan' ? 'selected' : ''}>🌱 Vegan</option>
        </select>
      </div>
    `;
    container.appendChild(card);
  });
}

function buildSummary() {
  const summary = document.getElementById('rsvp-summary');
  const attending = rsvpData.attendance === 'yes' ? 'Joyfully Accepting' :
                    rsvpData.attendance === 'no' ? 'Regretfully Declining' : 'Maybe Attending';

  let html = `
    <div style="font-family: Inter, sans-serif; color: rgba(255,255,255,0.7); font-size: 0.85rem; line-height: 2;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
        <span>Response</span>
        <span style="color: #D4AF37; font-weight: 500;">${attending}</span>
      </div>
  `;

  if (rsvpData.attendance !== 'no') {
    html += `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
        <span>Guests</span>
        <span style="color: #FFFFF0;">${rsvpData.guests.join(', ') || 'N/A'}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Meals</span>
        <span style="color: #FFFFF0;">${rsvpData.mealPrefs.filter(m => m).join(', ') || 'N/A'}</span>
      </div>
    `;
  }

  html += '</div>';
  summary.innerHTML = html;
}

async function submitRSVP() {
  rsvpData.personalMessage = document.getElementById('personal-message').value.trim();
  saveData();

  // Save to Firebase Firestore (cloud)
  await saveToFirestore();

  // Hide all steps, show success
  document.querySelectorAll('.rsvp-step').forEach(s => s.classList.remove('active'));
  document.getElementById('rsvp-progress').style.display = 'none';
  document.getElementById('rsvp-success').classList.add('active');

  // Trigger confetti
  launchConfetti();
}

function saveData() {
  localStorage.setItem('wedding-rsvp-madhusha-malshi', JSON.stringify(rsvpData));
}

async function saveToFirestore() {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured — RSVP saved locally only.');
    return;
  }

  try {
    const db = getDb();
    if (!db) return;

    await addDoc(collection(db, 'rsvps'), {
      attendance: rsvpData.attendance,
      guestCount: rsvpData.guestCount,
      guests: rsvpData.guests,
      mealPrefs: rsvpData.mealPrefs,
      dietaryNotes: rsvpData.dietaryNotes,
      personalMessage: rsvpData.personalMessage,
      submittedAt: serverTimestamp(),
      submittedAtLocal: new Date().toISOString(),
    });
    console.log('✅ RSVP saved to cloud!');
  } catch (err) {
    console.error('Failed to save RSVP to cloud:', err);
  }
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // force reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 500);
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors = ['#D4AF37', '#F5E6A3', '#2EAD70', '#5DD9A0', '#E8738A', '#FFD14D', '#FFFFF0'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${Math.random() * 10 + 5}px`;
    piece.style.height = `${Math.random() * 10 + 5}px`;
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.opacity = '1';

    container.appendChild(piece);

    const duration = Math.random() * 2 + 1.5;
    const xDrift = Math.random() * 200 - 100;

    piece.animate([
      {
        transform: `translate(0, -20px) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(${xDrift}px, ${window.innerHeight + 50}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0,
      }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards',
      delay: Math.random() * 500,
    });

    setTimeout(() => piece.remove(), (duration + 0.5) * 1000 + 500);
  }
}
