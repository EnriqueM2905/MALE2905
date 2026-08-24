// Letras de Always (Daniel Caesar) con traducción y marcas de tiempo
const lyrics = [
  { t: 0, en: "And I'll be here", es: "Y estaré aquí" },
  { t: 3, en: "'Cause we both know how it goes", es: "Porque ambos sabemos cómo va esto" },
  { t: 6, en: "I don't want things to change", es: "No quiero que las cosas cambien" },
  { t: 10, en: "I pray they stay the same, always", es: "Ruego que se queden igual, siempre" },
  { t: 15, en: "And I don't care if you're with somebody else", es: "Y no me importa si estás con alguien más" },
  { t: 20, en: "I'll give you time and space", es: "Te daré tiempo y espacio" },
  { t: 23, en: "Just know I'm not afraid, always", es: "Solo ten claro que no tengo miedo, siempre" }
];

const envelopeBtn = document.getElementById("envelope-btn");
const envelopeScreen = document.getElementById("envelope-screen");
const flowerOverlay = document.getElementById("flower-overlay");
const mainScreen = document.getElementById("main-screen");

const bgAudio = document.getElementById("bg-audio");
const mixtapeAudio = document.getElementById("mixtape-audio");
const lyricsContainer = document.getElementById("lyrics-container");

const gears = [document.getElementById("gear-1"), document.getElementById("gear-2")];

// 1. Montar las líneas de letra en el contenedor
lyrics.forEach((line, i) => {
  const div = document.createElement("div");
  div.className = "lyric-item";
  div.id = `lyric-${i}`;
  div.innerHTML = `<span>${line.en}</span><span class="lyric-trans">${line.es}</span>`;
  lyricsContainer.appendChild(div);
});

// 2. Apertura del sobre + Efecto floral + Autoplay
envelopeBtn.addEventListener("click", () => {
  // Activar animación floral
  flowerOverlay.classList.remove("hidden");
  flowerOverlay.classList.add("active");

  // Iniciar audio (Always.mp3)
  bgAudio.volume = 0.5;
  bgAudio.play().catch(err => console.log("Autoplay bloqueado:", err));

  // Transición a la pantalla principal
  setTimeout(() => {
    envelopeScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
    flowerOverlay.classList.remove("active");
    // Ocultar la capa de flores después de que se desvanezca
    setTimeout(() => flowerOverlay.classList.add("hidden"), 1000);
  }, 1000);
});

// 3. Sincronización de letras
bgAudio.addEventListener("timeupdate", () => {
  const current = bgAudio.currentTime;
  lyrics.forEach((item, i) => {
    const next = lyrics[i + 1];
    const isCurrent = current >= item.t && (!next || current < next.t);
    const el = document.getElementById(`lyric-${i}`);
    if (el) {
      if (isCurrent) {
        el.classList.add("active");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        el.classList.remove("active");
      }
    }
  });
});

// 4. Control de reproducción de pistas MP3 (El Casete)
const trackRows = document.querySelectorAll(".track-row");

trackRows.forEach(row => {
  const btn = row.querySelector(".track-btn");
  btn.addEventListener("click", () => {
    const src = row.getAttribute("data-src");

    // Si la misma canción está sonando, pausarla y reanudar Always
    if (mixtapeAudio.src.includes(src) && !mixtapeAudio.paused) {
      mixtapeAudio.pause();
      btn.textContent = "▶";
      gears.forEach(g => g.classList.remove("spin"));
      bgAudio.play();
    } else {
      // Si es una canción nueva, pausar Always y reproducir
      bgAudio.pause();
      document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");

      mixtapeAudio.src = src;
      mixtapeAudio.play();
      btn.textContent = "❚❚";
      gears.forEach(g => g.classList.add("spin"));
    }
  });
});

// Al terminar una canción del casete, volver a la canción de fondo
mixtapeAudio.addEventListener("ended", () => {
  document.querySelectorAll(".track-btn").forEach(b => b.textContent = "▶");
  gears.forEach(g => g.classList.remove("spin"));
  bgAudio.play();
});

// 5. Apertura y cierre de la carta emergente
const modal = document.getElementById("letter-modal");
document.getElementById("open-letter-btn").addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("close-letter-btn").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});
