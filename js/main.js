// Intersection Observer para reveal animations
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if(e.isIntersecting){ 
      e.target.classList.add('vis');
      if(e.target.classList.contains('s-num')) animateCounter(e.target);
      io.unobserve(e.target); 
    } 
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.s-num').forEach(el => io.observe(el));

// Counter Animation
function animateCounter(el) {
  const text = el.innerText.trim();
  const isPercent = text.includes('%');
  const isTime = text.includes('h');
  let num = parseInt(text) || 0;
  
  if(num === 0) return;
  
  const start = 0, duration = 2000, steps = 60;
  let current = 0;
  const increment = num / steps;
  
  const timer = setInterval(() => {
    current += increment;
    if(current >= num) {
      current = num;
      clearInterval(timer);
    }
    el.innerText = Math.floor(current) + (isPercent ? '%' : isTime ? 'h' : '');
  }, duration / steps);
}

// Parallax effect nos orbes
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.hero-orb1');
  const orb2 = document.querySelector('.hero-orb2');
  
  if(orb1) orb1.style.transform = `translate(-22px, calc(28px + ${scrollY * 0.15}px))`;
  if(orb2) orb2.style.transform = `translate(20px, calc(-22px - ${scrollY * 0.1}px))`;
});

// 3D Tilt effect nos cards ao mouse
const cards = document.querySelectorAll('.srv-card, .prob-item, .sobre-wrap, .sol-wrap');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) * 0.02;
    const rotateY = (x - rect.width / 2) * 0.02;
    
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
  });
});

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navClose = document.getElementById('navClose');

function openNav() {
  navMenu?.classList.add('open');
  navMenu?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navMenu?.classList.remove('open');
  navMenu?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
navMenu?.addEventListener('click', (event) => {
  if (event.target === navMenu) closeNav();
});

const navMenuLinks = navMenu?.querySelectorAll('a');
navMenuLinks?.forEach(link => {
  link.addEventListener('click', closeNav);
});

const contactForm = document.getElementById('contactForm');
const whatsappModal = document.getElementById('whatsappModal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const whatsappLink = 'https://wa.me/5585985535362?text=' + encodeURIComponent('Olá! Acabei de enviar o formulário pelo site. Quero continuar pelo WhatsApp.');

function openWhatsAppModal() {
  if (!whatsappModal) return;
  whatsappModal.classList.add('open');
  whatsappModal.setAttribute('aria-hidden', 'false');
}

function closeWhatsAppModal() {
  if (!whatsappModal) return;
  whatsappModal.classList.remove('open');
  whatsappModal.setAttribute('aria-hidden', 'true');
}

modalClose?.addEventListener('click', closeWhatsAppModal);
modalCancel?.addEventListener('click', closeWhatsAppModal);
whatsappModal?.addEventListener('click', (event) => {
  if (event.target === whatsappModal) closeWhatsAppModal();
});

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const formData = new FormData(contactForm);
    const actionUrl = contactForm.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');

    try {
      const response = await fetch(actionUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (!response.ok) throw new Error('Falha no envio');
      submitButton.textContent = 'Enviado!';
      contactForm.reset();
      openWhatsAppModal();
    } catch (error) {
      submitButton.textContent = 'Erro no envio. Tentando via formulário normal...';
      submitButton.disabled = false;
      contactForm.submit();
    } finally {
      setTimeout(() => {
        if (submitButton.textContent !== 'Enviado!') {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }
      }, 4000);
    }
  });
}
