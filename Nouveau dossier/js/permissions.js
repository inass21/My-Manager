// Permissions par rôle
const PERMISSIONS = {
  admin: { canCreate: true, canEdit: true, canDelete: true, canViewAll: true },
  secretariat: { canCreate: true, canEdit: true, canDelete: false, canViewAll: true },
  teacher: { canCreate: false, canEdit: false, canDelete: false, canViewAll: true },
  viewer: { canCreate: false, canEdit: false, canDelete: false, canViewAll: true }
};

function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function hasPermission(action) {
  const user = getCurrentUser();
  if (!user) return false;
  const perms = PERMISSIONS[user.role];
  return perms ? perms[action] === true : false;
}

function applyPermissions() {
  const user = getCurrentUser();
  if (!user) return;
  
  // Masquer formulaire si pas canCreate
  if (!hasPermission('canCreate')) {
    const form = document.querySelector('form');
    if (form && !form.id.includes('search')) {
      form.style.display = 'none';
      const msg = document.createElement('div');
      msg.style.cssText = 'background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;';
      msg.innerHTML = '⚠️ <strong>Accès restreint</strong><br>Vous ne pouvez pas ajouter d\'éléments.';
      form.parentNode.insertBefore(msg, form);
    }
  }
  
  // Masquer boutons DELETE
  if (!hasPermission('canDelete')) {
    document.querySelectorAll('.delete, button[onclick*="delete"]').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  
  // Masquer boutons EDIT
  if (!hasPermission('canEdit')) {
    document.querySelectorAll('.edit, button[onclick*="edit"]').forEach(btn => {
      btn.style.display = 'none';
    });
  }
  
  // Afficher info user dans navbar
  const navbar = document.querySelector('.navbar .nav-right, .nav-actions');
  if (navbar && !document.getElementById('user-info')) {
    const roleIcons = { admin: '', secretariat: '', teacher: '', viewer: '' };
    const userInfo = document.createElement('div');
    userInfo.id = 'user-info';
    userInfo.style.cssText = 'margin-right: 15px; padding: 8px 15px; background: rgba(255,255,255,0.1); border-radius: 5px; color: white; font-size: 14px;';
    userInfo.textContent = `${roleIcons[user.role]} ${user.name}`;
    const logoutBtn = navbar.querySelector('.logout-btn');
    if (logoutBtn) navbar.insertBefore(userInfo, logoutBtn);
  }
}

function checkAuth() {
  const currentPage = window.location.pathname;
  const isLoginPage = currentPage.includes('index.html') || currentPage === '/' || currentPage === '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn && !isLoginPage) window.location.href = 'index.html';
}

// Initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    applyPermissions();
  });
} else {
  checkAuth();
  applyPermissions();
}

window.getCurrentUser = getCurrentUser;
window.hasPermission = hasPermission;
window.applyPermissions = applyPermissions;
console.log(' Permissions chargées');
