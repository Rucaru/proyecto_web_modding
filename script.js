let currentIndex = 0;
let isAnimating = false;
const SPIN_MS = 280;
const RESET_MS = 220;
const STEP_DELAY_MS = 60;
const MOBILE_BREAKPOINT = 700;
const SPIN_OFFSET_DEG = 14;

const roulette = document.getElementById("roulette");
const panels = Array.from(roulette.querySelectorAll(".roulette-panel"));
const isMobileView = () =>
  window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
const isDesktopView = () => !isMobileView();
const isPanelActive = (index) => index === currentIndex;

const clickedInside = (event, element) => {
  const rect = element.getBoundingClientRect();
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
};

function updateFocus() {
  const total = panels.length;

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

  currentIndex = (currentIndex + direction + panels.length) % panels.length;
  roulette.style.setProperty(
    "--rotation-y",
    direction > 0 ? `-${SPIN_OFFSET_DEG}deg` : `${SPIN_OFFSET_DEG}deg`,
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

  const total = panels.length;
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

panels.forEach((panel, index) => {
  const link = panel.querySelector(".learn-more-btn");
  if (link) {
    link.addEventListener("click", (event) => {
      if (isDesktopView() && !isPanelActive(index)) {
        event.preventDefault();
        event.stopPropagation();
        rotateToIndex(index);
      }
    });
  }

  panel.addEventListener("click", (event) => {
    if (isDesktopView() && link && isPanelActive(index)) {
      // Chromium can report the wrong click target with transformed layers.
      if (clickedInside(event, link)) {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(link.href);
        return;
      }
    }

    const target = event.target;
    if (target instanceof Element && target.closest(".learn-more-btn")) return;
    if (isMobileView()) return;
    rotateToIndex(index);
  });
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (!isDesktopView() || panels.length === 0) return;
  rotateRoulette(-1);
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (!isDesktopView() || panels.length === 0) return;
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

if (panels.length > 0) {
  updateFocus();
}
