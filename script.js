/* ══════════════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ══════════════════════════════════════════════ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;width:0%;
    background:linear-gradient(90deg,#c9a96e,#4ecdc4);
    z-index:9999;transition:width 0.1s linear;pointer-events:none;
  `;
document.body.appendChild(progressBar);

window.addEventListener(
  'scroll',
  () => {
    const pct =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = pct + '%';
  },
  { passive: true },
);

/* ══════════════════════════════════════════════
     2. CUSTOM MAGNETIC CURSOR
  ══════════════════════════════════════════════ */
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.style.cssText = `
    position:fixed;width:32px;height:32px;border:1px solid rgba(201,169,110,0.5);
    border-radius:50%;pointer-events:none;z-index:9998;
    transition:transform 0.15s ease,opacity 0.2s,border-color 0.2s,width 0.2s,height 0.2s;
    transform:translate(-50%,-50%);top:0;left:0;mix-blend-mode:difference;
  `;
cursorDot.style.cssText = `
    position:fixed;width:5px;height:5px;background:#c9a96e;
    border-radius:50%;pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);top:0;left:0;
    transition:transform 0.05s,top 0.05s,left 0.05s;
  `;
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let mx = 0,
  my = 0,
  cx = 0,
  cy = 0;
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});
(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();
document
  .querySelectorAll('a,button,.skill-tag,.project-card,.timeline-item')
  .forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '56px';
      cursor.style.height = '56px';
      cursor.style.borderColor = 'rgba(78,205,196,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '32px';
      cursor.style.height = '32px';
      cursor.style.borderColor = 'rgba(201,169,110,0.5)';
    });
  });

/* ══════════════════════════════════════════════
     3. FLOATING PARTICLES CANVAS
  ══════════════════════════════════════════════ */
const canvas = document.createElement('canvas');
canvas.style.cssText =
  'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.4;';
document.body.insertBefore(canvas, document.body.firstChild);
const ctx = canvas.getContext('2d');
let W,
  H,
  particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.5 ? '201,169,110' : '78,205,196';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

// Connect nearby particles
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x,
        dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(201,169,110,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

(function animParticles() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animParticles);
})();

/* ══════════════════════════════════════════════
     4. TYPEWRITER on hero subtitle
  ══════════════════════════════════════════════ */
const roles = [
  'Principal Full Stack Engineer',
  'AI Systems Architect',
  'LLM & RAG Specialist',
  'Cloud-Native Leader',
  'Technical Lead · 14+ Years',
];
const heroLabel = document.querySelector('.hero-label');
if (heroLabel) {
  let ri = 0,
    ci = 0,
    deleting = false;
  const span = document.createElement('span');
  heroLabel.innerHTML = '';
  heroLabel.appendChild(span);
  function typewrite() {
    const word = roles[ri];
    if (!deleting) {
      span.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(typewrite, 2000);
        return;
      }
    } else {
      span.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    setTimeout(typewrite, deleting ? 40 : 80);
  }
  setTimeout(typewrite, 1200);
}

/* ══════════════════════════════════════════════
     5. SCROLL REVEAL (enhanced with stagger)
  ══════════════════════════════════════════════ */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
);
reveals.forEach((el) => revealObs.observe(el));

/* ══════════════════════════════════════════════
     6. ACTIVE NAV HIGHLIGHT
  ══════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener(
  'scroll',
  () => {
    let current = '';
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((a) => {
      a.style.color =
        a.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
    });
  },
  { passive: true },
);

/* ══════════════════════════════════════════════
     7. AVATAR RING SPIN on hover
  ══════════════════════════════════════════════ */
document.querySelectorAll('img[alt="Jeet Singh Parmar"]').forEach((img) => {
  const ring = img.parentElement;
  ring.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
  ring.addEventListener(
    'mouseenter',
    () => (ring.style.transform = 'rotate(8deg) scale(1.06)'),
  );
  ring.addEventListener('mouseleave', () => (ring.style.transform = ''));
});

/* ══════════════════════════════════════════════
     8. SKILL TAG RIPPLE on click
  ══════════════════════════════════════════════ */
document.querySelectorAll('.skill-tag').forEach((tag) => {
  tag.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
        position:absolute;border-radius:50%;
        width:80px;height:80px;
        background:rgba(78,205,196,0.25);
        transform:translate(-50%,-50%) scale(0);
        left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;
        animation:ripple 0.5s ease-out forwards;pointer-events:none;
      `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* ══════════════════════════════════════════════
     9. COUNTER ANIMATION on years/stats
  ══════════════════════════════════════════════ */
function animateCounter(el, target, suffix = '') {
  let start = 0,
    dur = 1800,
    startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const yearsEl = document.querySelector('.years-number');
if (yearsEl) {
  const counterObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(yearsEl, 14, '+');
        counterObs.disconnect();
      }
    },
    { threshold: 0.5 },
  );
  counterObs.observe(yearsEl);
}

/* ══════════════════════════════════════════════
     10. TIMELINE ITEM slide-in from left
  ══════════════════════════════════════════════ */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.cssText +=
    'opacity:0;transform:translateX(-30px);transition:opacity 0.6s ease,transform 0.6s ease;transition-delay:' +
    i * 0.08 +
    's;';
  const tObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
        tObs.disconnect();
      }
    },
    { threshold: 0.15 },
  );
  tObs.observe(item);
});

/* ══════════════════════════════════════════════
     11. PROJECT CARD tilt on mouse move
  ══════════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

/* ══════════════════════════════════════════════
     12. GLITCH effect on nav brand hover
  ══════════════════════════════════════════════ */
const brand = document.querySelector('.nav-brand');
if (brand) {
  brand.style.cursor = 'default';
  brand.addEventListener('mouseenter', () => {
    brand.classList.add('glitch');
    setTimeout(() => brand.classList.remove('glitch'), 600);
  });
}
