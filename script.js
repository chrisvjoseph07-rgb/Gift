/* ===================================================================
   LONG DISTANCE ROMANTIC GIFT - JAVASCRIPT ENGINE
   =================================================================== */

const ROMANTIC_CONFIG = {
  // Background Music Track Path
  musicTrack: "music/INSTRUMENTAL-CKay-Love-Nwantiti-Ah-Ah-Ah-Prod.-KG-Beatz-via-instrumentals.com_.ng_.mp3",

  // Girlfriend's Intro Typing Text
  typingTitleText: "No matter how many miles separate us... ❤️",

  // Long Distance Love Letter Content
  letterMessage: `My Dearest Love,

No matter how many miles and kilometers lie between us, you are always the first thing on my mind when I wake up and the last thought before I sleep.

Distance is just a test to see how far love can travel, and mine reaches you no matter where you are. Thank you for every late-night call, every sweet text, every shared laugh, and for being my home.

I can't wait for the day when I don't have to say 'I miss you' through a screen, but can finally hold you in my arms and never let go.

Until then and forever after, I love you ❤️`
};

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Hide preloader
  setTimeout(() => {
    const preloader = document.getElementById("loading-screen");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => preloader.style.display = "none", 800);
    }
  }, 900);

  initParticleCanvas();
  initCursorTrail();
  initTypingAnimation();
  initAudioEngine();
  initScrollReveal();
  initEnvelopeLetter();
  initGalleryLightbox();
  initTimelineLikes();
  initVirtualHug();
  initFinalSurprise();

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", handleStartStory);
  }
});

// ===================================================================
// 1. TYPING ANIMATION
// ===================================================================
function initTypingAnimation() {
  const typingHeading = document.getElementById("typing-heading");
  if (!typingHeading) return;

  const typeTextSpan = typingHeading.querySelector(".type-text");
  const fullText = ROMANTIC_CONFIG.typingTitleText;
  let charIndex = 0;

  function typeChar() {
    if (charIndex < fullText.length) {
      typeTextSpan.textContent += fullText.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, 75);
    }
  }

  setTimeout(typeChar, 700);
}

// ===================================================================
// 2. START STORY TRANSITION
// ===================================================================
function handleStartStory(e) {
  const rect = e.target.getBoundingClientRect();
  createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

  toggleMusic(true);

  const introScreen = document.getElementById("intro-screen");
  const mainContent = document.getElementById("main-content");

  if (introScreen) introScreen.classList.add("fade-out");

  if (mainContent) {
    mainContent.classList.remove("main-content-hidden");
    mainContent.classList.add("main-content-visible");
  }

  setTimeout(() => {
    const welcomeSec = document.getElementById("welcome-section");
    if (welcomeSec) {
      welcomeSec.scrollIntoView({ behavior: "smooth" });
    }
  }, 400);
}

// ===================================================================
// 3. CANVAS PARTICLES & STARRY SKY
// ===================================================================
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 50);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.speedY = -(Math.random() * 0.7 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.isHeart = Math.random() < 0.35;
      this.heartSymbol = ["❤️", "✈️", "✨", "💖", "💕"][Math.floor(Math.random() * 5)];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isHeart) {
        ctx.font = `${this.size * 5 + 8}px serif`;
        ctx.fillText(this.heartSymbol, this.x, this.y);
      } else {
        ctx.fillStyle = "#ff7597";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff2a5f";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// ===================================================================
// 4. DESKTOP CURSOR TRAIL
// ===================================================================
function initCursorTrail() {
  const container = document.getElementById("cursor-trail-container");
  if (!container || window.innerWidth < 768) return;

  let lastTime = 0;
  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastTime < 70) return;
    lastTime = now;

    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = ["❤️", "💖", "✨", "✈️"][Math.floor(Math.random() * 4)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  });
}

// ===================================================================
// 5. AUDIO ENGINE
// ===================================================================
let isAudioPlaying = false;
let audioSynthContext = null;
let synthInterval = null;

function initAudioEngine() {
  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");

  if (bgMusic && ROMANTIC_CONFIG.musicTrack) {
    bgMusic.src = ROMANTIC_CONFIG.musicTrack;
  }

  if (!musicToggle) return;

  musicToggle.addEventListener("click", () => {
    toggleMusic(!isAudioPlaying);
  });
}

function toggleMusic(playState) {
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  if (!musicToggle) return;

  const musicText = musicToggle.querySelector(".music-text");

  if (playState) {
    if (bgMusic) {
      bgMusic.play().then(() => {
        isAudioPlaying = true;
        musicToggle.classList.add("playing");
        if (musicText) musicText.textContent = "Music ON 🎵";
      }).catch((err) => {
        console.warn("Audio file fallback...", err);
        startSynthMusicBox();
        isAudioPlaying = true;
        musicToggle.classList.add("playing");
        if (musicText) musicText.textContent = "Music ON 🎵";
      });
    }
  } else {
    if (bgMusic) bgMusic.pause();
    stopSynthMusicBox();
    isAudioPlaying = false;
    musicToggle.classList.remove("playing");
    if (musicText) musicText.textContent = "Music OFF";
  }
}

function startSynthMusicBox() {
  if (synthInterval) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!audioSynthContext) audioSynthContext = new AudioCtx();

  if (audioSynthContext.state === "suspended") {
    audioSynthContext.resume();
  }

  const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23];
  let noteIdx = 0;

  synthInterval = setInterval(() => {
    if (!isAudioPlaying) return;
    try {
      const osc = audioSynthContext.createOscillator();
      const gain = audioSynthContext.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioSynthContext.currentTime);

      gain.gain.setValueAtTime(0.08, audioSynthContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioSynthContext.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioSynthContext.destination);

      osc.start();
      osc.stop(audioSynthContext.currentTime + 1.2);
      noteIdx++;
    } catch (e) {}
  }, 450);
}

function stopSynthMusicBox() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

// ===================================================================
// 6. SCROLL REVEAL
// ===================================================================
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

// ===================================================================
// 7. VIRTUAL HUG BUTTON INTERACTION
// ===================================================================
function initVirtualHug() {
  const hugBtn = document.getElementById("virtual-hug-btn");
  if (!hugBtn) return;

  hugBtn.addEventListener("click", (e) => {
    createHeartBurst(e.clientX, e.clientY);

    const messages = [
      "Sending a warm hug across the miles! 🫂❤️",
      "Squeezing you tight in my thoughts! 💖",
      "Distance means nothing when love is everything! ✈️💕",
      "Can't wait to hug you in real life! 🌹"
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    // Floating toast feedback
    const toast = document.createElement("div");
    toast.className = "hug-toast";
    toast.textContent = randomMsg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
  });
}

// ===================================================================
// 8. ENVELOPE LOVE LETTER
// ===================================================================
let isLetterOpened = false;

function initEnvelopeLetter() {
  const envelope = document.getElementById("interactive-envelope");
  const sealBtn = document.getElementById("wax-seal-btn");
  const teaserText = document.getElementById("envelope-teaser-text");

  if (!envelope) return;

  const openAction = () => {
    if (isLetterOpened) return;
    isLetterOpened = true;

    envelope.classList.add("open");
    if (teaserText) teaserText.textContent = "Your love letter is opened ❤️";

    setTimeout(() => {
      typewriteLetter();
    }, 800);
  };

  if (sealBtn) sealBtn.addEventListener("click", openAction);
  envelope.addEventListener("click", openAction);
}

function typewriteLetter() {
  const letterBody = document.getElementById("letter-typewriter-text");
  if (!letterBody) return;

  const text = ROMANTIC_CONFIG.letterMessage;
  letterBody.textContent = "";
  let idx = 0;

  function type() {
    if (idx < text.length) {
      letterBody.textContent += text.charAt(idx);
      idx++;
      setTimeout(type, 35);
    }
  }

  type();
}

// ===================================================================
// 9. PHOTO GALLERY LIGHTBOX
// ===================================================================
let currentGalleryIdx = 0;
let galleryItems = [];

function initGalleryLightbox() {
  galleryItems = Array.from(document.querySelectorAll(".gallery-card"));
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const modalCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!modal) return;

  galleryItems.forEach((card, idx) => {
    card.addEventListener("click", (e) => {
      currentGalleryIdx = idx;
      openLightbox();
      createHeartBurst(e.clientX, e.clientY);
    });
  });

  function openLightbox() {
    const item = galleryItems[currentGalleryIdx];
    if (!item) return;
    const src = item.getAttribute("data-src") || item.querySelector("img").src;
    const caption = item.getAttribute("data-caption") || "";

    modalImg.src = src;
    modalCaption.textContent = caption;
    modal.classList.add("active");
  }

  function closeLightbox() {
    modal.classList.remove("active");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIdx = (currentGalleryIdx - 1 + galleryItems.length) % galleryItems.length;
      openLightbox();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIdx = (currentGalleryIdx + 1) % galleryItems.length;
      openLightbox();
    });
  }
}

// ===================================================================
// 10. TIMELINE LIKES
// ===================================================================
function initTimelineLikes() {
  const likeBtns = document.querySelectorAll(".like-heart-btn");
  likeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const countSpan = btn.querySelector(".like-count");
      if (countSpan) {
        let count = parseInt(countSpan.textContent) || 0;
        countSpan.textContent = count + 1;
      }
      createHeartBurst(e.clientX, e.clientY);
    });
  });
}

// ===================================================================
// 11. FINAL SURPRISE & FOREVER PROMISE
// ===================================================================
function initFinalSurprise() {
  const toStage2 = document.getElementById("to-stage-2");
  const toStage3 = document.getElementById("to-stage-3");
  const yesBtn = document.getElementById("yes-btn");
  const alwaysBtn = document.getElementById("always-btn");

  const switchStage = (fromId, toId) => {
    const fromStage = document.getElementById(fromId);
    const toStage = document.getElementById(toId);
    if (fromStage) fromStage.classList.remove("active-stage");
    if (toStage) toStage.classList.add("active-stage");
  };

  if (toStage2) toStage2.addEventListener("click", () => switchStage("stage-1", "stage-2"));
  if (toStage3) toStage3.addEventListener("click", () => switchStage("stage-2", "stage-3"));

  const handleProposalAccept = (e) => {
    switchStage("stage-3", "stage-final");
    triggerFireworksCelebration();
    createHeartBurst(e.clientX, e.clientY);
  };

  if (yesBtn) yesBtn.addEventListener("click", handleProposalAccept);
  if (alwaysBtn) alwaysBtn.addEventListener("click", handleProposalAccept);
}

// ===================================================================
// 12. BURST & FIREWORKS
// ===================================================================
function createHeartBurst(x, y) {
  const burstCount = 10;
  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.textContent = ["❤️", "💖", "✈️", "🌹", "✨"][Math.floor(Math.random() * 5)];
    heart.style.left = `${x + (Math.random() - 0.5) * 50}px`;
    heart.style.top = `${y + (Math.random() - 0.5) * 50}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1200);
  }
}

function triggerFireworksCelebration() {
  const canvas = document.getElementById("fireworks-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#ff0055", "#ff5277", "#ff7597", "#ffcf77", "#ffffff"];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.005
    });
  }

  function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach((p) => {
      if (p.alpha > 0) {
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (active) requestAnimationFrame(animateFireworks);
  }

  animateFireworks();
}
