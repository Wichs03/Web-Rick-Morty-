document.addEventListener("DOMContentLoaded", () => {
  crearHamburguesa(); // Se ejecuta solo cuando ya se ha cargado el DOM
});

async function crearHamburguesa() {
  // Crear el panel de filtros y añadirlo justo después del header
  const html = `
    <div id="filtros-wrapper" class="hidden mt-4 space-y-4 bg-gray-800 p-4 rounded-md text-white container mx-auto px-4">
      <div>
        <h3 class="font-semibold">Estado:</h3>
        <div id="filtros-estado" class="space-y-1"></div>
      </div>
      <div>
        <h3 class="font-semibold">Especie:</h3>
        <div id="filtros-especie" class="space-y-1"></div>
      </div>
      <button id="btn-buscar" class="mt-2 bg-green-600 px-3 py-1 rounded-md">Buscar</button>
    </div>
  `;

  // Inserta el panel de filtros justo después del <header>
  const header = document.querySelector("header");
  header.insertAdjacentHTML("afterend", html);

  // Mostrar/ocultar panel al hacer clic en el botón hamburguesa
  const botonHamburguesa = document.getElementById("toggle-filtros");
  botonHamburguesa.addEventListener("click", () => {
    document.getElementById("filtros-wrapper").classList.toggle("hidden");
  });

  // Obtener los filtros dinámicamente
  const estados = new Set();
  const especies = new Set();

  try {
    const res = await fetch("https://rickandmortyapi.com/api/character");
    const data = await res.json();

    data.results.forEach(p => {
      estados.add(p.status.toLowerCase());
      especies.add(p.species);
    });

    const contEstados = document.getElementById("filtros-estado");
    [...estados].forEach(e => {
      contEstados.innerHTML += `
        <label><input type="radio" name="estado" value="${e}"> ${e}</label><br>
      `;
    });

    const contEspecies = document.getElementById("filtros-especie");
    [...especies].forEach(e => {
      contEspecies.innerHTML += `
        <label><input type="radio" name="especie" value="${e}"> ${e}</label><br>
      `;
    });
  } catch (error) {
    console.error("Error al cargar filtros:", error);
  }

  // Acción del botón Buscar
  document.getElementById("btn-buscar").addEventListener("click", async () => {
    const estado = document.querySelector('input[name="estado"]:checked')?.value;
    const especie = document.querySelector('input[name="especie"]:checked')?.value;

    let url = `https://rickandmortyapi.com/api/character/?`;
    if (estado) url += `status=${estado}&`;
    if (especie) url += `species=${especie}&`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Resultados filtrados:", data.results);
    } catch (err) {
      console.error("Error al buscar personajes:", err);
    }
  });
}
let personajesFiltrados = []; // Aquí guardamos resultados de búsqueda
let paginaActual = 1;
const elementosPorPagina = 6;

function renderizarPagina(pagina) {
  const contenedor = document.getElementById("contenedorCards");
  contenedor.innerHTML = "";

  // Calcular rango de elementos
  const inicio = (pagina - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const paginaItems = personajesFiltrados.slice(inicio, fin);

  // Crear cards
  paginaItems.forEach(personaje => {
    contenedor.innerHTML += `
      <article class="bg-gray-700 rounded-md p-4 shadow-md flex flex-col items-center text-center">
        <img src="${personaje.image}" alt="${personaje.name}" class="w-40 h-40 rounded-lg object-cover mb-4" />
        <h3 class="text-lg font-semibold">${personaje.name}</h3>
        <p class="text-sm text-gray-300">${personaje.status} - ${personaje.species}</p>
      </article>
    `;
  });
}

// Event listeners para botones
document.getElementById("atras").addEventListener("click", () => {
  if (paginaActual > 1) {
    paginaActual--;
    renderizarPagina(paginaActual);
  }
});

document.getElementById("adelante").addEventListener("click", () => {
  const totalPaginas = Math.ceil(personajesFiltrados.length / elementosPorPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    renderizarPagina(paginaActual);
  }
});

// Dentro de tu función de búsqueda, cuando obtienes resultados:

document.getElementById("btn-buscar").onclick = async () => {
  // ... tu código para obtener filtros y hacer fetch

  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/?`);
    const data = await res.json();

    personajesFiltrados = data.results || [];
    paginaActual = 1;
    renderizarPagina(paginaActual);
  } catch (err) {
    console.error("Error al buscar personajes:", err);
  }
};



