console.log("Cargando script de la carta...");

// --- 1. Letras de Always ---
const lyrics = [
  { t: 0, text: "And I'll be here" },
  { t: 3, text: "'Cause we both know how it goes" },
  { t: 6, text: "I don't want things to change" },
  { t: 10, text: "I pray they stay the same, always" },
  { t: 15, text: "And I don't care if you're with somebody else" },
  { t: 20, text: "I'll give you time and space" },
  { t: 23, text: "Just know I'm not afraid, always" }
];

const bgAudio = document.getElementById("bg-audio");
const mixtapeAudio = document.getElementById("mixtape-audio");
const lyricsContainer = document.getElementById("lyrics-container");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Cargar Letras de forma segura
if (lyricsContainer) {
  lyrics.forEach((line, i) => {
    const div = document.createElement("div");
    div.className = "lyric-item";
    div.id = `lyric-${i}`;
    div.innerText = line.text;
    lyricsContainer.appendChild(div);
  });
}

// --- 2. APERTURA DEL SOBRE (Con protección contra errores nulos) ---
const envelopeBtn = document.getElementById("envelope-btn");
if (envelopeBtn) {
  envelopeBtn.addEventListener("click", () => {
    console.log("Sobre abierto correctamente");
    
    const envelopeScreen = document.getElementById("envelope-screen");
    const mainScreen = document.getElementById("main-screen");

    if (envelopeScreen) envelopeScreen.classList.add("hidden");
    if (mainScreen) mainScreen.classList.remove("hidden");
    
    if (bgAudio) {
      if (volumeBar) bgAudio.volume = volumeBar.value;
      bgAudio.play().catch(e => console.log("Autoplay prevenido por el navegador:", e));
    }
  });
} else {
  console.error("No se encontró el elemento id='envelope-btn' en el HTML.");
}

// --- 3. Controles de Always ---
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

if (bgAudio) {
  bgAudio.addEventListener("loadedmetadata", () => {
    if (seekBar) seekBar.max = bgAudio.duration;
    if (durationEl) durationEl.innerText = formatTime(bgAudio.duration);
  });

  bgAudio.addEventListener("timeupdate", () => {
    if (seekBar) seekBar.value = bgAudio.currentTime;
    if (currentTimeEl) currentTimeEl.innerText = formatTime(bgAudio.currentTime);

    // Sincronizar Letras
    const current = bgAudio.currentTime;
    lyrics.forEach((item, i) => {
      const next = lyrics[i + 1];
      const el = document.getElementById(`lyric-${i}`);
      if (el) {
        if (current >= item.t && (!next || current < next.t)) {
          el.classList.add("active");
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          el.classList.remove("active");
        }
      }
    });
  });

  if (seekBar) {
    seekBar.addEventListener("input", () => { 
      bgAudio.currentTime = seekBar.value; 
    });
  }
}

if (volumeBar && bgAudio && mixtapeAudio) {
  volumeBar.addEventListener("input", () => { 
    bgAudio.volume = volumeBar.value; 
    mixtapeAudio.volume = volumeBar.value; 
  });
}

// --- 4. Playlist MP3 ---
const trackRows = document.querySelectorAll(".track-row");
trackRows.forEach(row => {
  const btn = row.querySelector(".track-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      const src = row.getAttribute("data-src");

      if (mixtapeAudio && mixtapeAudio.src.includes(src) && !mixtapeAudio.paused) {
        mixtapeAudio.pause();
        btn.textContent = "▶";
        if (bgAudio) bgAudio.play();
      } else {
        if (bgAudio) bgAudio.pause();
        document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");
        
        if (mixtapeAudio) {
          mixtapeAudio.src = src;
          mixtapeAudio.play().catch(e => alert("No se pudo reproducir la pista. Verifica que el archivo MP3 exista en la carpeta assets y no tenga espacios o tildes."));
        }
        btn.textContent = "❚❚";
      }
    });
  }
});

if (mixtapeAudio) {
  mixtapeAudio.addEventListener("ended", () => {
    document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");
    if (bgAudio) bgAudio.play();
  });
}

// --- 5. Carta ---
const modal = document.getElementById("letter-modal");
const openBtn = document.getElementById("open-letter-btn");
const closeBtn = document.getElementById("close-letter-btn");

if (modal && openBtn && closeBtn) {
  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

// --- 6. Minijuego: Memorama ---
const board = document.getElementById("memory-board");
const msg = document.getElementById("game-message");
if (board && msg) {
  const emojis = ["🌸", "💌", "💖", "🎶", "🌸", "💌", "💖", "🎶"];
  let flippedCards = [];
  let matchedCount = 0;

  emojis.sort(() => 0.5 - Math.random());

  emojis.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.val = emoji;
    card.dataset.index = i;
    
    card.addEventListener("click", () => {
      if (card.classList.contains("flipped") || flippedCards.length === 2) return;
      
      card.classList.add("flipped");
      card.innerText = emoji;
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        setTimeout(() => {
          const [c1, c2] = flippedCards;
          if (c1.dataset.val === c2.dataset.val) {
            matchedCount += 2;
            if (matchedCount === emojis.length) msg.classList.remove("hidden");
          } else {
            c1.classList.remove("flipped"); c1.innerText = "";
            c2.classList.remove("flipped"); c2.innerText = "";
          }
          flippedCards = [];
        }, 800);
      }
    });
    board.appendChild(card);
  });
}
