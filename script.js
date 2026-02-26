const images = [
  {
    src: "./images/retro_crt_workstation.svg",
    title: "CRT WORKSTATION",
    href: "./ordenadores/pc_benchmark.html",
  },
  {
    src: "./images/retro_tower_setup.svg",
    title: "TORRE RETRO",
    href: "./ordenadores/pc_integrado.html",
  },
  {
    src: "./images/retro_ibm_terminal.svg",
    title: "TERMINAL IBM",
    href: "./ordenadores/pc_mural.html",
  },
  {
    src: "./images/retro_luggable_pc.svg",
    title: "LUGGABLE PC",
    href: "./ordenadores/portatil_pc.html",
  },
];

let currentIndex = 0;
let isAnimating = false;
const SPIN_MS = 280;
const RESET_MS = 220;
const STEP_DELAY_MS = 60;
const MOBILE_BREAKPOINT = 700;

const roulette = document.getElementById("roulette");
const isMobileView = () =>
  window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

function buildRoulette() {
  roulette.innerHTML = "";

  images.forEach(({ src, title, href }, index) => {
    const panel = document.createElement("div");
    panel.className = "roulette-panel";
    panel.dataset.index = index;

    const card = document.createElement("div");
    card.className = "roulette-card";

    const img = document.createElement("img");
    img.className = "roulette-image";
    img.src = src;
    img.alt = title;

    const overlay = document.createElement("div");
    overlay.className = "roulette-overlay";

    const titleEl = document.createElement("h3");
    titleEl.className = "roulette-overlay-title";
    titleEl.textContent = title;

    const link = document.createElement("a");
    link.className = "learn-more-btn";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver más";
    link.addEventListener("click", (event) => {
      if (index !== currentIndex) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    overlay.append(titleEl, link);
    card.append(img, overlay);
    panel.appendChild(card);

    panel.addEventListener("click", (event) => {
      if (event.target.closest(".learn-more-btn")) return;
      if (isMobileView()) return;
      rotateToIndex(index);
    });
    roulette.appendChild(panel);
  });
}

function updateFocus() {
  const panels = roulette.querySelectorAll(".roulette-panel");
  const total = images.length;

  panels.forEach((panel, index) => {
    const isActive = index === currentIndex;
    panel.classList.remove("is-active", "is-left", "is-right", "is-back");
    panel.classList.toggle("is-active", isActive);

    const link = panel.querySelector(".learn-more-btn");
    if (link) {
      link.tabIndex = isActive || isMobileView() ? 0 : -1;
    }

    const delta = (index - currentIndex + total) % total;
    if (delta === 1) panel.classList.add("is-right");
    if (delta === total - 1) panel.classList.add("is-left");
    if (delta === 2 || delta === total - 2) panel.classList.add("is-back");
  });
}

function rotateRoulette(direction) {
  if (isAnimating) return;
  isAnimating = true;

  currentIndex = (currentIndex + direction + images.length) % images.length;
  roulette.style.setProperty(
    "--rotation-y",
    direction > 0 ? "-14deg" : "14deg",
  );
  updateFocus();
  setTimeout(() => {
    roulette.style.setProperty("--rotation-y", "0deg");
  }, SPIN_MS);

  setTimeout(() => {
    isAnimating = false;
  }, SPIN_MS + RESET_MS);
}

function rotateToIndex(targetIndex) {
  if (isAnimating || targetIndex === currentIndex) return;

  const total = images.length;
  const forward = (targetIndex - currentIndex + total) % total;
  const backward = (currentIndex - targetIndex + total) % total;
  const direction = forward <= backward ? 1 : -1;
  const steps = Math.min(forward, backward);
  if (steps === 0) return;

  let done = 0;
  const spinStep = () => {
    if (done >= steps) return;
    rotateRoulette(direction);
    done += 1;
    if (done < steps) {
      setTimeout(spinStep, SPIN_MS + RESET_MS + STEP_DELAY_MS);
    }
  };
  spinStep();
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (isMobileView()) return;
  rotateRoulette(-1);
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (isMobileView()) return;
  rotateRoulette(1);
});

const titleFlip = document.getElementById("title-flip");
const toggleTitleFlip = () => {
  const isFlipped = titleFlip.classList.toggle("is-flipped");
  titleFlip.setAttribute("aria-pressed", String(isFlipped));
};

titleFlip.addEventListener("click", toggleTitleFlip);
titleFlip.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleTitleFlip();
  }
});

buildRoulette();
updateFocus();
