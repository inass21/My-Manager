const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const roleSelect = document.getElementById("roleSelect");
const loginBtn = document.getElementById("loginBtn");
const errorDiv = document.getElementById("error");

// Base de donnees
const USERS = [
  { username: 'admin', password: 'admin', role: 'admin', name: 'Administrateur' },
  { username: 'secretaire', password: 'secret123', role: 'secretariat', name: 'Secretaire' },
  { username: 'prof', password: 'prof123', role: 'teacher', name: 'Professeur' },
  { username: 'viewer', password: 'view123', role: 'viewer', name: 'Visiteur' }
];


if (localStorage.getItem('isLoggedIn') === 'true') {
  window.location.href = 'dashboard.html';
}

loginBtn.addEventListener("click", login);
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") login();
});

function login() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const role = roleSelect.value;

  if (!username || !password) {
    errorDiv.textContent = " Remplissez tous les champs";
    errorDiv.style.color = "red";
    return;
  }

  if (!role) {
    errorDiv.textContent = "sélectionner votre role ";
    errorDiv.style.color = "red";
    return;
  }

  const user = USERS.find(u => 
    u.username === username && 
    u.password === password && 
    u.role === role
  );

  if (user) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({
      username: user.username,
      role: user.role,
      name: user.name
    }));
    
    // Log
    const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    logs.push({
      action: 'login',
      details: `Connexion: ${user.name}`,
      date: new Date().toLocaleString('fr-FR')
    });
    localStorage.setItem('activity_logs', JSON.stringify(logs));
    
    window.location.href = "dashboard.html";
  } else {
    errorDiv.textContent = " Identifiants ou role incorrect";
    errorDiv.style.color = "red";
  }
}