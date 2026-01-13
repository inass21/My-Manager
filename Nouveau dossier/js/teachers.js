let teachers = JSON.parse(localStorage.getItem('teachers')) || [
  { id: 1, name: "Ali Benali", email: "ali@school.ma", subject: "Mathématiques" },
  { id: 2, name: "Sara Meziane", email: "sara@school.ma", subject: "Physique" },
  { id: 3, name: "Youssef Tazi", email: "youssef@school.ma", subject: "Informatique" }
];

window.teachers = teachers;

let currentPage = 1;
const rowsPerPage = 5;
let sortAsc = true;

const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const form = document.getElementById("teacherForm");
const teacherId = document.getElementById("teacherId");
const teacherName = document.getElementById("teacherName");
const teacherEmail = document.getElementById("teacherEmail");
const teacherSubject = document.getElementById("teacherSubject");
const pageInfo = document.getElementById("pageInfo");



function saveTeachers() {
  localStorage.setItem('teachers', JSON.stringify(teachers));
  window.teachers = teachers;
  localStorage.setItem('teachers_updated', Date.now().toString());  
  if (typeof window.refreshStats === 'function') window.refreshStats();
}

// Event listeners
searchInput.addEventListener("input", () => { 
  currentPage = 1; 
  render(); 
});

subjectFilter.addEventListener("change", () => { 
  currentPage = 1; 
  render(); 
});

// Formulaire - Ajouter/Modifier
form.addEventListener("submit", e => {
  e.preventDefault();
  const idVal = teacherId.value;
  const name = teacherName.value.trim();
  const email = teacherEmail.value.trim();
  const subject = teacherSubject.value.trim();

  if (idVal === "") {
    // Créer nouveau professeur
    const newId = teachers.length ? Math.max(...teachers.map(t => t.id)) + 1 : 1;
    teachers.push({ id: newId, name, email, subject });
  } else {
    // Modifier professeur existant
    const tIndex = teachers.findIndex(t => t.id == idVal);
    if (tIndex !== -1) {
      teachers[tIndex] = { ...teachers[tIndex], name, email, subject };
    }
  }

 
  saveTeachers();

  form.reset();
  teacherId.value = "";
  render();
});

// Rendu du tableau
function render() {
  tableBody.innerHTML = "";

  let filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (subjectFilter.value === "" || t.subject === subjectFilter.value)
  );

  filtered.sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const start = (currentPage - 1) * rowsPerPage;
  const pageItems = filtered.slice(start, start + rowsPerPage);

  pageItems.forEach((t) => {
    tableBody.innerHTML += `
      <tr>
        <td>${t.id}</td>
        <td>${t.name}</td>
        <td>${t.email}</td>
        <td>${t.subject}</td>
        <td>
          <button class="edit" onclick="editTeacher(${t.id})">Edit</button>
          <button class="delete" onclick="deleteTeacher(${t.id})">Delete</button>
          <button class="details" onclick="seeDetails(${t.id})">Details</button>
        </td>
      </tr>
    `;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
}

// Éditer un professeur
function editTeacher(id) {
  const t = teachers.find(t => t.id === id);
  if (!t) return;
  
  teacherId.value = t.id;
  teacherName.value = t.name;
  teacherEmail.value = t.email;
  teacherSubject.value = t.subject;
}

// Supprimer un professeur
function deleteTeacher(id) {
  if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
    teachers = teachers.filter(t => t.id !== id);
    
    
    saveTeachers();
    
    render();
  }
}

// Voir détails
function seeDetails(id) {
  const t = teachers.find(t => t.id === id);
  if (!t) return;
  
  const url = `teacher-details.html?id=${t.id}&name=${encodeURIComponent(t.name)}&email=${encodeURIComponent(t.email)}&subject=${encodeURIComponent(t.subject)}`;
  window.location.href = url;
}

// Trier par nom
function sortByName() {
  sortAsc = !sortAsc;
  render();
}

// Export CSV
function exportCSV() {
  let csv = "ID,Nom,Email,Matière\n";
  teachers.forEach(t => {
    csv += `${t.id},"${t.name}","${t.email}","${t.subject}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "professeurs.csv";
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
  let filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (subjectFilter.value === "" || t.subject === subjectFilter.value)
  );
  
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
}


function applyFilters() {
  currentPage = 1;
  render();
}

// Initial render
render();

console.log(' teachers.js chargé');