# 💍 The Wedding of Madhusha & Malshi

An interactive, luxury digital wedding invitation and real-time RSVP management platform built with modern web technologies and connected to Firebase Firestore.

---

## ✨ Features

### 🌟 Guest Experience (`index.html`)
- **💌 Luxury Landing Screen**: Elegant typography-focused welcome screen with emerald green and gold shimmer. Clicking **"OPEN INVITATION"** reveals the main experience with smooth GSAP animations.
- **🎵 Romantic Background Music**: Plays custom background melody (with configurable start timestamp at `0:15`) and includes an animated floating equalizer toggle.
- **⏳ Dynamic Countdown Timer**: Live countdown to the wedding ceremony on **November 19, 2026 at 5:00 PM (Weragampita, Matara)**.
- **📖 Our Love Story**: Interactive visual timeline documenting relationship milestones from first date to the proposal.
- **📜 Ceremony & Reception Details**: Luxury portrait invitation card detailing parent honours, bride & groom roles, calendar date block, and Poruwa ceremony schedule.
- **✉️ Multi-Step RSVP System**:
  - Step 1: Attendance confirmation (Joyfully Accept / Regretfully Decline / Maybe).
  - Step 2: Guest count and individual guest names.
  - Step 3: Meal preferences & dietary requirements.
  - Step 4: Personal blessing message & review summary.
  - Interactive confetti burst on successful submission.
- **🗺️ Interactive Venue & Directions**: Pinned Google Map embed for **Mantara Villas, Weragampita, Matara, Sri Lanka** with a one-click *"Get Directions"* link.
- **💎 Luxury Visual Theme**: Curated Emerald Green (`#0D5C3F`), Shimmering Gold (`#D4AF37`), and Warm Ivory (`#FDF8F0`) color palette with ambient emerald glows and subtle animations.

---

### 🛡️ Admin Dashboard (`admin.html`)
- **🔒 Password Protection**: Secure login modal protecting guest data.
- **📊 Real-time Analytics**:
  - Total RSVPs count
  - Attending / Declined / Maybe breakdown
  - Total confirmed guest count
  - Interactive Meal Preference Donut Chart (powered by Chart.js)
- **💬 Guest Messages Feed**: Live stream of heartfelt wishes left by guests.
- **📋 Guest Data Table**:
  - Filter by attendance status (All, Attending, Declined, Maybe)
  - Real-time search by guest name or email
  - Sortable columns
- **📥 CSV Export**: One-click download of all RSVP data for caterers and event planners.

---

## 🛠️ Technology Stack

- **Core**: Vanilla JavaScript (ES6+ Modules), Semantic HTML5, Vanilla CSS3
- **Build Tool**: [Vite](https://vitejs.dev/) (Multi-page configuration for `index.html` and `admin.html`)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) (Real-time cloud database)
- **Animations & Effects**:
  - [GSAP (GreenSock)](https://greensock.com/gsap/) - Opening reveals & micro-animations
  - [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) - Smooth section reveals
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) - RSVP celebration particles
- **Charts**: [Chart.js](https://www.chartjs.org/) - Admin dietary visualization

---

## 📂 Project Structure

```text
wedding-invitation/
├── index.html              # Main wedding invitation page
├── admin.html              # Password-protected admin dashboard
├── vite.config.js          # Vite multi-page build configuration
├── package.json            # Project dependencies & build scripts
├── public/
│   ├── favicon.svg         # Monogram favicon
│   ├── hero_bg.jpg         # Hero background photography
│   └── music/
│       └── wedding_music.mp3 # Custom wedding background audio
└── src/
    ├── css/
    │   ├── style.css       # Main invitation styles (Emerald & Gold theme)
    │   └── admin.css       # Admin dashboard styles & glassmorphism
    └── js/
        ├── main.js         # Main coordinator & lifecycle
        ├── envelope.js     # Landing screen reveal & animations
        ├── countdown.js    # Live countdown timer logic
        ├── rsvp.js         # Multi-step RSVP logic & Firestore sync
        ├── music.js        # Audio player & equalizer controls
        ├── map.js          # Map & directions helper
        ├── firebase.js     # Firebase SDK initialization
        └── admin.js        # Admin auth, Firestore listener, charts & CSV export
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sithu0501/wedding-invitation.git
   cd wedding-invitation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Access the Admin Dashboard:**
   Navigate to `http://localhost:5173/admin.html` and enter the password 

---

## 📦 Production Build & Deployment

To build optimized assets for production:

```bash
npm run build
```

This generates the production bundle in the `dist/` directory, including both `dist/index.html` and `dist/admin.html`.

### Automated Deployment
Pushes to the `main` branch automatically trigger continuous deployment on [Vercel](https://vercel.com).

---

## 💍 Event Information

- **Couple**: Madhusha & Malshi
- **Date**: Thursday, November 19, 2026
- **Time**: 5:00 PM (Poruwa Ceremony at 5:20 PM)
- **Venue**: Mantara Villa / Hotel, Weragampita, Matara, Sri Lanka

---

