// Load header and footer partials
const inPages = window.location.pathname.includes("/pages/");
const base = inPages ? "../" : "";

const placeholders = document.querySelectorAll("[data-include]");

placeholders.forEach((el) => {
  const name = el.getAttribute("data-include");
  const url = base + "partials/" + name + ".html";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);

  if (xhr.status >= 200 && xhr.status < 300) {
    el.outerHTML = xhr.responseText.replace(/\{\{base\}\}/g, base);
  }
});
