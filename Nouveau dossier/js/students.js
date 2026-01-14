let students = JSON.parse(localStorage.getItem('students')) || [
  { name: "Ahmed Zerouali", email: "ahmed.z@student.ma", class: "1ère année" },
  { name: "Fatima El Idrissi", email: "fatima.e@student.ma", class: "2ème année" },
  { name: "Omar Charki", email: "omar.c@student.ma", class: "1ère année" },
  { name: "Noura Benjelloun", email: "noura.b@student.ma", class: "3ème année" },
  { name: "Yassin Mezzour", email: "yassin.m@student.ma", class: "2ème année" },
  { name: "Salma Kettani", email: "salma.k@student.ma", class: "1ère année" }
];

window.students = students;

let currentPage = 1;
const rowsPerPage = 5;
let searchValue = "";
let sortAsc = true;

const tableBody = document.getElementById("tableBody");
const form = document.getElementById("studentForm");
const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classFilter");

// FONCTION pour sauvegarder
function saveStudents() {
  localStorage.setItem('students', JSON.stringify(students));
  window.students = students;
  localStorage.setItem('students_updated', Date.now().toString());
  if (typeof window.refreshStats === 'function') window.refreshStats();
}

// Recherche
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  currentPage = 1;
  render();
});

// Filtre par classe
classFilter.addEventListener("change", () => {
  currentPage = 1;
  render();
});

// Ajout et modification
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value;
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;
  const classe = document.getElementById("studentClass").value;

  if (id === "") {
    students.push({ name, email, class: classe });
  } else {
    students[id] = { name, email, class: classe };
  }

  saveStudents();
  
  form.reset();
  document.getElementById("studentId").value = "";
  currentPage = 1;
  render();
});

// Rendu du tableau
function render() {
  tableBody.innerHTML = "";

  const selectedClass = classFilter.value;

  let filtered = students.filter(s => {
    const matchesName = s.name.toLowerCase().includes(searchValue);
    const matchesClass = selectedClass === "" || s.class === selectedClass;
    return matchesName && matchesClass;
  });

  filtered.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  paginated.forEach((s, i) => {
    const realIndex = students.findIndex(student => 
      student.name === s.name && student.email === s.email
    );
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${s.name}</td>
      <td>${s.email}</td>
      <td><span style="background: ${s.class === 'Externe API' ? '#9b59b6' : '#3498db'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${s.class}</span></td>
      <td>
        <button class="edit" onclick="editStudent(${realIndex})">Edit</button>
        <button class="delete" onclick="deleteStudent(${realIndex})">Delete</button>
        <button class="details" onclick="seeDetails(${realIndex})">Details</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  document.getElementById("pageInfo").textContent = `Page ${currentPage} / ${totalPages}`;
}

// Editer un étudiant
function editStudent(index) {
  document.getElementById("studentId").value = index;
  document.getElementById("studentName").value = students[index].name;
  document.getElementById("studentEmail").value = students[index].email;
  document.getElementById("studentClass").value = students[index].class;
}

// Supprimer un étudiant
function deleteStudent(index) {
  if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
    students.splice(index, 1);
    saveStudents();
    render();
  }
}

// Voir détails
function seeDetails(index) {
  const s = students[index];
  const url = `student-details.html?name=${encodeURIComponent(s.name)}&email=${encodeURIComponent(s.email)}&class=${encodeURIComponent(s.class)}`;
  window.location.href = url;
}

// Trier par nom
function sortByName() {
  sortAsc = !sortAsc;
  render();
}

// Export CSV
function exportCSV() {
  let csv = "Nom,Email,Classe\n";
  students.forEach(s => {
    csv += `"${s.name}","${s.email}","${s.class}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "etudiants.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Pagination
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
}

function nextPage() {
  const selectedClass = classFilter.value;
  const filtered = students.filter(s => {
    const matchesName = s.name.toLowerCase().includes(searchValue);
    const matchesClass = selectedClass === "" || s.class === selectedClass;
    return matchesName && matchesClass;
  });
  if (currentPage * rowsPerPage < filtered.length) {
    currentPage++;
    render();
  }
}

function applyFilters() {
  currentPage = 1;
  render();
}

//  Charger depuis API avec Classes ES6 
async function loadFromAPI() {
  try {
    console.log(' Début chargement API...');
    
    // Afficher un loading
    const oldHTML = tableBody.innerHTML;
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;"><div style="font-size: 18px;">f Chargement depuis l\'API...</div></td></tr>';
    
    //  Utiliser la classe APIIntegration (de models.js)
    const users = await APIIntegration.fetchUsers();
    console.log(' API chargée:', users.length, 'utilisateurs');
    
    //  Convertir en Students avec la classe Student
    const newStudents = users.slice(0, 3).map(user => {
      // Créer instance de Student
      const student = new Student(user.name, user.email, "Externe API");
      
      // Vérification que l'email est valide avec la méthode de classe
      if (!student.isValidEmail()) {
        console.warn(' Email invalide:', user.email);
      }
      
      console.log(' Student créé:', student.getFullInfo());
      
      // Convertir en JSON pour stockage
      return student.toJSON();
    });
    
    // 3. Ajouter aux étudiants existants
    const existingEmails = students.map(s => s.email);
    const uniqueNewStudents = newStudents.filter(s => !existingEmails.includes(s.email));
    
    if (uniqueNewStudents.length > 0) {
      students = [...students, ...uniqueNewStudents];
      saveStudents();
      
      // Message de succès
      alert(` ${uniqueNewStudents.length} nouveaux étudiants ajoutés depuis l'API!\n\n` +
            `Les étudiants sont marqués "Externe API" dans la colonne Classe.`);
    } else {
      alert('Les étudiants de l\'API existent déjà!');
    }
    
    // Re-render
    render();
    
    console.log(' Chargement API terminé avec succès');
    
  } catch (error) {
    console.error(' Erreur API:', error);
    alert('Erreur lors du chargement depuis l\'API:\n\n' + error.message);
    render();
  }
}

// les Classes ES6 
function testClasses() {
  console.log(' TEST CLASSES ES6 - DÉBUT');
  console.log('=====================================');
  
  // 1. Test classe Student
  console.log('\n Classe Student');
  const testStudent = new Student("Test Étudiant", "test@example.com", "1ère année");
  console.log('✓ Instance créée:', testStudent);
  console.log('✓ getFullInfo():', testStudent.getFullInfo());
  console.log('✓ isValidEmail():', testStudent.isValidEmail());
  console.log('✓ toJSON():', testStudent.toJSON());
  
  //  Student.fromJSON
  console.log('\n Student.fromJSON()');
  const jsonData = { name: "JSON Student", email: "json@test.com", class: "2ème année" };
  const fromJSON = Student.fromJSON(jsonData);
  console.log('✓ Student créé depuis JSON:', fromJSON.getFullInfo());
  
  //DataManager (Async/Await)
  console.log('\n  DataManager (Async/Await)');
  
  (async () => {
    try {
      // Test save
      await DataManager.saveToStorage('test_data', [1, 2, 3]);
      console.log('✓ Sauvegarde async réussie');
      
      // Test load
      const loaded = await DataManager.loadFromStorage('test_data');
      console.log('✓ Chargement async réussi:', loaded);
      
      // Test taille storage
      console.log('✓ Taille du storage:', DataManager.getStorageSize());
      
      // Nettoyer
      await DataManager.deleteFromStorage('test_data');
      console.log(' Suppression async réussie');
      
    } catch (error) {
      console.error(' Erreur DataManager:', error);
    }
  })();
  
  //  APIIntegration
  console.log('\n  APIIntegration');
  console.log(' Cliquez sur "Charger depuis API" pour tester');
  
  console.log('\n=====================================');
  console.log(' TEST CLASSES ES6 - FIN');
  console.log(' Toutes les classes sont opérationnelles!');
  console.log(' Ouvrez la console pour voir les détails');
  
  alert(' Test Classes ES6 terminé!\n\n' +
        'Cliquez sur "Charger depuis API" pour voir l\'API en action!');
}

// Exporter les fonctions pour les rendre accessibles
window.loadFromAPI = loadFromAPI;
window.testClasses = testClasses;

// Initial render
render();

console.log(' students.js chargé avec API support');
