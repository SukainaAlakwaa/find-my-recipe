// Mobile burger menu
function initNav() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle("show");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("show")) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    menu.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    }
  });
}

initNav();
