const contenedorCards = document.querySelector(".contenedorCards");
const btnAnterior = document.getElementById("atras");
const btnSiguiente = document.getElementById("adelante");

let personajes = [];
let paginaApi = 1;
let indiceVisible = 0;
const mostrarPorPagina = 10;

async function cargarPersonajes() {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character?page=${paginaApi}`
  );
  const data = await res.json();

  const personajesConEpisodio = await Promise.all(
    data.results.map(async (personaje) => {
      try {
        const episodioRes = await fetch(personaje.episode[0]);
        const episodioData = await episodioRes.json();
        return {
          ...personaje,
          firstEpisodeName: episodioData.name,
          firstEpisodeCode: episodioData.episode,
        };
      } catch {
        return {
          ...personaje,
          firstEpisodeName: "Desconocido",
          firstEpisodeCode: "",
        };
      }
    })
  );

  personajes = personajes.concat(personajesConEpisodio);
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
      <div class="card border-none rounded-2xl p-4 bg-gray-800 shadow-md
          w-[80vw] sm:w-[38vw] lg:w-[25vw] mx-auto">
        <div class="image">
          <img src="${personaje.image}" alt="${
      personaje.name
    }" class="w-full h-auto object-cover rounded-lg" />
        </div>
        <div class="name font-bold mt-2 text-gray-100">${personaje.name}</div>
        <div class="status text-sm text-gray-300">${personaje.status}</div>
        <div class="location text-sm text-gray-300">${
          personaje.location.name
        }</div>
        <div class="first text-sm text-blue-600 underline">
          First seen in: 
          <a href="https://rickandmortyapi.com/api/episode/${personaje.episode[0]
            .split("/")
            .pop()}" target="_blank" rel="noopener noreferrer">
            ${personaje.firstEpisodeCode} - ${personaje.firstEpisodeName}
          </a>
        </div>
      </div>
    `;
  });

  btnAnterior.disabled = indiceVisible === 0;
  btnSiguiente.disabled =
    indiceVisible + mostrarPorPagina >= personajes.length && paginaApi > 42;
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

btnSiguiente.addEventListener("click", mostrarSiguiente);
btnAnterior.addEventListener("click", mostrarAnterior);

(async () => {
  await cargarPersonajes();
  renderizarPersonajes();
})();
