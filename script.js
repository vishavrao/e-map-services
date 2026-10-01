const cards = [...document.querySelectorAll('.project')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.group !== button.dataset.filter; });
  document.querySelector('.gallery-count').textContent = `${cards.filter(c => !c.hidden).length} project photographs`;
}));
const dialog = document.querySelector('#lightbox');
let selected = 0;
function showPhoto(index) {
  selected = index;
  const card = cards[index];
  const source = card.querySelector('img');
  const target = document.querySelector('#large-photo');
  target.src = source.src; target.alt = source.alt;
  document.querySelector('#photo-title').textContent = card.querySelector('strong').textContent;
  document.querySelector('#photo-category').textContent = card.querySelector('small').textContent;
  const visible = cards.filter(c => !c.hidden);
  document.querySelector('#photo-count').textContent = `${visible.indexOf(card) + 1} / ${visible.length}`;
}
function movePhoto(step) {
  const visible = cards.map((card, i) => card.hidden ? -1 : i).filter(i => i >= 0);
  showPhoto(visible[(visible.indexOf(selected) + step + visible.length) % visible.length]);
}
cards.forEach((card, index) => card.addEventListener('click', () => { showPhoto(index); dialog.showModal(); document.body.style.overflow = 'hidden'; }));
document.querySelector('#close-photo').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; cards[selected].focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.querySelector('#previous-photo').addEventListener('click', () => movePhoto(-1));
document.querySelector('#next-photo').addEventListener('click', () => movePhoto(1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); } if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); } });
document.querySelector('#year').textContent = new Date().getFullYear();
const sectionLinks = [...document.querySelectorAll('#navigation a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin: '-20% 0px -55% 0px', threshold: 0});
  sectionLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) sectionObserver.observe(section); });
}
