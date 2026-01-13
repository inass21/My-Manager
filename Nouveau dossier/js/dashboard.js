// Variables globales pour stocker les charts
let pieChart, barChart, scatterChart, lineChart, donutChart;

//  INITIALISER LES DONNÉES AU CHARGEMENT
function initializeData() {
  console.log(' Initialisation des données...');
  
  // Vérifier si les données existent, sinon les créer
  if (!localStorage.getItem('students')) {
    const defaultStudents = [
      { name: "Ahmed Zerouali", email: "ahmed.z@student.ma", class: "1ère année" },
      { name: "Fatima El Idrissi", email: "fatima.e@student.ma", class: "2ème année" },
      { name: "Omar Charki", email: "omar.c@student.ma", class: "1ère année" },
      { name: "Noura Benjelloun", email: "noura.b@student.ma", class: "3ème année" },
      { name: "Yassin Mezzour", email: "yassin.m@student.ma", class: "2ème année" },
      { name: "Salma Kettani", email: "salma.k@student.ma", class: "1ère année" }
    ];
    localStorage.setItem('students', JSON.stringify(defaultStudents));
    window.students = defaultStudents;
  } else {
    window.students = JSON.parse(localStorage.getItem('students'));
  }

  if (!localStorage.getItem('teachers')) {
    const defaultTeachers = [
      { id: 1, name: "Ali Benali", email: "ali@school.ma", subject: "Mathématiques" },
      { id: 2, name: "Sara Meziane", email: "sara@school.ma", subject: "Physique" },
      { id: 3, name: "Youssef Tazi", email: "youssef@school.ma", subject: "Informatique" }
    ];
    localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    window.teachers = defaultTeachers;
  } else {
    window.teachers = JSON.parse(localStorage.getItem('teachers'));
  }

  if (!localStorage.getItem('courses')) {
    const defaultCourses = [
      { name: "Mathématiques", teacher: "Ali Benali", schedule: "Lundi 09h-11h" },
      { name: "Physique", teacher: "Sara Meziane", schedule: "Mardi 10h-12h" },
      { name: "Informatique", teacher: "Youssef Tazi", schedule: "Mercredi 14h-16h" },
      { name: "Français", teacher: "Leila Rahmani", schedule: "Jeudi 08h-10h" },
      { name: "Histoire", teacher: "Karim El Fassi", schedule: "Vendredi 11h-13h" },
      { name: "Chimie", teacher: "Nadia Kabbaj", schedule: "Samedi 09h-11h" }
    ];
    localStorage.setItem('courses', JSON.stringify(defaultCourses));
    window.courses = defaultCourses;
  } else {
    window.courses = JSON.parse(localStorage.getItem('courses'));
  }

  if (!localStorage.getItem('rooms')) {
    const defaultRooms = [
      { name: "Salle A101", capacity: 40, location: "Bâtiment A", type: "Cours" },
      { name: "Salle B205", capacity: 30, location: "Bâtiment B", type: "Cours" },
      { name: "Labo Info", capacity: 25, location: "Bâtiment C", type: "Laboratoire" },
      { name: "Amphithéâtre", capacity: 100, location: "Bâtiment Principal", type: "Amphithéâtre" },
      { name: "Salle C303", capacity: 35, location: "Bâtiment C", type: "Cours" },
      { name: "Salle Polyvalente", capacity: 50, location: "Bâtiment D", type: "Polyvalente" }
    ];
    localStorage.setItem('rooms', JSON.stringify(defaultRooms));
    window.rooms = defaultRooms;
  } else {
    window.rooms = JSON.parse(localStorage.getItem('rooms'));
  }

  if (!localStorage.getItem('exams')) {
    const defaultExams = [
      { course: "Mathématiques", date: "2026-01-10", room: "Salle A101" },
      { course: "Physique", date: "2026-01-12", room: "Salle B205" },
      { course: "Informatique", date: "2026-01-15", room: "Labo Info" },
      { course: "Français", date: "2026-01-18", room: "Salle C303" },
      { course: "Histoire", date: "2026-02-20", room: "Amphithéâtre" },
      { course: "Chimie", date: "2026-02-22", room: "Salle B205" }
    ];
    localStorage.setItem('exams', JSON.stringify(defaultExams));
    window.exams = defaultExams;
  } else {
    window.exams = JSON.parse(localStorage.getItem('exams'));
  }

  console.log(' Données initialisées:', {
    students: window.students.length,
    teachers: window.teachers.length,
    courses: window.courses.length,
    rooms: window.rooms.length,
    exams: window.exams.length
  });
}

// Fonction pour créer/mettre à jour les graphiques avec filtres
function createCharts(filteredData = null) {
  console.log('📊 Création des graphiques...');
  
  // S'assurer que les données sont chargées
  if (!window.students || !window.teachers || !window.courses || !window.rooms || !window.exams) {
    console.warn(' Données non disponibles, initialisation...');
    initializeData();
  }

  // Utiliser données filtrées ou données complètes
  const studentsData = filteredData?.students || window.students || [];
  const teachersData = filteredData?.teachers || window.teachers || [];
  const coursesData = filteredData?.courses || window.courses || [];
  const roomsData = filteredData?.rooms || window.rooms || [];
  const examsData = filteredData?.exams || window.exams || [];

  console.log('📈 Données pour graphiques:', {
    students: studentsData.length,
    teachers: teachersData.length,
    courses: coursesData.length,
    rooms: roomsData.length,
    exams: examsData.length
  });

  //  Mettre à jour les statistiques
  const totalStudentsEl = document.getElementById("totalStudents");
  const totalTeachersEl = document.getElementById("totalTeachers");
  const totalCoursesEl = document.getElementById("totalCourses");
  const totalRoomsEl = document.getElementById("totalRooms");
  const totalExamsEl = document.getElementById("totalExams");

  if (totalStudentsEl) totalStudentsEl.textContent = studentsData.length;
  if (totalTeachersEl) totalTeachersEl.textContent = teachersData.length;
  if (totalCoursesEl) totalCoursesEl.textContent = coursesData.length;
  if (totalRoomsEl) totalRoomsEl.textContent = roomsData.length;
  if (totalExamsEl) totalExamsEl.textContent = examsData.length;

  // Détruire les anciens graphiques
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();
  if (scatterChart) scatterChart.destroy();
  if (lineChart) lineChart.destroy();
  if (donutChart) donutChart.destroy();

  //  Répartition des Cours
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx && coursesData.length > 0) {
    const courseNames = coursesData.map(c => c.name);
    pieChart = new Chart(pieCtx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: courseNames,
        datasets: [{
          data: courseNames.map(() => 1),
          backgroundColor: ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c']
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    console.log('Pie Chart créé');
  }

  // Étudiants par Classe
  const barCtx = document.getElementById('barChart');
  if (barCtx && studentsData.length > 0) {
    const classCounts = {};
    studentsData.forEach(s => {
      classCounts[s.class] = (classCounts[s.class] || 0) + 1;
    });
    
    barChart = new Chart(barCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: Object.keys(classCounts),
        datasets: [{
          label: "Nombre d'étudiants",
          data: Object.values(classCounts),
          backgroundColor: '#3498db'
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
    console.log(' Bar Chart créé');
  }

  //Capacité des Salles
  const scatterCtx = document.getElementById('scatterChart');
  if (scatterCtx && roomsData.length > 0) {
    const scatterData = roomsData.map((r, i) => ({ x: i+1, y: r.capacity }));
    scatterChart = new Chart(scatterCtx.getContext('2d'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: "Capacité des salles",
          data: scatterData,
          backgroundColor: '#e74c3c'
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    console.log(' Scatter Chart créé');
  }

  // Examens par Mois
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx && examsData.length > 0) {
    const monthCounts = {};
    examsData.forEach(e => {
      const month = e.date.split('-')[1];
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    
    lineChart = new Chart(lineCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: Object.keys(monthCounts),
        datasets: [{
          label: "Nombre d'examens",
          data: Object.values(monthCounts),
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
    console.log(' Line Chart créé');
  }

  // Types de Salles
  const donutCtx = document.getElementById('donutChart');
  if (donutCtx && roomsData.length > 0) {
    const typeCounts = {};
    roomsData.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    });
    
    donutChart = new Chart(donutCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(typeCounts),
        datasets: [{
          data: Object.values(typeCounts),
          backgroundColor: ['#9b59b6','#1abc9c','#f39c12','#34495e']
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    console.log(' Donut Chart créé');
  }

  console.log(' Tous les graphiques ont été créés');
}

//  Fonction pour appliquer les filtres
function applyDashboardFilters() {
  const classFilter = document.getElementById('dashboardClassFilter');
  const monthFilter = document.getElementById('dashboardMonthFilter');
  
  if (!classFilter || !monthFilter) {
    console.warn(' Filtres non trouvés');
    return;
  }

  const selectedClass = classFilter.value;
  const selectedMonth = monthFilter.value;

  // Filtrer les données
  const filteredStudents = selectedClass === '' 
    ? window.students 
    : window.students.filter(s => s.class === selectedClass);

  const filteredExams = selectedMonth === ''
    ? window.exams
    : window.exams.filter(e => e.date.split('-')[1] === selectedMonth);

  console.log(' Filtres appliqués:', {
    classe: selectedClass || 'Toutes',
    mois: selectedMonth || 'Tous',
    studentsFiltrés: filteredStudents.length,
    examsFiltrés: filteredExams.length
  });

  // Recréer les graphiques avec données filtrées
  createCharts({
    students: filteredStudents,
    teachers: window.teachers,
    courses: window.courses,
    rooms: window.rooms,
    exams: filteredExams
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  console.log(' Dashboard - Initialisation');
  
  // Initialiser les données
  initializeData();
  
 
  setTimeout(() => {
    createCharts();
    
    // Ajouter les event listeners pour les filtres
    const classFilter = document.getElementById('dashboardClassFilter');
    const monthFilter = document.getElementById('dashboardMonthFilter');
    
    if (classFilter) {
      classFilter.addEventListener('change', applyDashboardFilters);
    }
    if (monthFilter) {
      monthFilter.addEventListener('change', applyDashboardFilters);
    }
  }, 500);
});

// Exporter les fonctions
window.createCharts = createCharts;
window.applyDashboardFilters = applyDashboardFilters;
window.initializeData = initializeData;

console.log(' dashboard-fix.js chargé');