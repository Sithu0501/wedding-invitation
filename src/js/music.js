/**
 * Background Music Player
 * - Auto-plays "Perfect" by Ed Sheeran when envelope opens
 * - Floating play/pause button with animated equalizer
 * - Remembers user preference
 */

let audio = null;
let isPlaying = false;
let musicBtn = null;

export function initMusic() {
  // Create the audio element
  audio = new Audio('/music/wedding_music.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = 'auto';

  // Create the floating music button
  createMusicButton();

  // Listen for envelope open to auto-play
  listenForEnvelopeOpen();
}

function createMusicButton() {
  // Container button
  musicBtn = document.createElement('button');
  musicBtn.id = 'music-toggle';
  musicBtn.className = 'music-toggle';
  musicBtn.setAttribute('aria-label', 'Toggle background music');
  musicBtn.innerHTML = `
    <div class="music-icon">
      <div class="music-bars">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
    <div class="music-tooltip">
      <span class="music-title">♫ Wedding Melody · Madhusha & Malshi</span>
    </div>
  `;

  // Initially hidden (shown after envelope opens)
  musicBtn.style.opacity = '0';
  musicBtn.style.pointerEvents = 'none';

  document.body.appendChild(musicBtn);

  // Toggle play/pause on click
  musicBtn.addEventListener('click', toggleMusic);
}

function listenForEnvelopeOpen() {
  // Watch for the envelope overlay to be removed (envelope opened)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        if (node.id === 'envelope-overlay') {
          observer.disconnect();
          // Small delay then start music & show button
          setTimeout(() => {
            showMusicButton();
            playMusic();
          }, 500);
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true });
}

function showMusicButton() {
  if (!musicBtn) return;
  musicBtn.style.opacity = '1';
  musicBtn.style.pointerEvents = 'auto';
  musicBtn.style.animation = 'musicBtnAppear 0.6s ease-out forwards';
}

const START_TIME = 15; // Start playback at 15 seconds
let hasSetStartTime = false;

function playMusic() {
  if (!audio) return;

  if (!hasSetStartTime) {
    try {
      audio.currentTime = START_TIME;
    } catch (e) {}
    hasSetStartTime = true;
  }

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked — wait for user interaction
      isPlaying = false;
      musicBtn.classList.remove('playing');
    });
  }
}

function toggleMusic() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
  } else {
    audio.play().then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
    }).catch(() => {});
  }
}
