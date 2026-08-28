/**
 * Live countdown timer to the wedding date
 * Flip-card animation on number changes
 * Auto-switches to celebration message on the day
 */

const WEDDING_DATE = new Date('2026-11-19T17:00:00+05:30');

export function initCountdown() {
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

  function update() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      // Wedding day or past
      daysEl.textContent = '🎉';
      hoursEl.textContent = '💍';
      minutesEl.textContent = '💒';
      secondsEl.textContent = '🥂';

      daysEl.parentElement.querySelector('.countdown-label').textContent = '';
      hoursEl.parentElement.querySelector('.countdown-label').textContent = '';
      minutesEl.parentElement.querySelector('.countdown-label').textContent = "It's";
      secondsEl.parentElement.querySelector('.countdown-label').textContent = 'Today!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const padded = {
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };

    // Update with flip animation if value changed
    updateDigit(daysEl, padded.days, prevValues.days);
    updateDigit(hoursEl, padded.hours, prevValues.hours);
    updateDigit(minutesEl, padded.minutes, prevValues.minutes);
    updateDigit(secondsEl, padded.seconds, prevValues.seconds);

    prevValues = { ...padded };

    requestAnimationFrame(() => {
      setTimeout(update, 1000);
    });
  }

  update();
}

function updateDigit(el, newVal, oldVal) {
  if (newVal !== oldVal) {
    el.textContent = newVal;
    el.classList.add('flip');
    setTimeout(() => el.classList.remove('flip'), 600);
  }
}
