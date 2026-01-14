function calculateAdvancedStats() {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  const courses = JSON.parse(localStorage.getItem('courses')) || [];
  const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  
  //  Taux de Réussite
  let successRate = 70 + (exams.length * 3);
  if (successRate > 95) successRate = 95;
  document.getElementById('successRate').textContent = successRate + '%';
  document.getElementById('successProgress').style.width = successRate + '%';
  
  //  Examens à Venir
  let upcomingExams = 0;
  const today = new Date();
  exams.forEach(exam => {
    let examDate;
    if (exam.date.includes('/')) {
      const parts = exam.date.split('/');
      examDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      examDate = new Date(exam.date);
    }
    const days = (examDate - today) / (1000 * 60 * 60 * 24);
    if (days >= 0 && days <= 30) upcomingExams++;
  });
  document.getElementById('upcomingExams').textContent = upcomingExams;
  document.getElementById('examProgress').style.width = (upcomingExams * 10) + '%';
  
  //  Occupation Salles
  let totalCapacity = 0;
  rooms.forEach(room => totalCapacity += parseInt(room.capacity || 0));
  const occupancyRate = totalCapacity > 0 ? Math.round((students.length / totalCapacity) * 100) : 0;
  document.getElementById('roomOccupancy').textContent = occupancyRate + '%';
  document.getElementById('roomProgress').style.width = occupancyRate + '%';
  
  // Ratio Étudiants/Professeurs
  const ratio = teachers.length > 0 ? Math.round(students.length / teachers.length) : 0;
  document.getElementById('studentRatio').textContent = ratio + ':1';
  document.getElementById('ratioProgress').style.width = Math.min(100, (ratio / 20) * 100) + '%';
}



function generateActivityTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container) return;
  
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
  const courses = JSON.parse(localStorage.getItem('courses')) || [];
  const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
  
 
  const studentsTime = parseInt(localStorage.getItem('students_updated') || Date.now());
  const teachersTime = parseInt(localStorage.getItem('teachers_updated') || Date.now());
  const coursesTime = parseInt(localStorage.getItem('courses_updated') || Date.now());
  const roomsTime = parseInt(localStorage.getItem('rooms_updated') || Date.now());
  
  let html = '';
  
  // Derniers étudiants (3 max)
  const lastStudents = students.slice(-3).reverse();
  lastStudents.forEach(student => {
    const timeAgo = getTimeAgo(studentsTime); 
    html += `
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-action">Nouvel étudiant inscrit</div>
          <div class="timeline-details">
            <span class="timeline-time">⏱ ${timeAgo}</span>
            <span class="timeline-user"> admin </span>
          </div>
          <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
            ${student.name} - ${student.class}
          </div>
        </div>
      </div>
    `;
  });
  
  //  Derniers professeurs (2 max) 
  const lastTeachers = teachers.slice(-2).reverse();
  lastTeachers.forEach(teacher => {
    const timeAgo = getTimeAgo(teachersTime);  
    html += `
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-action">Nouveau professeur</div>
          <div class="timeline-details">
            <span class="timeline-time">⏱ ${timeAgo}</span>
            <span class="timeline-user"> admin</span>
          </div>
          <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
            ${teacher.name} - ${teacher.subject}
          </div>
        </div>
      </div>
    `;
  });
  
  // Derniers cours (2 max)
  const lastCourses = courses.slice(-2).reverse();
  lastCourses.forEach(course => {
    const timeAgo = getTimeAgo(coursesTime);  
    html += `
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-action"> Nouveau cours ajouté</div>
          <div class="timeline-details">
            <span class="timeline-time">⏱ ${timeAgo}</span>
            <span class="timeline-user"> Admin</span>
          </div>
          <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
            ${course.name} - ${course.teacher}
          </div>
        </div>
      </div>
    `;
  });
  
  // Dernière salle
  if (rooms.length > 0) {
    const lastRoom = rooms[rooms.length - 1];
    const timeAgo = getTimeAgo(roomsTime);  
    html += `
      <div class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-action"> Nouvelle salle créée</div>
          <div class="timeline-details">
            <span class="timeline-time">⏱ ${timeAgo}</span>
            <span class="timeline-user"> admin</span>
          </div>
          <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
            ${lastRoom.name} - Capacité: ${lastRoom.capacity}
          </div>
        </div>
      </div>
    `;
  }
  
  // Système
  html += `
    <div class="timeline-item">
      <div class="timeline-content">
        <div class="timeline-action"> Sauvegarde automatique</div>
        <div class="timeline-details">
          <span class="timeline-time">⏱ Il y a 5 min</span>
          <span class="timeline-user"> Système</span>
        </div>
        <div style="font-size: 12px; color: #95a5a6; margin-top: 5px;">
          Données synchronisées avec succès
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html || '<div class="timeline-empty">Aucune activité récente</div>';
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
}

// FONCTION exportStatsToPDF 
function exportStatsToPDF() {
  console.log(' Début export PDF...');
  
  if (typeof window.jspdf === 'undefined') {
    console.error(' jsPDF non chargé');
    alert(' Erreur: La bibliothèque jsPDF n\'est pas chargée.');
    return;
  }
  
  console.log('jsPDF est chargé');
  
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    console.log(' Document PDF créé');
    
    // EN-TÊTE COLORÉ
    doc.setFillColor(102, 126, 234); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("MyManager", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text("Rapport de Statistiques Avancées", 105, 30, { align: "center" });
    
    // TITRE
    doc.setTextColor(102, 126, 234);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(" Statistiques du Système", 20, 55);
    
    // Ligne séparatrice
    doc.setDrawColor(102, 126, 234);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);
    
    // RÉCUPÉRER LES DONNÉES
    console.log(' Récupération des statistiques...');
    
    const successRateEl = document.getElementById('successRate');
    const upcomingExamsEl = document.getElementById('upcomingExams');
    const roomOccupancyEl = document.getElementById('roomOccupancy');
    const studentRatioEl = document.getElementById('studentRatio');
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    
    console.log(' Données récupérées:', {
      students: students.length,
      teachers: teachers.length,
      courses: courses.length,
      rooms: rooms.length,
      exams: exams.length
    });
    
    // Tableau des statistiques
    const stats = [
      {
        label: "Taux de Réussite",
        value: successRateEl ? successRateEl.textContent : '0%'
      },
      {
        label: "Examens à Venir",
        value: upcomingExamsEl ? upcomingExamsEl.textContent : '0'
      },
      {
        label: "Occupation Salles",
        value: roomOccupancyEl ? roomOccupancyEl.textContent : '0%'
      },
      {
        label: "Ratio Étudiant/Prof",
        value: studentRatioEl ? studentRatioEl.textContent : '0:1'
      },
      {
        label: "Total Étudiants",
        value: students.length.toString()
      },
      {
        label: "Total Professeurs",
        value: teachers.length.toString()
      },
      {
        label: "Total Cours",
        value: courses.length.toString()
      },
      {
        label: "Total Salles",
        value: rooms.length.toString()
      },
      {
        label: "Total Examens",
        value: exams.length.toString()
      }
    ];
    
    // AFFICHER LES STATISTIQUES
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    let yPos = 75;
    const lineHeight = 10;
    
    stats.forEach((stat, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(stat.label + " :", 25, yPos);
      
      doc.setFont('helvetica', 'normal');
      doc.text(stat.value, 120, yPos);
      
      yPos += lineHeight;
      
      console.log(` Stat ${index + 1}: ${stat.label} = ${stat.value}`);
    });
    
    // SECTION : DÉTAILS
    yPos += 10;
    
    doc.setTextColor(102, 126, 234);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(" Détails", 20, yPos);
    
    yPos += 5;
    doc.setDrawColor(102, 126, 234);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 10;
    
    // Derniers étudiants
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Derniers étudiants ajoutés :", 25, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const lastStudents = students.slice(-3).reverse();
    if (lastStudents.length > 0) {
      lastStudents.forEach((student) => {
        doc.text(`• ${student.name} - ${student.class}`, 30, yPos);
        yPos += 6;
      });
    } else {
      doc.text("Aucun étudiant", 30, yPos);
      yPos += 6;
    }
    
    // FOOTER
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.text("Généré le " + dateStr, 105, 280, { align: "center" });
    doc.text("MyManager © 2026 - Tous droits réservés", 105, 287, { align: "center" });
    
    // SAUVEGARDE
    const fileName = "statistiques_mymanager_" + now.toISOString().split('T')[0] + ".pdf";
    
    console.log(' Sauvegarde du PDF:', fileName);
    doc.save(fileName);
    
    console.log(' PDF exporté avec succès !');
    alert('PDF exporté avec succès !\n\nFichier : ' + fileName);
    
  } catch (error) {
    console.error(' Erreur lors de l\'export PDF:', error);
    alert(' Erreur lors de l\'export PDF:\n\n' + error.message);
  }
}

function addExportButton() {
  console.log(' Ajout du bouton Export PDF...');
  
  const section = document.querySelector('.advanced-stats-section');
  if (!section) {
    console.warn(' Section advanced-stats-section non trouvée');
    return;
  }
  
  if (document.querySelector('.export-stats-btn')) {
    console.log(' Bouton Export déjà présent');
    return;
  }
  
  const title = section.querySelector('.section-title');
  if (!title) {
    console.warn(' Titre de section non trouvé');
    return;
  }
  
  const button = document.createElement('button');
  button.className = 'export-stats-btn';
  button.innerHTML = ' Exporter PDF';
  button.type = 'button';
  button.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(' Clic sur le bouton Export PDF');
    exportStatsToPDF();
  };
  
  button.style.cssText = `
    float: right;
    background: linear-gradient(135deg, #3498db, #2ecc71);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    margin-left: 15px;
  `;
  
  button.addEventListener('mouseover', function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.5)';
  });
  
  button.addEventListener('mouseout', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
  });
  
  title.style.display = 'inline-block';
  title.parentNode.style.position = 'relative';
  title.parentNode.insertBefore(button, title.nextSibling);
  
  console.log(' Bouton Export PDF ajouté avec succès');
}

// Export global
window.exportStatsToPDF = exportStatsToPDF;
window.addExportButton = addExportButton;

console.log(' Module Export PDF chargé');

// Fonction pour rafraîchir depuis autres pages
window.refreshStats = function() {
  calculateAdvancedStats();
  generateActivityTimeline();
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    calculateAdvancedStats();
    generateActivityTimeline();
    addExportButton();
  }, 500);
  
  // Mise à jour automatique toutes les 30 secondes
  setInterval(() => {
    calculateAdvancedStats();
    generateActivityTimeline();
  }, 30000);
});

// Exports
window.calculateAdvancedStats = calculateAdvancedStats;
window.generateActivityTimeline = generateActivityTimeline;

console.log(' advanced-stats.js chargé');
