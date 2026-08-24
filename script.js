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
const diskStatus = document.getElementById("disk-status");

const hubs = [document.getElementById("hub-left"), document.getElementById("hub-right")];

// 1. Cargar letras en pantalla
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

// 2. Abrir sobre y comenzar audio de fondo
envelopeBtn.addEventListener("click", () => {
  envelopeScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  
  bgAudio.volume = 0.6;
  bgAudio.play().then(() => {
    diskStatus.textContent = "Reproduciendo fondo...";
  }).catch(err => {
    console.warn("Autoplay bloqueado por el navegador:", err);
    diskStatus.textContent = "Toca para activar audio";
  });
});

// 3. Sincronizar letra con la pista de fondo
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

// 4. Control de reproducción de pistas de la mixtape
const trackButtons = document.querySelectorAll(".track-btn");

trackButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const trackItem = e.target.closest(".track");
    const audioSrc = trackItem.getAttribute("data-src");
    const trackName = trackItem.getAttribute("data-name");

    // Si ya está sonando la misma canción, pausar y reactivar fondo
    if (mixtapeAudio.src.includes(audioSrc.replace("./", "")) && !mixtapeAudio.paused) {
      mixtapeAudio.pause();
      btn.textContent = "▶";
      hubs.forEach(h => h.classList.remove("spinning"));
      diskStatus.textContent = "En pausa";
      bgAudio.play();
    } else {
      // Pausar música de fondo y cambiar a la canción elegida
      bgAudio.pause();
      trackButtons.forEach(b => b.textContent = "▶");
      
      mixtapeAudio.src = audioSrc;
      mixtapeAudio.play().then(() => {
        btn.textContent = "❚❚";
        hubs.forEach(h => h.classList.add("spinning"));
        diskStatus.textContent = trackName;
      }).catch(err => {
        alert("Asegúrate de que los archivos de audio estén dentro de la carpeta assets/");
        console.error(err);
      });
    }
  });
});

// 5. Al terminar una canción de la mixtape, volver al audio de fondo
mixtapeAudio.addEventListener("ended", () => {
  trackButtons.forEach(b => b.textContent = "▶");
  hubs.forEach(h => h.classList.remove("spinning"));
  diskStatus.textContent = "Reproduciendo fondo...";
  bgAudio.play();
});

// 6. Modal de la carta
const openLetterBtn = document.getElementById("open-letter-btn");
const closeLetterBtn = document.getElementById("close-letter-btn");
const letterModal = document.getElementById("letter-modal");

openLetterBtn.addEventListener("click", () => letterModal.classList.remove("hidden"));
closeLetterBtn.addEventListener("click", () => letterModal.classList.add("hidden"));
letterModal.addEventListener("click", (e) => {
  if (e.target === letterModal) letterModal.classList.add("hidden");
});
