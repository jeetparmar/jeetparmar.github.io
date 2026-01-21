document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  const menuLinks = document.querySelectorAll('.menu a');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth',
      });

      menuLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Scroll spy
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    menuLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
});
