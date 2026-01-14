
# MyManager – Système de Gestion Scolaire

MyManager est une application web qui permet de gérer une école : étudiants, professeurs, cours, salles et examens.

## Description

L’application permet d’administrer les principales entités d’un établissement scolaire et d’afficher des statistiques via un tableau de bord.

### Technologies utilisées

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Chart.js
* jsPDF

---

## Fonctionnalités

### Gestion des entités (CRUD)

* Étudiants (nom, email, classe)
* Professeurs (nom, email, matière)
* Cours (nom, professeur, horaire)
* Salles (nom, capacité, localisation)
* Examens (cours, date, salle)

### Pour chaque entité

* Ajouter
* Modifier
* Supprimer
* Consulter les détails
* Recherche
* Filtrage
* Tri alphabétique
* Pagination
* Export CSV
* Export PDF

### Tableau de bord

* Graphiques statistiques (Chart.js)
* Mise à jour en temps réel
* Filtres dynamiques

### Autres fonctionnalités

* Support multilingue (Français, Anglais, Arabe)
* Design responsive
* Gestion des rôles utilisateurs
* Historique des actions (logs)

---

## Utilisation

### En ligne

Lien de démonstration :
[my-manager-kohl.vercel.appp)

### En local

1. Télécharger le projet
2. Ouvrir le fichier `index.html`
3. Se connecter avec :

   * Username : admin
   * Password : admin

---

## Comptes de test

| Username   | Password  | Rôle           |
| ---------- | --------- | -------------- |
| admin      | admin     | Administrateur |
| secretaire | secret123 | Secrétariat    |
| prof       | prof123   | Professeur     |
| viewer     | view123   | Consultation   |

---

## Structure du projet

```
MyManager/
├── index.html
├── dashboard.html
├── students.html
├── teachers.html
├── courses.html
├── rooms.html
├── exams.html
├── logs.html
│
├── css/
│   ├── main.css
│   ├── rtl.css
│
└── js/
    ├── models.js
    ├── data.js
    ├── i18n.js
    ├── permissions.js
    ├── main.js
    ├── login.js
    └── dashboard.js
```

---

## Fonctionnalités techniques

* Classes ES6
* Gestion asynchrone avec Async/Await
* Système de permissions utilisateurs
* Internationalisation (FR / EN / AR)
* Export PDF et CSV
* API JSONPlaceholder pour les données de test

---

## Équipe

* Membre 1 : Développement Frontend
* Membre 2 : Développement Backend
* Membre 3 : Design UI/UX

---

## Informations du projet

* Type : Projet académique
* Année universitaire : 2025–2026
* Framework : Aucun (Vanilla JavaScript)
* Déploiement : Vercel

---

## Licence

Projet éducatif – MyManager © 2026

