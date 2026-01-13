// 1. Vérifier si l'utilisateur est connecté
function checkAuth() {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('index.html') || currentPage === '/' || currentPage === '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn && !isLoginPage) {
    window.location.href = 'index.html';
  }
}

// Exécuter au chargement (sauf pour index.html)
if (typeof window !== 'undefined') {
  const currentPage = window.location.pathname;
  if (!currentPage.includes('index.html') && currentPage !== '/' && currentPage !== '') {
    checkAuth();
  }
}

// 2. Fonction de déconnexion
function logout() {
  const currentLang = localStorage.getItem('lang') || 'fr';
  const confirmMessages = {
    fr: "Voulez-vous vraiment vous déconnecter ?",
    en: "Do you really want to log out?",
    ar: "هل تريد حقا تسجيل الخروج؟"
  };
  
  if (confirm(confirmMessages[currentLang])) {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "index.html";
  }
}

// 3. Toggle sidebar pour mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const menuBtn = document.querySelector('.menu-toggle');
  
  if (sidebar) {
    sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    if (menuBtn) menuBtn.classList.toggle('active');
  }
}

// 4. Créer le bouton hamburger et l'overlay au chargement
document.addEventListener('DOMContentLoaded', () => {
  // Ne pas créer le menu sur la page de login
  if (window.location.pathname.includes('index.html') || 
      window.location.pathname === '/' || 
      window.location.pathname === '') {
    return;
  }

  // Créer le bouton hamburger
  const menuBtn = document.createElement('button');
  menuBtn.className = 'menu-toggle';
  menuBtn.onclick = toggleSidebar;
  menuBtn.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  document.body.appendChild(menuBtn);

  // Créer l'overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);

  // Fermer sidebar si clic en dehors sur mobile
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && sidebar.classList.contains('active')) {
      if (!sidebar.contains(e.target) && 
          !menuToggle.contains(e.target) && 
          !overlay.contains(e.target)) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    }
  });

  // Fermer sidebar après clic sur un lien (mobile)
  const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          const sidebar = document.querySelector('.sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          const menuBtn = document.querySelector('.menu-toggle');
          
          if (sidebar) sidebar.classList.remove('active');
          if (overlay) overlay.classList.remove('active');
          if (menuBtn) menuBtn.classList.remove('active');
        }, 200);
      }
    });
  });
});

console.log(' main.js chargé avec succès');
