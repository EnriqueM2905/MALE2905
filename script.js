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

// Cargar Letras
lyrics.forEach((line, i) => {
  const div = document.createElement("div");
  div.className = "lyric-item";
  div.id = `lyric-${i}`;
  div.innerText = line.text;
  lyricsContainer.appendChild(div);
});

// Apertura del sobre
document.getElementById("envelope-btn").addEventListener("click", () => {
  document.getElementById("envelope-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
  
  bgAudio.volume = volumeBar.value;
  bgAudio.play().catch(e => console.log("Autoplay bloquedo", e));
});

// --- 2. Controles de Always ---
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

bgAudio.addEventListener("loadedmetadata", () => {
  seekBar.max = bgAudio.duration;
  durationEl.innerText = formatTime(bgAudio.duration);
});

bgAudio.addEventListener("timeupdate", () => {
  seekBar.value = bgAudio.currentTime;
  currentTimeEl.innerText = formatTime(bgAudio.currentTime);

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

seekBar.addEventListener("input", () => { bgAudio.currentTime = seekBar.value; });
volumeBar.addEventListener("input", () => { 
  bgAudio.volume = volumeBar.value; 
  mixtapeAudio.volume = volumeBar.value; // El volumen controla ambas músicas
});

// --- 3. Playlist MP3 ---
const trackRows = document.querySelectorAll(".track-row");
trackRows.forEach(row => {
  const btn = row.querySelector(".track-btn");
  btn.addEventListener("click", () => {
    const src = row.getAttribute("data-src");

    if (mixtapeAudio.src.includes(src) && !mixtapeAudio.paused) {
      mixtapeAudio.pause();
      btn.textContent = "▶";
      bgAudio.play();
    } else {
      bgAudio.pause();
      document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");
      
      mixtapeAudio.src = src;
      mixtapeAudio.play().catch(e => alert("No se pudo reproducir. Revisa que el nombre del archivo MP3 no tenga espacios ni tildes."));
      btn.textContent = "❚❚";
    }
  });
});

mixtapeAudio.addEventListener("ended", () => {
  document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");
  bgAudio.play();
});

// --- 4. Carta ---
const modal = document.getElementById("letter-modal");
document.getElementById("open-letter-btn").addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("close-letter-btn").addEventListener("click", () => modal.classList.add("hidden"));

// --- 5. Minijuego: Memorama ---
const board = document.getElementById("memory-board");
const msg = document.getElementById("game-message");
const emojis = ["🌸", "💌", "💖", "🎶", "🌸", "💌", "💖", "🎶"]; // 4 pares
let flippedCards = [];
let matchedCount = 0;

// Barajar
emojis.sort(() => 0.5 - Math.random());

emojis.forEach((emoji, i) => {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.dataset.val = emoji;
  card.dataset.index = i;
  
  card.addEventListener("click", () => {
    // Si ya está volteada o hay 2 seleccionadas, no hacer nada
    if (card.classList.contains("flipped") || flippedCards.length === 2) return;
    
    card.classList.add("flipped");
    card.innerText = emoji;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 800);
    }
  });
  board.appendChild(card);
});

function checkMatch() {
  const [c1, c2] = flippedCards;
  if (c1.dataset.val === c2.dataset.val) {
    matchedCount += 2;
    if (matchedCount === emojis.length) msg.classList.remove("hidden");
  } else {
    c1.classList.remove("flipped"); c1.innerText = "";
    c2.classList.remove("flipped"); c2.innerText = "";
  }
  flippedCards = [];
}
