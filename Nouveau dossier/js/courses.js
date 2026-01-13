window.courses = JSON.parse(localStorage.getItem('courses')) || [
  { name: "Mathématiques", teacher: "Ali Benali", schedule: "Lundi 09h-11h" },
  { name: "Physique", teacher: "Sara Meziane", schedule: "Mardi 10h-12h" },
  { name: "Informatique", teacher: "Youssef Tazi", schedule: "Mercredi 14h-16h" },
  { name: "Français", teacher: "Leila Rahmani", schedule: "Jeudi 08h-10h" },
  { name: "Histoire", teacher: "Karim El Fassi", schedule: "Vendredi 11h-13h" },
  { name: "Chimie", teacher: "Nadia Kabbaj", schedule: "Samedi 09h-11h" }
];

let currentPage = 1;
const rowsPerPage = 5;
let searchValue = "";
let sortAsc = true;

const tableBody = document.getElementById("tableBody");
const form = document.getElementById("courseForm");
const searchInput = document.getElementById("searchInput");

//  FONCTION CENTRALISÉE pour sauvegarder
function saveCourses() {
  localStorage.setItem('courses', JSON.stringify(courses));
  window.courses = courses;
  localStorage.setItem('courses_updated', Date.now().toString());
  if (typeof window.refreshStats === 'function') window.refreshStats();
}

// Recherche
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  currentPage = 1;
  render();
});

// Formulaire - Ajouter/Modifier
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("courseId").value;
  const name = document.getElementById("courseName").value.trim();
  const teacher = document.getElementById("courseTeacher").value.trim();
  const schedule = document.getElementById("courseSchedule").value.trim();

  if (id === "") {
    // Créer nouveau cours
    courses.push({ name, teacher, schedule });
  } else {
    // Modifier cours existant
    courses[id] = { name, teacher, schedule };
  }

  //  UN SEUL APPEL
  saveCourses();

  form.reset();
  document.getElementById("courseId").value = "";
  currentPage = 1;
  render();
});

// Fonction pour appliquer les filtres
function applyFilters() {
  currentPage = 1;
  render();
}

// Fonction pour obtenir les cours filtrés
function getFilteredCourses() {
  const teacherFilter = document.getElementById("teacherFilter");
  const selectedTeacher = teacherFilter ? teacherFilter.value : "";
  
  return courses.filter(c => {
    const matchName = c.name.toLowerCase().includes(searchValue);
    const matchTeacher = selectedTeacher === "" || c.teacher === selectedTeacher;
    return matchName && matchTeacher;
  });
}

// Rendu du tableau
function render() {
  tableBody.innerHTML = "";

  let filtered = getFilteredCourses();

  filtered.sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  paginated.forEach((c, i) => {
    // Trouver l'index RÉEL
    const realIndex = courses.findIndex(course => 
      course.name === c.name && course.teacher === c.teacher && course.schedule === c.schedule
    );
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${c.name}</td>
      <td>${c.teacher}</td>
      <td>${c.schedule}</td>
      <td>
        <button class="edit" onclick="editCourse(${realIndex})">Edit</button>
        <button class="delete" onclick="deleteCourse(${realIndex})">Delete</button>
        <button class="details" onclick="seeDetails(${realIndex})">Details</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  document.getElementById("pageInfo").textContent = `Page ${currentPage} / ${totalPages}`;
}

// Éditer un cours
function editCourse(index) {
  if (index < 0 || index >= courses.length) return;
  
  document.getElementById("courseId").value = index;
  document.getElementById("courseName").value = courses[index].name;
  document.getElementById("courseTeacher").value = courses[index].teacher;
  document.getElementById("courseSchedule").value = courses[index].schedule;
}

// Supprimer un cours
function deleteCourse(index) {
  if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
    courses.splice(index, 1);
    
  
    saveCourses();
    
    render();
  }
}

// Voir détails
function seeDetails(index) {
  const c = courses[index];
  if (!c) return;
  
  const url = `course-details.html?name=${encodeURIComponent(c.name)}&teacher=${encodeURIComponent(c.teacher)}&schedule=${encodeURIComponent(c.schedule)}`;
  window.location.href = url;
}

// Trier par nom
function sortByName() {
  sortAsc = !sortAsc;
  render();
}

// Export CSV
function exportCSV() {
  let csv = "Cours,Professeur,Horaire\n";
  courses.forEach(c => {
    csv += `"${c.name}","${c.teacher}","${c.schedule}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cours.csv";
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
  const filtered = getFilteredCourses();
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
}

// Event listener pour le filtre
const teacherFilter = document.getElementById("teacherFilter");
if (teacherFilter) {
  teacherFilter.addEventListener("change", applyFilters);
}

// Initial render
render();

console.log(' courses.js chargé');