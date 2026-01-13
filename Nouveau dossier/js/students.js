let students = JSON.parse(localStorage.getItem('students')) || [
  { name: "Ahmed Zerouali", email: "ahmed.z@student.ma", class: "1ére année" },
  { name: "Fatima El Idrissi", email: "fatima.e@student.ma", class: "2éme année" },
  { name: "Omar Charki", email: "omar.c@student.ma", class: "1ére année" },
  { name: "Noura Benjelloun", email: "noura.b@student.ma", class: "3éme année" },
  { name: "Yassin Mezzour", email: "yassin.m@student.ma", class: "2éme année" },
  { name: "Salma Kettani", email: "salma.k@student.ma", class: "1ére année" }
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

// FONCTION  pour sauvegarder
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
      <td>${s.class}</td>
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

// Editer un Ã©tudiant
function editStudent(index) {
  document.getElementById("studentId").value = index;
  document.getElementById("studentName").value = students[index].name;
  document.getElementById("studentEmail").value = students[index].email;
  document.getElementById("studentClass").value = students[index].class;
}

// Supprimer un Ã©tudiant
function deleteStudent(index) {
  if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
    students.splice(index, 1);
    
    
    saveStudents();
    
    render();
  }
}

// Voir dÃ©tails
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

//  FONCTION MANQUANTE
function applyFilters() {
  currentPage = 1;
  render();
}

// Initial render
render();