document.addEventListener('DOMContentLoaded', () => {
  setupNavToggle();
});

function setupNavToggle() {
  const toggle = document.querySelector('.toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}