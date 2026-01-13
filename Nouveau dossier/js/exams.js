window.exams = JSON.parse(localStorage.getItem('exams')) || [
  { course: "Mathématiques", date: "2026-01-10", room: "Salle A101" },
  { course: "Physique", date: "2026-01-12", room: "Salle B205" },
  { course: "Informatique", date: "2026-01-15", room: "Labo Info" },
  { course: "Français", date: "2026-01-18", room: "Salle C303" },
  { course: "Histoire", date: "2026-02-20", room: "Amphithéâtre" },
  { course: "Chimie", date: "2026-02-22", room: "Salle B205" }
];

let currentPage = 1;
const rowsPerPage = 5;
let sortAsc = true;
let searchValue = "";

const tableBody = document.getElementById("tableBody");
const form = document.getElementById("examForm");
const searchInput = document.getElementById("searchInput");
const monthFilter = document.getElementById("monthFilter");
const courseFilter = document.getElementById("courseFilter");

// Recherche
searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value.toLowerCase();
  currentPage = 1;
  render();
});

// Ajouter / Modifier examen
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("examId").value;
  const course = document.getElementById("examCourse").value.trim();
  let date = document.getElementById("examDate").value.trim();
  const room = document.getElementById("examRoom").value.trim();

  // Convertir DD/MM/YYYY → YYYY-MM-DD
  if (date.includes("/")) {
    const parts = date.split("/");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  if (id === "") {
    exams.push({ course, date, room });
  } else {
    exams[id] = { course, date, room };
  }

  localStorage.setItem("exams", JSON.stringify(exams));
  localStorage.setItem('exams_updated', Date.now().toString());
  if (typeof window.refreshStats === 'function') window.refreshStats();
  
  form.reset();
  document.getElementById("examId").value = "";
  currentPage = 1;
  render();
});

// Filtrage
function getFilteredExams() {
  return exams.filter(e => {
    const matchesSearch = e.course.toLowerCase().includes(searchValue);
    const matchesMonth = monthFilter.value === "" || e.date.split("-")[1] === monthFilter.value;
    const matchesCourse = courseFilter.value === "" || e.course === courseFilter.value;
    return matchesSearch && matchesMonth && matchesCourse;
  });
}

// Formater date FR
function formatDateFR(dateStr) {
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Rendu tableau
function render() {
  tableBody.innerHTML = "";
  const filtered = getFilteredExams();

  filtered.sort((a, b) => sortAsc ? a.course.localeCompare(b.course) : b.course.localeCompare(a.course));

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  paginated.forEach((e, i) => {
    const realIndex = exams.findIndex(exam => exam.course === e.course && exam.date === e.date && exam.room === e.room);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${e.course}</td>
      <td>${formatDateFR(e.date)}</td>
      <td>${e.room}</td>
      <td>
        <button onclick="editExam(${realIndex})">Edit</button>
        <button onclick="deleteExam(${realIndex})">Delete</button>
        <button onclick="seeDetails(${realIndex})">Details</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  document.getElementById("pageInfo").textContent = `Page ${currentPage} / ${totalPages}`;
}

// Editer examen
function editExam(index) {
  const e = exams[index];
  document.getElementById("examId").value = index;
  document.getElementById("examCourse").value = e.course;
  document.getElementById("examDate").value = formatDateFR(e.date);
  document.getElementById("examRoom").value = e.room;
}

// Supprimer examen
function deleteExam(index) {
  if (confirm("Voulez-vous vraiment supprimer cet examen ?")) {
    exams.splice(index, 1);
    localStorage.setItem("exams", JSON.stringify(exams));
    localStorage.setItem('exams_updated', Date.now().toString());
    if (typeof window.refreshStats === 'function') window.refreshStats();
    render();
  }
}

// Pagination
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
}

function nextPage() {
  const totalPages = Math.ceil(getFilteredExams().length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
}

// Tri
function sortByCourse() {
  sortAsc = !sortAsc;
  render();
}

// Export CSV
function exportCSV() {
  let csv = "Cours,Date,Salle\n";
  exams.forEach(e => {
    csv += `"${e.course}","${formatDateFR(e.date)}","${e.room}"\n`;
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "exams.csv";
  a.click();
}


function applyFilters() {
  currentPage = 1;
  render();
}

// Voir détails d'un examen
function seeDetails(index) {
  const e = exams[index];
  const url = `exam-details.html?course=${encodeURIComponent(e.course)}&date=${formatDateFR(e.date)}&room=${encodeURIComponent(e.room)}`;
  window.location.href = url;
}

// Initial render
render();