const contenedorCards = document.querySelector(".contenedorCards");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");

let personajes = [];
let paginaApi = 1;
let indiceVisible = 0;
const mostrarPorPagina = 10;

async function cargarPersonajes() {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character?page=${paginaApi}`
  );
  const data = await res.json();
  personajes = personajes.concat(data.results);
  paginaApi++;
}

function renderizarPersonajes() {
  contenedorCards.innerHTML = "";
  const personajesAMostrar = personajes.slice(
    indiceVisible,
    indiceVisible + mostrarPorPagina
  );

  personajesAMostrar.forEach((personaje) => {
    contenedorCards.innerHTML += `
        <div class="card border rounded-2xl p-4 bg-white shadow-md">
          <div class="image"><img src="${personaje.image}" alt="${personaje.name}" class="w-full h-auto object-cover rounded-lg"></div>
          <div class="name font-semibold mt-2">${personaje.name}</div>
          <div class="status text-sm text-gray-700">${personaje.status}</div>
          <div class="location text-sm text-gray-700">${personaje.location.name}</div>
          <div class="first text-sm text-blue-600 underline">
            First seen in: <a href="${personaje.episode[0]}" target="_blank">Episodio</a>
          </div>
        </div>
      `;
  });

  btnAnterior.disabled = indiceVisible === 0;
  btnSiguiente.disabled =
    indiceVisible + mostrarPorPagina >= personajes.length && paginaApi > 42; // la doc dice que son 42 pages de 20
}

async function mostrarSiguiente() {
  if (indiceVisible + mostrarPorPagina >= personajes.length) {
    if (paginaApi <= 42) {
      await cargarPersonajes();
    }
  }
  if (indiceVisible + mostrarPorPagina < personajes.length) {
    indiceVisible += mostrarPorPagina;
    renderizarPersonajes();
  }
}

function mostrarAnterior() {
  if (indiceVisible > 0) {
    indiceVisible -= mostrarPorPagina;
    renderizarPersonajes();
  }
}

/* btnSiguiente.addEventListener("click", mostrarSiguiente);
btnAnterior.addEventListener("click", mostrarAnterior); */

(async () => {
  await cargarPersonajes();
  renderizarPersonajes();
})();
