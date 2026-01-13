// CLASSE STUDENT 
class Student {
  constructor(name, email, classYear) {
    this.name = name;
    this.email = email;
    this.class = classYear;
  }

  // Méthode pour valider l'email
  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Méthode pour afficher les infos complètes
  getFullInfo() {
    return `${this.name} (${this.class}) - ${this.email}`;
  }

  // Convertir en objet JSON pour localStorage
  toJSON() {
    return {
      name: this.name,
      email: this.email,
      class: this.class
    };
  }

  // Créer une instance depuis JSON 
  static fromJSON(data) {
    return new Student(data.name, data.email, data.class);
  }
}

// CLASSE TEACHER 
class Teacher {
  constructor(id, name, email, subject) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.subject = subject;
  }

  // Méthode pour obtenir le nom avec la matière
  getDisplayName() {
    return `${this.name} - ${this.subject}`;
  }

  // Méthode pour vérifier si l'email est valide
  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject
    };
  }

  static fromJSON(data) {
    return new Teacher(data.id, data.name, data.email, data.subject);
  }
}

// CLASSE COURSE
class Course {
  constructor(name, teacher, schedule) {
    this.name = name;
    this.teacher = teacher;
    this.schedule = schedule;
  }

  // Méthode pour extraire le jour de la semaine
  getDay() {
    return this.schedule.split(' ')[0];
  }

  // Méthode pour extraire l'heure
  getTime() {
    const match = this.schedule.match(/\d+h/);
    return match ? match[0] : '';
  }

  toJSON() {
    return {
      name: this.name,
      teacher: this.teacher,
      schedule: this.schedule
    };
  }

  static fromJSON(data) {
    return new Course(data.name, data.teacher, data.schedule);
  }
}

// CLASSE ROOM 
class Room {
  constructor(name, capacity, location, type = "Cours") {
    this.name = name;
    this.capacity = capacity;
    this.location = location;
    this.type = type;
  }

  // Vérifier si la salle est grande 
  isLargeRoom() {
    return this.capacity > 50;
  }

  // Obtenir la catégorie de taille
  getSizeCategory() {
    if (this.capacity < 30) return "Petite";
    if (this.capacity <= 50) return "Moyenne";
    return "Grande";
  }

  // Calculer le taux d'occupation 
  getOccupancyRate(students) {
    return ((students / this.capacity) * 100).toFixed(1) + '%';
  }

  toJSON() {
    return {
      name: this.name,
      capacity: this.capacity,
      location: this.location,
      type: this.type
    };
  }

  static fromJSON(data) {
    return new Room(data.name, data.capacity, data.location, data.type || "Cours");
  }
}

// CLASSE EXAM 
class Exam {
  constructor(course, date, room) {
    this.course = course;
    this.date = date; 
    this.room = room;
  }

  // Formater la date en français $
  getFormattedDate() {
    const parts = this.date.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // Obtenir le mois de l'examen
  getMonth() {
    return this.date.split('-')[1];
  }

  // Obtenir le nom du mois en français
  getMonthName() {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthIndex = parseInt(this.getMonth()) - 1;
    return months[monthIndex];
  }

  // Vérifier si l'examen est passé
  isPast() {
    return new Date(this.date) < new Date();
  }

  toJSON() {
    return {
      course: this.course,
      date: this.date,
      room: this.room
    };
  }

  static fromJSON(data) {
    return new Exam(data.course, data.date, data.room);
  }
}

//  DATA MANAGER (ASYNC/AWAIT) 
class DataManager {
  
  //  Sauvegarder avec Async/Await (Promesse)
  static async saveToStorage(key, data) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(` Sauvegarde réussie: ${key} (${data.length} éléments)`);
        resolve(true);
      } catch (error) {
        console.error(` Erreur sauvegarde ${key}:`, error);
        reject(error);
      }
    });
  }

  //  Charger avec Async/Await 
  static async loadFromStorage(key, defaultValue = []) {
    return new Promise((resolve) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          console.log(`Chargement réussi: ${key} (${parsed.length} éléments)`);
          resolve(parsed);
        } else {
          console.log(` Aucune donnée pour ${key}, valeurs par défaut utilisées`);
          resolve(defaultValue);
        }
      } catch (error) {
        console.error(`Erreur chargement ${key}:`, error);
        resolve(defaultValue);
      }
    });
  }

  //  Supprimer des données
  static async deleteFromStorage(key) {
    return new Promise((resolve) => {
      localStorage.removeItem(key);
      console.log(`Données supprimées: ${key}`);
      resolve(true);
    });
  }

  // Vider tout le localStorage
  static async clearAllStorage() {
    return new Promise((resolve) => {
      localStorage.clear();
      console.log(` LocalStorage complètement vidé`);
      resolve(true);
    });
  }

  //  Obtenir la taille des données stockées
  static getStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  }
}

// API INTEGRATION (FETCH) 
class APIIntegration {
  
  //  Charger des utilisateurs depuis JSONPlaceholder
  static async fetchUsers() {
    try {
      console.log(' Chargement des utilisateurs depuis API...');
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const users = await response.json();
      console.log(` ${users.length} utilisateurs chargés depuis l'API`);
      return users;
    } catch (error) {
      console.error(' Erreur lors du chargement des utilisateurs:', error);
      return [];
    }
  }

  //  Convertir les utilisateurs API en étudiants
  static async loadExternalStudents() {
    try {
      const users = await this.fetchUsers();
      
      // Convertir les 3 premiers utilisateurs en étudiants
      const students = users.slice(0, 3).map(user => 
        new Student(user.name, user.email, "Externe API")
      );
      
      console.log(` ${students.length} étudiants externes créés`);
      return students;
    } catch (error) {
      console.error('Erreur conversion utilisateurs:', error);
      return [];
    }
  }

  // Charger des posts
  static async fetchPosts() {
    try {
      console.log(' Chargement des posts depuis API.');
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      console.log(` ${posts.length} posts chargés`);
      return posts.slice(0, 5);
    } catch (error) {
      console.error(' Erreur chargement posts:', error);
      return [];
    }
  }
}

// Rendre les classes accessibles partout dans l'application
if (typeof window !== 'undefined') {
  window.Student = Student;
  window.Teacher = Teacher;
  window.Course = Course;
  window.Room = Room;
  window.Exam = Exam;
  window.DataManager = DataManager;
  window.APIIntegration = APIIntegration;
  
  console.log(' Classes ES6 chargées avec succès');
  console.log(' Classes disponibles: Student, Teacher, Course, Room, Exam, DataManager, APIIntegration');
}

