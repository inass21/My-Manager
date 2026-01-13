window.addEventListener('DOMContentLoaded', function() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser) return;
  
  // Afficher badge du rôle
  const userRoleBadge = document.getElementById('userRoleBadge');
  if (userRoleBadge) {
    userRoleBadge.textContent = currentUser.role.toUpperCase();
  }
  
  // Afficher Logs uniquement pour admin
  const logsNavBtn = document.getElementById('logsNavBtn');
  if (logsNavBtn && currentUser.role === 'admin') {
    logsNavBtn.style.display = 'inline-block';
  }
});