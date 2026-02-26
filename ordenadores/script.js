const points = document.querySelectorAll(".punto-interactivo, .punto");

const closeAllPoints = () => {
  points.forEach((point) => {
    point.classList.remove("is-open");
    point.setAttribute("aria-expanded", "false");
  });
};

points.forEach((point) => {
  if (!point.hasAttribute("role")) point.setAttribute("role", "button");
  if (!point.hasAttribute("tabindex")) point.setAttribute("tabindex", "0");
  if (!point.hasAttribute("aria-expanded")) {
    point.setAttribute("aria-expanded", "false");
  }

  point.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !point.classList.contains("is-open");
    closeAllPoints();
    if (willOpen) {
      point.classList.add("is-open");
      point.setAttribute("aria-expanded", "true");
    }
  });

  point.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      point.click();
    }
  });
});

document.addEventListener("click", closeAllPoints);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAllPoints();
});
