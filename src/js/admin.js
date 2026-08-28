/**
 * Admin Dashboard — Madhusha & Malshi Wedding
 * Fetches RSVP data from Firebase Firestore, renders stats, table, chart, messages
 * Password-protected with client-side gate
 */

import '../css/admin.css';
import { getDb, isFirebaseConfigured } from './firebase.js';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// ===== Config =====
const ADMIN_PASSWORD = 'madhusha2026';  // Change this to your preferred password
let allRsvps = [];

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
  setCurrentDate();
});

// ===== Login =====
function initLogin() {
  // Check if already logged in this session
  if (sessionStorage.getItem('admin-auth') === 'true') {
    showDashboard();
    return;
  }

  const passwordInput = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');

  // Enter key to login
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });

  // Focus the input
  setTimeout(() => passwordInput.focus(), 500);

  // Expose to global for onclick
  window.attemptLogin = attemptLogin;
}

function attemptLogin() {
  const input = document.getElementById('login-password');
  const error = document.getElementById('login-error');

  if (input.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin-auth', 'true');
    showDashboard();
  } else {
    error.classList.add('show');
    input.value = '';
    input.focus();
    setTimeout(() => error.classList.remove('show'), 2500);
  }
}

function showDashboard() {
  const overlay = document.getElementById('login-overlay');
  const dashboard = document.getElementById('dashboard');

  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';
  setTimeout(() => {
    overlay.style.display = 'none';
    dashboard.style.display = 'block';
    loadData();
    initEventListeners();
  }, 400);
}

function setCurrentDate() {
  const el = document.getElementById('topbar-date');
  if (el) {
    el.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

// ===== Event Listeners =====
function initEventListeners() {
  // Refresh button
  document.getElementById('btn-refresh').addEventListener('click', () => {
    const btn = document.getElementById('btn-refresh');
    btn.classList.add('spinning');
    setTimeout(() => btn.classList.remove('spinning'), 800);
    loadData();
  });

  // Search
  document.getElementById('search-input').addEventListener('input', renderTable);

  // Filter
  document.getElementById('filter-status').addEventListener('change', renderTable);

  // Export
  document.getElementById('btn-export').addEventListener('click', exportCSV);

  // Sortable headers
  document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      sortTable(field);
    });
  });
}

// ===== Data Loading =====
let currentSort = { field: 'date', dir: 'desc' };

async function loadData() {
  allRsvps = [];

  // Try Firebase first
  if (isFirebaseConfigured()) {
    try {
      const db = getDb();
      if (db) {
        const q = query(collection(db, 'rsvps'), orderBy('submittedAtLocal', 'desc'));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const data = doc.data();
          allRsvps.push({
            id: doc.id,
            attendance: data.attendance || 'unknown',
            guestCount: data.guestCount || 1,
            guests: data.guests || [],
            mealPrefs: data.mealPrefs || [],
            dietaryNotes: data.dietaryNotes || '',
            personalMessage: data.personalMessage || '',
            date: data.submittedAtLocal || data.submittedAt?.toDate?.()?.toISOString() || '',
          });
        });
      }
    } catch (err) {
      console.error('Error loading from Firebase:', err);
    }
  }

  // If no Firebase data, check localStorage for demo/testing
  if (allRsvps.length === 0) {
    const saved = localStorage.getItem('wedding-rsvp-madhusha-malshi');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        allRsvps.push({
          id: 'local-1',
          attendance: data.attendance || 'unknown',
          guestCount: data.guestCount || 1,
          guests: data.guests || [],
          mealPrefs: data.mealPrefs || [],
          dietaryNotes: data.dietaryNotes || '',
          personalMessage: data.personalMessage || '',
          date: new Date().toISOString(),
        });
      } catch (e) { /* ignore */ }
    }
  }

  renderAll();
}

// ===== Rendering =====
function renderAll() {
  renderStats();
  renderTable();
  renderGuestCapacityChart();
  renderMealChart();
  renderMessages();
}

// --- Stats ---
function renderStats() {
  const total = allRsvps.length;
  const attending = allRsvps.filter(r => r.attendance === 'yes');
  const declined = allRsvps.filter(r => r.attendance === 'no');
  const maybe = allRsvps.filter(r => r.attendance === 'maybe');
  const confirmedGuests = attending.reduce((sum, r) => sum + (r.guestCount || 1), 0);
  const totalGuests = confirmedGuests + maybe.reduce((sum, r) => sum + (r.guestCount || 1), 0);

  animateNumber('stat-total', total);
  animateNumber('stat-attending', attending.length);
  animateNumber('stat-declined', declined.length);
  animateNumber('stat-maybe', maybe.length);
  animateNumber('stat-guests', totalGuests);
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  const start = parseInt(el.textContent) || 0;
  if (start === target) {
    el.textContent = target;
    return;
  }

  const duration = 600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// --- Table ---
function renderTable() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filterStatus = document.getElementById('filter-status').value;

  let filtered = allRsvps;

  // Filter by status
  if (filterStatus !== 'all') {
    filtered = filtered.filter(r => r.attendance === filterStatus);
  }

  // Filter by search
  if (searchTerm) {
    filtered = filtered.filter(r =>
      r.guests.some(g => g.toLowerCase().includes(searchTerm)) ||
      r.personalMessage.toLowerCase().includes(searchTerm) ||
      r.dietaryNotes.toLowerCase().includes(searchTerm)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let valA, valB;
    switch (currentSort.field) {
      case 'date':
        valA = a.date || '';
        valB = b.date || '';
        break;
      case 'status':
        valA = a.attendance;
        valB = b.attendance;
        break;
      case 'guests':
        valA = (a.guests[0] || '').toLowerCase();
        valB = (b.guests[0] || '').toLowerCase();
        break;
      default:
        valA = a.date || '';
        valB = b.date || '';
    }
    if (currentSort.dir === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  const tbody = document.getElementById('table-body');
  const emptyState = document.getElementById('table-empty');
  const tableWrapper = document.querySelector('.table-wrapper');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    tableWrapper.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  tableWrapper.style.display = 'block';

  const mealEmojis = {
    chicken: '🍗',
    fish: '🐟',
    vegetarian: '🥗',
    vegan: '🌱',
  };

  tbody.innerHTML = filtered.map(r => {
    const dateStr = r.date ? new Date(r.date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }) : '—';

    const statusLabel = r.attendance === 'yes' ? 'Attending' :
                       r.attendance === 'no' ? 'Declined' :
                       r.attendance === 'maybe' ? 'Maybe' : 'Unknown';

    const badgeClass = `badge badge-${r.attendance}`;

    const guestsHtml = r.guests.length > 0
      ? r.guests.map(g => `<span class="guest-name">${escapeHtml(g)}</span>`).join('')
      : '<span style="opacity:0.4">—</span>';

    const mealsHtml = r.mealPrefs.length > 0
      ? r.mealPrefs.map(m => {
          const emoji = mealEmojis[m] || '🍽️';
          return `<span class="meal-tag">${emoji} ${capitalize(m)}</span>`;
        }).join('')
      : '<span style="opacity:0.4">—</span>';

    return `
      <tr>
        <td style="white-space:nowrap; font-size:0.75rem;">${dateStr}</td>
        <td><span class="${badgeClass}">${statusLabel}</span></td>
        <td><div class="guest-list">${guestsHtml}</div></td>
        <td style="text-align:center; font-weight:600;">${r.guestCount}</td>
        <td><div class="meal-list">${mealsHtml}</div></td>
        <td class="td-dietary" title="${escapeHtml(r.dietaryNotes)}">${escapeHtml(r.dietaryNotes) || '<span style="opacity:0.4">—</span>'}</td>
        <td class="td-message" title="${escapeHtml(r.personalMessage)}">${escapeHtml(r.personalMessage) || '<span style="opacity:0.4">—</span>'}</td>
      </tr>
    `;
  }).join('');
}

function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.dir = 'asc';
  }
  renderTable();
}

// --- Chart 1: Guest Capacity (Hall Capacity: 120 Guests) ---
const HALL_CAPACITY = 120;

function renderGuestCapacityChart() {
  const attending = allRsvps.filter(r => r.attendance === 'yes');
  const maybe = allRsvps.filter(r => r.attendance === 'maybe');
  
  const confirmedCount = attending.reduce((sum, r) => sum + (r.guestCount || 1), 0);
  const maybeCount = maybe.reduce((sum, r) => sum + (r.guestCount || 1), 0);
  const totalCount = confirmedCount + maybeCount;
  const availableCount = Math.max(0, HALL_CAPACITY - totalCount);
  const percentFilled = Math.min(100, Math.round((totalCount / HALL_CAPACITY) * 100));

  // Update badge in header
  const badge = document.getElementById('capacity-badge');
  if (badge) {
    badge.textContent = `${totalCount} / ${HALL_CAPACITY} (${percentFilled}%)`;
  }

  const canvas = document.getElementById('guest-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 240 * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = '240px';
  canvas.style.height = '240px';

  const cx = 120, cy = 120, radius = 90, innerRadius = 55;
  ctx.clearRect(0, 0, 240, 240);

  const slices = [
    { label: 'Confirmed', count: confirmedCount, color: '#2EAD70', icon: '✅' },
    { label: 'Maybe', count: maybeCount, color: '#D4AF37', icon: '🤔' },
    { label: 'Available', count: availableCount, color: '#2A3C34', icon: '🪑' },
  ].filter(s => s.count > 0 || (s.label === 'Available' && totalCount === 0));

  // If no responses at all, show empty hall
  if (slices.length === 0) {
    slices.push({ label: 'Available', count: HALL_CAPACITY, color: '#2A3C34', icon: '🪑' });
  }

  let startAngle = -Math.PI / 2;
  slices.forEach(slice => {
    const sliceAngle = (slice.count / HALL_CAPACITY) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();

    // Subtle slice border
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0F1A15';
    ctx.stroke();

    startAngle = endAngle;
  });

  // Center text
  ctx.fillStyle = '#f0f0f0';
  ctx.font = '700 24px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(totalCount, cx, cy - 8);
  ctx.fillStyle = '#8E9FA5';
  ctx.font = '600 10px Inter';
  ctx.fillText(`/ ${HALL_CAPACITY} GUESTS`, cx, cy + 12);

  // Legend
  const legendEl = document.getElementById('guest-chart-legend');
  if (legendEl) {
    legendEl.innerHTML = [
      { label: 'Confirmed', count: confirmedCount, color: '#2EAD70', icon: '✅' },
      { label: 'Maybe', count: maybeCount, color: '#D4AF37', icon: '🤔' },
      { label: 'Available', count: availableCount, color: '#4A6256', icon: '🪑' },
    ].map(item => {
      const pct = Math.round((item.count / HALL_CAPACITY) * 100);
      return `
        <div class="legend-item">
          <span class="legend-dot" style="background: ${item.color}"></span>
          ${item.icon} ${item.label}: <strong>${item.count}</strong> <span style="opacity:0.7">(${pct}%)</span>
        </div>
      `;
    }).join('');
  }
}

// --- Chart 2: Meal Category Breakdown ---
function renderMealChart() {
  const attending = allRsvps.filter(r => r.attendance !== 'no');
  const allMeals = attending.flatMap(r => r.mealPrefs).filter(m => m);

  const chartArea = document.getElementById('meal-chart-area');
  const chartEmpty = document.getElementById('chart-empty');
  const mealsBadge = document.getElementById('meals-badge');

  if (mealsBadge) {
    mealsBadge.textContent = `${allMeals.length} Meals`;
  }

  if (allMeals.length === 0) {
    if (chartArea) chartArea.style.display = 'none';
    if (chartEmpty) chartEmpty.style.display = 'block';
    return;
  }

  if (chartArea) chartArea.style.display = 'flex';
  if (chartEmpty) chartEmpty.style.display = 'none';

  // Count meals
  const counts = {};
  allMeals.forEach(m => {
    counts[m] = (counts[m] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);
  const total = values.reduce((a, b) => a + b, 0);

  const colors = {
    chicken: '#F5A623',
    fish: '#5B9FED',
    vegetarian: '#2EAD70',
    vegan: '#8BD4A4',
  };

  const mealIcons = {
    chicken: '🍗',
    fish: '🐟',
    vegetarian: '🥗',
    vegan: '🌱',
  };

  // Draw donut chart on canvas
  const canvas = document.getElementById('meal-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 240 * dpr;
  canvas.height = 240 * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = '240px';
  canvas.style.height = '240px';

  const cx = 120, cy = 120, radius = 90, innerRadius = 55;
  ctx.clearRect(0, 0, 240, 240);

  let startAngle = -Math.PI / 2;
  labels.forEach((label, i) => {
    const sliceAngle = (values[i] / total) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[label] || '#888';
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0F1A15';
    ctx.stroke();

    startAngle = endAngle;
  });

  // Center text
  ctx.fillStyle = '#f0f0f0';
  ctx.font = '700 24px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 8);
  ctx.fillStyle = '#8E9FA5';
  ctx.font = '600 10px Inter';
  ctx.fillText('MEALS', cx, cy + 12);

  // Legend
  const legendEl = document.getElementById('meal-chart-legend');
  if (legendEl) {
    legendEl.innerHTML = labels.map(label => {
      const pct = Math.round((counts[label] / total) * 100);
      return `
        <div class="legend-item">
          <span class="legend-dot" style="background: ${colors[label] || '#888'}"></span>
          ${mealIcons[label] || '🍽️'} ${capitalize(label)}: <strong>${counts[label]}</strong> <span style="opacity:0.7">(${pct}%)</span>
        </div>
      `;
    }).join('');
  }
}

// --- Messages ---
function renderMessages() {
  const withMessages = allRsvps.filter(r => r.personalMessage);
  const container = document.getElementById('messages-list');
  const emptyEl = document.getElementById('messages-empty');
  const countBadge = document.getElementById('messages-count-badge');

  if (countBadge) {
    countBadge.textContent = `${withMessages.length} Wishes`;
  }

  if (withMessages.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  container.innerHTML = withMessages.map(r => {
    const name = r.guests[0] || 'Anonymous';
    const dateStr = r.date ? new Date(r.date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
    }) : '';

    return `
      <div class="message-card">
        <div class="message-from">💛 ${escapeHtml(name)}</div>
        <div class="message-text">"${escapeHtml(r.personalMessage)}"</div>
        <div class="message-date">${dateStr}</div>
      </div>
    `;
  }).join('');
}

// ===== CSV Export =====
function exportCSV() {
  if (allRsvps.length === 0) return;

  const headers = ['Date', 'Status', 'Guest Count', 'Guest Names', 'Meal Preferences', 'Dietary Notes', 'Message'];
  const rows = allRsvps.map(r => [
    r.date ? new Date(r.date).toLocaleString() : '',
    r.attendance,
    r.guestCount,
    r.guests.join('; '),
    r.mealPrefs.join('; '),
    r.dietaryNotes,
    r.personalMessage,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wedding-rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Helpers =====
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
