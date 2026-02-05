// Run after page loads
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// Scroll reveal animation
const revealTargets = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => observer.observe(el));

// Auto year in footer
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
