const navLinks = document.querySelectorAll('.slide-nav a[href^="#"]');
const sections = Array.from(document.querySelectorAll('section[id]'));
let isScrolling = false;
let currentIndex = 0;

function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return;
  isScrolling = true;
  sections[index].scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { isScrolling = false }, 1000);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = sections.indexOf(entry.target);
      currentIndex = index;
      navLinks.forEach(l => l.classList.remove('active'));
      document.querySelector(`.slide-nav a[href="#${entry.target.id}"]`).classList.add('active');
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.6 });

sections.forEach(section => observer.observe(section));

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) scrollToSection(sections.indexOf(target));
  });
});

window.addEventListener('wheel', e => {
  if (isScrolling) {
    e.preventDefault();
    return;
  }
  if (e.deltaY > 0) scrollToSection(currentIndex + 1);
  else if (e.deltaY < 0) scrollToSection(currentIndex - 1);
  e.preventDefault();
}, { passive: false });

scrollToSection(0);

async function updateServerStats(){
  try {
    const res = await fetch('http://213.181.206.239:30120/players.json');
    if (!res.ok) throw new Error(`Hiba: ${res.status}`);
    const players = await res.json();
    const online = players.length;
    const max = 64; 
    document.getElementById('onlineCount').textContent = online;
    document.getElementById('maxCount').textContent    = max;
    document.getElementById('onlineBar').style.width   = Math.min(100, online / max * 100) + '%';
  } catch (e) {
    console.error('Server stats frissítési hiba:', e);
  }
}
updateServerStats();
setInterval(updateServerStats, 30000);



document.getElementById('copyicon').addEventListener('click', function() {
  const text = "connect play.pentarp.hu";
  navigator.clipboard.writeText(text)
  .then(() => {
    this.classList.replace('fa-copy', 'fa-check');
    this.style.color = '#58bba4';
    this.title = 'Másolva';
    setTimeout(() => {
      this.classList.replace('fa-check', 'fa-copy');
      this.style.color = 'white';
      this.title = 'Másolás a vágólapra';
    }, 2000);
  })
  .catch(err => {
    console.error('Másolás sikertelen', err);
    alert('A másolás nem sikerült. Kérlek, manuálisan másold ki a szöveget.');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const header  = document.getElementById('nav');
  const logoImg = header.querySelector('img.logo');
  const titleEl = header.querySelector('#nav-title');
  titleEl.style.position      = 'absolute';
  titleEl.style.top           = '38%';
  titleEl.style.left          = '17%';
  titleEl.style.visibility    = 'hidden';
  const sections = [
    { id: 'section1', text: '',                     logo: true  },
    { id: 'section2', text: 'ABOUT US',             logo: false },
    { id: 'section3', text: 'HOGY TUDOK FELJÖNNI?',  logo: false },
    { id: 'section4', text: 'Csatlakozz hozzánk!',   logo: false }
  ];
  function showLogoHideTitle() {
    if (titleEl.style.visibility === 'visible') {
      titleEl.classList.remove('slide-in');
      titleEl.classList.add('title-slide-out');
      titleEl.addEventListener('animationend', () => {
        titleEl.style.visibility = 'hidden';
        titleEl.classList.remove('title-slide-out');
      }, { once: true });
    }
    logoImg.style.visibility = 'visible';
    logoImg.classList.remove('logo-slide-out');
    logoImg.classList.add('logo-slide-in');
    logoImg.addEventListener('animationend', () => {
      logoImg.classList.remove('logo-slide-in');
    }, { once: true });
  }
  function hideLogoShowTitle(newText) {
    if (logoImg.style.visibility === 'visible') {
      logoImg.classList.remove('logo-slide-in');
      logoImg.classList.add('logo-slide-out');
      logoImg.addEventListener('animationend', () => {
        logoImg.style.visibility = 'hidden';
        logoImg.classList.remove('logo-slide-out');
      }, { once: true });
    }
    if (titleEl.style.visibility === 'visible') {
      titleEl.classList.remove('slide-in');
      titleEl.classList.add('title-slide-out');
      setTimeout(() => {
        titleEl.style.visibility = 'hidden';
        titleEl.classList.remove('title-slide-out');
        enterNewTitle(newText);
      }, 300);
    } else {
      enterNewTitle(newText);
    }
  }
  function enterNewTitle(text) {
    titleEl.textContent      = text;
    titleEl.style.visibility = 'visible';
    titleEl.classList.remove('title-slide-out');
    titleEl.classList.add('title-slide-in');
    setTimeout(() => {
      titleEl.classList.add('slide-in');
    }, 300);
    titleEl.addEventListener('animationend', () => {
      titleEl.classList.remove('title-slide-in');
    }, { once: true });
  }
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const visibleId = entry.target.getAttribute('id');
      const info = sections.find(s => s.id === visibleId);
      if (!info) return;
      if (info.logo) {
        showLogoHideTitle();
      } else {
        hideLogoShowTitle(info.text);
      }
    });
  };
  const observerOptions = {
    root: null,
    rootMargin: '-10px 0px -90% 0px',
    threshold: 0
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(s => {
    const secEl = document.getElementById(s.id);
    if (secEl) observer.observe(secEl);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  const sections = [
    { id: 'section1', showButton: false },
    { id: 'section2', showButton: true  },
    { id: 'section3', showButton: true  },
    { id: 'section4', showButton: true  }
  ];
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      const info = sections.find(s => s.id === id);
      if (!info) return;
      if (info.showButton) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    });
  };
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) observer.observe(el);
  });
});
