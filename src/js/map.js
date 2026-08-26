/**
 * Registry map and QR code generation
 * Uses canvas-based QR code generation (no external lib needed)
 */

export function initMap() {
  // Expose modal functions globally for onclick
  window.openQRModal = openQRModal;
  window.closeQRModal = closeQRModal;

  // Close modal on backdrop click
  const modal = document.getElementById('qr-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQRModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQRModal();
  });
}

function openQRModal(title, url) {
  const modal = document.getElementById('qr-modal');
  const titleEl = document.getElementById('qr-modal-title');
  const canvas = document.getElementById('qr-canvas');

  if (!modal || !canvas) return;

  titleEl.textContent = title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Generate QR code on canvas
  generateQR(canvas, url);
}

function closeQRModal() {
  const modal = document.getElementById('qr-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Simple QR Code generator using canvas
 * Generates a styled QR-like pattern (decorative placeholder)
 * For production, replace with a proper QR library
 */
function generateQR(canvas, data) {
  const ctx = canvas.getContext('2d');
  const size = 200;
  canvas.width = size;
  canvas.height = size;

  // Clear
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Generate a deterministic pattern from the URL string
  const cellSize = 8;
  const gridSize = Math.floor(size / cellSize);
  const margin = 2;

  // Create a simple hash-based grid
  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      // Margin cells are white
      if (x < margin || x >= gridSize - margin || y < margin || y >= gridSize - margin) {
        grid[y][x] = false;
        continue;
      }

      // Position detection patterns (corners)
      const isTopLeft = x < margin + 7 && y < margin + 7;
      const isTopRight = x >= gridSize - margin - 7 && y < margin + 7;
      const isBottomLeft = x < margin + 7 && y >= gridSize - margin - 7;

      if (isTopLeft || isTopRight || isBottomLeft) {
        const cx = isTopLeft ? margin + 3 : isTopRight ? gridSize - margin - 4 : margin + 3;
        const cy = (isTopLeft || isTopRight) ? margin + 3 : gridSize - margin - 4;
        const dx = Math.abs(x - cx);
        const dy = Math.abs(y - cy);
        const maxD = Math.max(dx, dy);
        grid[y][x] = maxD <= 3 && (maxD === 0 || maxD === 2 || maxD === 3);
        continue;
      }

      // Data area: use string hash for pattern
      const hash = simpleHash(data + x * 31 + y * 17);
      grid[y][x] = hash % 3 !== 0; // ~66% fill for QR-like density
    }
  }

  // Make it symmetric-ish for aesthetics
  for (let y = margin; y < gridSize - margin; y++) {
    for (let x = margin; x < Math.floor(gridSize / 2); x++) {
      if (y > margin + 7 && y < gridSize - margin - 7) {
        // Only mirror some cells
        const hash = simpleHash(data + x + y * 100);
        if (hash % 4 === 0) {
          grid[y][gridSize - 1 - x] = grid[y][x];
        }
      }
    }
  }

  // Draw cells
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = '#2EAD70';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  // Draw small logo in center
  const logoSize = 28;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8);

  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(logoX, logoY, logoSize, logoSize);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M&M', size / 2, size / 2);
}

function simpleHash(str) {
  let hash = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
