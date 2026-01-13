window.rooms = JSON.parse(localStorage.getItem('rooms')) || [
  { name: "Salle A101", capacity: 40, location: "Bâtiment A", type: "Cours" },
  { name: "Salle B205", capacity: 30, location: "Bâtiment B", type: "Cours" },
  { name: "Labo Info", capacity: 25, location: "Bâtiment C", type: "Laboratoire" },
  { name: "Amphithéâtre", capacity: 100, location: "Bâtiment Principal", type: "Amphithéâtre" },
  { name: "Salle C303", capacity: 35, location: "Bâtiment C", type: "Cours" },
  { name: "Salle Polyvalente", capacity: 50, location: "Bâtiment D", type: "Polyvalente" }
];

let currentPage = 1;
const rowsPerPage = 5;
let searchValue = "";
let sortAsc = true;

const tableBody = document.getElementById("tableBody");
const form = document.getElementById("roomForm");
const searchInput = document.getElementById("searchInput");

//  FONCTION CENTRALISÉE pour sauvegarder
function saveRooms() {
  localStorage.setItem('rooms', JSON.stringify(rooms));
  window.rooms = rooms;
  localStorage.setItem('rooms_updated', Date.now().toString());
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
  const id = document.getElementById("roomId").value;
  const name = document.getElementById("roomName").value.trim();
  const capacity = parseInt(document.getElementById("roomCapacity").value);
  const location = document.getElementById("roomLocation").value.trim();
  
  // Déterminer automatiquement le type
  let type = "Cours";
  if (name.toLowerCase().includes("labo")) type = "Laboratoire";
  else if (name.toLowerCase().includes("amphi")) type = "Amphithéâtre";
  else if (capacity > 60) type = "Amphithéâtre";
  else if (name.toLowerCase().includes("polyvalente")) type = "Polyvalente";

  if (id === "") {
    // Créer nouvelle salle
    rooms.push({ name, capacity, location, type });
  } else {
    // Modifier salle existante
    rooms[id] = { name, capacity, location, type };
  }


  saveRooms();

  form.reset();
  document.getElementById("roomId").value = "";
  currentPage = 1;
  render();
});

// Appliquer les filtres
function applyFilters() {
  currentPage = 1;
  render();
}

// Filtrer les données
function filterData() {
  const locationFilter = document.getElementById("locationFilter");
  const capacityFilter = document.getElementById("capacityFilter");
  
  const selectedLocation = locationFilter ? locationFilter.value : "";
  const selectedCapacity = capacityFilter ? capacityFilter.value : "";

  return rooms.filter(r => {
    const matchName = r.name.toLowerCase().includes(searchValue);
    const matchLocation = selectedLocation === "" || r.location === selectedLocation;
    
    let matchCapacity = true;
    if (selectedCapacity === "small") matchCapacity = r.capacity < 30;
    else if (selectedCapacity === "medium") matchCapacity = r.capacity >= 30 && r.capacity <= 50;
    else if (selectedCapacity === "large") matchCapacity = r.capacity > 50;
    
    return matchName && matchLocation && matchCapacity;
  });
}

// Rendu du tableau
function render() {
  tableBody.innerHTML = "";
  let filtered = filterData();

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;

  filtered.sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const start = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  paginated.forEach((r, i) => {
    // Trouver l'index RÉEL
    const realIndex = rooms.findIndex(room => 
      room.name === r.name && room.capacity === r.capacity && room.location === r.location
    );
    
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${r.name}</td>
      <td>${r.capacity}</td>
      <td>${r.location}</td>
      <td>
        <button class="edit" onclick="editRoom(${realIndex})">Edit</button>
        <button class="delete" onclick="deleteRoom(${realIndex})">Delete</button>
        <button class="details" onclick="seeDetails(${realIndex})">Details</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("pageInfo").textContent = `Page ${currentPage} / ${totalPages || 1}`;
}

// Éditer une salle
function editRoom(index) {
  if (index < 0 || index >= rooms.length) return;
  
  document.getElementById("roomId").value = index;
  document.getElementById("roomName").value = rooms[index].name;
  document.getElementById("roomCapacity").value = rooms[index].capacity;
  document.getElementById("roomLocation").value = rooms[index].location;
}

// Supprimer une salle
function deleteRoom(index) {
  if (confirm("Voulez-vous vraiment supprimer cette salle ?")) {
    rooms.splice(index, 1);
    
    //  UN SEUL APPEL
    saveRooms();
    
    render();
  }
}

// Voir détails
function seeDetails(index) {
  const r = rooms[index];
  if (!r) return;
  
  const url = `room-details.html?name=${encodeURIComponent(r.name)}&capacity=${r.capacity}&location=${encodeURIComponent(r.location)}`;
  window.location.href = url;
}

// Trier par nom
function sortByName() {
  sortAsc = !sortAsc;
  render();
}

// Export CSV
function exportCSV() {
  let csv = "Salle,Capacité,Localisation,Type\n";
  rooms.forEach(r => {
    csv += `"${r.name}",${r.capacity},"${r.location}","${r.type || 'Non défini'}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "salles.csv";
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
  const filtered = filterData();
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
}

// Event listeners pour les filtres
const locationFilter = document.getElementById("locationFilter");
const capacityFilter = document.getElementById("capacityFilter");

if (locationFilter) {
  locationFilter.addEventListener("change", applyFilters);
}
if (capacityFilter) {
  capacityFilter.addEventListener("change", applyFilters);
}

// Initial render
render();

console.log(' rooms.js chargé');