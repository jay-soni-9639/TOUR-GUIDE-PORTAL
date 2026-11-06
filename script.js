/* Saket Tours & Travels — lightweight, dependency-free interactions */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('#header');
  const nav = document.querySelector('#nav');
  const menu = document.querySelector('.menu-toggle');
  const topBtn = document.querySelector('#backToTop');

  // Loading screen
  window.addEventListener('load', () => setTimeout(() => document.querySelector('#loader').classList.add('done'), 650));

  // Sticky navigation, active link and return-to-top
  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 45);
    topBtn.classList.toggle('show', window.scrollY > 550);
    const sections = [...document.querySelectorAll('main section[id]')];
    let current = 'home';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 140) current = section.id; });
    document.querySelectorAll('#nav a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', updateHeader, { passive: true }); updateHeader();
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', open); });
  document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', false); }));

  // Dark mode preference
  const theme = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('saket-theme');
  if (savedTheme === 'dark') { document.body.classList.add('dark'); theme.textContent = '☀'; }
  theme.addEventListener('click', () => { const dark = document.body.classList.toggle('dark'); theme.textContent = dark ? '☀' : '☾'; localStorage.setItem('saket-theme', dark ? 'dark' : 'light'); });

  // Scroll reveal and number counters
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (entry.target.classList.contains('stat')) animateCount(entry.target.querySelector('[data-count]'));
    observer.unobserve(entry.target);
  }), { threshold: .14 });
  document.querySelectorAll('.reveal,.stat').forEach(el => observer.observe(el));
  function animateCount(el) {
    if (!el || el.dataset.done) return; el.dataset.done = 'true';
    const target = Number(el.dataset.count), suffix = el.dataset.suffix || '', start = performance.now(), duration = 1500;
    const tick = now => { const progress = Math.min((now - start) / duration, 1); const value = Math.floor((1 - Math.pow(1 - progress, 3)) * target); el.textContent = value.toLocaleString('en-IN') + suffix; if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  // Destination search filter
  const filter = document.querySelector('#tourFilter');
  const cards = [...document.querySelectorAll('.tour-card')];
  const empty = document.querySelector('.filter-empty');
  document.querySelector('#searchTours').addEventListener('click', () => {
    const value = filter.value; let matches = 0;
    cards.forEach(card => { const visible = value === 'all' || card.dataset.type.includes(value); card.hidden = !visible; if (visible) matches++; });
    empty.hidden = matches !== 0; document.querySelector('#tours').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // FAQ accordion
  document.querySelectorAll('.accordion button').forEach(button => button.addEventListener('click', () => {
    const item = button.parentElement; document.querySelectorAll('.accordion').forEach(a => { if (a !== item) a.classList.remove('open'); }); item.classList.toggle('open');
  }));

  // Gallery lightbox
  const lightbox = document.querySelector('#lightbox');
  document.querySelectorAll('.g-item').forEach(item => item.addEventListener('click', () => {
    const image = item.querySelector('img'); lightbox.querySelector('img').src = item.dataset.full; lightbox.querySelector('img').alt = image.alt; lightbox.querySelector('p').textContent = image.alt; lightbox.classList.add('open'); document.body.style.overflow = 'hidden';
  }));
  const closeLightbox = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
  lightbox.querySelector('button').addEventListener('click', closeLightbox); lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // Testimonial slider
  const reviews = [...document.querySelectorAll('.testimonial')]; let reviewIndex = 0;
  const showReview = index => { reviews[reviewIndex].classList.remove('active'); reviewIndex = (index + reviews.length) % reviews.length; reviews[reviewIndex].classList.add('active'); };
  document.querySelector('#nextTest').addEventListener('click', () => showReview(reviewIndex + 1));
  document.querySelector('#prevTest').addEventListener('click', () => showReview(reviewIndex - 1));
  setInterval(() => showReview(reviewIndex + 1), 6500);

  // Booking validation and success feedback (static site: no data is transmitted)
  const form = document.querySelector('#bookingForm');
  const toast = document.querySelector('#toast');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    toast.classList.add('show'); form.reset(); setTimeout(() => toast.classList.remove('show'), 4500);
  });
  document.querySelector('#newsletterForm').addEventListener('submit', e => { e.preventDefault(); toast.querySelector('b').textContent = 'You’re on the list!'; toast.querySelector('p').textContent = 'Fresh travel inspiration is coming your way.'; toast.classList.add('show'); e.target.reset(); setTimeout(() => toast.classList.remove('show'), 4500); });

  // Respect keyboard users in the gallery
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
});
