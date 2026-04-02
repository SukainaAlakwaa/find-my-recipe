// Back to top button functionality
initBackToTop = () => {
  const backToTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    const scrollPosition = window.pageYOffset;
  if (scrollPosition > 100) {
    backToTopBtn.classList.add("active");
  } else {
    backToTopBtn.classList.remove("active");
    }
  });

// smooth scrolling to the top
backToTopBtn.addEventListener('click', (e) => {
e.preventDefault();
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});

});
}

initBackToTop();