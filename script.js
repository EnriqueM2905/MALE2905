// Letras con timestamps (segundos), texto original y traducción en español
const lyricsData = [
  { time: 0, text: "And I'll be here", trans: "Y estaré aquí" },
  { time: 3, text: "'Cause we both know how it goes", trans: "Porque ambos sabemos cómo termina esto" },
  { time: 6, text: "I don't want things to change", trans: "No quiero que las cosas cambien" },
  { time: 10, text: "I pray they stay the same, always", trans: "Ruego que sigan igual, siempre" },
  { time: 15, text: "And I don't care if you're with somebody else", trans: "Y no me importa si estás con alguien más" },
  { time: 20, text: "I'll give you time and space", trans: "Te daré tiempo y espacio" },
  { time: 23, text: "Just know I'm not afraid, always", trans: "Solo ten claro que no tengo miedo, siempre" },
  { time: 30, text: "Always, always...", trans: "Siempre, siempre..." }
];

const envelopeBtn = document.getElementById("envelope-btn");
const envelopeScreen = document.getElementById("envelope-screen");
const mainScreen = document.getElementById("main-screen");

const bgAudio = document.getElementById("bg-audio");
const mixtapeAudio = document.getElementById("mixtape-audio");
const lyricsContainer = document.getElementById("lyrics-container");

const wheels = [document.getElementById("wheel-1"), document.getElementById("wheel-2")];

// 1. Cargar las letras en el panel lateral
lyricsData.forEach((item, index) => {
  const lineDiv = document.createElement("div");
  lineDiv.classList.add("lyric-line");
  lineDiv.id = `lyric-${index}`;
  lineDiv.innerHTML = `
    <span>${item.text}</span>
    <span class="translation">${item.trans}</span>
  `;
  lyricsContainer.appendChild(lineDiv);
});

// 2. Abrir sobre e iniciar música de fondo
envelopeBtn.addEventListener("click", () => {
  envelopeScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  
  bgAudio.volume = 0.5;
  bgAudio.play().catch(e => console.log("Interacción necesaria:", e));
});

// 3. Sincronizar las letras con el tiempo del audio de fondo
bgAudio.addEventListener("timeupdate", () => {
  const currentTime = bgAudio.currentTime;

  lyricsData.forEach((item, index) => {
    const nextItem = lyricsData[index + 1];
    const isCurrent = currentTime >= item.time && (!nextItem || currentTime < nextItem.time);
    const elem = document.getElementById(`lyric-${index}`);

    if (elem) {
      if (isCurrent) {
        elem.classList.add("active");
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        elem.classList.remove("active");
      }
    }
  });
});

// 4. Control de reproducción de pistas de la Mixtape
const trackButtons = document.querySelectorAll(".play-track-btn");

trackButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const trackItem = e.target.closest(".track-item");
    const audioSrc = trackItem.getAttribute("data-src");

    if (mixtapeAudio.src.includes(audioSrc) && !mixtapeAudio.paused) {
      // Si ya está sonando, pausar y reanudar fondo
      mixtapeAudio.pause();
      btn.textContent = "▶";
      wheels.forEach(w => w.classList.remove("spinning"));
      bgAudio.play();
    } else {
      // Reproducir nueva canción y pausar música de fondo
      bgAudio.pause();
      trackButtons.forEach(b => b.textContent = "▶");
      
      mixtapeAudio.src = audioSrc;
      mixtapeAudio.play();
      btn.textContent = "❚❚";
      wheels.forEach(w => w.classList.add("spinning"));
    }
  });
});

// 5. Al terminar la pista de la mixtape, reanudar fondo automáticamente
mixtapeAudio.addEventListener("ended", () => {
  trackButtons.forEach(b => b.textContent = "▶");
  wheels.forEach(w => w.classList.remove("spinning"));
  bgAudio.play();
});
