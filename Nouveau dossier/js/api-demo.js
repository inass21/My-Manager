console.log(" API Demo chargée");

async function demoAPIUsage() {
  // API externe
  const externalStudents = await APIIntegration.loadExternalStudents();

  if (externalStudents.length === 0) {
    console.warn(" Aucun étudiant externe chargé");
    return;
  }

  console.log(" Étudiants API:", externalStudents.map(s => s.getFullInfo()));

  
  const localStudents = JSON.parse(localStorage.getItem("students")) || [];

 
  const mergedStudents = [
    ...localStudents,
    ...externalStudents.map(s => s.toJSON())
  ];


  await DataManager.saveToStorage("students", mergedStudents);

 
  window.students = mergedStudents.map(Student.fromJSON);

  console.log(" Fusion Local + API réussie");
}
